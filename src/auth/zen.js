const request = require("request");

request.post(
  {
    url: "https://tetr.io/api/games/zen",
    json: {
      "level": "null",
      "map":
        "_________________________________________________________________________________________________________________________________________________________________________________________l_______lll_______zz________jzz_______jjj________oo________oo________ss_______ss_________t________ttt_______iiii______zz_________zz_______iiii_______oo________oo________ss_______ssl_______lll________t________ttt____?jtlzso",
      "progress": "null",
      "score": "null",
      "timesplayed": "null",
    },
    headers: {
      "Authorization": `Bearer ${process.env.TOKEN}`,
    },
  },
  (err, res, body) => {
    if (err) console.error(err);
    console.log(res.toJSON().body);
  },
);
