import fetch from "node-fetch";
import WebSocket from "ws";
import tinyMsgpack from "tiny-msgpack";
import * as commands from "./utils/commands.mjs";

const enviroment = await fetch("https://tetr.io/api/server/environment").then(
  (res) => res.json()
);

const ribbon = await fetch("https://tetr.io/api/server/ribbon", {
  headers: {
    Authorization: `Bearer ${process.env.TOKEN}`,
  },
}).then((res) => res.json());

const ws = new WebSocket(ribbon.endpoint);
let id = 0;
const newClient = tinyMsgpack.encode(commands.new_ribbon());
const handling = commands.handling(0, 7.5, 40, true, false, 0);
const authorizeClient = tinyMsgpack.encode(
  commands.authorize(
    id++,
    process.env.TOKEN,
    handling,
    enviroment,
    "5135f9146ea09f75e7128d266a8c822cef06e013"
  )
);
const die = tinyMsgpack.encode(commands.die());

setTimeout(() => {
  if (ws.readyState === 1) {
    ws.onmessage = (event) => {
      console.log(`Original Message: ${event.data}`);
      console.log(`Decoded Message: ${tinyMsgpack.decode(event.data)}`);
    };

    ws.send(newClient);
    ws.send(authorizeClient);
    ws.send(die);
    process.exit(0);
  }
}, 5);
