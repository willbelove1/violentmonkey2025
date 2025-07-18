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
    or
    ```
    npm run build
    ```
4.  Open Chrome and go to `chrome://extensions`.
5.  Enable "Developer mode".
6.  Click on "Load unpacked" and select the `dist` directory inside the cloned repository.

## Troubleshooting Installation Issues

### `husky` errors

If you encounter an error related to `husky` during installation (e.g., `fatal: not a git repository`), it's because `husky` requires a Git repository to be initialized. You can fix this by running the following commands:

```
git init
git add .
git commit -m "Initial commit"
npx husky install
```

If you don't need Git or `husky`, you can remove the `"prepare": "husky install"` line from the `scripts` section of your `package.json` file.

### Security Vulnerabilities

If you see warnings about security vulnerabilities after running `npm install`, you can try to fix them by running:

```
npm audit fix
```

For more complex cases, you might need to use `npm audit fix --force` or manually edit the `package.json` to update the vulnerable dependencies.

### Deprecated Libraries

You might see warnings about deprecated libraries. These are usually indirect dependencies and don't cause immediate errors, but it's good practice to update them. You can use `npm list` to identify which packages are pulling in the deprecated libraries and then update the root packages.

## Customization

You can customize the extension by editing the files in the `src` directory. After making changes, you need to rebuild the extension by running `yarn build` or `npm run build` and then reload it in Chrome.

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

You can also use the Gemini API to analyze your `package.json` for dependency issues. Create a file named `analyze-deps.js` with the following content:

```javascript
const fs = require('fs').promises;

async function analyzeDependenciesWithGemini() {
  const packageJson = JSON.parse(await fs.readFile('package.json', 'utf-8'));
  try {
    const response = await fetch('https://api.gemini.ai/v1/analyze', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_GEMINI_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ packageJson, task: 'dependency_check' })
    });
    const result = await response.json();
    console.log('Dependency issues:', result);
  } catch (error) {
    console.error('Gemini API error:', error);
  }
}

analyzeDependenciesWithGemini();
```

Then run it with:

```
node analyze-deps.js
```
