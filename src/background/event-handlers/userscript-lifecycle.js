import { commands } from '../utils';
import { onTabCreate, onTabClosed, onUpdate } from '../web-bridge';

function onScriptChecked(data) {
  const {
    id,
    result,
  } = data;
  const script = commands.getScript(id);
  if (script) {
    script.checked = result;
  }
}

browser.runtime.onMessage.addListener(({ cmd, data }) => {
  if (cmd === 'ScriptChecked') {
    onScriptChecked(data);
  } else if (cmd === 'TabCreate') {
    onTabCreate(data);
  } else if (cmd === 'TabClosed') {
    onTabClosed(data);
  } else if (cmd === 'Update') {
    onUpdate(data);
  }
});

chrome.alarms.create('checkScripts', { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkScripts') {
    commands.checkScripts();
  }
});
