export const validateParams = [
    {
        description: 'array',
        type: 'array',
        value: [],
        success: true,
        allowEmpty: true,
    },
    {
        description: 'array invalid (empty)',
        type: 'array',
        value: [],
    },
    {
        description: 'array-buffer',
        type: 'array-buffer',
        value: new ArrayBuffer(0),
        success: true,
    },
    {
        description: 'array-buffer invalid',
        type: 'array-buffer',
        value: Buffer.from('foo'),
    },
    {
        description: 'array-buffer invalid',
        type: 'array-buffer',
        value: [],
    },
    {
        description: 'array-buffer invalid',
        type: 'array-buffer',
        value: 'foo',
    },
    {
        description: 'array-buffer invalid',
        type: 'array-buffer',
        value: 0,
    },
];

const DEFAULT_RANGE = { '1': { min: '1.0.0', max: '0' }, '2': { min: '2.0.0', max: '0' } };

export const getFirmwareRange = [
    {
        description: 'default range. coinInfo and config.json data not found',
        params: ['signTransaction', null, DEFAULT_RANGE],
        result: DEFAULT_RANGE,
    },
    {
        description: 'range from coinInfo',
        params: [
            'signTransaction',
            { support: { trezor1: '1.6.2', trezor2: '2.1.0' }, shortcut: 'btc', type: 'bitcoin' },
            DEFAULT_RANGE,
        ],
        result: { '1': { min: '1.6.2', max: '0' }, '2': { min: '2.1.0', max: '0' } },
    },
    {
        description: 'coinInfo without support',
        params: ['signTransaction', { shortcut: 'btc', type: 'bitcoin' }, DEFAULT_RANGE],
        result: { '1': { min: '0', max: '0' }, '2': { min: '0', max: '0' } },
    },
    {
        description: 'coinInfo without T1 support',
        params: [
            'signTransaction',
            { support: { trezor1: null, trezor2: '2.1.0' }, shortcut: 'btc', type: 'bitcoin' },
            DEFAULT_RANGE,
        ],
        result: { '1': { min: '0', max: '0' }, '2': { min: '2.1.0', max: '0' } },
    },
    {
        description: 'coinInfo without T2 support',
        params: [
            'signTransaction',
            { support: { trezor1: '1.6.2', trezor2: null }, shortcut: 'btc', type: 'bitcoin' },
            DEFAULT_RANGE,
        ],
        result: { '1': { min: '1.6.2', max: '0' }, '2': { min: '0', max: '0' } },
    },
    {
        description: 'coinInfo support is lower than default',
        params: [
            'signTransaction',
            { support: { trezor1: '1.6.2', trezor2: '2.1.0' }, shortcut: 'btc', type: 'bitcoin' },
            { '1': { min: '1.10.0', max: '0' }, '2': { min: '2.4.0', max: '0' } },
        ],
        result: { '1': { min: '1.10.0', max: '0' }, '2': { min: '2.4.0', max: '0' } },
    },
    {
        description: 'range from config.json (by coinType)',
        config: {
            supportedFirmware: [{ coinType: 'bitcoin', min: ['1.10.0', '2.4.0'] }],
        },
        params: [
            'signTransaction',
            { support: { trezor1: '1.6.2', trezor2: '2.1.0' }, shortcut: 'btc', type: 'bitcoin' },
            DEFAULT_RANGE,
        ],
        result: { '1': { min: '1.10.0', max: '0' }, '2': { min: '2.4.0', max: '0' } },
    },
    {
        description: 'range from config.json (by coin as string)',
        config: {
            supportedFirmware: [{ coin: 'btc', min: ['1.10.0', '2.4.0'] }],
        },
        params: [
            'signTransaction',
            { support: { trezor1: '1.6.2', trezor2: '2.1.0' }, shortcut: 'btc', type: 'bitcoin' },
            DEFAULT_RANGE,
        ],
        result: { '1': { min: '1.10.0', max: '0' }, '2': { min: '2.4.0', max: '0' } },
    },
    {
        description: 'range from config.json (by coin as array)',
        config: {
            supportedFirmware: [{ coin: ['btc'], min: ['1.10.0', '2.4.0'] }],
        },
        params: [
            'signTransaction',
            { support: { trezor1: '1.6.2', trezor2: '2.1.0' }, shortcut: 'btc', type: 'bitcoin' },
            DEFAULT_RANGE,
        ],
        result: { '1': { min: '1.10.0', max: '0' }, '2': { min: '2.4.0', max: '0' } },
    },
    {
        description: 'range from config.json (by excludedMethods)',
        config: {
            supportedFirmware: [{ excludedMethods: ['signTransaction'], min: ['1.10.0', '2.4.0'] }],
        },
        params: [
            'signTransaction',
            { support: { trezor1: '1.6.2', trezor2: '2.1.0' }, shortcut: 'btc', type: 'bitcoin' },
            DEFAULT_RANGE,
        ],
        result: { '1': { min: '1.10.0', max: '0' }, '2': { min: '2.4.0', max: '0' } },
    },
    {
        description: 'range from config.json found by coin but ignored because of excludedMethods',
        config: {
            supportedFirmware: [
                { coin: 'btc', excludedMethods: ['signTransaction'], min: ['1.10.0', '2.4.0'] },
            ],
        },
        params: [
            'getAddress',
            { support: { trezor1: '1.6.2', trezor2: '2.1.0' }, shortcut: 'btc', type: 'bitcoin' },
            DEFAULT_RANGE,
        ],
        result: { '1': { min: '1.6.2', max: '0' }, '2': { min: '2.1.0', max: '0' } },
    },
    {
        description: 'range from config.json is lower than coinInfo',
        config: {
            supportedFirmware: [{ excludedMethods: ['signTransaction'], min: ['1.6.2', '2.1.0'] }],
        },
        params: [
            'signTransaction',
            { support: { trezor1: '1.10.0', trezor2: '2.4.0' }, shortcut: 'btc', type: 'bitcoin' },
            DEFAULT_RANGE,
        ],
        result: { '1': { min: '1.10.0', max: '0' }, '2': { min: '2.4.0', max: '0' } },
    },
    {
        description: 'range from config.json using max',
        config: {
            supportedFirmware: [{ excludedMethods: ['signTransaction'], max: ['1.10.0', '2.4.0'] }],
        },
        params: [
            'signTransaction',
            { support: { trezor1: '1.6.2', trezor2: '2.1.0' }, shortcut: 'btc', type: 'bitcoin' },
            DEFAULT_RANGE,
        ],
        result: { '1': { min: '1.6.2', max: '1.10.0' }, '2': { min: '2.1.0', max: '2.4.0' } },
    },
    {
        description: 'range from config.json using max (values lower than default)',
        config: {
            supportedFirmware: [{ excludedMethods: ['signTransaction'], max: ['1.0.1', '2.0.1'] }],
        },
        params: [
            'signTransaction',
            { support: { trezor1: '1.6.2', trezor2: '2.1.0' }, shortcut: 'btc', type: 'bitcoin' },
            {
                '1': { min: '1.0.0', max: '1.10.0' },
                '2': { min: '1.0.0', max: '2.10.0' },
            },
        ],
        result: { '1': { min: '1.6.2', max: '1.10.0' }, '2': { min: '2.1.0', max: '2.10.0' } },
    },
    // real config.json data
    {
        description: 'xrp + getAccountInfo: coinInfo range is replaced by config.json range',
        params: [
            'getAccountInfo',
            { support: { trezor1: '1.0.1', trezor2: '2.0.1' }, shortcut: 'xrp', type: 'ripple' },
            DEFAULT_RANGE,
        ],
        result: { '1': { min: '0', max: '0' }, '2': { min: '2.1.0', max: '0' } },
    },
    {
        description: 'eip1559: coinInfo range is replaced by config.json range',
        params: [
            'eip1559',
            { support: { trezor1: '1.6.2', trezor2: '2.1.0' }, shortcut: 'eth', type: 'ethereum' },
            DEFAULT_RANGE,
        ],
        result: { '1': { min: '0', max: '0' }, '2': { min: '2.4.2', max: '0' } },
    },
];
