import WebSocket from "ws";
import fetch from "node-fetch";

const enviroment = await fetch("https://tetr.io/api/server/environment")
  .then((res) => res.json());

const ribbon = await fetch("https://tetr.io/api/server/ribbon", {
  headers: {
    Authorization: `Bearer ${process.env.TOKEN}`,
  },
})
  .then((res) => res.json());

const ws = new WebSocket(ribbon.endpoint);
