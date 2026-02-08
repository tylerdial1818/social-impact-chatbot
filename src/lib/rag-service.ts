import { Source } from '@/types';

// Mock RAG service - in production, this would use ChromaDB and embeddings
// For demo purposes, we're simulating the RAG pipeline

export interface RAGConfig {
  topK: number;
  chunkSize: number;
  similarityThreshold: number;
}

const defaultConfig: RAGConfig = {
  topK: 5,
  chunkSize: 500,
  similarityThreshold: 0.5,
};

// Mock corpus - in production, this would be indexed in ChromaDB
const mockCorpus: Source[] = [
  {
    id: 'hannum-2003',
    title: 'Global Educational Expansion and Socio-Economic Development',
    author: 'Emily Hannum',
    year: '2003',
    chunk: 'Educational expansion serves as a critical driver of socio-economic development, particularly in low-income contexts. Programs targeting education access must consider not only enrollment but also learning outcomes and quality of instruction.',
  },
  {
    id: 'guerrero-2021',
    title: 'Aid Effectiveness in Sustainable Development: A Multidimensional Approach',
    author: 'Omar A. Guerrero',
    year: '2021',
    chunk: 'Aid effectiveness requires a multidimensional assessment that considers not just immediate outcomes but long-term sustainability, local capacity building, and alignment with national development strategies.',
  },
  {
    id: 'riddell-2007',
    title: 'The Effectiveness of Foreign Aid to Education: What Can Be Learned?',
    author: 'Abby Riddell',
    year: '2007',
    chunk: 'Foreign aid to education shows varied results depending on context, policy alignment, and implementation quality. Success factors include teacher training, community involvement, and sustainable financing mechanisms.',
  },
  {
    id: 'vogel-2012',
    title: 'Review of the Use of Theory of Change in International Development',
    author: 'Isabel Vogel',
    year: '2012',
    chunk: 'Theory of Change provides a rigorous framework for understanding causal pathways in complex social programs. It requires explicit articulation of assumptions, risks, and the logic linking activities to intended outcomes.',
  },
  {
    id: 'weiss-1995',
    title: 'Nothing as Practical as Good Theory: Exploring Theory-Based Evaluation',
    author: 'Carol H. Weiss',
    year: '1995',
    chunk: 'Theory-based evaluation examines the mechanisms through which programs are expected to produce change. This approach helps identify why programs succeed or fail and informs improvement strategies.',
  },
];

export class RAGService {
  private config: RAGConfig;
  private isInitialized: boolean = false;

