# Social Impact Project Planner

A production-ready RAG-powered chatbot that helps social impact practitioners design rigorous programs grounded in evidence-based research.

## 🎯 Overview

This application provides evidence-based guidance for:
- Designing Theory of Change frameworks
- Creating logic models and results-based accountability systems
- Program evaluation methodology
- Humanitarian aid and international development best practices

Built with **Next.js**, **OpenAI**, and **Pinecone** vector search.

## ✨ Features

- **💬 Modern Chat Interface**: Clean, responsive UI with real-time streaming responses
- **🔍 RAG Pipeline**: Semantic search over curated corpus of 17+ academic papers
- **📚 Source Attribution**: Every response includes citations to academic sources
- **🧠 Conversational Memory**: Maintains context across multi-turn conversations
- **⚡ Fast & Scalable**: Edge runtime with optimized embeddings
- **📱 Mobile-Friendly**: Fully responsive design

## 🏗️ Architecture

```
User Query
    ↓
Next.js API Route
    ↓
Generate Query Embedding (OpenAI)
    ↓
Vector Search (Pinecone)
    ↓
Retrieve Top-K Relevant Chunks
    ↓
Build Augmented Prompt
    ↓
Stream LLM Response (GPT-4o-mini)
    ↓
Return Structured Answer with Citations
```

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui-inspired components
- **AI/ML**: OpenAI (GPT-4o-mini, text-embedding-3-small)
- **Vector DB**: Pinecone (cloud-native vector search)
- **Streaming**: Vercel AI SDK for real-time responses
- **Deployment**: Vercel (recommended) or any Node.js host

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key
- Pinecone account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/evegreenftw/social-impact-chatbot.git
   cd social-impact-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   ```
   OPENAI_API_KEY=sk-...
   PINECONE_API_KEY=...
   PINECONE_INDEX_NAME=social-impact
   ```

4. **Ingest corpus into Pinecone** (see [Data Ingestion](#data-ingestion))

5. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 📊 Data Ingestion

The chatbot uses a curated corpus of 17 peer-reviewed academic papers on:
- Theory of Change
- Program evaluation
- Humanitarian aid
- International development

### Ingesting Documents

Use the included script to process PDFs and upload to Pinecone:

```bash
npm run ingest
```

See `scripts/ingest-corpus.ts` for details.

**Key papers include:**
- Hannum (2003): *Global Educational Expansion and Socio-Economic Development*
- Guerrero (2021): *Aid Effectiveness in Sustainable Development*
- Riddell (2007): *The Effectiveness of Foreign Aid to Education*

## 🧪 Testing

```bash
npm run lint        # ESLint
npm run build       # Production build
npm run start       # Production server
```

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/evegreenftw/social-impact-chatbot)

### Alternative Hosting

Works on any Node.js platform:
- Railway
- Render
- AWS (Lambda + API Gateway)
- Google Cloud Run
- Digital Ocean App Platform

## 💰 Cost Estimation

**Per 1000 conversations** (assuming avg 10 messages each):
- OpenAI embeddings: ~$0.05
- OpenAI GPT-4o-mini: ~$0.30
- Pinecone (free tier): $0.00
- **Total**: ~$0.35/1000 conversations

Pinecone free tier: 100K vectors, 1M queries/month

## 🛠️ Configuration

### RAG Parameters

Edit in `lib/rag.ts`:

```typescript
const config = {
  topK: 5,           // Number of chunks to retrieve
  minScore: 0.65,    // Minimum similarity threshold
  chunkSize: 600,    // Tokens per chunk
  chunkOverlap: 60,  // Overlap between chunks
}
```

### LLM Settings

Edit in `app/api/chat/route.ts`:

```typescript
{
  model: 'gpt-4o-mini',     // or 'gpt-4o' for better quality
  temperature: 0.7,          // 0.0-1.0 (creativity)
  max_tokens: 1500,          // Response length
}
```

## 📁 Project Structure

```
social-impact-chatbot/
├── app/
│   ├── api/chat/route.ts      # Chat API endpoint
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Chat interface
│   └── globals.css            # Global styles
├── components/
│   ├── ChatMessage.tsx        # Message bubble component
│   └── ChatInput.tsx          # Input field component
├── lib/
│   ├── rag.ts                 # RAG pipeline logic
│   └── utils.ts               # Utility functions
├── scripts/
│   └── ingest-corpus.ts       # Document ingestion script
├── public/                    # Static assets
├── .env.example               # Environment template
├── next.config.js             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file

## 🙏 Acknowledgments

- Original concept by Tyler Dial (Northwestern MSDS453)
- Academic corpus: See `SOURCES.md` for full citation list
- Built with inspiration from the Vercel AI SDK examples

## 📞 Support

- Issues: [GitHub Issues](https://github.com/evegreenftw/social-impact-chatbot/issues)
- Email: support@example.com (replace with actual contact)

---

**Built with ❤️ for social impact practitioners worldwide**
