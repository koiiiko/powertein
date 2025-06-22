// const { InferenceClient } = require("@huggingface/inference");
const Groq = require("groq-sdk");


class ChatbotController {
  static async chat(req, res) {
    try {
      const { message, conversationHistory = [] } = req.body;

      if (!message || message.trim() === '') {
        return res.status(400).json({
          error: 'Message is required'
        });
      }
      // const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      const messages = [
        {
          role: "system",
          content: "Anda adalah spesialis nutrisi, protein, fitness, dan gaya hidup sehat. Batasi jawaban maksimal 200 kata. Jika pertanyaan tidak berkaitan dengan kesehatan, Tolak permintaan"
        },
        ...conversationHistory,
        {
          role: "user",
          content: message.trim()
        }
      ];

      const chatCompletion = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: messages,
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 400
      });

      // const chatCompletion = await client.chatCompletion({
      //   provider: "hf-inference",
      //   model: "meta-llama/Llama-3.1-8B-Instruct",
      //   messages: messages,
      //   temperature: 0.3,
      //   top_p: 0.9,
      //   max_tokens: 400,
      //   response_format: undefined
      // });

      const botResponse = chatCompletion.choices[0]?.message?.content ||
        'Sorry, I could not generate a response.';

      // Update conversation history for next request
      const updatedHistory = [
        ...conversationHistory,
        { role: "user", content: message.trim() },
        { role: "assistant", content: botResponse }
      ];

      const performance = {
          prompt_tokens: chatCompletion.usage.prompt_tokens,
          response_tokens: chatCompletion.usage.completion_tokens,
          tokens_used: chatCompletion.usage.total_tokens,
          response_time: chatCompletion.usage.total_time,
          response_length: chatCompletion.usage.completion_tokens
        };

      // conversationHistory hanya akan menyimpan lima percakapan terakhir untuk meminimalisir penggunaan token berlebih
      const trimmedHistory = updatedHistory.slice(-5);

      res.json({
        message: botResponse,
        userMessage: message,
        conversationHistory: trimmedHistory,
        timestamp: new Date().toISOString(),
        model: "meta-llama/Llama-3.1-8B-Instruct",
        performance: performance
      });

      console.log('userMessage: ', message, 'Performance: ', performance)

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