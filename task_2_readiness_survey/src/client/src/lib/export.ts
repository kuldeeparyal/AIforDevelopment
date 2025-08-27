import type { Assessment } from "@shared/schema";
import { getReadinessLevelInfo, getCategoryInfo, getCategoryStatus, getSpecificRecommendations } from "./scoring";

export function generateMarkdownReport(assessment: Assessment): string {
  const readinessInfo = getReadinessLevelInfo(assessment.readinessLevel);
  const categoryInfo = getCategoryInfo();
  
  let markdown = `# AI & Digital Transformation Readiness Assessment Report\n\n`;
  markdown += `## Executive Summary\n\n`;
  
  if (assessment.organizationName) {
    markdown += `**Organization:** ${assessment.organizationName}\n`;
  }
  if (assessment.contactEmail) {
    markdown += `**Contact:** ${assessment.contactEmail}\n`;
  }
  
  markdown += `**Overall Readiness Score:** ${assessment.overallScore}%\n`;
  markdown += `**Readiness Level:** ${assessment.readinessLevel}\n`;
  markdown += `**Assessment Date:** ${assessment.completedAt.toLocaleDateString()}\n\n`;
  markdown += `**Summary:** ${readinessInfo.summaryText}\n\n`;
  
  markdown += `## Category Breakdown\n\n`;
  
  Object.entries(assessment.categoryScores).forEach(([categoryId, score]) => {
    const category = categoryInfo[categoryId];
    if (category) {
      const status = getCategoryStatus(score);
      markdown += `### ${category.title}\n`;
      markdown += `- **Score:** ${score.toFixed(1)}/10 (${Math.round(score * 10)}%)\n`;
      markdown += `- **Status:** ${status.label}\n`;
      markdown += `- **Description:** ${category.description}\n\n`;
    }
  });
  
  markdown += `## Recommendations\n\n`;
  
  // Sort categories by priority (lowest scores first)
  const sortedCategories = Object.entries(assessment.categoryScores)
    .filter(([_, score]) => score < 7)
    .sort(([, a], [, b]) => a - b);

  if (sortedCategories.length === 0) {
    markdown += `Your organization demonstrates excellent readiness across all categories. `;
    markdown += `Continue to maintain these high standards and consider sharing your best practices with other organizations.\n\n`;
  } else {
    sortedCategories.forEach(([categoryId, score]) => {
      const category = categoryInfo[categoryId];
      if (category) {
        const priority = score < 5 ? 'High Priority' : 'Medium Priority';
        const recommendations = getSpecificRecommendations(categoryId, score);
        
        markdown += `### ${category.title} - ${priority}\n\n`;
        
        if (score < 5) {
          markdown += `**Critical Actions Needed:**\n`;
        } else {
          markdown += `**Improvement Opportunities:**\n`;
        }
        
        recommendations.forEach(rec => {
          markdown += `- ${rec}\n`;
        });
        markdown += `\n`;
      }
    });
  }
  
  markdown += `## Next Steps\n\n`;
  markdown += `1. **Review Priority Areas:** Focus on categories with scores below 5.0\n`;
  markdown += `2. **Develop Action Plan:** Create specific milestones for improvement\n`;
  markdown += `3. **Allocate Resources:** Ensure adequate budget and staffing for initiatives\n`;
  markdown += `4. **Monitor Progress:** Re-assess in 6 months to track improvements\n\n`;
  
  markdown += `### 90-Day Action Plan\n\n`;
  markdown += `**First 30 Days:**\n`;
  markdown += `- Conduct data quality assessment\n`;
  markdown += `- Form digital transformation committee\n`;
  markdown += `- Survey staff digital skill levels\n`;
  markdown += `- Research data governance frameworks\n\n`;
  
  markdown += `**Days 31-60:**\n`;
  markdown += `- Implement data governance policies\n`;
  markdown += `- Launch staff training program\n`;
  markdown += `- Pilot AI tool in one department\n`;
  markdown += `- Establish partnership with tech vendor\n\n`;
  
  markdown += `**Days 61-90:**\n`;
  markdown += `- Evaluate pilot project results\n`;
  markdown += `- Expand successful initiatives\n`;
  markdown += `- Document lessons learned\n`;
  markdown += `- Plan next phase of transformation\n\n`;
  
  markdown += `---\n\n`;
  markdown += `*Report generated on ${new Date().toLocaleDateString()} using the AI Readiness Assessment Tool*\n`;
  
  return markdown;
}
