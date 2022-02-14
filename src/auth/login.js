const request = require("request");
const readline = require("readline-sync");

const username = readline.question("Username: ");
const password = readline.question(`Password for user ${username}: `);

request.get(
  `https://tetr.io/api/users/${username}/exists`,
  (err, res, _) => {
    if (err) console.error(err);
    if (res.toJSON().body.success) {
      console.log("User not found, stopping.");
      process.exit(1);
    }
  },
);

request.post(
  `https://tetr.io/api/users/authenticate`,
  {
    json: {
      "username": username,
      "password": password,
    },
  },
  (err, res, _) => {
    if (err) console.error(err);
    console.log(
      `Authentication status: ${
        res.toJSON().body.success ? "success" : "failure"
      }`,
    );
    console.log(`UserID: ${res.toJSON().body.userid}`);
    console.log(`Token: ${res.toJSON().body.token}`);
    console.log("DO NOT SHARE THIS INFORMATION TO ANYONE!");
  },
);
