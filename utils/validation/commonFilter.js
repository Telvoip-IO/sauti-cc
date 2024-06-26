
const joi = require('joi');

exports.options = joi.object({
    pagination: joi.boolean(),
    collation: joi.alternatives().try(joi.string(), joi.object()).allow(null).allow(''),
    sort: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()).allow(null).allow(''),
     page: joi.number().integer(),
    limit: joi.number(),
    useEstimatedCount: joi.boolean(),
    useCustomCountFn: joi.boolean(),
    forceCountFn: joi.boolean(),
    read: joi.any(),
    options: joi.any()

    }).unknown(true);

exports.isCountOnly = joi.boolean();

exports.include = joi.object({
    path: joi.string().allow(null).allow(''),
    select: joi.array(),
    attributes: joi.array()

}).unknown(true);

exports.select = joi.alternatives().try(joi.array().items(),joi.string(),joi.object()).allow(null).allow('');