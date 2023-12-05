const dotenv = require('dotenv');
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
  }
}

async function correctGrammar(text) {
  const axios = require('axios');

  const encodedParams = new URLSearchParams();
  encodedParams.set('text', text);

  const options = {
    method: 'GET',
    url: `https://api.textgears.com/correct?text=${text}&language=en-US&key=${TEXTGEARS_KEY}`,
  };

  try {
    const response = await axios.request(options);

    return response.data.response.corrected;
  } catch (error) {
    console.error(error);
  }
}

const target = 'es';

async function translateText(text) {
  let [translations] = await translate.translate(text, target);

  translations = Array.isArray(translations) ? translations : [translations];
  
  return translations[0];
}

function generateImage(id, text) {
  // Set the canvas size
  const canvasWidth = 1200;
  const canvasHeight = 1200;
  
  // Set the background color
  const backgroundColor = '#f0f0f0'; // Soft color
  
  // Set the text color
  const textColor = '#000000'; // Black
  
  // Set the font family and size
  const fontFamily = 'Sans';
  const fontSize = 35;
  
  // Set the provided text
  const providedText = text;

  console.log(providedText);
  
  // Create a canvas and context
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');
  
  // Set the background color
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Set the text properties
  ctx.fillStyle = textColor;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  
  // Split the text into lines
  const lines = providedText.split('\n');
  
  // Calculate the vertical position for the text block
  const textBlockHeight = lines.length * fontSize;
  const startY = canvasHeight / 2 - textBlockHeight / 2;
  
  // Draw each line of text
  lines.forEach((line, index) => {
    const textY = startY + index * fontSize;
    ctx.fillText(line, canvasWidth / 2, textY);
  });
  
  // Save the image as a JPG file
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(`./results/images/output${id}.jpg`, buffer);
  console.log(`Image generated successfully!: output${id}.jpg`);
  
}

module.exports = {
  getTextFromImage,
  correctGrammar,
  translateText,
  generateImage
}