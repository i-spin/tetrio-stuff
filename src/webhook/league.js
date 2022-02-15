const request = require('request');
const fs = require('graceful-fs');
const path = require('path');
const { Webhook, MessageBuilder } = require('discord-webhook-node');

const webhook = new Webhook(process.env.WEBHOOK_URL);
webhook.setUsername('Tetra League News');
webhook.setAvatar('https://branding.osk.sh/tetrio-color.png');
const userID = 'league_userrecent_60973cca34013fd46d14312f';

function roundToTwo(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

request(`https://ch.tetr.io/api/streams/${userID}`, (err, res, body) => {
  if (err) console.error(err);
  console.log(res && res.statusCode);

  if (!fs.existsSync(path.join(__dirname, '../league.json'))) {
    fs.writeFileSync(path.join(__dirname, '../league.json'), body);
    return 'cache created';
  }

  fs.readFile(path.join(__dirname, '../league.json'), (err, data) => {
    if (err) console.error(err);

    let oldGame;
    try {
      oldGame = JSON.stringify(JSON.parse(data).data.records);
    } catch {
      oldGame = JSON.stringify([]);
    }
    const newGame = JSON.stringify(JSON.parse(body).data.records);
    const parsedNewGame = JSON.parse(newGame);

    if (oldGame === newGame) return;

    const condition = parsedNewGame[0].endcontext[0].wins
      > parsedNewGame[0].endcontext[1].wins;

    const embed = new MessageBuilder()
      .setTitle(
        `${parsedNewGame[0].endcontext[0].user.username} has ${
          condition ? 'won' : 'lost'
        } a tetra league game against ${
          parsedNewGame[0].endcontext[1].user.username
        }!`,
      )
      .setDescription(
        `${parsedNewGame[0].endcontext[0].wins} - ${
          parsedNewGame[0].endcontext[1].wins
        }`,
      )
      .addField(
        `Stats for ${parsedNewGame[0].endcontext[0].user.username}`,
        `APM: ${
          roundToTwo(parsedNewGame[0].endcontext[0].points.secondary)
        }\nPPS: ${
          roundToTwo(parsedNewGame[0].endcontext[0].points.tertiary)
        }\nVS: ${roundToTwo(parsedNewGame[0].endcontext[0].points.extra.vs)}`,
        true,
      )
      .addField(
        `Stats for ${parsedNewGame[0].endcontext[1].user.username}`,
        `APM: ${
          roundToTwo(parsedNewGame[0].endcontext[1].points.secondary)
        }\nPPS: ${
          roundToTwo(parsedNewGame[0].endcontext[1].points.tertiary)
        }\nVS: ${roundToTwo(parsedNewGame[0].endcontext[1].points.extra.vs)}`,
        true,
      )
      .addField(
        'Replay',
        `https://tetr.io/#r:${parsedNewGame[0].replayid}`,
      )
      .setColor(condition ? 16756521 : 6445785)
      .setFooter(parsedNewGame[0].ts);
    webhook.send(embed);

    fs.writeFile(path.join(__dirname, '../league.json'), body, (err) => {
      if (err) console.error(err);
    });
  });
});
