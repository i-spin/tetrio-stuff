import ws from "ws";
import fetch from "node-fetch";

//fetch https://tetr.io/api/server/environment and store the data in a variable
const enviroment = await fetch("https://tetr.io/api/server/environment");
console.log(enviroment);
