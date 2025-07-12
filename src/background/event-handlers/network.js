import { commands } from '../utils';
import { dnrUpdateDynamicRules } from '../utils/declarative-net-request';

function onBeforeSendHeaders(details) {
  const { requestHeaders, requestId } = details;
  const req = commands.getRequest(requestId);
  if (!req) return;
  const { headers } = req;
  for (const key in headers) {
    if (hasOwnProperty(headers, key)) {
      requestHeaders.push({ name: key, value: headers[key] });
    }
  }
  return { requestHeaders };
}

function onHeadersReceived(details) {
  const { responseHeaders, requestId, statusCode, statusLine } = details;
  const req = commands.getRequest(requestId);
  if (!req) return;
  req.finalUrl = details.url;
  req.readyState = 2;
  req.status = statusCode;
  req.statusText = statusLine;
  req.responseHeaders = responseHeaders.reduce((map, { name, value }) => {
    map[name] = (map[name] ? `${map[name]}\n` : '') + value;
    return map;
  }, {});
  if (details.redirectUrl) {
    req.redirectUrl = details.redirectUrl;
  }
  commands.httpRequestCallback(req.id, 'headersreceived', req);
  return { responseHeaders };
}

function onCompleted(details) {
  const { requestId } = details;
  const req = commands.getRequest(requestId);
  if (!req) return;
  req.readyState = 4;
  commands.httpRequestCallback(req.id, 'load', req);
  commands.httpRequestCallback(req.id, 'loadend', req);
  commands.removeRequest(requestId);
}

function onErrorOccurred(details) {
  const { requestId } = details;
  const req = commands.getRequest(requestId);
  if (!req) return;
  commands.httpRequestCallback(req.id, 'error', { error: details.error });
  commands.httpRequestCallback(req.id, 'loadend', req);
  commands.removeRequest(requestId);
}

browser.webRequest.onBeforeSendHeaders.addListener(
  onBeforeSendHeaders,
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders'],
);

browser.webRequest.onHeadersReceived.addListener(
  onHeadersReceived,
  { urls: ['<all_urls>'] },
  ['blocking', 'responseHeaders'],
);

browser.webRequest.onCompleted.addListener(
  onCompleted,
  { urls: ['<all_urls>'] },
);

browser.webRequest.onErrorOccurred.addListener(
  onErrorOccurred,
  { urls: ['<all_urls>'] },
);

export {
  dnrUpdateDynamicRules,
};
