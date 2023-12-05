const dotenv = require('dotenv');
const axios = require('axios');
const { createCanvas } = require('canvas');
const fs = require('fs');
const { ocrSpace } = require('ocr-space-api-wrapper');
const {Translate} = require('@google-cloud/translate').v2;

const translate = new Translate();
dotenv.config();

const { OCR_KEY, TEXTGEARS_KEY } = process.env;

async function getTextFromImage(url) {
  try {
    const result = await ocrSpace(url, { apiKey: OCR_KEY });

    return result.ParsedResults[0].ParsedText;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function correctGrammar(text) {
  const encodedParams = new URLSearchParams();
  encodedParams.set('text', text);

  const options = {
    method: 'GET',
    url: `https://api.textgears.com/correct?text=${text}&language=es-ES&key=${TEXTGEARS_KEY}`,
  };

  try {
    const response = await axios.request(options);

    return response.data.response.corrected;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function translateText(text) {
  try {
    let [translations] = await translate.translate(text, 'es');
  
    translations = Array.isArray(translations) ? translations : [translations];
    
    return translations[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const canvasOptions = {
  canvasWidth: 1200,
  canvasHeight: 1200,
  backgroundColor: '#f3e9e9',
  textColor: '#393231', 
  fontSize: 35,
  fontFamily: 'Sans'
}

// Function to create the image
async function generateImage(id, text) {
  // Function to split text into lines that fit within a given width
  function splitTextIntoLines(text, ctx, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }

    lines.push(currentLine);
    return lines;
  }

  const canvas = createCanvas(canvasOptions.canvasWidth, canvasOptions.canvasHeight);
  const ctx = canvas.getContext('2d');

  // Set the background color
  ctx.fillStyle = canvasOptions.backgroundColor;
  ctx.fillRect(0, 0, canvasOptions.canvasWidth, canvasOptions.canvasHeight);

  // Set the text properties
  ctx.fillStyle = canvasOptions.textColor;
  ctx.font = `${canvasOptions.fontSize}px ${canvasOptions.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Split text into multiple lines if necessary
  const lines = splitTextIntoLines(text, ctx, canvasOptions.canvasWidth - 40);

  // Calculate the total height of the text block
  const totalTextHeight = lines.length * canvasOptions.fontSize;

  // Calculate the starting y-coordinate for vertically aligning the text
  const startY = (canvasOptions.canvasHeight - totalTextHeight) / 2;

  // Draw each line of text
  lines.forEach((line, index) => {
    const y = startY + index * canvasOptions.fontSize;
    ctx.fillText(line, canvasOptions.canvasWidth / 2, y);
  });

  // Save the image to a file (change the filename as needed)
  const fs = require('fs');
  const out = fs.createWriteStream(`./results/images/output-${id}.jpg`);
  const stream = canvas.createJPEGStream({ quality: 0.95 });
  stream.pipe(out);

  out.on('finish', () => console.log('Image created successfully'));
}


module.exports = {
  getTextFromImage,
  correctGrammar,
  translateText,
  generateImage
}