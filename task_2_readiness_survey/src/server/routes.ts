import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { surveyResponseSchema, insertAssessmentSchema, ReadinessLevel, type Assessment } from "@shared/schema";
import { z } from "zod";
import { analyzeTextResponses, generateCustomSummary, type TextAnalysisResult } from "./openai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get survey configuration (categories and questions)
  app.get("/api/survey-config", async (req, res) => {
    try {
      const categoriesWithQuestions = await storage.getCategoriesWithQuestions();
      res.json({ categories: categoriesWithQuestions });
    } catch (error) {
      console.error("Error fetching survey config:", error);
      res.status(500).json({ message: "Failed to fetch survey configuration" });
    }
  });

  // Submit survey responses and calculate scores
  app.post("/api/assessments", async (req, res) => {
    try {
      const surveyData = surveyResponseSchema.parse(req.body);
      
      // Calculate category scores and overall score
      const categoryScores = calculateCategoryScores(surveyData.responses);
      const overallScore = Math.round(calculateOverallScore(categoryScores));
      const readinessLevel = determineReadinessLevel(overallScore);
      
      // Extract text responses for AI analysis
      const textResponses: Record<string, string> = {};
      Object.entries(surveyData.responses).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim()) {
          textResponses[key] = value;
        }
      });
      
      // Analyze text responses with AI if any exist
      let aiAnalysis: TextAnalysisResult | null = null;
      let customSummary: string | null = null;
      
      if (Object.keys(textResponses).length > 0) {
        try {
          aiAnalysis = await analyzeTextResponses(textResponses, categoryScores, overallScore, surveyData.organizationName);
          customSummary = await generateCustomSummary(categoryScores, overallScore, readinessLevel, aiAnalysis, surveyData.organizationName);
        } catch (error) {
          console.error("AI analysis error:", error);
          // Continue without AI analysis if it fails
        }
      }
      
      const assessmentData = {
        organizationName: surveyData.organizationName,
        contactEmail: surveyData.contactEmail,
        responses: surveyData.responses,
        categoryScores,
        overallScore,
        readinessLevel,
        aiAnalysis: aiAnalysis || undefined,
        customSummary: customSummary || undefined,
      };

      const validatedData = insertAssessmentSchema.parse(assessmentData);
      const assessment = await storage.createAssessment(validatedData);
      
      res.json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid survey data", errors: error.errors });
        return;
      }
      res.status(500).json({ message: "Failed to process assessment" });
    }
  });

  // Get assessment results by ID
  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const assessment = await storage.getAssessment(id);
      
      if (!assessment) {
        res.status(404).json({ message: "Assessment not found" });
        return;
      }
      
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve assessment" });
    }
  });

  // Export assessment as Markdown
  app.get("/api/assessments/:id/export", async (req, res) => {
    try {
      const { id } = req.params;
      const assessment = await storage.getAssessment(id);
      
      if (!assessment) {
        res.status(404).json({ message: "Assessment not found" });
        return;
      }
      
      const markdown = generateMarkdownReport(assessment);
      
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', `attachment; filename="ai-readiness-assessment-${id}.md"`);
      res.send(markdown);
    } catch (error) {
      res.status(500).json({ message: "Failed to export assessment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for scoring logic
function calculateCategoryScores(responses: Record<string, number | string>): Record<string, number> {
  // Enhanced category weights
  const categoryWeights = {
    'strategy_governance': 0.20,
    'data_tech_infrastructure': 0.25,
    'people_skills': 0.20,
    'process_data_practices': 0.15,
    'ai_applications_risks': 0.20
  };

  const scores: Record<string, number> = {};
  
  // Get categories from storage and calculate scores
  // For now, we'll use a simplified approach
  // In production, this would fetch from database
  const categoryQuestions: Record<string, string[]> = {
    'strategy_governance': ['leadership_support', 'digital_strategy', 'change_management'],
    'data_tech_infrastructure': ['it_infrastructure', 'digital_tools', 'cybersecurity'],
    'people_skills': ['staff_skills', 'training_programs', 'innovation_culture'],
    'process_data_practices': ['data_collection', 'data_quality', 'analytics_capability', 'process_digitization', 'governance_policies', 'agile_processes'],
    'ai_applications_risks': ['budget_allocation', 'technical_expertise', 'external_partnerships']
  };
  
  Object.entries(categoryQuestions).forEach(([category, questions]) => {
    const categoryResponses = questions
      .map(q => {
        const response = responses[q];
        // Only include numeric responses in scoring
        return typeof response === 'number' ? response : null;
      })
      .filter((score): score is number => score !== null);
    
    if (categoryResponses.length > 0) {
      scores[category] = categoryResponses.reduce((sum, score) => sum + score, 0) / categoryResponses.length;
    } else {
      scores[category] = 0;
    }
  });

  return scores;
}

function calculateOverallScore(categoryScores: Record<string, number>): number {
  const scores = Object.values(categoryScores);
  if (scores.length === 0) return 0;
  
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return average * 10; // Convert to percentage (0-100)
}

function determineReadinessLevel(percentage: number): string {
  if (percentage >= 86) {
    return ReadinessLevel.ADVANCED;
  } else if (percentage >= 61) {
    return ReadinessLevel.DEVELOPING;
  } else if (percentage >= 31) {
    return ReadinessLevel.EMERGING;
  } else {
    return ReadinessLevel.NEEDS_FOUNDATION;
  }
}

function generateMarkdownReport(assessment: Assessment): string {
  const readinessLevelInfo = getReadinessLevelInfo(assessment.readinessLevel);
  
  let markdown = `# AI & Digital Transformation Readiness Assessment Report\n\n`;
  markdown += `## Executive Summary\n\n`;
  markdown += `**Organization:** ${assessment.organizationName || 'Anonymous'}\n`;
  markdown += `**Overall Readiness Score:** ${assessment.overallScore}%\n`;
  markdown += `**Readiness Level:** ${assessment.readinessLevel}\n`;
  markdown += `**Assessment Date:** ${assessment.completedAt.toLocaleDateString()}\n\n`;
  markdown += `**Summary:** ${readinessLevelInfo.description}\n\n`;
  
  markdown += `## Category Breakdown\n\n`;
  
  const categoryInfo = getCategoryInfo();
  Object.entries(assessment.categoryScores).forEach(([categoryId, score]) => {
    const category = categoryInfo[categoryId];
    if (category && typeof score === 'number') {
      const status = getCategoryStatus(score);
      markdown += `### ${category.title}\n`;
      markdown += `- **Score:** ${score.toFixed(1)}/10 (${Math.round(score * 10)}%)\n`;
      markdown += `- **Status:** ${status}\n`;
      markdown += `- **Description:** ${category.description}\n\n`;
    }
  });
  
  markdown += `## Recommendations\n\n`;
  markdown += generateRecommendations(assessment.categoryScores);
  
  markdown += `## Next Steps\n\n`;
  markdown += `1. **Review Priority Areas:** Focus on categories with scores below 5.0\n`;
  markdown += `2. **Develop Action Plan:** Create specific milestones for improvement\n`;
  markdown += `3. **Allocate Resources:** Ensure adequate budget and staffing for initiatives\n`;
  markdown += `4. **Monitor Progress:** Re-assess in 6 months to track improvements\n\n`;
  
  markdown += `---\n\n`;
  markdown += `*Report generated on ${new Date().toLocaleDateString()} using the AI Readiness Assessment Tool*\n`;
  
  return markdown;
}

function getReadinessLevelInfo(level: string) {
  switch (level) {
    case ReadinessLevel.ADVANCED:
      return { description: 'Your organization is highly ready to adopt AI initiatives with strong foundations across all areas.' };
    case ReadinessLevel.DEVELOPING:
      return { description: 'Your organization has moderate readiness with solid foundations but needs targeted improvements.' };
    case ReadinessLevel.EMERGING:
      return { description: 'Your organization has limited readiness with some elements in place but many areas need development.' };
    case ReadinessLevel.NEEDS_FOUNDATION:
      return { description: 'Your organization has significant gaps and needs to strengthen fundamental capacities before pursuing AI.' };
    default:
      return { description: 'Readiness level assessment complete.' };
  }
}

function getCategoryInfo(): Record<string, { title: string, description: string }> {
  return {
    strategy: {
      title: 'Strategy & Leadership',
      description: 'Leadership commitment and strategic planning for digital transformation'
    },
    people: {
      title: 'People & Culture',
      description: 'Staff skills and organizational culture readiness'
    },
    technology: {
      title: 'Technology & Infrastructure',
      description: 'IT systems, infrastructure, and digital tools'
    },
    data: {
      title: 'Data & Analytics',
      description: 'Data management and analysis capabilities'
    },
    processes: {
      title: 'Processes & Governance',
      description: 'Operational processes and governance structures'
    },
    resources: {
      title: 'Resources & Partnerships',
      description: 'Budget allocation and external support systems'
    }
  };
}

function getCategoryStatus(score: number): string {
  if (score >= 7) return 'Strength';
  if (score >= 5) return 'Needs Improvement';
  return 'Area of Concern';
}

function generateRecommendations(categoryScores: Record<string, number>): string {
  let recommendations = '';
  
  Object.entries(categoryScores).forEach(([categoryId, score]) => {
    const category = getCategoryInfo()[categoryId];
    if (!category) return;
    
    if (score < 7) {
      const priority = score < 5 ? 'High Priority' : 'Medium Priority';
      recommendations += `### ${category.title} - ${priority}\n\n`;
      
      if (score < 5) {
        recommendations += `**Critical Actions Needed:**\n`;
      } else {
        recommendations += `**Improvement Opportunities:**\n`;
      }
      
      // Add category-specific recommendations
      recommendations += getSpecificRecommendations(categoryId, score);
      recommendations += `\n\n`;
    }
  });
  
  return recommendations;
}

function getSpecificRecommendations(categoryId: string, score: number): string {
  const recommendations = {
    strategy: [
      '- Develop a formal digital transformation strategy aligned with organizational mission',
      '- Secure leadership buy-in through board workshops on AI opportunities',
      '- Establish governance committee to oversee digital initiatives',
      '- Create change management protocols for technology adoption'
    ],
    people: [
      '- Implement structured digital literacy training programs',
      '- Create innovation incentives and recognition systems',
      '- Hire or train digital champions within teams',
      '- Foster culture of experimentation and continuous learning'
    ],
    technology: [
      '- Upgrade critical IT infrastructure and connectivity',
      '- Implement comprehensive cybersecurity measures',
      '- Adopt modern software platforms and tools',
      '- Establish reliable technical support systems'
    ],
    data: [
      '- Develop data governance framework and policies',
      '- Conduct data quality audit and cleanup initiative',
      '- Implement centralized data management system',
      '- Train staff on data analysis and visualization tools'
    ],
    processes: [
      '- Digitize key operational processes and workflows',
      '- Establish formal governance structures for technology',
      '- Develop agile project management capabilities',
      '- Create policies for ethical AI use and data protection'
    ],
    resources: [
      '- Allocate dedicated budget for digital initiatives',
      '- Develop partnerships with technology providers',
      '- Hire dedicated IT/data personnel or consultants',
      '- Create sustainability plan for scaling successful projects'
    ]
  };
  
  return (recommendations[categoryId as keyof typeof recommendations] || []).join('\n');
}
