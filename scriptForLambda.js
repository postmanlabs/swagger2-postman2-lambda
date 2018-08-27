var Converter = require('./convert'),
    // Converter = require('swagger2-postman2-converter'),
    request = require('request');
    // secrets = require('./secrets');


// ###############################################
// define helper functions to handle conversion and update collection

module.exports = {
    getSwaggerFile: function (owner, repo, filepathAndName) {

        let getGitHubOptions = {
            method: 'GET',
            url: `https://api.github.com/repos/${owner}/${repo}/contents/${filepathAndName}`,
            headers: {
                'Accept': 'application/vnd.github.3.raw',
                'User-Agent': owner
            }
        };

        // submit GET request to retrieve Swagger file
        return new Promise(function(resolve, reject) {
            request(getGitHubOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(body));
                }
            });
        })
    },

    convertCollection: function (swaggerFile) {

        // use converter imported from local directory
        return new Promise(function(resolve, reject) {
            let converted = Converter(swaggerFile);
            console.log('after convert', converted);
            resolve(JSON.stringify(converted));
        })
    },

    updatePostmanCollection: function (newFile, collection_uid) {

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
                'X-Api-Key': process.env.postmanAPIKey,
                'Content-Type': 'application/json'
            },
            body: JSON.parse(newFile),
            json: true
        };

        // submit PUT request to update a Postman collection
        return new Promise(function(resolve, reject) {
            request(putOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    console.log('updated collection', body);
                    resolve(body);
                }
            });
        })
    }
};


// ###############################################
// define main function
// move this main function definition and invokation to the Lambda handler
// async function converter (owner, repo, filepathAndName, collection_uid) {

//     let result = await functions.getSwaggerFile(owner, repo, filepathAndName);
//     console.log("Retrieved GitHub swagger file");

//     let updatedPostmanCollection = await functions.convertCollection(result);
//     console.log("Converted Swagger to Postman");

//     let response = await functions.updatePostmanCollection(updatedPostmanCollection, collection_uid);
//     console.log('Updating Postman Collection', response);
// }

// // define required variables
// let collection_uid = "1559979-2de5594b-7153-4270-b280-451705f346f3";
// let owner = "loopDelicious";
// let repo = "swagger2-postman2";
// let filepathAndName = "data/swagger.json";

// // call main function
// converter(owner, repo, filepathAndName, collection_uid);
