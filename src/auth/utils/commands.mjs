const new_ribbon = () => {
  return {"command": "new"}
}

const handling = (arr, das, sdf, safelock, cancel, dcd) => {
  return {"arr": arr, "das": das, "sdf": sdf, "safelock": safelock, "cancel": cancel, "dcd": dcd}
}

const authorize = (id, token, handling, signature, i) => {
  return {"id": id, "command": "authorize", data: {"token": token, "handling": handling, "signature": signature, "i": i.toString('base64')}}
}

const die = () => {
  return {"command": "die"}
}

const ping = () => {
  "PING"
}

export {
  new_ribbon,
  handling,
  authorize,
  die,
  ping
}