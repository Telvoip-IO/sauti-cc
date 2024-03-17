
const dbService = require('../utils/dbService');
const authService = require('../services/auth');
const validation = require('../utils/validateRequest');
const authConstant = require('../constants/auth');
const userSchemaKey = require('../utils/validation/user');
const { checkUniqueFieldsInDatabase } = require('../utils/common');
const { sendPasswordByEmail } = require('../services/auth');
const dayjs = require("dayjs");
const {user} = require('../model/index');

const register = async (req, res)  => {
    try{
        let dataToRegister = req.body;
        let validateRequest = validation.validateParamsWithJoi(
            dataToRegister,
            userSchemaKey.schemaKeys
        );
        if (!validateRequest.isValid) {
            return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
        }
        let isEmptyPassword = false;
        if (!dataToRegister.password){
            isEmptyPassword = true;
            dataToRegister.password = Math.random().toString(36).slice(2);
        }

        let checkUniqueFields = await checkUniqueFieldsInDatabase(user,[  'email' ],dataToRegister,'REGISTER');
        if (checkUniqueFields.isDuplicate){
            return res.validationError({ message : `${checkUniqueFields.value} already exists.Unique ${checkUniqueFields.field} are allowed.` });
        }

        const result = await dbService.createOne(user,{
            ...dataToRegister,
            userType: authConstant.USER_TYPES.Admin
        });

        console.log('result',result)

        if (isEmptyPassword && req.body.email){
            sendPasswordByEmail({
                email: req.body.email,
                password: req.body.password
            });
        }

        return res.success({ data: result });
    }catch (e){
        return res.internalServerError({ message: e.message });
    }
}

const login = async (req, res) => {
    try {
        let {
            username,password
        } = req.body;
        if (!username || !password){
            return res.badRequest({ message : 'Insufficient request parameters! username and password is required.' });
        }
        let roleAccess = false;
        // if (req.body.includeRoleAccess){
        //     roleAccess = req.body.includeRoleAccess;
        // }
        let result = await authService.login(username, password, authConstant.PLATFORM.ADMIN, roleAccess);
        if (result.flag){
            return res.badRequest({ message:result.data });
        }
        return res.success({
            data:result.data,
            message :'Login successful.'
        });
    } catch (error) {
        return res.internalServerError({ message:error.message });
    }
}


module.exports = {
    register,
    login
}