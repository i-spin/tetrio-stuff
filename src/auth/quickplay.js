const fetch = require("node-fetch");
const { Webhook, MessageBuilder } = require("discord-webhook-node");

const webhook = new Webhook(process.env.WEBHOOK_URL);

fetch("https://tetr.io/api/rooms/menu", {
  headers: {
    Authorization: `Bearer ${process.env.TOKEN}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    if (data.quickplay.total >= 100) {
      const embed = new MessageBuilder()
        .setTitle("Super Lobby has engaged in quickplay!")
        .setDescription(`${data.quickplay.total} players are in the lobby.`);
      webhook.send(embed);
    }
  });
