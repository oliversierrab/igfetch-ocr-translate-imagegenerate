const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const { ocrSpace } = require('ocr-space-api-wrapper');

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

module.exports = {
  getTextFromImage,
  correctGrammar
}