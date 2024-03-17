
const Event = {
    Channel: {
        CREATE: 'CHANNEL_CREATE',
        HANGUP: 'CHANNEL_HANGUP',
    },
};

const notify = (event) => {
    const eventName = event.getHeader('Event-Name');
    switch (eventName) {
        case Event.Channel.CREATE:
            // console.info(`Channel created : ${JSON.stringify(event)}`);
            break;
        case Event.Channel.HANGUP:
            // console.info(`Channel hangup : ${JSON.stringify(event)}`);
            break;
        default:
            // A new unhandled event has been received...
            break;
    }
};

exports.notify = notify;