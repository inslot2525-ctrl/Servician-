import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8080";

export default function SupportBot({ title }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello. I am the Careflow support assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function send() {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/query?q=${encodeURIComponent(userText)}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.response || "No answer received." }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Error: Unable to reach the backend service. Ensure the FastAPI server is running." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>{title}</h2>
        <p className="subtitle" style={{ marginBottom: '0' }}>AI Assistant powered by company documents.</p>
      </div>

      <div className="glass-panel chat-container" style={{ flex: 1, padding: '0', overflow: 'hidden' }}>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`chat-message ${m.role === 'user' ? 'msg-user' : 'msg-bot'}`}
              style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
            >
              {m.role === 'bot' && (
                <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary)' }}>
                  <Bot size={20} />
                </div>
              )}
              <div style={{ flex: 1 }}>{m.text}</div>
              {m.role === 'user' && (
                <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                  <User size={20} />
                </div>
              )}
            </motion.div>
          ))}
          {isLoading && (
            <div className="chat-message msg-bot" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
               <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary)' }}>
                  <Bot size={20} />
                </div>
                <Loader2 className="animate-spin" size={20} style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ color: 'var(--text-muted)' }}>Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)' }}>
          <input
            className="input-field"
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={isLoading}
          />
          <button className="btn-primary" onClick={send} disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={18} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
