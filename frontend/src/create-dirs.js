const fs = require('fs');
const path = require('path');

const basePath = __dirname;

const dirs = [
  'components/layout',
  'pages/dashboard',
  'pages/bookings',
  'pages/guests',
  'pages/rooms',
  'pages/billing'
];

dirs.forEach(dir => {
  const fullPath = path.join(basePath, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log('✓ Created: ' + fullPath);
});
