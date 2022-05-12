import { Swagger, XAmazonApigatewayIntegration } from "./model";
import { default as swagger } from "./swagger.json";
import fs from 'fs';

const documentation = swagger as any;
// const objectPath = documentation.paths;

Object.keys(documentation.paths as any).forEach(path => {
    // obtengo los paths
    // get endpoint
    const endpoint = documentation.paths[`${path}`];

    Object.keys(endpoint).forEach(method => {

        const docXAmazon: XAmazonApigatewayIntegration = {
            uri: "http://${stageVariables.BaseURL}" + path,
            responses: {
                default: {
                    statusCode: "200"
                }
            },
            passthroughBehavior: "when_no_match",
            connectionType: "VPC_LINK",
            connectionId: "${stageVariables.VPCLink}",
            httpMethod: method.toUpperCase(),
            type: "http_proxy"
        }
        delete endpoint[method]["operationId"]
        // endpoint[method]["operationId"] = uuidv4();
        endpoint[method]["x-amazon-apigateway-integration"] = docXAmazon;
    })
    // delete endpoint[keyTypeMethod]["operationId"]

    documentation.paths[`${path}`] = endpoint;
});


fs.writeFileSync('swagger2.json', JSON.stringify(documentation));