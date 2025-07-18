# Violentmonkey Manifest V3

This is a development version of Violentmonkey that has been migrated to Manifest V3.

## Installation

1.  Clone this repository:
    ```
    git clone https://github.com/violentmonkey/violentmonkey.git
    ```
2.  Install the dependencies. You can use either `yarn` or `npm`.

    **Using yarn:**
    ```
    cd violentmonkey
    yarn install
    ```
    If you don't have yarn installed, you can install it by following the instructions on the official website: https://classic.yarnpkg.com/en/docs/install

    **Using npm:**
    ```
    cd violentmonkey
    npm install
    ```
    If you don't have Node.js and npm installed, you can download them from here: https://nodejs.org/
3.  Build the extension:
    ```
    yarn build
    ```
4.  Open Chrome and go to `chrome://extensions`.
5.  Enable "Developer mode".
6.  Click on "Load unpacked" and select the `dist` directory inside the cloned repository.

## Customization

You can customize the extension by editing the files in the `src` directory. After making changes, you need to rebuild the extension by running `yarn build` and then reload it in Chrome.

### Gemini API

To use the Gemini API for script analysis, you need to add your API key to `src/background/index.js`. Look for the `analyzeScriptWithGemini` function and replace `"YOUR_GEMINI_API_KEY"` with your actual API key.

```javascript
async function analyzeScriptWithGemini(code) {
  try {
    const response = await fetch('https://api.gemini.ai/v1/analyze', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_GEMINI_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, task: 'syntax_check' })
    });
    const result = await response.json();
    return result.isValid ? code : null;
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
}
```

**Note:** The Gemini API integration is currently a placeholder. You will need to implement the actual API call.
