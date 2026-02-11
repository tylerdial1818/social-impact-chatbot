# Social Impact Project Planner

A production-ready RAG-powered chatbot that helps users design rigorous social impact projects grounded in established program evaluation literature.
<img width="921" height="490" alt="Screenshot 2026-02-11 at 4 37 46 PM" src="https://github.com/user-attachments/assets/6bf1956f-b314-4eb4-9ab9-468ba07427b4" />


## Features

- **AI-Powered Guidance**: Get intelligent recommendations for your social impact programs
- **Evidence-Based Responses**: All recommendations grounded in peer-reviewed literature
- **Structured Frameworks**: Support for Theory of Change, Logic Models, and Results-Based Accountability
- **Source Attribution**: Every response cites the academic sources that inform it
- **Conversational Memory**: Maintains context throughout your planning session
- **Modern UI**: Clean, accessible interface built with React and Tailwind CSS

## About the Project

This chatbot was developed for MSDS453: Natural Language Processing at Northwestern University. It helps social impact practitioners:

- Design programs using rigorous methodological frameworks
- Ground their approach in academic research on program evaluation
- Think through Theory of Change, Logic Models, and Results-Based Accountability
- Consider risks and equity in program design

### Literature Grounding

The chatbot is grounded in curated academic literature including works on:
- Theory of Change (Vogel, 2012)
- Program evaluation frameworks (Weiss, 1995)
- Aid effectiveness (Guerrero, 2021; Riddell, 2007)
- Education and development (Hannum, 2003)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- (Optional) OpenAI API key for production use

### Installation

```bash
# Clone the repository
git clone https://github.com/evegreenftw/social-impact-chatbot.git
cd social-impact-chatbot

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Social Impact Chatbot                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   Frontend   │◄──►│  Next.js API │◄──►│   Backend   │   │
│  │   (React)    │    │   Routes     │    │   Services  │   │
│  └─────────────┘    └─────────────┘    └─────────────┘   │
│         │                                      │           │
│         │                                      ▼           │
│         │                            ┌─────────────────┐  │
│         │                            │   RAG Pipeline  │  │
│         │                            ├─────────────────┤  │
│         │                            │ • Embeddings    │  │
│         │                            │ • Vector DB     │  │
│         │                            │ • LLM Generation│  │
│         │                            └─────────────────┘  │
│         │                                      │           │
│         ▼                                      ▼           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              ChromaDB Vector Database                 │  │
│  │     (Indexed academic literature corpus)              │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

- **Frontend**: React 18, Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: ChromaDB (vector database)
- **ML/AI**: LangChain, OpenAI API (or OpenRouter)
- **Deployment**: Vercel (recommended), Docker

## Project Structure

```
social-impact-chatbot/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── chat/          # Chat endpoint
│   │   ├── chat/              # Chat page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   └── ChatInterface.tsx # Main chat UI
│   ├── lib/                   # Core utilities
│   │   ├── prompts.ts        # Prompt templates
│   │   ├── rag-service.ts    # RAG pipeline
│   │   └── utils.ts          # Helper functions
│   └── types/                 # TypeScript types
│       └── index.ts
├── public/                    # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for LLM generation | Yes* |
| `OPENROUTER_API_KEY` | OpenRouter API key (alternative to OpenAI) | Yes* |
| `CHROMA_HOST` | ChromaDB server host | No (defaults to localhost) |
| `CHROMA_PORT` | ChromaDB server port | No (defaults to 8000) |
| `NEXT_PUBLIC_APP_URL` | Application URL | No (defaults to localhost) |

*Either OpenAI or OpenRouter API key is required for production use.

### Adding More Documents to the Corpus

To add new documents to the knowledge base:

1. Place PDF or text files in a `corpus/` directory
2. Run the indexing script:
   ```bash
   npm run index:corpus
   ```

## User Flow

1. **Landing Page**: User learns about the chatbot's capabilities
2. **Chat Interface**: User describes their social impact project or asks questions
3. **RAG Retrieval**: System finds relevant academic sources
4. **LLM Generation**: System generates structured response with citations
5. **Iterative Refinement**: User can ask follow-up questions to refine their approach

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Response latency | < 10s | ~7s |
| Structure adherence | 100% | 100% |
| Source citations per response | 2+ | 1.8 avg |
| Unique sources per query | 2+ | 1.4 avg |

## Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e
```

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t social-impact-chatbot .

# Run container
docker run -p 3000:3000 social-impact-chatbot
```

### Environment Variables for Production

Make sure to set these in your deployment platform:

```
OPENAI_API_KEY=your_production_api_key
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Future Improvements

- [ ] User authentication and saved sessions
- [ ] Export functionality (PDF, Markdown)
- [ ] Multi-language support
- [ ] Advanced evaluation metrics
- [ ] Integration with project management tools
- [ ] Mobile app (React Native)

## License

MIT License - See [LICENSE](LICENSE) for details.

## Acknowledgments

- Northwestern University MSDS453 course
- OpenAI for API access
- LangChain community for RAG utilities
- The social impact practitioners who inspired this project

---

Built with ❤️ for social good practitioners
