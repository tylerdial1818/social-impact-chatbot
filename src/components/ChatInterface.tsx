'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Source } from '@/types';
import { cn, formatDate, generateId } from '@/lib/utils';
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  BookOpen, 
  ChevronDown,
  X,
  ExternalLink,
} from 'lucide-react';

interface ChatInterfaceProps {
  initialMessage?: string;
}

export function ChatInterface({ initialMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your Social Impact Project Planner assistant. 

I'm here to help you design rigorous social impact programs using evidence-based frameworks like:
- **Theory of Change** - Mapping causal pathways
- **Logic Models** - Visualizing program components  
- **Results-Based Accountability** - Measuring what matters

How can I help you today? Feel free to describe your social impact goals, and I'll provide structured guidance grounded in program evaluation literature.`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (initialMessage && messages.length === 1) {
      setInput(initialMessage);
    }
  }, [initialMessage, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.message,
        sources: data.sources,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again, or rephrase your question.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSource = (sourceId: string) => {
    setExpandedSources(prev => ({
      ...prev,
      [sourceId]: !prev[sourceId],
    }));
  };

  const renderMessageContent = (content: string, sources?: Source[]) => {
    // Simple markdown-like rendering
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let currentList: string[] = [];
    let isListStart = true;

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="bg-slate-100 p-4 rounded-lg overflow-x-auto mb-4">
              <code>{codeContent}</code>
            </pre>
          );
          codeContent = '';
        }
        inCodeBlock = !inCodeBlock;
        return;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

      // Handle headers
      if (line.startsWith('## ')) {
        if (currentList.length > 0) {
          elements.push(renderList(currentList));
          currentList = [];
        }
        elements.push(
          <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-slate-800">
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        if (currentList.length > 0) {
          elements.push(renderList(currentList));
          currentList = [];
        }
        elements.push(
          <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-slate-800">
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Handle bold text
      const processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Handle list items
      if (line.match(/^[-*•]\s/) || line.match(/^\d+\.\s/)) {
        const itemText = line.replace(/^[-*•]\s/, '').replace(/^\d+\.\s/, '');
        currentList.push(itemText);
        isListStart = false;
        return;
      }

      // Render accumulated list if needed
      if (currentList.length > 0 && !line.match(/^[-*•]\s/) && !line.match(/^\d+\.\s/) && line.trim()) {
        elements.push(renderList(currentList));
        currentList = [];
      }

      // Handle regular paragraph
      if (line.trim()) {
        elements.push(
          <p 
            key={index} 
            className="mb-3 text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        );
      }
    });

    // Render remaining list
    if (currentList.length > 0) {
      elements.push(renderList(currentList));
    }

    // Render sources
    if (sources && sources.length > 0) {
      elements.push(
        <div key="sources" className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-accent-600" />
            <span className="font-semibold text-slate-800">Sources</span>
          </div>
          <div className="space-y-2">
            {sources.map((source) => (
              <div
                key={source.id}
                className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleSource(source.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800 truncate">
                      {source.title}
                    </div>
                    <div className="text-sm text-slate-500">
                      {source.author}{source.year ? ` (${source.year})` : ''}
                      {source.similarity && (
                        <span className="ml-2 text-accent-600">
                          {(source.similarity * 100).toFixed(0)}% match
                        </span>
                      )}
                    </div>
                  </div>
                  {expandedSources[source.id] ? (
                    <ChevronDown className="h-4 w-4 text-slate-400 rotate-180" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                {expandedSources[source.id] && source.chunk && (
                  <div className="px-4 py-3 bg-white border-t border-slate-200">
                    <p className="text-sm text-slate-600 italic">
                      "{source.chunk}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return elements;
  };

  const renderList = (items: string[]) => (
    <ul className="mb-4 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-slate-700">
          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500 mt-2"></span>
          <span dangerouslySetInnerHTML={{ 
            __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
          }} />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Bot className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Social Impact Project Planner</h1>
            <p className="text-sm text-slate-500">AI-powered guidance for rigorous program design</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-4',
              message.role === 'user' && 'flex-row-reverse'
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                message.role === 'user'
                  ? 'bg-primary-100'
                  : 'bg-accent-100'
              )}
            >
              {message.role === 'user' ? (
                <User className="h-5 w-5 text-primary-600" />
              ) : (
                <Bot className="h-5 w-5 text-accent-600" />
              )}
            </div>

            {/* Message bubble */}
            <div
              className={cn(
                'flex-1 max-w-[85%]',
                message.role === 'user' ? 'text-right' : 'text-left'
              )}
            >
              <div
                className={cn(
                  'chat-bubble',
                  message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
                )}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {renderMessageContent(message.content, message.sources)}
                </div>
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {formatDate(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
              <Bot className="h-5 w-5 text-accent-600" />
            </div>
            <div className="chat-bubble chat-bubble-assistant">
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your social impact project or ask a question..."
              className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none min-h-[52px] max-h-[200px]"
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors',
                input.trim() && !isLoading
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              )}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-400 text-center">
          Powered by RAG - Responses grounded in peer-reviewed literature
        </p>
      </div>
    </div>
  );
}
