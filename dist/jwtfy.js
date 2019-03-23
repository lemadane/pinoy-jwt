"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const njwt = require("njwt");
const urlencode = require("urlencode");
const sha = require("sha.js");
require("dotenv").config();
function hash(text) {
    return urlencode(sha("sha384").update(text, "utf8").digest("base64"));
}
exports.hash = hash;
function getClientToken(client) {
    const hashed = hash(JSON.stringify({
        client,
        issuer: "jwtfy",
        secret: hash(process.env.classified),
        timestamp: new Date().getTime()
    }));
    return { client, token: hashed };
}
exports.getClientToken = getClientToken;
async function getAccessToken(clientToken, hourDuration = 1) {
    const timestamp = new Date().getTime();
    const offset = 1000 * 60 * 60 * hourDuration;
    const payload = {
        iat: timestamp,
        iss: "jwtfy",
        sub: clientToken
    };
    const jwt = njwt.create(payload, hash(process.env.classified));
    jwt.setExpiration(timestamp + offset);
    return Promise.resolve({ accessToken: jwt.compact() });
}
exports.getAccessToken = getAccessToken;
async function verifyAccessToken(accessToken) {
    if (!accessToken.startsWith("Bearer")) {
        throw new Error("Invalid bearer token.");
    }
    const accessToken1 = accessToken.split(" ")[1];
    return new Promise((resolve) => {
        njwt.verify(accessToken1, hash(process.env.classified), (error, _) => {
            if (error) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.verifyAccessToken = verifyAccessToken;
const client = process.argv[2];
if (client) {
    const clientToken = getClientToken(client);
    console.log(clientToken);
}
else {
    console.log("Need to have 'client' as the 3rd argument");
}
