export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: number;
}

export interface Source {
  id: string;
  title: string;
  author?: string;
  year?: string;
  chunk?: string;
  similarity?: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
}

export interface ChatRequest {
  message: string;
  history?: Message[];
}

export interface ChatResponse {
  message: string;
  sources: Source[];
}

export interface StructuredResponse {
  contextAndFraming: string;
  evidence: string;
  practicalGuidance: string;
  risksAndEquity: string;
  sources: Source[];
}
