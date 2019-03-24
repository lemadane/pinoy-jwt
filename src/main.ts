const njwt = require("njwt");
const urlencode = require("urlencode");
const sha = require("sha.js");
const packageName = require("../package.json").name;


export function hash(text: string): string {
	return urlencode(sha("sha384").update(text, "utf8").digest("base64"));
}

export function getClientToken(client: string): any {
	const hashed = hash(
		JSON.stringify({
			client,
			issuer: packageName,
			secret: hash(packageName),
			timestamp: new Date().getTime()
		})
	);
	return { client, token: hashed };
}

export function getAccessToken(clientToken: string, hourDuration: number = 1): any {
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

export async function verifyAccessToken(accessToken: string): Promise<boolean> {
	if (!accessToken.startsWith("Bearer")) {
		return Promise.resolve(false);
	}
	const accessToken1 = accessToken.split(" ")[1];
	if(!accessToken1) {
		Promise.resolve(false);
	}
	return new Promise(async (resolve) => {
		njwt.verify(accessToken1, hash(packageName), (error: any, _: any) => {
			if (error) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
}
