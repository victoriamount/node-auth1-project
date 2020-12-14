require("dotenv").config();

const server = require("./api/server.js");

const port = process.env.PORT || 6000;
server.listen(port, () => console.log(`\n** Project Running on port ${port} **\n`));
