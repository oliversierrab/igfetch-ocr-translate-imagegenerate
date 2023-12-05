const fs = require('fs');

const { generateImage } = require('./functions.js');

const inputFileName = './results/transcriptions.json';

// Read the content of used.txt to know which ids have already been processed
async function generateImages() {

  // Read the input JSON file
  const inputFileContent = fs.readFileSync(inputFileName, 'utf8');
  const inputData = JSON.parse(inputFileContent);
  
  for (const item of inputData) {
    const { id, translation } = item;
  
    generateImage(id, translation);
  
    console.log(`Image Generated for item with id ${id}`);
  }  
}

generateImages();