const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" rx="200" fill="#4F46E5"/>
  <path d="M512 256L736 576H288L512 256Z" fill="white"/>
  <path d="M512 768L288 448H736L512 768Z" fill="white"/>
  <path d="M512 768L512 576" stroke="white" stroke-width="64" stroke-linecap="round"/>
</svg>
`;

const outputPath = path.join(__dirname, '..', 'public', 'logo.png');

async function generateLogo() {
  try {
    await sharp(Buffer.from(svg))
      .resize(1024, 1024)
      .png()
      .toFile(outputPath);
    
    console.log(`Logo généré avec succès : ${outputPath}`);
  } catch (error) {
    console.error('Erreur lors de la génération du logo :', error);
  }
}

generateLogo();
