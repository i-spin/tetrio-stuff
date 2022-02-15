const newRibbon = () => ({ command: 'new' });

const handling = (arr, das, sdf, safelock, cancel, dcd) => ({
  arr, das, sdf, safelock, cancel, dcd,
});

// eslint-disable-next-line no-shadow
const authorize = (id, token, handling, signature, i) => ({
  id,
  command: 'authorize',
  data: {
    token, handling, signature, i: i.toString('base64'),
  },
});

const die = () => ({ command: 'die' });

const ping = () => {
  'PING';
};

export {
  newRibbon,
  handling,
  authorize,
  die,
  ping,
};
