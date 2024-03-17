

const buildFrom = (rawEvent) => {
    return {
        callingFile: rawEvent.getHeader('Event-Calling-File'),
        callingFunction: rawEvent.getHeader('Event-Calling-Function'),
        callingLineNumber: rawEvent.getHeader('Event-Calling-Line-Number'),
        date: {
            local: rawEvent.getHeader('Event-Date-Local'),
            name: rawEvent.getHeader('Event-Date-Name'),
            gmt: rawEvent.getHeader('Event-Date-GMT'),
        },
        name: rawEvent.getHeader('Event-Name'),
    }
}

module.exports = { buildFrom }