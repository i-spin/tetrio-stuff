/*
Steps:
1. New
2. if resume, send resume
3. authorize
4. other commands
5. die
*/
import fetch from 'node-fetch';
import Ribbon from './utils/Ribbon.mjs';
import * as commands from './utils/commands.mjs';

const enviroment = await fetch('https://tetr.io/api/server/environment').then(
  (res) => res.json(),
);

const endpoint = await fetch('https://tetr.io/api/server/ribbon', {
  headers: {
    Authorization: `Bearer ${process.env.TOKEN}`,
  },
}).then((res) => res.json()).then((data) => data.endpoint);

const ribbon = new Ribbon(endpoint);
const handling = commands.handling(0, 7.5, 40, true, false, 0);

await ribbon.waitForWebSocket();

ribbon.connect();
ribbon.sendCommand(commands.authorize(
  ribbon.newId(),
  process.env.TOKEN,
  handling,
  enviroment.signature,
  '5135f9146ea09f75e7128d266a8c822cef06e013',
));
ribbon.ping();
ribbon.disconnect();

process.on('beforeExit', () => {
  ribbon.logger.display();
});
