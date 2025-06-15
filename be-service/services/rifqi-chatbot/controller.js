const { InferenceClient } = require("@huggingface/inference");

class ChatbotController {
  // POST /chatbot/chat
  static async chat(req, res) {
    try {
      const { message, conversationHistory = [] } = req.body;
      
      // Validate input
      if (!message || message.trim() === '') {
        return res.status(400).json({ 
          error: 'Message is required' 
        });
      }
      const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

      const messages = [
        {
          role: "system",
          content: "You are assistant specializing in protein, nutrition, fitness, and healthy lifestyle. Limit responses to 200 words maximum."
        },
        ...conversationHistory, 
        {
          role: "user",
          content: message.trim()
        }
      ];

      const chatCompletion = await client.chatCompletion({
        provider: "hf-inference",
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: messages,
        temperature: 0.3,
        top_p: 0.9,
        max_tokens:400,
        response_format: undefined
      });

      // Extract bot response
      const botResponse = chatCompletion.choices[0]?.message?.content || 
        'Sorry, I could not generate a response.';

      // Update conversation history for next request
      const updatedHistory = [
        ...conversationHistory,
        { role: "user", content: message.trim() },
        { role: "assistant", content: botResponse }
      ];

      // Keep only last 10 messages to avoid token limits
      const trimmedHistory = updatedHistory.slice(-10);

      res.json({
        message: botResponse,
        userMessage: message,
        conversationHistory: trimmedHistory,
        timestamp: new Date().toISOString(),
        model: "meta-llama/Llama-3.1-8B-Instruct"
      });

    } catch (error) {
      console.error('Chatbot error:', error);
      
      if (error.message && error.message.includes('401')) {
        return res.status(500).json({ 
          error: 'AI service authentication failed.' 
        });
      } else if (error.message && error.message.includes('503')) {
        return res.status(503).json({ 
          error: 'AI model is currently loading. Please try again in a moment.' 
        });
      } else if (error.message && error.message.includes('rate limit')) {
        return res.status(429).json({ 
          error: 'Too many requests. Please wait a moment before trying again.' 
        });
      }
      
      res.status(500).json({ 
        error: 'Error connecting to AI service. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = ChatbotController;