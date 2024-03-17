
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilter');


exports.schemaKeys = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string().allow(null).allow(''),
    code: joi.string().required(),
    address: joi.string().allow(null).allow(''),
    balance: joi.string().allow(null).allow(''),
    website: joi.string().allow(null).allow(''),
    isActive: joi.boolean().default(true),
    isDeleted: joi.boolean().default(false),
    billing_type: joi.number().integer().allow(0),
    pay_type: joi.number().integer().allow(0),
    ivr_limit: joi.number().integer().allow(0),
    agent_limit: joi.number().integer().allow(0),
    group_limit: joi.number().integer().allow(0),
    duration_storage: joi.number().integer().allow(0),
    callback_url: joi.string().allow(null).allow(''),
    status: joi.number().integer().allow(0)
    }).unknown(true);

exports.updateSchemaKeys = joi.object({
    name: joi.string().when({
        is:joi.exist(),
        then:joi.required(),
        otherwise:joi.optional()
    }),
    email: joi.string().when({
        is:joi.exist(),
        then:joi.required(),
        otherwise:joi.optional()
    }),
    phone: joi.string().allow(null).allow(''),
    code: joi.string().when({
        is:joi.exist(),
        then:joi.required(),
        otherwise:joi.optional()
    }),
    address: joi.string().allow(null).allow(''),
    balance: joi.string().allow(null).allow(''),
    website: joi.string().allow(null).allow(''),
    isActive: joi.boolean().default(true),
    isDeleted: joi.boolean().default(false),
    billing_type: joi.number().integer().allow(0),
    pay_type: joi.number().integer().allow(0),
    ivr_limit: joi.number().integer().allow(0),
    agent_limit: joi.number().integer().allow(0),
    group_limit: joi.number().integer().allow(0),
    duration_storage: joi.number().integer().allow(0),
    callback_url: joi.string().allow(null).allow(''),
    status: joi.number().integer().allow(0),
    id: joi.number().integer()
}).unknown(true);

let keys = ['query', 'where'];

exports.findFilterKeys = joi.object({
    options: options,
    ...Object.fromEntries(
        keys.map(key => [key, joi.object({
            name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
            email: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
            phone: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
            code: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
            address: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
            balance: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
            website: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
            isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
            isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
            billing_type: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
            pay_type: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
            ivr_limit: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
            agent_limit: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
            group_limit: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
            duration_storage: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
            callback_url: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
            status: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
            id: joi.any()
        }).unknown(true),])
    ),
    isCountOnly: isCountOnly,
    include: joi.array().items(include),
    select: select
}).unknown(true);
