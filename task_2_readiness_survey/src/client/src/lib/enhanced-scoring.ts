import { ReadinessLevel } from "@shared/schema";

// Category weights for overall scoring
const CATEGORY_WEIGHTS = {
  'strategy_governance': 0.20,
  'data_tech_infrastructure': 0.25,
  'people_skills': 0.20,
  'process_data_practices': 0.15,
  'ai_applications_risks': 0.20
};

interface Question {
  id: string;
  type: string;
  categoryId?: string;
}

interface Category {
  id: string;
  questions: Question[];
}

export function calculateEnhancedCategoryScores(
  responses: Record<string, number | string>,
  categories: Category[]
): Record<string, number> {
  const scores: Record<string, number> = {};

  categories.forEach(category => {
    const categoryQuestions = category.questions.filter(q => 
      responses[q.id] !== undefined && q.type !== 'text'
    );
    
    if (categoryQuestions.length === 0) {
      scores[category.id] = 0;
      return;
    }

    const categoryResponses = categoryQuestions
      .map(q => {
        const response = responses[q.id];
        return typeof response === 'number' ? response : 0;
      })
      .filter(score => !isNaN(score));

    if (categoryResponses.length > 0) {
      const average = categoryResponses.reduce((sum, score) => sum + score, 0) / categoryResponses.length;
      scores[category.id] = Math.round(average * 10) / 10; // Round to 1 decimal
    } else {
      scores[category.id] = 0;
    }
  });

  return scores;
}

export function calculateEnhancedOverallScore(categoryScores: Record<string, number>): number {
  let weightedSum = 0;
  let totalWeight = 0;

  Object.entries(categoryScores).forEach(([categoryId, score]) => {
    const weight = CATEGORY_WEIGHTS[categoryId as keyof typeof CATEGORY_WEIGHTS] || 0.2;
    weightedSum += score * weight;
    totalWeight += weight;
  });

  if (totalWeight === 0) return 0;
  
  // Convert from 0-10 scale to 0-100 percentage
  const percentage = (weightedSum / totalWeight) * 10;
  return Math.round(percentage);
}

export function determineEnhancedReadinessLevel(percentage: number): string {
  if (percentage >= 86) {
    return "Level 4 - Advanced";
  } else if (percentage >= 61) {
    return "Level 3 - Developing";
  } else if (percentage >= 31) {
    return "Level 2 - Emerging";
  } else {
    return "Level 1 - Needs Foundation";
  }
}

export function getReadinessLevelDescription(level: string): string {
  switch (level) {
    case "Level 4 - Advanced":
      return "Your organization is highly ready to adopt AI initiatives with strong foundations across all areas.";
    case "Level 3 - Developing":
      return "Your organization has moderate readiness with solid foundations but needs targeted improvements.";
    case "Level 2 - Emerging":
      return "Your organization has limited readiness with some elements in place but many areas need development.";
    case "Level 1 - Needs Foundation":
      return "Your organization has significant gaps and needs to strengthen fundamental capacities before pursuing AI.";
    default:
      return "Readiness level assessment complete.";
  }
}

export function getCategoryRecommendations(categoryId: string, score: number): string[] {
  const recommendations: Record<string, string[]> = {
    'strategy_governance': [
      'Develop a formal digital transformation strategy aligned with organizational mission',
      'Secure leadership buy-in through board workshops on AI opportunities',
      'Establish governance committee to oversee digital initiatives',
      'Create change management protocols for technology adoption',
      'Develop policies for ethical AI and responsible data use'
    ],
    'data_tech_infrastructure': [
      'Upgrade critical IT infrastructure and connectivity',
      'Implement comprehensive cybersecurity measures',
      'Adopt modern software platforms and tools',
      'Establish reliable technical support systems',
      'Create centralized data management systems'
    ],
    'people_skills': [
      'Implement structured digital literacy training programs',
      'Create innovation incentives and recognition systems',
      'Hire or train digital champions within teams',
      'Foster culture of experimentation and continuous learning',
      'Build partnerships with technical experts or consultants'
    ],
    'process_data_practices': [
      'Digitize key operational processes and workflows',
      'Establish formal governance structures for technology',
      'Develop agile project management capabilities',
      'Create policies for data-driven decision making',
      'Standardize data collection and reporting processes'
    ],
    'ai_applications_risks': [
      'Pilot AI tools in low-risk areas to build experience',
      'Develop AI ethics guidelines and risk management protocols',
      'Build awareness of AI opportunities through workshops',
      'Create partnerships with AI vendors or consultants',
      'Establish metrics to measure AI impact and ROI'
    ]
  };

  const categoryRecs = recommendations[categoryId] || [];
  
  // Return different recommendations based on score
  if (score < 3) {
    return categoryRecs.slice(0, 3); // Critical actions for low scores
  } else if (score < 7) {
    return categoryRecs.slice(1, 4); // Improvement opportunities for mid scores
  } else {
    return categoryRecs.slice(3, 5); // Advanced recommendations for high scores
  }
}