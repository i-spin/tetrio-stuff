const request = require("request");
const fs = require("graceful-fs");
const path = require("path");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const webhook = new Webhook(process.env.WEBHOOK_URL);
webhook.setUsername("Tetra League News");
webhook.setAvatar("https://branding.osk.sh/tetrio-color.png");
const userID = "league_userrecent_60973cca34013fd46d14312f";

request(`https://ch.tetr.io/api/streams/${userID}`, (err, res, body) => {
  if (err) console.error(err);
  console.log(res && res.statusCode);

  if (!fs.existsSync(path.join(__dirname, "../league.json"))) {
    fs.writeFileSync(path.join(__dirname, "../league.json"), body);
    return "cache created";
  }

  fs.readFile(path.join(__dirname, "../league.json"), (err, data) => {
    if (err) console.error(err);

    let old_game;
    try {
      old_game = JSON.stringify(JSON.parse(data).data.records);
    } catch {
      old_game = JSON.stringify([]);
    }
    const new_game = JSON.stringify(JSON.parse(body).data.records);
    const parsed_new_game = JSON.parse(new_game);

    if (old_game === new_game) return;

    const condition = parsed_new_game[0].endcontext[0].wins >
      parsed_new_game[0].endcontext[1].wins;

    const embed = new MessageBuilder()
      .setTitle(
        `${parsed_new_game[0].endcontext[0].user.username} has ${
          condition ? "won" : "lost"
        } a tetra league game against ${
          parsed_new_game[0].endcontext[1].user.username
        }!`,
      )
      .setDescription(
        `${parsed_new_game[0].endcontext[0].wins} - ${
          parsed_new_game[0].endcontext[1].wins
        }`,
      )
      .addField(
        `Stats for ${parsed_new_game[0].endcontext[0].user.username}`,
        `APM: ${
          roundToTwo(parsed_new_game[0].endcontext[0].points.secondary)
        }\nPPS: ${
          roundToTwo(parsed_new_game[0].endcontext[0].points.tertiary)
        }\nVS: ${roundToTwo(parsed_new_game[0].endcontext[0].points.extra.vs)}`,
        true,
      )
      .addField(
        `Stats for ${parsed_new_game[0].endcontext[1].user.username}`,
        `APM: ${
          roundToTwo(parsed_new_game[0].endcontext[1].points.secondary)
        }\nPPS: ${
          roundToTwo(parsed_new_game[0].endcontext[1].points.tertiary)
        }\nVS: ${roundToTwo(parsed_new_game[0].endcontext[1].points.extra.vs)}`,
        true,
      )
      .addField(
        `Replay`,
        `https://tetr.io/#r:${parsed_new_game[0].replayid}`,
      )
      .setColor(condition ? 16756521 : 6445785)
      .setFooter(parsed_new_game[0].ts);
    webhook.send(embed);

    fs.writeFile(path.join(__dirname, "../league.json"), body, (err) => {
      if (err) console.error(err);
    });
  });
});

function roundToTwo(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
