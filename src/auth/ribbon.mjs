import fetch from "node-fetch";
import WebSocket from "ws";
import tinyMsgpack from "tiny-msgpack";
import * as commands from "./utils/commands.mjs"

WebSocket.prototype.ribbon = {id: 0};

const enviroment = await fetch("https://tetr.io/api/server/environment").then(
  (res) => res.json()
);

const ribbon = await fetch("https://tetr.io/api/server/ribbon", {
  headers: {
    Authorization: `Bearer ${process.env.TOKEN}`,
  },
}).then((res) => res.json());

const ws = new WebSocket(ribbon.endpoint);
const newClient = tinyMsgpack.encode(commands.new_ribbon());
const handling = commands.handling(0, 7.5, 40, true, false, 0);
const authorizeClient = tinyMsgpack.encode(
  commands.authorize(
    ws.ribbon.id++,
    process.env.TOKEN,
    handling,
    enviroment,
    "5135f9146ea09f75e7128d266a8c822cef06e013"
  )
);
const die = tinyMsgpack.encode(commands.die());

ws.on("open", () => {
  console.log("Connected to server.");
  ws.send(newClient);
  console.log("Sent new client.");
  ws.send(authorizeClient);
  console.log("Sent authorize client.");
  ws.send(die);
  console.log("Sent die.");
});


// 69 = 0x45
// 174 = 0xae
ws.onmessage = (event) => {
  const packetType = event.data.slice(0, 1)[0];
  console.log(packetType);
}
