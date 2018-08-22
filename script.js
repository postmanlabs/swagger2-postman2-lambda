var fs = require('fs'),
    // Converter = require('swagger2-postman2-converter'),
    Converter = require('./lib/convert'),
    secrets = require('./secrets'),
    request = require('request');


// ###############################################
// define functions to handle conversion and update collection

// retrieves postman collection based on uid, returns postman collection
function getPostmanCollection(collection_uid) {

    // compile GET request to retrieve a single Postman collection
    let getSingleOptions = {
        method: 'GET',
        url: `https://api.getpostman.com/collections/${collection_uid}`,
        headers: {
            'Postman-Token': '4122abb3-6098-6906-e172-49334961f595',
            'Cache-Control': 'no-cache',
            'X-Api-Key': secrets.postmanAPIKey,
            'Content-Type': 'application/json'
        }
    };

    // submit GET request to retrieve a single Postman collection
    request(getSingleOptions, function (error, response, body) {
        if (error) throw new Error(error);
        console.log('get single collection', body);
        return body;
    });
}

function updatePostmanCollection(newFile, collection_uid) {

    // compile PUT request to update a Postman collection
    let putOptions = {
        method: 'PUT',
        url: `https://api.getpostman.com/collections/${collection_uid}`,
        qs: {
            format: '2.1.0'
        },
        headers: {
            'Postman-Token': '4122abb3-6098-6906-e172-49334961f595',
            'Cache-Control': 'no-cache',
            'X-Api-Key': secrets.postmanAPIKey,
            'Content-Type': 'application/json'
        },
        body: JSON.parse(newFile),
        json: true
    };

    // submit PUT request to update a Postman collection
    request(putOptions, function (error, response, body) {
        if (error) throw new Error(error);
        // console.log('updated collection', body);
    });

}

function convertCollection(swaggerPath) {

    let swaggerFile = require(swaggerPath);
    let converted = Converter(swaggerFile);
    // console.log('after convert', converted);
    return JSON.stringify(converted);
}


// ###############################################
// call functions to handle conversion and update collection

let collection_uid = "1559979-2de5594b-7153-4270-b280-451705f346f3";
let pathToSwaggerFile = './data/swagger.json';

// retrieves postman collection based on uid
// returns postman collection
let originalPostmanCollection = getPostmanCollection(collection_uid); 

// swagger json converts to postman collection
// returns converted postman collection
let newPostmanCollection = convertCollection(pathToSwaggerFile);

// update postman collection
updatePostmanCollection(newPostmanCollection, collection_uid)
