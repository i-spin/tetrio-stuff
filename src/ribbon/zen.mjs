import fetch from 'node-fetch';

fetch('https://tetr.io/api/games/zen', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    level: '69420', // Level of zen mode.
    map:
      '_________________________________________________________________________________________________________________________________________________________________________________________l_______lll_______zz________jzz_______jjj________oo________oo________ss_______ss_________t________ttt_______iiii______zz_________zz_______iiii_______oo________oo________ss_______ssl_______lll________t________ttt____?jtlzso', // use the map generator to generate this.
    progress: '0.5', // Number between 0 and 1 to represent the progress of the level.
    score: '0', // Score of zen mode.
    timesplayed: '1000', // time of how you played zen in seconds
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  });
