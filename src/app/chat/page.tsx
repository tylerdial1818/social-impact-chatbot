import { Metadata } from 'next';
import { ChatInterface } from '@/components/ChatInterface';

export const metadata: Metadata = {
  title: 'Chat - Social Impact Project Planner',
  description: 'AI-powered chatbot for designing social impact projects',
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <ChatInterface />
    </div>
  );
}
