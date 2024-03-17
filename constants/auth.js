/**
 * authConstant.js
 * @description :: constants used in authentication
 */

const JWT = {
    ADMIN_SECRET:'adm1ns3cr3tk3y',
    CLIENT_SECRET:'s3cr3tk3y',
    AGENT_SECRET:'agSecretK3y',
    SUPER_SECRET:'sup3rS3cr3tK3y',
    EXPIRES_IN: 10000
};

const USER_TYPES = {
    Agent:1,
    User:2,
    Admin:3,
    Supervisor:4,
};

const PLATFORM = {
    CLIENT:1,
    ADMIN:2,
};

let LOGIN_ACCESS = {
    [USER_TYPES.User]:[PLATFORM.CLIENT],
    [USER_TYPES.Admin]:[PLATFORM.ADMIN],
    [USER_TYPES.Agent]:[PLATFORM.CLIENT],
    [USER_TYPES.Supervisor]:[PLATFORM.CLIENT],
};

const MAX_LOGIN_RETRY_LIMIT = 5;
const LOGIN_REACTIVE_TIME = 10;

const SEND_LOGIN_OTP = { SMS:1, };
const DEFAULT_SEND_LOGIN_OTP = SEND_LOGIN_OTP.SMS;

const FORGOT_PASSWORD_WITH = {
    LINK: {
        email: true,
        sms: false
    },
    EXPIRE_TIME: 15
};

module.exports = {
    JWT,
    USER_TYPES,
    PLATFORM,
    MAX_LOGIN_RETRY_LIMIT,
    LOGIN_REACTIVE_TIME,
    SEND_LOGIN_OTP,
    DEFAULT_SEND_LOGIN_OTP,
    FORGOT_PASSWORD_WITH,
    LOGIN_ACCESS,
};