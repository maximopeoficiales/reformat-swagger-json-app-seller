import { Swagger, XAmazonApigatewayIntegration } from "./model";
import { default as swagger } from "./swagger.json";
import fs from 'fs';

const documentation = swagger as Swagger;
// const objectPath = documentation.paths;

Object.keys(documentation.paths as any).forEach(path => {
    // obtengo los paths
    // get endpoint
    const endpoint = documentation.paths[`${path}`];
    const keyTypeMethod = Object.keys(endpoint)[0];

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
        httpMethod: keyTypeMethod.toUpperCase(),
        type: "http_proxy"
    }
    delete endpoint[keyTypeMethod]["operationId"];
    endpoint[keyTypeMethod]["x-amazon-apigateway-integration"] = docXAmazon;

    documentation.paths[`${path}`] = endpoint;
});


fs.writeFileSync('swagger2.json', JSON.stringify(documentation));