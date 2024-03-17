
const models = require('../model');
const { Op } = require('sequelize');

const OPERATORS = ['$and', '$or', '$like', '$in', '$eq', '$gt', '$lt', '$gte', '$lte', '$any', '$between'];

const createOne = async (model, data) => model.create(data);

const update = async (model, query, data) => {
  query = queryBuilderParser(query);
  let result = await model.update(data, { where: query });
  result = await model.findAll({ where: query });
  return result;
};

const findOne = async (model, query, options = {}) => {
    query = queryBuilderParser(query);
    return model.findOne({
        where: query,
        options,
    });
}

//find multiple records without pagination
const findAll = async (model, query, options = {}) => {
    query = queryBuilderParser(query);
    if (options && options.select && options.select.length) {
        options.attributes = options.select;
        delete options.select;
    }
    if (options && options.sort) {
        options.order = sortParser(options.sort);
        delete options.sort;
    }
    if (options && options.include && options.include.length) {
        const include = [];
        options.include.forEach((i) => {
            i.model = models[i.model];
            if (i.query) {
                i.where = queryBuilderParser(i.query);
            }
            include.push(i);
        });
        options.include = include;
    }
    options = {
        where: query,
        ...options,
    };
    return model.findAll({ where: query, ...options });
};

const paginate = async (model, query, options = {}) => {
    query = queryBuilderParser(query);
    if (options && options.select && options.select.length) {
        options.attributes = options.select;
        delete options.select;
    }
    if (options && options.sort) {
        options.order = sortParser(options.sort);
        delete options.sort;
    }
    if (options && options.include && options.include.length) {
        const include = [];
        options.include.forEach((i) => {
            i.model = models[i.model];
            if (i.query) {
                i.where = queryBuilderParser(i.query);
            }
            include.push(i);
        });
        options.include = include;
    }
    return model.findAndCountAll({ where: query, ...options });
};

const count = async (model, query, options = {}) => {
    query = queryBuilderParser(query);
    return model.count({ where: query , ...options});
};

const queryBuilderParser = (data) => {
    if (data) {
        const keys = Object.keys(data);
        keys.forEach((key) => {
            if (OPERATORS.includes(key)) {
                data[Op[key]] = data[key];
                delete data[key];
            }
        });
    }
    return data;
}

const sortParser = (sort) => {
    const newSortedObject = [];
    if (sort) {
        Object.entries(aort).forEach(([key, value]) => {
            if (value === 1) {
                newSortedObject.push([key, 'ASC']);
            } else if (value === -1) {
                newSortedObject.push([key, 'DESC']);
            }
        });
    }
    return newSortedObject;
}

module.exports = {
    findAll,
    count,
    queryBuilderParser,
    createOne,
    update,
    findOne,
    paginate
};