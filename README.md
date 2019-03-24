# pinoy-jwt - The JWT Library For You

How to use:

  const jwt = require("pinoy-jwt");
  
  async function run(client = process.argv[2]) {
    if (client) {
        const clientToken = jwt.getClientToken(client);
        console.log(clientToken);
        const { accessToken } = jwt.getAccessToken(clientToken.token, 1);
        console.log(accessToken);
        console.log(await jwt.verifyAccessToken(accessToken)); // returns true
    }
    else {
        console.log("Need to have '<client-name>' as the 3rd command-line parameter.");
    }
}