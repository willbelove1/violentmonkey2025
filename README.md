# Violentmonkey for Manifest V3

This document provides instructions on how to create, set up, and adjust this Violentmonkey extension.

## Creating the Extension

1. **Clone the repository:**
   ```bash
   git clone https://github.com/violentmonkey/violentmonkey.git
   ```
2. **Install dependencies:**
   ```bash
   cd violentmonkey
   npm install
   ```
3. **Build the extension:**
   ```bash
   npm run build
   ```
   This will create a `dist` directory with the extension files.

## Setting up the Extension in Chrome

1. **Open Chrome and navigate to `chrome://extensions`**.
2. **Enable "Developer mode"** using the toggle switch in the top right corner.
3. **Click "Load unpacked"** and select the `dist` directory from the cloned repository.

## Adjusting the Extension

The extension's options can be accessed by clicking on the Violentmonkey icon in the Chrome toolbar and selecting "Options".

### Scripts

The "Scripts" tab displays a list of all installed userscripts. You can enable or disable scripts, edit them, or remove them from this page.

### Settings

The "Settings" tab allows you to configure the extension's behavior. This includes:

* **Default injection mode:** Choose whether to inject scripts into the page, content, or automatically.
* **Chunk size:** Set the size of the chunks for chunked requests.
* **Dangerous API whitelist:** Add domains to the whitelist to allow `GM_xmlhttpRequest` in anonymous mode.

### About

The "About" tab displays information about the extension, including the version number and links to the homepage and support page.

## Manifest V3 Limitations

Manifest V3 introduces several limitations that affect how Violentmonkey works.

* **Network Requests:** The `webRequest` API is replaced by the `declarativeNetRequest` API, which has a limit of 5000 dynamic rules. This may affect scripts that use a large number of network filters.
* **Script Execution:** Scripts are executed in a separate world and cannot directly access the page's JavaScript variables.
* **Background Scripts:** Background scripts are now service workers and are terminated after a period of inactivity. This means that `setTimeout` and `setInterval` may not work as expected.

## Comparison with Manifest V2

| Feature | Manifest V2 | Manifest V3 |
|---|---|---|
| Network Requests | `webRequest` API | `declarativeNetRequest` API |
| Script Execution | Shared world | Isolated world |
| Background Scripts | Persistent | Service workers |

## Migrating from Violentmonkey

To migrate your scripts from the original Violentmonkey, you can use the following script to export your scripts to a JSON file:

```javascript
const scripts = await GM.getValues();
const json = JSON.stringify(scripts, null, 2);
console.log(json);
```

You can then import this file into the new version of Violentmonkey.
