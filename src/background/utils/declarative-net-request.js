import { addBackgroundCompleteListener, addBackgroundMessageListener } from './message';

const DNR_ID_OFFSET = 1;
const DNR_ID_RESERVED = 1;
const DNR_RULE_ID_PREPARE = 'dnr-prepare';

const dnRules = {}; // { 1: { id: 1, ... }, 2, ... }
let dnrSessionIds;
let dnrEnabled;
let dnrTotal;

addBackgroundMessageListener('DnrSessionRules', ({ enabled, rules, total }) => {
  dnrEnabled = enabled;
  dnrTotal = total;
  if (!dnrSessionIds) {
    dnrSessionIds = new Set(rules.map(r => r.id));
    return;
  }
  const added = [];
  const removed = [];
  const updated = [];
  const changed = new Set();
  for (const rule of rules) {
    const { id } = rule;
    const old = dnRules[id];
    dnRules[id] = rule;
    changed.add(id);
    if (old) updated.push(rule);
    else added.push(rule);
  }
  for (const id of dnrSessionIds) {
    if (!changed.has(id)) {
      removed.push(id);
      delete dnRules[id];
    }
  }
  dnrSessionIds = changed;
  if (added.length || removed.length || updated.length) {
    return browser.declarativeNetRequest.updateSessionRules({
      addRules: added,
      removeRuleIds: removed,
      updateRules: updated,
    });
  }
});

addBackgroundCompleteListener(async () => {
  const rules = Object.values(dnRules);
  if (!dnrEnabled || !rules.length) return;
  await browser.declarativeNetRequest.updateSessionRules({
    addRules: rules,
    removeRuleIds: [...dnrSessionIds],
  });
  dnrSessionIds.clear();
});

export async function dnrReady() {
  const { available } = await browser.declarativeNetRequest.getAvailableStaticRuleCount();
  return available > 0;
}

export async function dnrUpdateDynamicRules(rules) {
  const all = await browser.declarativeNetRequest.getDynamicRules();
  const allIds = all.map(r => r.id);
  const addRules = [];
  const updateRules = [];
  const removeRuleIds = new Set(allIds);
  for (const rule of rules) {
    const id = rule.id + DNR_ID_RESERVED;
    rule.id = id;
    if (removeRuleIds.delete(id)) {
      updateRules.push(rule);
    } else {
      addRules.push(rule);
    }
  }
  return browser.declarativeNetRequest.updateDynamicRules({
    addRules,
    removeRuleIds: [...removeRuleIds],
    updateRules,
  });
}

export async function dnrUpdateEnabledRules(enabled) {
  const ruleIds = enabled.map(id => id + DNR_ID_OFFSET);
  const total = dnrTotal + ruleIds.length;
  if (total) {
    await browser.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: [DNR_RULE_ID_PREPARE],
      disableRulesetIds: [],
    });
    const res = await browser.declarativeNetRequest.testMatchOutcome({
      url: 'https://violentmonkey.github.io',
      type: 'sub_frame',
    });
    if (res.matchedRules.length) {
      browser.runtime.reload();
    }
  }
  return browser.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: enabled.length ? ['dnr-user'] : [],
    disableRulesetIds: ['dnr-user'],
  });
}
