
module.exports = {
    CallType: {
        INBOUND_CALL: 1,
        OUTBOUND_CALL: 2,
        AUTO_CALL: 3,
        BOOT_CALL: 4,
        BOTH_CALL: 5,
        SIP_OUTBOUND_CALL: 6,
        INNER_CALL: 7,
        Code: ''
    },
    CauseEnums: {
        NORMAL_CLEARING: 0,
        UNALLOCATED_NUMBER: 9001,
        USER_BUSY: 9002,
        NORMAL_TEMPORARY_FAILURE: 9003,
        RECOVERY_ON_TIMER_EXPIRE: 9004,
        DESTINATION_OUT_OF_ORDER: 9005,
        NO_ANSWER: 9006,
        NO_USER_RESPONSE: 9007,
        CALL_REJECTED: 9008,
        MANDATORY_IE_MISSING: 9009,
        ORIGINATOR_CANCEL: 9010,
        TIMEOUT: 9011,
        OVERFLOW_TIMEOUT: 9501,
        QUEUE_TIMEOUT: 9502,
        VDN_ERROR: 9503,
        CALL_TIMEOUT: 9504,
        PARAMETER_ERROR: 9599
    },
    Direction: {
        INBOUND: 1,
        OUTBOUND: 2
    }
};