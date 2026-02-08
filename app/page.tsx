'use client';

import { useChat } from 'ai/react';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { Sparkles, BookOpen, Target, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';

const EXAMPLE_PROMPTS = [
  {
    icon: Target,
    text: 'How do I create a Theory of Change for a literacy program?',
  },
  {
    icon: BookOpen,
    text: 'What are the key components of a results-based accountability framework?',
  },
  {
    icon: Users,
    text: 'How can I ensure equity in my humanitarian program design?',
  },
  {
    icon: Sparkles,
    text: 'What are best practices for measuring social impact outcomes?',
  },
];

export default function HomePage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat',
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleExampleClick = (text: string) => {
    setInput(text);
  };
  
  const handleSend = (message: string) => {
    setInput(message);
    // Trigger form submit
    const form = document.querySelector('form');
    if (form) {
      handleSubmit(new Event('submit') as any);
    }
  };
  
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Social Impact Project Planner</h1>
          </div>
          <p className="hidden text-sm text-muted-foreground md:block">
            Evidence-based guidance for program design
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="container h-full px-4 py-6">
          <div className="mx-auto flex h-full max-w-4xl flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Welcome to the Social Impact Project Planner</h2>
                    <p className="text-muted-foreground max-w-md">
                      Get evidence-based guidance for designing rigorous social impact programs,
                      grounded in academic research on Theory of Change, program evaluation, and best practices.
                    </p>
                  </div>
                  
                  <div className="grid gap-3 sm:grid-cols-2 w-full max-w-2xl">
                    {EXAMPLE_PROMPTS.map((prompt, i) => {
                      const Icon = prompt.icon;
                      return (
                        <button
                          key={i}
                          onClick={() => handleExampleClick(prompt.text)}
                          className="flex items-start gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted"
                        >
                          <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{prompt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      role={message.role as 'user' | 'assistant'}
                      content={message.content}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Input Container */}
            <div className="mt-4 border-t pt-4">
              <form onSubmit={handleSubmit}>
                <ChatInput
                  onSend={handleSend}
                  isLoading={isLoading}
                />
              </form>
              <p className="mt-2 text-xs text-center text-muted-foreground">
                Responses are generated using AI and grounded in academic research. Always verify critical information.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
