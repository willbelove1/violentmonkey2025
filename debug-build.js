const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function debugBuildWithGemini() {
  try {
    const { stdout, stderr } = await execPromise('npm run build');
    console.log('Build output:', stdout);
    if (stderr) {
      const response = await fetch('https://api.gemini.ai/v1/analyze', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_GEMINI_API_KEY',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ log: stderr, task: 'debug_build' })
      });
      const result = await response.json();
      console.log('Gemini debug suggestions:', result.suggestions);
    }
  } catch (error) {
    console.error('Build error:', error);
    const response = await fetch('https://api.gemini.ai/v1/analyze', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_GEMINI_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ log: error.message, task: 'debug_build' })
    });
    const result = await response.json();
    console.log('Gemini debug suggestions:', result.suggestions);
  }
}

debugBuildWithGemini();
