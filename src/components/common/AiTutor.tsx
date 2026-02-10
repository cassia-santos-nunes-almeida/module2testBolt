import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Key } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MathWrapper } from './MathWrapper';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AiTutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      setIsApiKeySet(true);
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I\'m your Circuit Analysis tutor. I can help you understand concepts related to resistors, capacitors, inductors, time-domain analysis, Laplace transforms, and s-domain analysis. Ask me anything!'
        }
      ]);
    }
  };

  const parseLatex = (text: string) => {
    const parts: Array<{ type: 'text' | 'latex'; content: string }> = [];
    const regex = /\$\$(.*?)\$\$|\$(.*?)\$/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }

      const latex = match[1] || match[2];
      parts.push({ type: 'latex', content: latex, });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return parts;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const systemPrompt = `You are a rigorous engineering tutor specializing in circuit analysis. Your role is to help students understand:
- Component physics (resistors, capacitors, inductors)
- Constitutive laws: V=IR, I=C(dV/dt), V=L(dI/dt)
- Time-domain differential equations for RC, RL, and RLC circuits
- Laplace transforms and their application to circuit analysis
- s-domain transfer functions, poles, and zeros
- Damping ratios, natural frequency, and transient response

Guidelines:
1. Use LaTeX notation for all mathematical expressions. Enclose inline math in single $ signs and display math in double $$ signs.
2. Provide detailed, step-by-step explanations to promote deep learning.
3. Connect physical intuition with mathematical rigor.
4. Only answer questions related to circuit analysis and electromagnetics.
5. If asked about unrelated topics, politely redirect to circuit theory.
6. Use proper engineering terminology and reference Nilsson & Riedel principles when appropriate.

Question: ${userMessage}`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please check your API key and try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-engineering-blue-600 hover:bg-engineering-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Open AI Tutor"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-slate-200">
      <div className="bg-engineering-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h3 className="font-semibold">AI Circuit Tutor</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-engineering-blue-700 p-1 rounded"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {!isApiKeySet ? (
        <div className="flex-1 p-6 flex flex-col justify-center items-center gap-4">
          <Key className="w-12 h-12 text-engineering-blue-600" />
          <h4 className="text-lg font-semibold text-slate-800">Enter Your API Key</h4>
          <p className="text-sm text-slate-600 text-center">
            Get your free API key from{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-engineering-blue-600 underline"
            >
              Google AI Studio
            </a>
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your Gemini API key"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-engineering-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSetApiKey()}
          />
          <button
            onClick={handleSetApiKey}
            disabled={!apiKey.trim()}
            className="w-full bg-engineering-blue-600 text-white py-2 rounded-lg hover:bg-engineering-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Tutoring
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-engineering-blue-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none">
                      {parseLatex(message.content).map((part, idx) => (
                        <span key={idx}>
                          {part.type === 'text' ? (
                            part.content
                          ) : (
                            <MathWrapper formula={part.content} />
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about circuits..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-engineering-blue-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-engineering-blue-600 text-white p-2 rounded-lg hover:bg-engineering-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
