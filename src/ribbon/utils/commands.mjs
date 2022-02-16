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

const social = {
  presence: (id, status, detail) => ({
    id,
    command: 'social.presence',
    data: { status, detail },
  }),
};

const ping = () => {
  const buf = Buffer.alloc(2);
  buf.writeUInt8(0xB0, 0);
  buf.write('ping', 1);
  return buf;
};

export {
  newRibbon,
  handling,
  authorize,
  social,
  ping,
};
