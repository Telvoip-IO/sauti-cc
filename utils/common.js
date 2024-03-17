
const {Op} = require('sequelize');
const dbService = require('../utils/dbService');


function getDifferenceOfTwoDatesInTime (currentDate,toDate){
    let hours = toDate.diff(currentDate,'hour');
    currentDate =  currentDate.add(hours, 'hour');
    let minutes = toDate.diff(currentDate,'minute');
    currentDate =  currentDate.add(minutes, 'minute');
    let seconds = toDate.diff(currentDate,'second');
    currentDate =  currentDate.add(seconds, 'second');
    if (hours){
        return `${hours} hour, ${minutes} minute and ${seconds} second`;
    }
    return `${minutes} minute and ${seconds} second`;
}


async function getRoleAccessData (model,userId) {
    let userRoles = await dbService.findAll(model.userRole, { userId: userId });
    let routeRoles = await dbService.findAll(model.routeRole, { roleId: { $in: userRoles && userRoles.length ? userRoles.map(u=>u.roleId) : [] } },
        {
            include:[/*{
                model: model.projectRoute,
                as:'_routeId'
            },*/{
                model: model.role,
                as: '_roleId'
            }]
        });
    let models = Object.keys(model);
    let Roles = routeRoles && routeRoles.length ? routeRoles.map(rr => rr._roleId && rr._roleId.name).filter((value, index, self) => self.indexOf(value) === index) : [];
    let roleAccess = {};
    if (Roles.length){
        Roles.map(role => {
            roleAccess[role] = {};
            models.forEach(model => {
                if (routeRoles && routeRoles.length) {
                    routeRoles.map(rr => {
                        if (rr._routeId && rr._routeId.uri.includes(`/${model.toLowerCase()}/`) && rr._roleId && rr._roleId.name === role) {
                            if (!roleAccess[role][model]) {
                                roleAccess[role][model] = [];
                            }
                            if (rr._routeId.uri.includes('create') && !roleAccess[role][model].includes('C')) {
                                roleAccess[role][model].push('C');
                            }
                            else if (rr._routeId.uri.includes('list') && !roleAccess[role][model].includes('R')) {
                                roleAccess[role][model].push('R');
                            }
                            else if (rr._routeId.uri.includes('update') && !roleAccess[role][model].includes('U')) {
                                roleAccess[role][model].push('U');
                            }
                            else if (rr._routeId.uri.includes('delete') && !roleAccess[role][model].includes('D')) {
                                roleAccess[role][model].push('D');
                            }
                        }
                    });
                }
            });
        });
    }
    return roleAccess;
};


async function uniqueValidation(Model, data){
    let filter = { $or:[] };
    if (data && data['username']){
        filter.$or.push(
            { 'username':data['username'] },
            { 'email':data['username'] },
        );
    }
    if (data && data['email']){
        filter.$or.push(
            { 'username':data['email'] },
            { 'email':data['email'] },
        );
    }
    filter.isActive = true;
    filter.isDeleted = false;
    let found = await dbService.findOne(Model,filter);
    return !found;
}

const checkUniqueFieldsInDatabase = async (model, fieldsToCheck, data, operation, filter = {})=> {
    switch (operation) {
        case 'INSERT':
            for (const field of fieldsToCheck) {
                //Add unique field and it's value in filter.
                let query = {
                    ...filter,
                    [field] : data[field]
                };
                let found = await dbService.findOne(model, query);
                if (found) {
                    return {
                        isDuplicate : true,
                        field: field,
                        value:  data[field]
                    };
                }
            }
            break;
        case 'BULK_INSERT':
            for (const dataToCheck of data) {
                for (const field of fieldsToCheck) {
                    //Add unique field and it's value in filter.
                    let query = {
                        ...filter,
                        [field] : dataToCheck[field]
                    };
                    let found = await dbService.findOne(model, query);
                    if (found) {
                        return {
                            isDuplicate : true,
                            field: field,
                            value:  dataToCheck[field]
                        };
                    }
                }
            }
            break;
        case 'UPDATE':
        case 'BULK_UPDATE':
            let existData = await dbService.findAll(model, filter, { select : ['id'] });

            for (const field of fieldsToCheck) {
                if (Object.keys(data).includes(field)) {
                    if (existData && existData.length > 1) {
                        return {
                            isDuplicate : true,
                            field: field,
                            value:  data[field]
                        };
                    } else if (existData && existData.length === 1){
                        let found = await dbService.findOne(model,{ [field]: data[field] });
                        if (found && (existData[0].id !== found.id)) {
                            return {
                                isDuplicate : true,
                                field: field,
                                value:  data[field]
                            };
                        }
                    }
                }
            }
            break;
        case 'REGISTER':
            for (const field of fieldsToCheck) {
                //Add unique field and it's value in filter.
                let query = {
                    ...filter,
                    [field] : data[field]
                };
                let found = await dbService.findOne(model, query);
                if (found) {
                    return {
                        isDuplicate : true,
                        field: field,
                        value:  data[field]
                    };
                }
            }
            //cross field validation required when login with multiple fields are present, to prevent wrong user logged in.

            let loginFieldFilter = { [Op.or]:[] };
            if (data && data['username']){
                loginFieldFilter[Op.or].push(
                    { 'username':data['username'] },
                    { 'email':data['username'] },
                );
                loginFieldFilter.isActive = true;
                loginFieldFilter.isDeleted = false;
                let found = await dbService.findOne(model,loginFieldFilter);
                if (found){
                    return {
                        isDuplicate : true,
                        field: 'username and email',
                        value:  data['username']
                    };
                }
            }
            if (data && data['email']){
                loginFieldFilter[Op.or].push(
                    { 'username':data['email'] },
                    { 'email':data['email'] },
                );
                loginFieldFilter.isActive = true;
                loginFieldFilter.isDeleted = false;
                let found = await dbService.findOne(model,loginFieldFilter);
                if (found){
                    return {
                        isDuplicate : true,
                        field: 'username and email',
                        value:  data['email']
                    };
                }
            }
            break;
        default:
            return { isDuplicate : false };
            break;
    }
    return { isDuplicate : false };
};

module.exports = {
    checkUniqueFieldsInDatabase,
    getDifferenceOfTwoDatesInTime,
}