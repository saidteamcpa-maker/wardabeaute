const fs = require('fs');
const s = fs.readFileSync('node_modules/next-intl/dist/esm/middleware/middleware.js', 'utf8');
console.log(s.slice(1400, 4200));
