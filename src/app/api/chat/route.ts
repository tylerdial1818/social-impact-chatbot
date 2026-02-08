import { NextRequest, NextResponse } from 'next/server';
import { getRAGService } from '@/lib/rag-service';
import { STRUCTURED_PROMPT_TEMPLATE } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const ragService = getRAGService();
    
    // Initialize RAG service if needed
    await ragService.initialize();

    // Retrieve relevant context
    const sources = await ragService.retrieve(message);

    // Format context from retrieved sources
    const context = sources
      .map((s, i) => `[Source ${i + 1}]: ${s.title} by ${s.author || 'Unknown'} (${s.year || 'N.D.'})\n${s.chunk || ''}`)
      .join('\n\n');

    // Format chat history
    const chatHistory = history
      ? history
          .map((m: { role: string; content: string }) => 
            `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
          )
          .join('\n\n')
      : 'No previous conversation.';

    // Generate response using RAG
    const response = await ragService.generate(context, message, chatHistory);

    return NextResponse.json({
      message: response,
      sources: sources.map(s => ({
        id: s.id,
        title: s.title,
        author: s.author,
        year: s.year,
        similarity: s.similarity,
      })),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
