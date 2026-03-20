import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

export function ForensAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! I'm ForensAI, your investigative assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const suggestedPrompts = [
    "Summarize anomalies",
    "Generate timeline",
    "Explain risk score",
  // Threat correlation removed
  ];

  const OLLAMA_URL = 'http://localhost:11434/api/generate';
  const systemDescription = `You are ForensAI, an assistant that ONLY answers questions about the ForensAI platform (its features, architecture, data flows, modules, and usage). Provide short, factual answers: 1-3 sentences maximum. Answer only what is explicitly asked — do not add extra details or recommendations unless requested. If the user asks for more detail, wait for a follow-up request.`;

  const sendMessage = () => {
    if (input.trim()) {
      const userText = input.trim();
      setMessages(prev => [...prev, { role: "user", content: userText }]);
      setInput("");

      const prompt = `${systemDescription}\n\nUser: ${userText}\n\nRespond in detail:`;

      // Direct call to local Ollama with streaming support (NDJSON)
      fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'mistral', prompt, stream: true })
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Ollama HTTP ${res.status}: ${text}`);
          }

          // If the response is a streamed body (NDJSON), read it incrementally
          if (!res.body) {
            // No stream support: fall back to reading full text
            const text = await res.text();
            try {
              const data = JSON.parse(text);
              const reply = data.response || data.output || data.text || data.result || JSON.stringify(data);
              setMessages(prev => [...prev, { role: 'ai', content: reply }] );
            } catch (e) {
              setMessages(prev => [...prev, { role: 'ai', content: text }] );
            }
            return;
          }

          // Add a placeholder AI message which we'll update as chunks arrive
          setMessages(prev => [...prev, { role: 'ai', content: '' }]);

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            // Split into lines. Ollama emits NDJSON lines; process complete lines only.
            const lines = buffer.split('\n');
            // Keep the last (possibly incomplete) line in buffer
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              // Some implementations may prefix with "data: "; strip if present
              const jsonText = trimmed.startsWith('data:') ? trimmed.replace(/^data:\s*/, '') : trimmed;
              try {
                const obj = JSON.parse(jsonText);
                // Extract possible text chunk
                const chunk = obj.response || obj.output || obj.text || obj.result || obj.data || '';
                if (typeof chunk === 'string' && chunk.length > 0) {
                  // Append chunk to last AI message
                  setMessages(prev => {
                    const copy = [...prev];
                    // Find last ai message index (should be the placeholder we added)
                    let idx = -1;
                    for (let i = copy.length - 1; i >= 0; i--) {
                      if (copy[i].role === 'ai') { idx = i; break; }
                    }
                    if (idx === -1) {
                      // fallback: push new ai message
                      copy.push({ role: 'ai', content: chunk });
                    } else {
                      copy[idx] = { ...copy[idx], content: (copy[idx].content || '') + chunk };
                    }
                    return copy;
                  });
                }

                // If Ollama marks done, we could break early (some implementations send done:true)
                if (obj.done === true) {
                  // consume remaining buffer later
                }
              } catch (err) {
                // Not JSON — append raw text as fallback
                setMessages(prev => {
                  const copy = [...prev];
                  let idx = -1;
                  for (let i = copy.length - 1; i >= 0; i--) {
                    if (copy[i].role === 'ai') { idx = i; break; }
                  }
                  if (idx === -1) copy.push({ role: 'ai', content: jsonText });
                  else copy[idx] = { ...copy[idx], content: (copy[idx].content || '') + jsonText };
                  return copy;
                });
              }
            }
          }

          // After stream ends, if there's leftover buffer try to parse it
          if (buffer.trim()) {
            try {
              const obj = JSON.parse(buffer);
              const chunk = obj.response || obj.output || obj.text || obj.result || obj.data || '';
              if (chunk) {
                setMessages(prev => {
                  const copy = [...prev];
                  let idx = -1;
                  for (let i = copy.length - 1; i >= 0; i--) {
                    if (copy[i].role === 'ai') { idx = i; break; }
                  }
                  if (idx === -1) copy.push({ role: 'ai', content: chunk });
                  else copy[idx] = { ...copy[idx], content: (copy[idx].content || '') + chunk };
                  return copy;
                });
              }
            } catch (e) {
              // append leftover raw text
              setMessages(prev => {
                const copy = [...prev];
                let idx = -1;
                for (let i = copy.length - 1; i >= 0; i--) {
                  if (copy[i].role === 'ai') { idx = i; break; }
                }
                if (idx === -1) copy.push({ role: 'ai', content: buffer });
                else copy[idx] = { ...copy[idx], content: (copy[idx].content || '') + buffer };
                return copy;
              });
            }
          }
        })
        .catch((err) => {
          console.error('ForensAI chat error', err);
          setMessages(prev => [...prev, { role: 'ai', content: `ForensAI error: ${err.message}.\nIf you see a CORS error, run this UI from the same origin as Ollama or enable CORS on Ollama.` }]);
        });
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-[#7A5CFF] to-[#00FFFF] rounded-full shadow-[0_0_40px_rgba(122,92,255,0.6)] flex items-center justify-center cursor-pointer hover:shadow-[0_0_60px_rgba(122,92,255,0.8)] transition-all z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle className="w-8 h-8 text-white" />
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF3864] rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-8 right-8 w-96 h-[600px] bg-[rgba(28,31,38,0.95)] backdrop-blur-xl border border-[rgba(122,92,255,0.3)] rounded-2xl shadow-[0_0_60px_rgba(122,92,255,0.4)] flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[rgba(122,92,255,0.3)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#7A5CFF] to-[#00FFFF] rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[#E6E8EB]">ForensAI</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00FFB3] animate-pulse" />
                    <p className="text-xs text-[#8B92A0]">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[rgba(255,56,100,0.1)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#8B92A0] hover:text-[#FF3864]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl ${
                      msg.role === "user"
                        ? "bg-[rgba(0,255,255,0.1)] border border-[rgba(0,255,255,0.3)] text-[#E6E8EB]"
                        : "bg-[rgba(122,92,255,0.1)] border border-[rgba(122,92,255,0.3)] text-[#E6E8EB]"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {messages.length > 1 && messages[messages.length - 1].role === "user" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-[rgba(122,92,255,0.1)] border border-[rgba(122,92,255,0.3)] rounded-xl p-3">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-[#7A5CFF]"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-[#7A5CFF]"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-[#7A5CFF]"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Suggested Prompts */}
            <div className="px-4 pb-2">
              <p className="text-xs text-[#8B92A0] mb-2">Suggested prompts:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt)}
                    className="text-xs px-3 py-1 bg-[rgba(122,92,255,0.1)] border border-[rgba(122,92,255,0.3)] rounded-full text-[#7A5CFF] hover:bg-[rgba(122,92,255,0.2)] transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[rgba(122,92,255,0.3)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask ForensAI anything..."
                  className="flex-1 px-4 py-2 bg-[rgba(28,31,38,0.8)] border border-[rgba(122,92,255,0.3)] rounded-lg focus:border-[#7A5CFF] focus:outline-none text-[#E6E8EB] text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-gradient-to-r from-[#7A5CFF] to-[#00FFFF] rounded-lg hover:shadow-[0_0_20px_rgba(122,92,255,0.5)] transition-all"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
