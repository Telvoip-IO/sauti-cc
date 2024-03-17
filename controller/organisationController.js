
const Organisation = require('../model/organisation');
const organisationSchemaKey = require('../utils/validation/organisation');
const validation = require('../utils/validateRequest');
const dbService = require('../utils/dbService');
const utils = require('../utils/common');


const createOrganisation = async (req, res) => {
    try{
        let dataToRegister = req.body;
        let validateRequest = validation.validateParamsWithJoi(
            dataToRegister,
            organisationSchemaKey.schemaKeys
        );
        if (!validateRequest.isValid) {
            return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
        }

        let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Organisation,[ 'name' ],dataToRegister,'REGISTER');
        if (checkUniqueFields.isDuplicate){
            return res.validationError({ message : `${checkUniqueFields.value} already exists.Unique ${checkUniqueFields.field} are allowed.` });
        }

        const result = await dbService.createOne(Organisation,dataToRegister);

        return res.success({ data: result });
    }catch (e){
        return res.internalServerError({ message: e.message });
    }
}

const findAllOrganisation = async (req, res) => {
    try{
        let validateRequest = validation.validateParamsWithJoi(
            req.query,
            organisationSchemaKey.findFilterKeys
        );
        if (!validateRequest.isValid) {
            return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
        }

        let result = await dbService.findAll(Organisation,req.query);
        return res.success({ data: result });
    }catch (e){
        return res.internalServerError({ message: e.message });
    }
}




module.exports = {
    createOrganisation,
    findAllOrganisation
}
