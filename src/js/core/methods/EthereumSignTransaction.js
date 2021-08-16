/* @flow */

import AbstractMethod from './AbstractMethod';
import { validateParams, getFirmwareRange } from './helpers/paramsValidator';
import { validatePath } from '../../utils/pathUtils';
import { getEthereumNetwork } from '../../data/CoinInfo';
import { getNetworkLabel } from '../../utils/ethereumUtils';
import { stripHexPrefix } from '../../utils/formatUtils';
import * as helper from './helpers/ethereumSignTx';

import type { CoreMessage } from '../../types';
import type {
    EthereumTransaction,
    EthereumTransactionEIP1559,
} from '../../types/networks/ethereum';

type Params = {
    path: number[],
    transaction: EthereumTransaction,
};

const strip = value => {
    if (typeof value === 'string') {
        let stripped = stripHexPrefix(value);
        // pad left even
        if (stripped.length % 2 !== 0) {
            stripped = `0${stripped}`;
        }
        return stripped;
    }
    if (Array.isArray(value)) {
        return value.map(strip);
    }
    if (typeof value === 'object') {
        return Object.entries(value).reduce((acc, [k, v]) => ({ ...acc, [k]: strip(v) }), {});
    }
    return value;
};

export default class EthereumSignTx extends AbstractMethod {
    params: Params;

    constructor(message: CoreMessage) {
        super(message);

        this.requiredPermissions = ['read', 'write'];

        const { payload } = message;

        // validate incoming parameters
        validateParams(payload, [
            { name: 'path', obligatory: true },
            { name: 'transaction', obligatory: true },
        ]);

        const path = validatePath(payload.path, 3);
        const network = getEthereumNetwork(path);
        this.firmwareRange = getFirmwareRange(this.name, network, this.firmwareRange);

        this.info = getNetworkLabel('Sign #NETWORK transaction', network);

        // incoming transaction should be in EthereumTx format
        // https://github.com/ethereumjs/ethereumjs-tx
        const tx: EthereumTransaction | EthereumTransactionEIP1559 = payload.transaction;

        const isEIP1559 = tx.maxFeePerGas !== undefined && tx.maxPriorityFeePerGas !== undefined;

        const schema = isEIP1559
            ? [
                  { name: 'to', type: 'string', obligatory: true },
                  { name: 'value', type: 'string', obligatory: true },
                  { name: 'gasLimit', type: 'string', obligatory: true },
                  { name: 'maxFeePerGas', type: 'string', obligatory: true },
                  { name: 'maxPriorityFeePerGas', type: 'string', obligatory: true },
                  { name: 'nonce', type: 'string', obligatory: true },
                  { name: 'data', type: 'string' },
                  { name: 'chainId', type: 'number', obligatory: true },
              ]
            : [
                  { name: 'to', type: 'string', obligatory: true },
                  { name: 'value', type: 'string', obligatory: true },
                  { name: 'gasLimit', type: 'string', obligatory: true },
                  { name: 'gasPrice', type: 'string', obligatory: true },
                  { name: 'nonce', type: 'string', obligatory: true },
                  { name: 'data', type: 'string' },
                  { name: 'chainId', type: 'number' },
                  { name: 'txType', type: 'number' },
              ];

        validateParams(tx, schema);

        // TODO: check if tx data is a valid hex

        this.params = {
            path,
            // strip '0x' from values
            transaction: strip(tx),
        };
    }

    run() {
        const tx = this.params.transaction;
        const isEIP1559 =
            !this.device.unavailableCapabilities.eip1559 &&
            tx.maxFeePerGas !== undefined &&
            tx.maxPriorityFeePerGas !== undefined;
        return isEIP1559
            ? helper.ethereumSignTxEIP1559(
                  this.device.getCommands().typedCall.bind(this.device.getCommands()),
                  this.params.path,
                  tx.to,
                  tx.value,
                  tx.gasLimit,
                  tx.maxFeePerGas,
                  tx.maxPriorityFeePerGas,
                  tx.nonce,
                  tx.chainId,
                  tx.data,
                  tx.accessList,
              )
            : helper.ethereumSignTx(
                  this.device.getCommands().typedCall.bind(this.device.getCommands()),
                  this.params.path,
                  tx.to,
                  tx.value,
                  tx.gasLimit,
                  tx.gasPrice,
                  tx.nonce,
                  tx.data,
                  tx.chainId,
                  tx.txType,
              );
    }
}
