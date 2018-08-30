### Get started
Make sure you have [Node.js](https://nodejs.org/en/download/) and a package manager like [npm](https://www.npmjs.com/) installed on your machine.

The file called `script.js` contains functions to handle the conversion from Swagger to Postman, and to update an existing Postman collection. 

1. Add your Postman API key on line 55 of `script.js`.
1. Define your required variables starting on line 90 of `script.js`.

Then from your project's root folder, run the following terminal command to execute the script:

    $ node script.js

You can add additional logic to execute either before or after the conversion in `script.js`. Additionally, you can customize the conversion by updating `./lib/convert.js` or `./lib/helpers.js`.

Check out a [step-by-step walkthrough of automating this process using a GitHub webhook and AWS Lambda](https://medium.com/postman-engineering/the-ultimate-api-publishers-guide-be74a2692326).

# Forked from [swagger2-Postman2](https://github.com/postmanlabs/swagger2-postman2)
Converter for swagger 2.0 JSON to Postman Collection v2
Exports the following functions:

*<ValidationResult> validate(JSON-or-string)*: Formats like RAML/cURL don't have a JSON representation. For others, JSON is preferred. The result should be an object: `{result: true/false, reason: 'string'}`. Reason must be populated if the result is false. This function will be used by the app to determine whether or not this converter can be used for the given input.

*<Conversion result> convert(JSON-or-string)*: Converts the input to a collection object. Conversion result should be an object: `{result: true/false, reason: '', collection: <object>}` Reason must be populated if the result is false. Collection must be populated if result is true.