const bgMessageHandlers = {};
const bgCompleteHandlers = [];

export function addBackgroundMessageListener(cmd, cb) {
  bgMessageHandlers[cmd] = cb;
}

export function addBackgroundCompleteListener(cb) {
  bgCompleteHandlers.push(cb);
}

export function onBackgroundMessage(msg, sender) {
  const cb = bgMessageHandlers[msg.cmd];
  if (cb) return cb(msg.data, sender);
}

export function onBackgroundCompleted() {
  for (const cb of bgCompleteHandlers) {
    cb();
  }
}
