/**
 * Document Ingestion Script
 * 
 * Processes PDF documents from the corpus and uploads them to Pinecone
 * 
 * Usage: npx tsx scripts/ingest-corpus.ts
 */

import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

// Configuration
const CORPUS_DIR = path.join(__dirname, '../corpus');
const CHUNK_SIZE = 600; // tokens (approximate)
const CHUNK_OVERLAP = 60;
const BATCH_SIZE = 100;

// Initialize clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

interface DocumentChunk {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    source: string;
    page?: number;
    chunkIndex: number;
  };
}

/**
 * Extract text from PDF
 */
async function extractTextFromPDF(filePath: string): Promise<{ text: string; numPages: number }> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return {
    text: data.text,
    numPages: data.numpages,
  };
}

/**
 * Simple text chunking with overlap
 */
function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }
  
  return chunks;
}

/**
 * Generate embeddings for text chunks
 */
async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  });
  
  return response.data.map(d => d.embedding);
}

/**
 * Process a single document
 */
async function processDocument(
  filePath: string,
  filename: string
): Promise<DocumentChunk[]> {
  console.log(`Processing: ${filename}`);
  
  // Extract text
  const { text, numPages } = await extractTextFromPDF(filePath);
  console.log(`  Extracted ${text.length} characters from ${numPages} pages`);
  
  // Clean text
  const cleanedText = text
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E\n]/g, '')
    .trim();
  
  // Chunk text
  const chunks = chunkText(cleanedText, CHUNK_SIZE, CHUNK_OVERLAP);
  console.log(`  Created ${chunks.length} chunks`);
  
  // Generate embeddings in batches
  const documentChunks: DocumentChunk[] = [];
  
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const embeddings = await generateEmbeddings(batch);
    
    batch.forEach((text, j) => {
      const globalIndex = i + j;
      documentChunks.push({
        id: `${filename}-chunk-${globalIndex}`,
        text,
        embedding: embeddings[j],
        metadata: {
          source: filename.replace('.pdf', ''),
          chunkIndex: globalIndex,
        },
      });
    });
    
    console.log(`  Generated embeddings for chunks ${i}-${i + batch.length}`);
  }
  
  return documentChunks;
}

/**
 * Upload vectors to Pinecone
 */
async function uploadToPinecone(chunks: DocumentChunk[], indexName: string) {
  const index = pinecone.index(indexName);
  
  // Upload in batches
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    
    await index.upsert(
      batch.map(chunk => ({
        id: chunk.id,
        values: chunk.embedding,
        metadata: {
          text: chunk.text,
          source: chunk.metadata.source,
          chunkIndex: chunk.metadata.chunkIndex,
        },
      }))
    );
    
    console.log(`  Uploaded ${i + batch.length}/${chunks.length} vectors`);
  }
}

/**
 * Main ingestion pipeline
 */
async function main() {
  console.log('🚀 Starting document ingestion...\n');
  
  // Check if corpus directory exists
  if (!fs.existsSync(CORPUS_DIR)) {
    console.error(`❌ Corpus directory not found: ${CORPUS_DIR}`);
    console.log('Please create the directory and add PDF files.');
    process.exit(1);
  }
  
  // Get all PDF files
  const files = fs.readdirSync(CORPUS_DIR).filter(f => f.endsWith('.pdf'));
  
  if (files.length === 0) {
    console.error('❌ No PDF files found in corpus directory');
    process.exit(1);
  }
  
  console.log(`Found ${files.length} PDF files\n`);
  
  // Process each document
  const allChunks: DocumentChunk[] = [];
  
  for (const file of files) {
    const filePath = path.join(CORPUS_DIR, file);
    try {
      const chunks = await processDocument(filePath, file);
      allChunks.push(...chunks);
      console.log(`✅ Processed ${file}\n`);
    } catch (error: any) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\n📊 Total chunks generated: ${allChunks.length}`);
  
  // Upload to Pinecone
  const indexName = process.env.PINECONE_INDEX_NAME || 'social-impact';
  console.log(`\n📤 Uploading to Pinecone index: ${indexName}`);
  
  try {
    await uploadToPinecone(allChunks, indexName);
    console.log(`\n✅ Successfully uploaded all vectors to Pinecone!`);
  } catch (error: any) {
    console.error(`\n❌ Error uploading to Pinecone:`, error.message);
    process.exit(1);
  }
  
  console.log('\n🎉 Ingestion complete!');
}

// Run the script
main().catch(console.error);
