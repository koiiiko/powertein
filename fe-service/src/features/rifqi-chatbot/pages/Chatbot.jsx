import React, { useState } from 'react';
import { Card, CardBody, Button, Input } from '@heroui/react';
import { Send, Bot } from 'lucide-react';
import AppsLayout from "../../../components/layout";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const suggestedQuestions = [
        "Apa itu protein?",
        "Buatkan rutinitas harian yang ideal bagi kesehatan!",
        "Bagaimana cara melatih otot?"
    ];

    const handleSendMessage = async (message = inputMessage) => {
        if (!message.trim()) return;

        const newMessage = { role: 'user', content: message };
        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/chatbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: messages
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const botMessage = { role: 'assistant', content: data.message };
                setMessages(prev => [...prev, botMessage]);
            } else {
                const errorMessage = {
                    role: 'assistant',
                    content: `Error: ${data.error || 'Something went wrong'}`
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            const errorMessage = {
                role: 'assistant',
                content: 'Network error. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <AppsLayout>
            <div className="flex flex-col h-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Bot className="w-8 h-8 text-blue-600 mr-2" />
                        <h1 className="text-2xl font-bold text-gray-800">PowerTein AI</h1>
                    </div>
                    <p className="text-gray-600">
                        Tanyakan apapun pada ChatBot AI tentang kesehatan ^^
                    </p>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 mb-6 min-h-0">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {suggestedQuestions.map((question, index) => (
                                    <Button
                                        key={index}
                                        variant="bordered"
                                        className="h-auto p-4 text-left font-semibold whitespace-normal hover:bg-primary-600 hover:font-semibold hover:text-white"
                                        onClick={() => handleSendMessage(question)}
                                    >
                                        {question}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Chat History */
                        <div className="space-y-4 overflow-y-auto h-full">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <Card className={`max-w-[80%] ${message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100'
                                        }`}>
                                        <CardBody className="p-3">
                                            <div className="text-sm whitespace-pre-wrap">
                                                {message.content.split('**').map((part, index) =>
                                                    index % 2 === 0 ? (
                                                        <span key={index}>{part}</span>
                                                    ) : (
                                                        <strong key={index}>{part}</strong>
                                                    )
                                                )}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <Card className="bg-gray-100">
                                        <CardBody className="p-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                                <span className="text-sm text-gray-600">AI sedang berpikir...</span>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Masukkan pertanyaan terkait kesehatan"
                        className="flex-1"
                        size='lg'
                        disabled={loading}
                    />
                    <Button
                        onClick={() => handleSendMessage()}
                        isIconOnly
                        color="primary"
                        size='lg'
                        disabled={loading || !inputMessage.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </AppsLayout>
    );
};

export default Chatbot;