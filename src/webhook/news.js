const request = require("request");
const fs = require("graceful-fs");
const path = require("path");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const webhook = new Webhook(process.env.WEBHOOK_URL);
webhook.setUsername("Tetr.io News");
webhook.setAvatar("https://branding.osk.sh/tetrio-color.png");
const userID = "user_60973cca34013fd46d14312f";

request(`https://ch.tetr.io/api/news/${userID}`, (err, res, body) => {
  if (err) console.error(err);
  console.log(res && res.statusCode);

  if (!fs.existsSync(path.join(__dirname, "../cache.json"))) {
    fs.writeFileSync(path.join(__dirname, "../cache.json"), body);
    return "cache created";
  }

  fs.readFile(path.join(__dirname, "../cache.json"), (err, data) => {
    if (err) console.error(err);

    let old_news;
    try {
      old_news = JSON.stringify(JSON.parse(data).data.news);
    } catch {
      old_news = JSON.stringify([]);
    }
    const new_news = JSON.stringify(JSON.parse(body).data.news);
    const parsedNews = JSON.parse(new_news);

    if (old_news === new_news) return;

    switch (parsedNews[0].type) {
      case "personalbest":
        let personalbest = new MessageBuilder()
          .setTitle(
            `New Personal Best Record for ${parsedNews[0].data.username} on ${
              parsedNews[0].data.gametype
            }!`.trim(),
          )
          .setDescription(
            parsedNews[0].data.gametype == "40l"
              ? `Record Time: ${
                Math.round(
                  ((parsedNews[0].data.result / 1000) + Number.EPSILON) * 100,
                ) / 100
              }s.`
              : `Record Score: ${parsedNews[0].data.result}`,
          )
          .addField(
            "Replay Link:",
            `https://tetr.io/#R:${parsedNews[0].data.replayid}`,
          )
          .setFooter(parsedNews[0].ts)
          .setColor(15603580);
        webhook.send(personalbest);
        break;

      case "rankup":
        let rankup = new MessageBuilder()
          .setTitle(
            `${parsedNews[0].data.username} has ranked up to ${
              parsedNews[0].data.rank
            }!`.trim(),
          )
          .setThumbnail(getIcon(parsedNews[0].data.rank))
          .setFooter(parsedNews[0].ts)
          .setColor(15603580);
        webhook.send(rankup);
        break;

      case "supporter" || "supporter_gift":
        let supporter = new MessageBuilder()
          .setTitle(
            `${parsedNews[0].data.username} has become a supporter!`,
          )
          .setThumbnail("https://tetr.io/res/supporter-tag.png")
          .setFooter(parsedNews[0].ts)
          .setColor(15603580);
        webhook.send(supporter);
        break;

      case "badge":
        let badge = new MessageBuilder()
          .setTitle(`${parsedNews[0].data.username} has earned a new badge!`)
          .addField("Badge Title:", parsedNews[0].data.type)
          .addField("Badge Description:", parsedNews[0].data.label)
          .setFooter(parsedNews[0].ts)
          .setColor(15603580);
        webhook.send(badge);
        break;
    }

    fs.writeFile(path.join(__dirname, "../cache.json"), body, (err) => {
      if (err) console.error(err);
    });
  });
});

function getIcon(rank) {
  switch (rank) {
    case "X":
      return "https://tetr.io/res/league-ranks/x.png";
    case "U":
      return "https://tetr.io/res/league-ranks/u.png";
    case "SS":
      return "https://tetr.io/res/league-ranks/ss.png";
    case "S+":
      return "https://tetr.io/res/league-ranks/s+.png";
    case "S-":
      return "https://tetr.io/res/league-ranks/s-.png";
    case "A+":
      return "https://tetr.io/res/league-ranks/a+.png";
    case "A":
      return "https://tetr.io/res/league-ranks/a.png";
    case "A-":
      return "https://tetr.io/res/league-ranks/a-.png";
    case "B+":
      return "https://tetr.io/res/league-ranks/b+.png";
    case "B":
      return "https://tetr.io/res/league-ranks/b.png";
    case "B-":
      return "https://tetr.io/res/league-ranks/b-.png";
    case "C+":
      return "https://tetr.io/res/league-ranks/c+.png";
    case "C":
      return "https://tetr.io/res/league-ranks/c.png";
    case "C-":
      return "https://tetr.io/res/league-ranks/c-.png";
    case "D+":
      return "https://tetr.io/res/league-ranks/d+.png";
    case "D":
      return "https://tetr.io/res/league-ranks/d.png";
  }
}
