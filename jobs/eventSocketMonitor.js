
const FsApi = require('../services/fsApi');
const ChannelObserver = require('./channel-observer');

const RECONNECT_INTERVAL = 5000;

const start = async (job) => {
    FsApi.connect().then(connection => {
        //subscribe to all freeswitch events
        connection.subscribe(FsApi.ALL_EVENTS);
        connection.on(FsApi.EVENT.RECEIVED, (event) => {
            // A new freeswitch event has been received
            ChannelObserver.notify(event)

        })
        connection.on(FsApi.EVENT.Connection.CLOSED, () => {
            console.log('Freeswitch ESL connection closed');
            setTimeout(start, RECONNECT_INTERVAL)
        });
        connection.on(FsApi.EVENT.Connection.ERROR, (err) => {
            console.log('Freeswitch ESL connection error', err);
            setTimeout(start, RECONNECT_INTERVAL)
        });
    }).catch(err => {
        console.log(err);
        setTimeout(start, RECONNECT_INTERVAL)
    })
}

module.exports = { start };