
const configParams = {
    freeswitch: {
        ip: '13.48.136.19',
        port: 8021,
        password: 'ClueCon',
    },
};

const getConfig = module => (configParams[module] !== undefined) ? configParams[module] : {};

exports.getConfig = getConfig;