// index file for Lambda
console.log('Loading function');
const functions = require('./scriptForLambda');

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    const message = event.Records[0].Sns.Message;
    console.log('From SNS:', message);

    async function converter (owner, repo, filepathAndName, collection_uid) {

        let result = await functions.getSwaggerFile(owner, repo, filepathAndName);
        console.log("Retrieved GitHub swagger file");

        let updatedPostmanCollection = await functions.convertCollection(result);
        console.log("Converted Swagger to Postman");

        let response = await functions.updatePostmanCollection(updatedPostmanCollection, collection_uid);
        console.log('Updating Postman Collection', response);
    }

    // define required variables
    let collection_uid = "1559979-2de5594b-7153-4270-b280-451705f346f3";
    let owner = "loopDelicious";
    let repo = "swagger2-postman2";
    let filepathAndName = "data/swagger.json";

    // call main function
    converter(owner, repo, filepathAndName, collection_uid);

    return message;
};
