import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

// Types
export interface RetrievedChunk {
  id: string;
  text: string;
  source: string;
  score: number;
  page?: number;
}

export interface RAGConfig {
  topK?: number;
  minScore?: number;
}

// Initialize clients (singleton pattern)
let pineconeClient: Pinecone | null = null;
let openaiClient: OpenAI | null = null;

function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY is not set');
    }
    pineconeClient = new Pinecone({ apiKey });
  }
  return pineconeClient;
}

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * Generate embeddings for a text query
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const openai = getOpenAIClient();
  
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  
  return response.data[0].embedding;
}

/**
 * Retrieve relevant document chunks from Pinecone
 */
export async function retrieveRelevantChunks(
  query: string,
  config: RAGConfig = {}
): Promise<RetrievedChunk[]> {
  const { topK = 5, minScore = 0.7 } = config;
  
  try {
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);
    
    // Query Pinecone
    const pinecone = getPineconeClient();
    const indexName = process.env.PINECONE_INDEX_NAME || 'social-impact';
    const index = pinecone.index(indexName);
    
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });
    
    // Filter and format results
    const chunks: RetrievedChunk[] = [];
    
    for (const match of queryResponse.matches || []) {
      if (match.score && match.score >= minScore && match.metadata) {
        chunks.push({
          id: match.id,
          text: (match.metadata.text as string) || '',
          source: (match.metadata.source as string) || 'Unknown',
          score: match.score,
          page: match.metadata.page as number | undefined,
        });
      }
    }
    
    return chunks;
  } catch (error) {
    console.error('Error retrieving chunks:', error);
    // Return empty array if retrieval fails (graceful degradation)
    return [];
  }
}

/**
 * Build the augmented prompt with retrieved context
 */
export function buildAugmentedPrompt(
  userQuery: string,
  retrievedChunks: RetrievedChunk[],
  conversationHistory: Array<{ role: string; content: string }> = []
): string {
  const systemPrompt = `You are a Social Impact Project Planning Assistant. Your purpose is to help practitioners design rigorous, evidence-based social impact programs.

You must ALWAYS respond in this structured format:

**1. Context & Problem Framing**
[Restate the user's question and provide contextual background]

**2. Evidence from Research**
${retrievedChunks.length > 0 ? '[Draw from the academic sources provided below]' : '[No specific sources available - use general best practices]'}

**3. Practical Guidance**
- Key steps to take
- Potential risks and mitigation strategies
- Equity and inclusion considerations
- Expected outcomes

**4. Sources**
${retrievedChunks.length > 0 ? '[Cite the sources used]' : '[N/A - No specific sources available]'}

---

${retrievedChunks.length > 0 ? '**RETRIEVED RESEARCH CONTEXT:**\n\n' + retrievedChunks.map((chunk, i) => 
  `[${i + 1}] Source: ${chunk.source}${chunk.page ? ` (Page ${chunk.page})` : ''}\nRelevance Score: ${(chunk.score * 100).toFixed(1)}%\n\n${chunk.text}\n`
).join('\n---\n\n') : '**No specific research sources available for this query. Provide general best practices guidance.**'}

---

**CONVERSATION HISTORY:**
${conversationHistory.length > 0 ? conversationHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n') : 'No previous conversation.'}

---

**CURRENT USER QUERY:**
${userQuery}

Remember: Maintain the 4-part structure, be practical and actionable, and cite sources when available.`;

  return systemPrompt;
}

/**
 * Extract citations from retrieved chunks
 */
export function extractCitations(chunks: RetrievedChunk[]): string[] {
  const uniqueSources = new Set<string>();
  chunks.forEach(chunk => uniqueSources.add(chunk.source));
  return Array.from(uniqueSources);
}
