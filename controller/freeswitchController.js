
// controller to handle the freeswitch related operations making and receiving calls handling dtmf events etc. and ivr operations

const ESL = require('modesl');
const FsApi = require("../services/fsApi");
const {response} = require("express");
const  ESL_CONFIG  = require('../config/fs').getConfig('freeswitch');

const makeCall = async (req, res) => {
    const { phoneNumber } = req.body;
    FsApi.execute(`originate {origination_caller_id_number=1005}sofia/internal/${phoneNumber}@${ESL_CONFIG.ip} &echo`)
        .then(response => {
            res.success({ message: 'Call initiated successfully' });
        })
        .catch(error => {
            res.internalServerError({ message: 'Error while initiating call' });
        });
}


const receiveCall = async (req, res) => {

}


const dtmfHandler = async (req, res) => {
    try {
        const connection = await connect();
        connection.api('originate', `sofia/internal/1000@${ESL_CONFIG.ip} &echo`);
        res.success({ message: 'Call initiated successfully' });
    } catch (error) {
        res.internalServerError({ message: 'Error while initiating call' });
    }
}

module.exports = {
    makeCall,
    receiveCall,
    dtmfHandler
}