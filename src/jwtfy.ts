const njwt = require("njwt");
const urlencode = require("urlencode");
const sha = require("sha.js");
require("dotenv").config();

export function hash(text: string): string {
	return urlencode(sha("sha384").update(text, "utf8").digest("base64"));
}

export function getClientToken(client: string): any {
	const hashed = hash(
		JSON.stringify({
			client,
			issuer: "jwtfy",
			secret: hash(process.env.classified as string),
			timestamp: new Date().getTime()
		})
	);
	return { client, token: hashed };
}

export async function getAccessToken(clientToken: string, hourDuration: number = 1): Promise<any> {
	const timestamp = new Date().getTime();
	const offset = 1000 * 60 * 60 * hourDuration;
	const payload = {
		iat: timestamp,
		iss: "jwtfy",
		sub: clientToken
	};
	const jwt = njwt.create(payload, hash(process.env.classified as string));
	jwt.setExpiration(timestamp + offset);
	return Promise.resolve({ accessToken: jwt.compact() });
}

export async function verifyAccessToken(accessToken: string): Promise<boolean> {
	if (!accessToken.startsWith("Bearer")) {
		throw new Error("Invalid bearer token.");
	}
	const accessToken1 = accessToken.split(" ")[1];
	return new Promise((resolve) => {
		njwt.verify(accessToken1, hash(process.env.classified as string), (error: any, _: any) => {
			if (error) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
}

const client = process.argv[2];
if (client) {
	const clientToken = getClientToken(client);
	console.log(clientToken);
} else {
	console.log("Need to have 'client' as the 3rd argument");
}
