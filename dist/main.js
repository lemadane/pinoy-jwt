"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const njwt = require("njwt");
const urlencode = require("urlencode");
const sha = require("sha.js");
const packageName = require("../package.json").name;
function hash(text) {
    return urlencode(sha("sha384").update(text, "utf8").digest("base64"));
}
exports.hash = hash;
function getClientToken(client) {
    const hashed = hash(JSON.stringify({
        client,
        issuer: packageName,
        secret: hash(packageName),
        timestamp: new Date().getTime()
    }));
    return { client, token: hashed };
}
exports.getClientToken = getClientToken;
function getAccessToken(clientToken, hourDuration = 1) {
    const timestamp = new Date().getTime();
    const offset = 1000 * 60 * 60 * hourDuration;
    const payload = {
        iat: timestamp,
        iss: packageName,
        sub: clientToken
    };
    const jwt = njwt.create(payload, hash(packageName));
    jwt.setExpiration(timestamp + offset);
    return { accessToken: "Bearer " + jwt.compact() };
}
exports.getAccessToken = getAccessToken;
async function verifyAccessToken(accessToken) {
    if (!accessToken.startsWith("Bearer")) {
        return Promise.resolve(false);
    }
    const accessToken1 = accessToken.split(" ")[1];
    if (!accessToken1) {
        Promise.resolve(false);
    }
    return new Promise(async (resolve) => {
        njwt.verify(accessToken1, hash(packageName), (error, _) => {
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
