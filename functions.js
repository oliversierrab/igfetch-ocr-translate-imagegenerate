const dotenv = require('dotenv');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const { ocrSpace } = require('ocr-space-api-wrapper');

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

// TODO: Translate function, Image Generation Function



async function generateImage(id, text) {
  // Create a canvas
  const canvas = createCanvas(1200, 1200);
  const ctx = canvas.getContext('2d');

  // Set background color
  ctx.fillStyle = '#f0f0f0'; // Soft color, adjust as needed
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set text properties
  ctx.fillStyle = '#000000'; // Black text
  ctx.font = 'bold 30px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Calculate text position
  const textX = canvas.width / 2;
  const textY = canvas.height / 2;

  // Draw text on canvas
  ctx.fillText(text, textX, textY);

  // Save the canvas as a JPEG image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(`./results/images/output${id}.jpg`, buffer);
}

generateImage('123','Hello, ChatGPT!');


module.exports = {
  getTextFromImage,
  correctGrammar,
  generateImage
}