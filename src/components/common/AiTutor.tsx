import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, Send, Key, PanelLeftClose, X, Maximize2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MathWrapper } from './MathWrapper';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type TutorMode = 'closed' | 'docked' | 'floating';

interface AiTutorProps {
  mode: TutorMode;
  onModeChange: (mode: TutorMode) => void;
}

const FLOAT_WIDTH = 380;
const FLOAT_HEIGHT = 520;
const FLOAT_PADDING = 20;

/** Custom hook for window drag behavior (F4/F5). */
function useDraggable(mode: TutorMode) {
  const [floatPos, setFloatPos] = useState({ x: -1, y: -1 });
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (mode === 'floating' && floatPos.x === -1) {
      setFloatPos({
        x: Math.max(window.innerWidth - FLOAT_WIDTH - FLOAT_PADDING * 2, FLOAT_PADDING),
        y: Math.max(window.innerHeight - FLOAT_HEIGHT - FLOAT_PADDING * 2, FLOAT_PADDING),
      });
    }
  }, [mode, floatPos.x]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (mode !== 'floating') return;
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - floatPos.x, y: e.clientY - floatPos.y };

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      setFloatPos({
        x: Math.max(0, Math.min(window.innerWidth - FLOAT_WIDTH - FLOAT_PADDING, ev.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 100, ev.clientY - dragOffset.current.y)),
      });
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [mode, floatPos]);

  return { floatPos, onMouseDown };
}

/** API key input prompt shown when no key is configured. */
function ApiKeyPrompt({ apiKey, onApiKeyChange, onSubmit }: {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onSubmit: () => void;
}) {
  return (
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
        onChange={(e) => onApiKeyChange(e.target.value)}
        placeholder="Paste your Gemini API key"
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-engineering-blue-500"
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
      />
      <button
        onClick={onSubmit}
        disabled={!apiKey.trim()}
        className="w-full bg-engineering-blue-600 text-white py-2 rounded-lg hover:bg-engineering-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start Tutoring
      </button>
    </div>
  );
}

/** Loading dots shown while waiting for AI response. */
function LoadingDots() {
  return (
    <div className="flex justify-start">
      <div className="bg-slate-100 text-slate-800 p-3 rounded-lg">
        <div className="flex gap-1">
          {[0, 150, 300].map(delay => (
            <div key={delay} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

const SYSTEM_INSTRUCTION = `You are a rigorous engineering tutor specializing in circuit analysis. Your role is to help students understand:
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
6. Use proper engineering terminology and reference Nilsson & Riedel principles when appropriate.`;

/** Parse $...$ and $$...$$ LaTeX delimiters into text/latex segments. */
function parseLatex(text: string) {
  const parts: Array<{ type: 'text' | 'latex'; content: string }> = [];
  const regex = /\$\$(.*?)\$\$|\$(.*?)\$/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }

    const latex = match[1] || match[2];
    parts.push({ type: 'latex', content: latex });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts;
}

export function AiTutor({ mode, onModeChange }: AiTutorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState(() => {
    try { return localStorage.getItem('emac_gemini_api_key') || ''; } catch { return ''; }
  });
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<ReturnType<ReturnType<GoogleGenerativeAI['getGenerativeModel']>['startChat']> | null>(null);

  const { floatPos, onMouseDown: handleMouseDown } = useDraggable(mode);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-initialize if we have a saved API key on mount
  useEffect(() => {
    const savedKey = (() => { try { return localStorage.getItem('emac_gemini_api_key') || ''; } catch { return ''; } })();
    if (savedKey.trim()) {
      initializeChat(savedKey);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeChat = (key: string) => {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });
    chatRef.current = model.startChat();
    setIsApiKeySet(true);
    try { localStorage.setItem('emac_gemini_api_key', key); } catch {}
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your Circuit Analysis tutor. I can help you understand concepts related to resistors, capacitors, inductors, time-domain analysis, Laplace transforms, and s-domain analysis. Ask me anything!'
      }
    ]);
  };

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      initializeChat(apiKey);
    }
  };

  const handleClearApiKey = () => {
    try { localStorage.removeItem('emac_gemini_api_key'); } catch {}
    setApiKey('');
    setIsApiKeySet(false);
    setMessages([]);
    chatRef.current = null;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        throw new Error('Chat session not initialized');
      }

      const result = await chatRef.current.sendMessage(userMessage);
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

  if (mode === 'closed') {
    return null;
  }

  const isFloating = mode === 'floating';

  // Header bar (shared between docked and floating)
  const header = (
    <div
      className={`bg-gradient-to-r from-engineering-blue-600 to-engineering-blue-700 text-white p-3 flex justify-between items-center ${isFloating ? 'cursor-grab active:cursor-grabbing rounded-t-xl' : ''}`}
      onMouseDown={isFloating ? handleMouseDown : undefined}
    >
      <div className="flex items-center gap-2 select-none">
        <MessageSquare className="w-4 h-4" />
        <h3 className="font-semibold text-sm">AI Circuit Tutor</h3>
      </div>
      <div className="flex items-center gap-1">
        {isApiKeySet && (
          <button
            onClick={handleClearApiKey}
            className="hover:bg-engineering-blue-800 p-1.5 rounded text-white/70 hover:text-white transition-colors"
            aria-label="Change API key"
            title="Change API key"
          >
            <Key className="w-4 h-4" />
          </button>
        )}
        {isFloating ? (
          <button
            onClick={() => onModeChange('docked')}
            className="hover:bg-engineering-blue-800 p-1.5 rounded text-white/70 hover:text-white transition-colors"
            aria-label="Dock to sidebar"
            title="Dock to sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onModeChange('floating')}
            className="hover:bg-engineering-blue-800 p-1.5 rounded text-white/70 hover:text-white transition-colors"
            aria-label="Detach as floating window"
            title="Detach as floating window"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onModeChange('closed')}
          className="bg-white/15 hover:bg-red-500 p-1.5 rounded text-white transition-colors"
          aria-label="Close tutor"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Chat content (shared)
  const chatContent = !isApiKeySet ? (
    <ApiKeyPrompt apiKey={apiKey} onApiKeyChange={setApiKey} onSubmit={handleSetApiKey} />
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
        {isLoading && <LoadingDots />}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about circuits..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-engineering-blue-500 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-engineering-blue-600 text-white p-2 rounded-lg hover:bg-engineering-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  // Floating mode
  if (isFloating) {
    return (
      <div
        className={`fixed z-[100] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden`}
        style={{
          width: FLOAT_WIDTH,
          height: FLOAT_HEIGHT,
          left: floatPos.x,
          top: floatPos.y,
        }}
      >
        {header}
        {chatContent}
      </div>
    );
  }

  // Docked mode
  return (
    <aside className="w-96 h-screen bg-white border-l border-slate-200 flex flex-col shrink-0">
      {header}
      {chatContent}
    </aside>
  );
}
