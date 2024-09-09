require('dotenv').config(); // Load environment variables from .env

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Example function to make a request
async function testOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',  // Adjust model as needed
      messages: [{ role: 'user', content: 'Say this is a test!' }],
      max_tokens: 50,
    });
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testOpenAI();
