'use strict';

require('dotenv').config();

const { v4: uuidv4 } = require('uuid');

var AWS = require('aws-sdk');
const aws_region = process.env.region;
const tableName = process.env.roleTable;

var dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: aws_region,
});

module.exports.clientRole = async(event, context, callback) => {
// async function insertDataintoDatabase() {
    var params = {
        TableName: tableName,
        Item: {
            id: uuidv4(),
            email: event.userName, 
            name: event.request.userAttributes.name,
            user_type: 'user', 
            email_verified: event.request.userAttributes.email_verified, 
            user_status: event.request.userAttributes['cognito:user_status'], 
            createdAt: Date.now(),
            updateAt: Date.now(),
        }
    };
    let putItem = new Promise((res, rej) => {
        dynamoDB.put(params, function(err, data) {
            if (err) {
                console.log("Error", err);
                rej(err);
            } else {
                console.log("Success!");
                res("Inserted data into Dynamodb!");
            }
        }); 
    });
    const result = await putItem;
    console.log(result);  
    context.succeed(event);

}

// insertDataintoDatabase(); // commmet this