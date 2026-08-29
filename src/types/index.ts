export type DsaLevel = 'newbie' | 'intermediate' | 'pro';

export type TrackLevel = 'beginner' | 'intermediate' | 'pro';

export type TutorTone = 'balanced' | 'savage' | 'socratic' | 'friendly';

export type PracticeMode = 'solve' | 'hint' | 'explain' | 'interview' | 'timed';

export type ProblemDifficulty = 'easy' | 'medium' | 'hard';

export interface CodeSnippet {
  language: 'javascript' | 'python' | 'cpp' | 'java';
  code: string;
}

export interface TopicPattern {
  name: string;
  description: string;
  exampleProblem: string;
}

export interface YouTubeResource {
  id: string;
  title: string;
  creator: string;
  channelName: string;
  description: string;
  duration: string;
  whyRecommended: string;
  searchQuery: string;
  topicId: string;
  difficulty: ProblemDifficulty;
}

export interface DsaTopic {
  id: string;
  title: string;
  category: string;
  trackLevel: 'beginner' | 'intermediate' | 'pro';
  order: number;
  description: string;
  prerequisites: string[];
  concept: string;
  whyItMatters: string;
  visualDiagram?: string;
  visualExplanation: string;
  timeComplexity: {
    best?: string;
    average: string;
    worst: string;
    description: string;
  };
  spaceComplexity: {
    worst: string;
    description: string;
  };
  codeSnippets: Record<'javascript' | 'python' | 'cpp' | 'java', string>;
  commonMistakes: string[];
  patterns: TopicPattern[];
  practiceProblemIds: string[];
  recommendedResources: YouTubeResource[];
}

export interface PracticeProblem {
  id: string;
  title: string;
  topicId: string;
  topicName: string;
  difficulty: ProblemDifficulty;
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: Record<'javascript' | 'python' | 'cpp' | 'java', string>;
  progressiveHints: string[];
  solutionExplanation: string;
  expectedComplexity: {
    time: string;
    space: string;
  };
  tags: string[];
}

export interface AssessmentQuestion {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  codeSnippet?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  testedConcept: string;
}

export interface AssessmentResult {
  score: number;
  totalQuestions: number;
  level: DsaLevel;
  strengths: string[];
  weaknesses: string[];
  recommendedStartingTopicId: string;
  recommendedStartingTopicName: string;
  recommendations: string[];
  breakdown: {
    topic: string;
    correct: boolean;
    difficulty: string;
  }[];
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string | number;
  roastLevel?: string;
  topicId?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  isRoast?: boolean;
}

export interface SolvedProblemRecord {
  problemId: string;
  problemTitle: string;
  difficulty: ProblemDifficulty;
  topicId: string;
  solvedAt: string;
  timeSpentSeconds: number;
  mode: PracticeMode;
}

export interface UserProfile {
  id: string;
  name: string;
  level: DsaLevel;
  preferredLanguage: 'javascript' | 'python' | 'cpp' | 'java';
  activeTrack: 'beginner' | 'intermediate' | 'pro';
  completedTopicIds: string[];
  solvedProblems: SolvedProblemRecord[];
  streakDays: number;
  lastActiveDate: string;
  assessmentResult: AssessmentResult | null;
  weakTopics: string[];
  strongTopics: string[];
  currentTopicId: string;
  tutorTone: TutorTone;
  dailyGoalProblems: number;
}

export interface InterviewMessage {
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: number | string;
  phase?: 'problem' | 'clarification' | 'coding' | 'complexity' | 'evaluation';
}

export interface InterviewEvaluation {
  overallScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  complexityScore: number;
  optimizationScore: number;
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  interviewerVerdict: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs More Practice' | 'Cooked (Roast)' | string;
  detailedFeedback: string;
}

export interface CodeAnalysisResult {
  overview: string;
  lineByLine: {
    line: string;
    explanation: string;
  }[];
  underlyingAlgorithm: string;
  timeComplexity: string;
  spaceComplexity: string;
  bugsAndEdgeCases: string[];
  improvements: string[];
  optimizedCode?: string;
  roastVerdict?: string;
}
