function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./dist"));

async function run(client = process.argv[2]) {
    if (client) {
        const clientToken = exports.getClientToken(client);
        console.log(clientToken);
        const { accessToken } = exports.getAccessToken(clientToken.token, 1);
        console.log(accessToken);
        console.log(await exports.verifyAccessToken(accessToken));
    }
    else {
        console.log("Need to have '<client-name>' as the 3rd command-line parameter.");
    }
}
// run();