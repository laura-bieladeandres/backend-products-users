const fs = require("fs");

console.log("Middlewares encontrados:");
console.log(fs.readdirSync("./middlewares"));
