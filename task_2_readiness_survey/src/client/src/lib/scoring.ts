import { ReadinessLevel } from "@shared/schema";

export interface ReadinessLevelInfo {
  level: string;
  name: string;
  description: string;
  summaryText: string;
}

export function getReadinessLevelInfo(readinessLevel: string): ReadinessLevelInfo {
  switch (readinessLevel) {
    case ReadinessLevel.ADVANCED:
      return {
        level: "Level 4",
        name: "Advanced",
        description: "AI-Ready",
        summaryText: "Your organization is highly ready to adopt AI initiatives with strong foundations across all areas."
      };
    case ReadinessLevel.DEVELOPING:
      return {
        level: "Level 3",
        name: "Developing",
        description: "Moderate Readiness",
        summaryText: "Your organization has moderate readiness with solid foundations but needs targeted improvements."
      };
    case ReadinessLevel.EMERGING:
      return {
        level: "Level 2",
        name: "Emerging", 
        description: "Limited Readiness",
        summaryText: "Your organization has limited readiness with some elements in place but many areas need development."
      };
    case ReadinessLevel.NEEDS_FOUNDATION:
      return {
        level: "Level 1",
        name: "Needs Foundation",
        description: "Unprepared",
        summaryText: "Your organization has significant gaps and needs to strengthen fundamental capacities before pursuing AI."
      };
    default:
      return {
        level: "Unknown",
        name: "Unknown",
        description: "Assessment incomplete",
        summaryText: "Readiness level assessment incomplete."
      };
  }
}

export function getCategoryInfo(): Record<string, { title: string, description: string, icon: string }> {
  return {
    strategy: {
      title: 'Strategy & Leadership',
      description: 'Leadership commitment and strategic planning for digital transformation',
      icon: 'business_center'
    },
    people: {
      title: 'People & Culture',
      description: 'Staff skills and organizational culture readiness',
      icon: 'people'
    },
    technology: {
      title: 'Technology & Infrastructure',
      description: 'IT systems, infrastructure, and digital tools',
      icon: 'computer'
    },
    data: {
      title: 'Data & Analytics',
      description: 'Data management and analysis capabilities',
      icon: 'analytics'
    },
    processes: {
      title: 'Processes & Governance',
      description: 'Operational processes and governance structures',
      icon: 'settings'
    },
    resources: {
      title: 'Resources & Partnerships',
      description: 'Budget allocation and external support systems',
      icon: 'account_balance'
    }
  };
}

export function getCategoryStatus(score: number): { label: string; color: "success" | "warning" | "error" } {
  if (score >= 7) {
    return { label: 'Strength', color: 'success' };
  }
  if (score >= 5) {
    return { label: 'Needs Improvement', color: 'warning' };
  }
  return { label: 'Area of Concern', color: 'error' };
}

export function getSpecificRecommendations(categoryId: string, score: number): string[] {
  const recommendations: Record<string, string[]> = {
    strategy: [
      'Develop a formal digital transformation strategy aligned with organizational mission',
      'Secure leadership buy-in through board workshops on AI opportunities',
      'Establish governance committee to oversee digital initiatives',
      'Create change management protocols for technology adoption'
    ],
    people: [
      'Implement structured digital literacy training programs',
      'Create innovation incentives and recognition systems',
      'Hire or train digital champions within teams',
      'Foster culture of experimentation and continuous learning'
    ],
    technology: [
      'Upgrade critical IT infrastructure and connectivity',
      'Implement comprehensive cybersecurity measures',
      'Adopt modern software platforms and tools',
      'Establish reliable technical support systems'
    ],
    data: [
      'Develop data governance framework and policies',
      'Conduct data quality audit and cleanup initiative',
      'Implement centralized data management system',
      'Train staff on data analysis and visualization tools'
    ],
    processes: [
      'Digitize key operational processes and workflows',
      'Establish formal governance structures for technology',
      'Develop agile project management capabilities',
      'Create policies for ethical AI use and data protection'
    ],
    resources: [
      'Allocate dedicated budget for digital initiatives',
      'Develop partnerships with technology providers',
      'Hire dedicated IT/data personnel or consultants',
      'Create sustainability plan for scaling successful projects'
    ]
  };
  
  return recommendations[categoryId] || [];
}
