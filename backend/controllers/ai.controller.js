import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for a charity platform. You help users with questions about donations, causes, and general platform usage. Keep responses concise and friendly."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 150,
      temperature: 0.7,
    });

    if (!completion.choices || !completion.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('AI Chat error details:', error);
    
    // Handle specific OpenAI errors
    if (error.message.includes('429')) {
      return res.status(429).json({
        error: 'API quota exceeded',
        message: 'API service is temporarily unavailable. Please try again later.'
      });
    }

    if (error.message.includes('401')) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'Authentication failed with AI service.'
      });
    }

    res.status(500).json({ 
      error: error.message,
      message: "Unable to process your request at this time."
    });
  }
};
