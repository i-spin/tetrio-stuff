const fetch = require("node-fetch");
const readline = require("readline-sync");

const username = readline.question("Username: ");
const password = readline.question(`Password for user ${username}: `);

fetch(`https://tetr.io/api/users/${username}/exists`)
  .then((res) => res.json())
  .then((data) => {
    if (!data.success) {
      console.error("Username does not exist.");
      process.exit(1);
    }
  });

fetch(`https://tetr.io/api/users/authenticate`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    "username": username,
    "password": password,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    if (!data.success) {
      console.error("Incorrect password.");
      process.exit(1);
    }
    console.log(`UserID: ${data.userid}`);
    console.log(`Token: ${data.token}`);
    console.log("DO NOT SHARE THIS INFORMATION TO ANYONE!");
  });
