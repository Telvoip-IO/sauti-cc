
const GenericEvent = require('./event');

const buildEvent = (rawEvent) => {
    const eventName = rawEvent.getHeader('Event-Name');
    switch (eventName) {
        case 'CHANNEL_CREATE':
            return new ChannelCreateEvent(rawEvent);
        case 'CHANNEL_HANGUP':
            return new ChannelHangupEvent(rawEvent);
        default:
            return GenericEvent.buildFrom(rawEvent);
    }
}