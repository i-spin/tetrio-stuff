const request = require("request");

//send request to https://tetr.io/api/rooms/menu with authorization header
request(
  {
    url: "https://tetr.io/api/rooms/menu",
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
  },
  (err, res, body) => {
    if (JSON.parse(res.toJSON().body).quickplay.total >= 100) {
      console.log("Super lobby has engaged at quickplay!");
    } else {
      console.log("Super lobby has not engaged at quickplay!");
    }
  },
);
