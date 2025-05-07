const fs = require('fs');
const path = require('path');

// Read the template
const templatePath = path.resolve(__dirname, '../src/manifest.template.json');
const outputPath = path.resolve(__dirname, '../src/manifest.json');

let template = fs.readFileSync(templatePath, 'utf8');

// Replace all environment variables
Object.keys(process.env).forEach((key) => {
  if (key.startsWith('REACT_APP_')) {
    template = template.replace(new RegExp(`%${key}%`, 'g'), process.env[key]);
  }
});

// Write the final manifest
fs.writeFileSync(outputPath, template);
console.log('Manifest file generated successfully');
