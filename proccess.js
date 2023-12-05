const fs = require('fs');

const { getTextFromImage, correctGrammar, generateImage } = require('./functions.js');

const inputFileName = './results/sourcePosts.json';
const outputFileName = './results/transcriptions.json';
const usedFileName = './results/used.txt';

// Read the content of used.txt to know which ids have already been processed
async function proccess() {

  let usedIds = [];
  if (fs.existsSync(usedFileName)) {
    const usedFileContent = fs.readFileSync(usedFileName, 'utf8');
    usedIds = usedFileContent.split('\n').filter(Boolean);
  }
  
  // Read the input JSON file
  const inputFileContent = fs.readFileSync(inputFileName, 'utf8');
  const inputData = JSON.parse(inputFileContent);
  
  // Process each item in the input JSON
  const transcriptions = [];
  
  for (const item of inputData) {
    const { id, imageUrl, videoUrl } = item;
  
    // Check if the item has a videoUrl or if the id has been used already
    if (videoUrl || usedIds.includes(id)) {
      console.log(`Skipping item with id ${id} due to videoUrl or already processed.`);
      continue;
    }
  
    const copy = await getTextFromImage(imageUrl);
    const corrected = await correctGrammar(copy);
    // Add the item to transcriptions array
    transcriptions.push({ id, imageUrl, copy, corrected });

    // TODO: Translate

    generateImage(id, copy);

  
    // Log the id to used.txt
    fs.appendFileSync(usedFileName, `${id}\n`);
    console.log(`Processed item with id ${id}`);
  }
  
  // Write the transcriptions array to transcriptions.json
  const transcriptionsJson = JSON.stringify(transcriptions, null, 2);
  fs.writeFileSync(outputFileName, transcriptionsJson);
  
  console.log(`Transcriptions written to ${outputFileName}`);
}

proccess();