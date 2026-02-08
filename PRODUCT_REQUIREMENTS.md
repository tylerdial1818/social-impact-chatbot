# Social Impact Project Planner - Product Requirements Document

## Executive Summary

Building a production-ready RAG-powered chatbot that helps social impact practitioners design rigorous programs grounded in evidence-based research. This is a complete rebuild of Tyler's MSDS453 class project with enhanced UX, scalable architecture, and deployment-ready code.

## Problem Statement

Social impact organizations design programs to address poverty, inequality, and humanitarian needs but often lack:
- Access to latest academic research and methodological frameworks
- Time to read and synthesize peer-reviewed literature
- Structured approach to program design and evaluation
- Evidence-based decision-making tools

**Current State**: Tyler built a functional proof-of-concept RAG chatbot that:
- Uses 17 peer-reviewed papers on Theory of Change, humanitarian aid, and international development
- Returns structured responses with citations
- Achieved good metrics but has infrastructure limitations

**Desired State**: Production-ready web application that practitioners can actually use.

## Target Users

### Primary Personas
1. **Program Manager** - Designs social impact programs, needs structured guidance
2. **Grant Writer** - Needs evidence-based justifications and methodological frameworks
3. **Evaluation Specialist** - Requires research backing for measurement strategies
4. **Nonprofit Executive** - Seeks best practices for organizational effectiveness

### User Needs
- Fast, conversational interface
- Evidence-backed recommendations
- Source attribution and citations
- Ability to explore related concepts
- Save and export conversation history
- Mobile-friendly access

## Core Features

### MVP (Phase 1)
1. **Chat Interface**
   - Clean, modern UI
   - Real-time streaming responses
   - Message history with context
   - Mobile responsive

2. **RAG Pipeline**
   - Vector search over curated corpus
   - Semantic retrieval with embeddings
   - Source attribution with citations
   - Structured response format

3. **Conversational Memory**
   - Session-based context retention
   - Follow-up question handling
   - Conversation threading

4. **Source Management**
   - Display cited documents
   - Link to full source when available
   - Highlight relevant passages

### Phase 2 (Future)
- User accounts and saved conversations
- Custom corpus upload (per organization)
- Export to PDF/Word
- Analytics dashboard
- Multi-language support
- API access

## Success Metrics

### User Engagement
- Session duration > 5 minutes
- Messages per session > 8
- Return user rate > 30%
- Completion rate for full project planning flow

### Technical Performance
- Response latency < 3 seconds (p95)
- RAG retrieval accuracy > 80% relevance
- Uptime > 99.5%
- Cost per conversation < $0.10

### Quality Metrics
- Citation inclusion rate > 90%
- Structured response compliance 100%
- User satisfaction score > 4/5
- Perceived usefulness vs ChatGPT: significantly higher

## Technical Architecture

### Frontend
- **Framework**: Next.js 14+ with App Router
- **UI**: React with Tailwind CSS
- **Components**: shadcn/ui for accessible, beautiful components
- **State**: React hooks + Context API
- **Streaming**: Server-Sent Events or Vercel AI SDK streaming

### Backend
- **Runtime**: Next.js API Routes (serverless functions)
- **Language**: TypeScript
- **RAG Pipeline**:
  - Vector DB: Pinecone or Supabase Vector (cloud-native, scalable)
  - Embeddings: OpenAI text-embedding-3-small (better than MiniLM)
  - LLM: OpenAI GPT-4o-mini (cost-effective, fast)
- **Memory**: Upstash Redis for conversation context
- **File Storage**: Vercel Blob or S3 for document corpus

### Infrastructure
- **Hosting**: Vercel (seamless Next.js deployment)
- **Database**: Supabase (PostgreSQL + Vector extensions)
- **Monitoring**: Vercel Analytics + Sentry
- **CI/CD**: GitHub Actions → Vercel auto-deploy

### Data Pipeline
```
Academic Papers (PDFs)
    ↓
Text Extraction & Cleaning
    ↓
Chunking (overlap strategy)
    ↓
Embedding Generation
    ↓
Vector Database (with metadata)
    ↓
RAG Retrieval System
```

### Conversation Flow
```
User Query
    ↓
Retrieve conversation context (Redis)
    ↓
Generate query embedding
    ↓
Vector search (top-k relevant chunks)
    ↓
Build augmented prompt with context
    ↓
Stream LLM response with citations
    ↓
Save to conversation history
```

## User Flows

### Primary Flow: New Project Guidance
1. User lands on homepage
2. Sees example prompts: "How do I design a literacy program?" "What is Theory of Change?"
3. Enters question in chat
4. System retrieves relevant research
5. Streams structured response with:
   - Context & problem framing
   - Evidence from academic sources
   - Practical guidance (steps, risks, equity considerations)
   - Citations with links
6. User asks follow-up questions
7. System maintains context across conversation
8. User can start new conversation or export current one

### Secondary Flow: Exploration
1. User browses "Explore Concepts" page
2. Sees curated topics: Theory of Change, Logic Models, Results-Based Accountability, etc.
3. Clicks topic → pre-filled chat with context
4. Conversation begins with expert guidance

## Design Principles

1. **Evidence-First**: Every recommendation backed by research
2. **Clarity Over Cleverness**: Simple, direct language
3. **Structured Thinking**: Encourage systematic problem-solving
4. **Progressive Disclosure**: Start simple, offer depth on demand
5. **Speed Matters**: Sub-3-second responses, streaming feedback
6. **Accessible**: WCAG 2.1 AA compliant

## Risk Assessment

### Technical Risks
- **Vector DB scaling**: Mitigation → Use managed service (Pinecone/Supabase)
- **LLM costs**: Mitigation → Cache common queries, use GPT-4o-mini
- **Latency**: Mitigation → Streaming responses, optimized embeddings

### Product Risks
- **User adoption**: Mitigation → Clear value prop, example-driven onboarding
- **Quality degradation**: Mitigation → Structured prompts, citation requirements
- **Corpus staleness**: Mitigation → Document update pipeline, versioning

## Open Questions
1. Should we allow users to upload their own documents? (Privacy implications)
2. Do we need user authentication for MVP, or anonymous sessions?
3. What's the right balance between corpus size and retrieval quality?
4. Should we implement rate limiting? (Prevent abuse)

## Next Steps
1. ✅ Define requirements (this document)
2. 🔄 Build application (Software Engineer phase)
3. ⏳ Deploy to production
4. ⏳ Document deployment requirements
5. ⏳ Create deployment report

---

**Version**: 1.0  
**Last Updated**: 2026-02-08  
**Owner**: Tyler Dial / Rebuild by Eve's Agent
