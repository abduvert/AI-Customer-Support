// modules/embedding.js
const axios = require('axios');
require('dotenv').config();

async function generateEmbeddings(text) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

module.exports = { generateEmbeddings };
