import fetch from 'node-fetch';
import { question } from 'readline-sync';

const username = question('Username: ');
const password = question(`Password for user ${username}: `, {
  hideEchoBack: true,
});

fetch(`https://tetr.io/api/users/${username}/exists`)
  .then((res) => res.json())
  .then((data) => {
    if (!data.success) {
      console.error('Username does not exist.');
      process.exit(1);
    }
  });

fetch('https://tetr.io/api/users/authenticate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username,
    password,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    if (!data.success) {
      console.error('Incorrect password.');
      process.exit(1);
    }
    console.log(`UserID: ${data.userid}`);
    console.log(`Token: ${data.token}`);
    console.log('DO NOT SHARE THIS INFORMATION TO ANYONE!');
  });