  constructor(config: Partial<RAGConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async initialize(): Promise<void> {
    // In production, this would load the ChromaDB and embedding model
    this.isInitialized = true;
    console.log('RAG Service initialized with config:', this.config);
  }

  async retrieve(query: string): Promise<Source[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Simulate semantic search with mock corpus
    // In production, this would query ChromaDB with embeddings
    const queryLower = query.toLowerCase();
    
    const relevantKeywords: Record<string, string[]> = {
      'education': ['education', 'school', 'learning', 'teacher', 'enrollment'],
      'health': ['health', 'medical', 'hospital', 'disease', 'prevention'],
      'poverty': ['poverty', 'income', 'economic', 'livelihood', 'employment'],
      'theory of change': ['theory of change', 'causal', 'pathway', 'outcome', 'impact'],
      'evaluation': ['evaluation', 'assessment', 'measurement', 'indicator', 'outcome'],
      'program': ['program', 'intervention', 'project', 'initiative'],
      'community': ['community', 'participation', 'stakeholder', 'local'],
      'impact': ['impact', 'effectiveness', 'results', 'change'],
      'development': ['development', 'sustainable', 'growth', 'progress'],
      'aid': ['aid', 'donor', 'funding', 'grant', 'assistance'],
    };

    const scores: { source: Source; score: number }[] = mockCorpus.map(source => {
      let score = 0;
      
      // Check for keyword matches
      for (const [category, keywords] of Object.entries(relevantKeywords)) {
        if (queryLower.includes(category)) {
          // Check if source chunk contains related keywords
          const chunkLower = source.chunk?.toLowerCase() || '';
          const matches = keywords.filter(kw => chunkLower.includes(kw)).length;
          score += matches * 0.2;
        }
      }

      // Boost score based on title relevance
      if (source.title.toLowerCase().includes('effectiveness') && 
          (queryLower.includes('effectiveness') || queryLower.includes('evaluation'))) {
        score += 0.3;
      }

      if (source.title.toLowerCase().includes('theory of change') && 
          queryLower.includes('theory of change')) {
        score += 0.4;
      }

      // Base relevance score
      score += Math.random() * 0.2;

      return { source, score: Math.min(score, 1) };
    });

    // Sort by score and return top-k
    const sorted = scores
      .filter(s => s.score > 0.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config.topK);

    return sorted.map(s => ({
      ...s.source,
      similarity: s.score,
    }));
  }

  async generate(context: string, query: string, chatHistory: string): Promise<string> {
    // In production, this would call OpenAI API
    // For demo, we simulate the generation with structured response

    const structuredResponse = await this.simulateGeneration(context, query, chatHistory);
    return structuredResponse;
  }

  private async simulateGeneration(context: string, query: string, chatHistory: string): Promise<string> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const queryLower = query.toLowerCase();
    
    // Generate contextual response based on query type
    let response = '';

    if (queryLower.includes('theory of change')) {
      response = `## CONTEXT & PROBLEM FRAMING

You've asked about developing a Theory of Change (ToC) for your social impact program. A ToC is essential for articulating the causal logic behind your intervention - how and why your activities are expected to lead to desired outcomes.

## EVIDENCE FROM LITERATURE

According to Vogel (2012), Theory of Change provides a rigorous framework for understanding causal pathways in complex social programs. The framework requires:

- **Explicit articulation of assumptions** - What must be true for your logic to hold?
- **Risk identification** - What could go wrong at each step?
- **Clear causal linkages** - How do activities connect to short, medium, and long-term outcomes?

Weiss (1995) emphasizes that theory-based evaluation examines the mechanisms through which programs are expected to produce change, helping identify why programs succeed or fail.

## PRACTICAL GUIDANCE

1. **Start with your end goal** - What long-term change do you want to achieve?
2. **Work backward** - Identify preconditions needed to achieve that goal
3. **Map interventions** - What activities will create those preconditions?
4. **Test assumptions** - Are your causal assumptions valid?
5. **Identify indicators** - How will you measure progress at each stage?

## RISKS & EQUITY CONSIDERATIONS

**Risks:**
- Over-simplifying complex social dynamics
- Missing critical assumptions that could derail outcomes
- Failing to account for external factors (political, economic, environmental)

**Equity:**
- Ensure your ToC addresses systemic barriers your beneficiaries face
- Consider power dynamics between stakeholders
- Include voice from marginalized communities in the ToC development process

## CITATIONS

Vogel, I. (2012). Review of the Use of Theory of Change in International Development. London: DFID.

Weiss, C.H. (1995). Nothing as Practical as Good Theory: Exploring Theory-Based Evaluation. New Directions for Evaluation, 1995(66), 33-50.`;
    } else if (queryLower.includes('logic model')) {
      response = `## CONTEXT & PROBLEM FRAMING

You're asking about Logic Models - a powerful visual tool for communicating program theory. Logic Models show the logical relationship between program components: Inputs → Activities → Outputs → Outcomes → Impact.

## EVIDENCE FROM LITERATURE

While the literature emphasizes that Logic Models are most effective when connected to underlying theory (as noted by Weiss on theory-based evaluation), the model itself serves as a communication and planning tool that:

- Creates shared understanding among stakeholders
- Identifies resource needs and gaps
- Provides a framework for evaluation planning
- Clarifies what the program does and doesn't address

## PRACTICAL GUIDANCE

**Inputs (Resources):**
- Staff, volunteers, funding, partners, materials, technology

**Activities (What you do):**
- Services, programs, events, training, outreach

**Outputs (Direct results):**
- Number served, sessions delivered, materials distributed

**Short-term Outcomes (Changes):**
- Knowledge, attitudes, skills, behaviors of participants

**Long-term Outcomes (Impact):**
- Sustained changes, policy shifts, improved conditions

## RISKS & EQUITY CONSIDERATIONS

**Risks:**
- Focusing too much on activities rather than actual outcomes
- Overlooking external factors that influence results
- Creating unrealistic timelines for outcome achievement

**Equity:**
- Ensure inputs address barriers to access
- Design outcomes that reduce disparities
- Consider whose perspectives shaped the model`;
    } else if (queryLower.includes('evaluation') || queryLower.includes('measure')) {
      response = `## CONTEXT & PROBLEM FRAMING

You're asking about program evaluation in the context of social impact. Evaluation is critical for demonstrating effectiveness, improving programs, and informing resource allocation decisions.

## EVIDENCE FROM LITERATURE

According to Riddell (2007) on foreign aid effectiveness and Guerrero (2021) on aid effectiveness more broadly, successful evaluation frameworks share several characteristics:

- **Alignment with program theory** - Evaluation should test the underlying logic of your program
- **Multi-dimensional assessment** - Consider outcomes across different time horizons
- **Mixed methods** - Combine quantitative and qualitative evidence
- **Stakeholder involvement** - Include beneficiaries in defining success criteria

## PRACTICAL GUIDANCE

**Types of Evaluation:**

1. **Formative Evaluation** (during implementation)
   - Improve program design and delivery
   - Identify needed adjustments

2. **Summative Evaluation** (after implementation)
   - Assess overall effectiveness
   - Inform decisions about continuation or scaling

**Key Evaluation Questions:**
- Did the program achieve its intended outcomes?
- Were outcomes achieved efficiently?
- What worked, what didn't, and why?
- What are the lessons for future programming?

## RISKS & EQUITY CONSIDERATIONS

**Risks:**
- Focusing only on easily measurable outcomes
- Evaluation fatigue among staff and participants
- Findings not being used to improve programming

**Equity:**
- Ensure evaluation captures differential impacts
- Include disaggregated data by demographic groups
- Center voices of marginalized communities in assessment`;
    } else {
      // General response for other queries
      response = `## CONTEXT & PROBLEM FRAMING

Thank you for your question about "${query}". This is an important consideration for effective social impact programming.

## EVIDENCE FROM LITERATURE

Research on social impact effectiveness (Hannum, 2003; Guerrero, 2021) emphasizes several key principles:

- **Context matters** - Programs must be designed with deep understanding of the local context
- **Sustainability focus** - Consider long-term viability from the start
- **Systems thinking** - Address root causes, not just symptoms
- **Stakeholder engagement** - Involve beneficiaries in design and implementation

## PRACTICAL GUIDANCE

Based on best practices in the field:

1. **Define clear objectives** - What specific change do you want to create?
2. **Understand your context** - Who are the stakeholders? What are the constraints?
3. **Develop your theory** - How will your intervention create the desired change?
4. **Plan for measurement** - How will you know if you're succeeding?
5. **Build in learning** - Create feedback loops for continuous improvement

## RISKS & EQUITY CONSIDERATIONS

**Risks:**
- Underestimating complexity of social change
- External factors beyond program control
- Sustainability challenges when funding ends

**Equity:**
- Consider differential impacts on various groups
- Address power imbalances in stakeholder engagement
- Ensure access and inclusion in program design`;
    }

    return response;
  }
}

// Singleton instance
let ragService: RAGService | null = null;

export function getRAGService(): RAGService {
  if (!ragService) {
    ragService = new RAGService();
  }
  return ragService;
}
