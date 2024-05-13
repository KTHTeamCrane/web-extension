# Le Chrome Extension

The Chrome extension acts as the primary method of usage for the end-user. 

# Feature support
## Automatic article detection
The extension supports automatic article detection, running scans every time it detects the user has visited an article.

## Intuitive feedback
The extension offers intuitive feedback on claims that the article makes. The extension provides feedback for each claim and a list of sources for the reader to further verify on their own.

# Building
To build the extension yourself, simply run
```bash
npm install
npm run build
```

This will create the extension in a `./build` directory with a `manifest.json` file. You can now load the extension from Chrome Extension by enabling Developer Mode.