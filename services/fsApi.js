
const ESL = require('modesl');
const  ESL_CONFIG  = require('../config/fs').getConfig('freeswitch');

const EVENT = {
    Connection: {
        READY: 'esl::ready',
        CLOSED: 'esl::closed',
        ERROR: 'esl::error'
    },
    RECEIVED: 'esl::event::*::*'
}
const ALL_EVENTS = 'all';
const DTMF_EVENTS = 'DTMF';
let connection = null;

const connect = () =>  new Promise((resolve, reject) => {
    if(connection != null && connection.connected){
        resolve(connection);
    }else{
        //opening new Freeswitch ESL connection..
        connection = new ESL.Connection(ESL_CONFIG.ip, ESL_CONFIG.port, ESL_CONFIG.password, function(){
            console.log('Freeswitch ESL connection opened');
            resolve(connection);
        });
        connection.on(EVENT.Connection.ERROR, (err) => {
            console.log('Freeswitch ESL connection error', err);
            reject(err);
        });
        connection.on(EVENT.Connection.CLOSED, () => {
            console.log('Freeswitch ESL connection closed');
            reject('Connection Closed')
        });
        connection.on(EVENT.Connection.READY, () => {
            console.log('Freeswitch ESL connection ready');
            resolve(connection);
        });
    }
});

const execute = (command) => new Promise((resolve, reject) => {
    connect()
        .then(connection => {
            connection.bgapi(command, response => {
                const responseBody = response.getBody();
                resolve(responseBody);
            });
        })
        .catch(error => {
            reject(error);
        });
});

const disconnect = () => {
    if(connection != null && connection.connected){
        connection.disconnect();
        connection = null;
    }
}

module.exports = {
    connect,
    execute,
    disconnect,
    ALL_EVENTS,
    DTMF_EVENTS,
    EVENT
}

