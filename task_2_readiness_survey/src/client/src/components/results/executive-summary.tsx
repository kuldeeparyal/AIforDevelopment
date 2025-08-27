import { Card, CardContent } from "@/components/ui/card";
import { getReadinessLevelInfo } from "@/lib/scoring";
import type { Assessment } from "@shared/schema";

interface ExecutiveSummaryProps {
  assessment: Assessment;
}

export default function ExecutiveSummary({ assessment }: ExecutiveSummaryProps) {
  const readinessInfo = getReadinessLevelInfo(assessment.readinessLevel);
  const recommendationCount = Object.values(assessment.categoryScores).filter(score => score < 7).length * 3;
  const hasCustomSummary = assessment.customSummary && assessment.customSummary.length > 0;
  const hasAIInsights = assessment.aiAnalysis && assessment.aiAnalysis.insights;

  return (
    <Card className="shadow-material p-8 mb-8">
      <CardContent className="p-0">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-success to-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="material-icons text-white text-3xl">verified</span>
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">Assessment Complete</h2>
          <p className="text-lg text-text-secondary">Your AI & Digital Transformation Readiness Report</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
            <div 
              className="text-4xl font-bold text-primary mb-2"
              data-testid="text-overall-score"
            >
              {assessment.overallScore}%
            </div>
            <div className="text-lg font-medium text-text-primary mb-1">Overall Readiness</div>
            <div className="text-sm text-text-secondary">{readinessInfo.name}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
            <div 
              className="text-2xl font-bold text-success mb-2"
              data-testid="text-readiness-level"
            >
              {readinessInfo.level}
            </div>
            <div className="text-lg font-medium text-text-primary mb-1">{readinessInfo.name}</div>
            <div className="text-sm text-text-secondary">{readinessInfo.description}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
            <div 
              className="text-2xl font-bold text-purple-600 mb-2"
              data-testid="text-recommendation-count"
            >
              {recommendationCount}
            </div>
            <div className="text-lg font-medium text-text-primary mb-1">Recommendations</div>
            <div className="text-sm text-text-secondary">Actionable insights</div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            {hasCustomSummary && <span className="material-icons text-blue-600 dark:text-blue-400 text-lg">auto_awesome</span>}
            Executive Summary
          </h3>
          
          {hasCustomSummary ? (
            <div className="space-y-4">
              {/* AI-Generated Custom Summary */}
              <div className="text-blue-800 dark:text-blue-200 leading-relaxed whitespace-pre-line" data-testid="text-executive-summary">
                {assessment.customSummary}
              </div>
              
              {/* AI Insights if available */}
              {hasAIInsights && assessment.aiAnalysis!.insights.length > 0 && (
                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Key Insights from Your Responses:</h4>
                  <ul className="space-y-2">
                    {assessment.aiAnalysis!.insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                        <span className="material-icons text-blue-600 dark:text-blue-400 text-xs mt-0.5">insights</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-blue-800 dark:text-blue-200 leading-relaxed" data-testid="text-executive-summary">
              Your organization demonstrates <strong>{readinessInfo.name} digital/AI readiness ({assessment.overallScore}%)</strong>. 
              {readinessInfo.summaryText} {assessment.organizationName && `As ${assessment.organizationName}, you have `}
              {assessment.overallScore >= 70 ? "established strong foundations across most areas." : 
               assessment.overallScore >= 50 ? "some solid foundations but need targeted improvements." :
               "significant opportunities for improvement across key readiness areas."}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
