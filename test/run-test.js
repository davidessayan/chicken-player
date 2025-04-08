/**
 * Chicken Player - Test Runner
 * @description Script to run the test page
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const open = require('open');

const PORT = 3000;
const TEST_DIR = path.join(__dirname);
const DIST_DIR = path.join(__dirname, '..', 'dist');
const SRC_DIR = path.join(__dirname, '..', 'src');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  let filePath = '';
  
  // Handle root path
  if (req.url === '/') {
    filePath = path.join(TEST_DIR, 'index.html');
  } else if (req.url.startsWith('/test.js')) {
    filePath = path.join(TEST_DIR, 'test.js');
  } else if (req.url.startsWith('/dist/')) {
    // Serve files from the dist directory
    filePath = path.join(DIST_DIR, req.url.replace('/dist/', ''));
  } else if (req.url.startsWith('/src/')) {
    // Serve files from the src directory
    filePath = path.join(SRC_DIR, req.url.replace('/src/', ''));
  } else {
    // Try to serve the requested file
    filePath = path.join(TEST_DIR, req.url);
  }
  
  // Get the file extension
  const extname = path.extname(filePath);
  
  // Set the content type based on the file extension
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }
  
  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('File not found');
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Start the server
server.listen(PORT, async () => {
  console.log(`Test server running at http://localhost:${PORT}/`);
  console.log('Opening browser...');
  
  try {
    // Open the browser
    await open(`http://localhost:${PORT}/`);
    console.log('Browser opened successfully');
  } catch (error) {
    console.error('Failed to open browser:', error);
  }
  
  console.log('Press Ctrl+C to stop the server');
}); 