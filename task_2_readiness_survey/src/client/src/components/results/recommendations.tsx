import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryInfo, getSpecificRecommendations, getCategoryStatus } from "@/lib/scoring";
import type { Assessment } from "@shared/schema";

interface RecommendationsProps {
  assessment: Assessment;
}

export default function Recommendations({ assessment }: RecommendationsProps) {
  const categoryInfo = getCategoryInfo();
  
  // Check if AI analysis is available
  const hasAIAnalysis = assessment.aiAnalysis && assessment.aiAnalysis.recommendations && assessment.aiAnalysis.recommendations.length > 0;
  
  // Sort categories by priority (lowest scores first)
  const sortedCategories = Object.entries(assessment.categoryScores)
    .filter(([_, score]) => score < 7)
    .sort(([, a], [, b]) => a - b);

  return (
    <Card className="mb-8" data-testid="recommendations-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="material-icons text-primary">lightbulb</span>
          Recommendations & Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* AI-Powered Recommendations if available */}
        {hasAIAnalysis && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3 mb-4">
                <span className="material-icons text-blue-600 dark:text-blue-400">auto_awesome</span>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    AI-Powered Strategic Recommendations
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                    Based on your qualitative responses and assessment scores, here are personalized recommendations:
                  </p>
                  <div className="space-y-3">
                    {assessment.aiAnalysis!.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="material-icons text-blue-600 dark:text-blue-400 text-sm mt-0.5">
                          arrow_forward
                        </span>
                        <p className="text-sm text-blue-900 dark:text-blue-100">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            {assessment.aiAnalysis && assessment.aiAnalysis.insights && assessment.aiAnalysis.insights.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h5 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                    <span className="material-icons text-green-600 dark:text-green-400 text-sm">verified</span>
                    Key Strengths
                  </h5>
                  <ul className="space-y-2">
                    {assessment.aiAnalysis!.strengths?.map((strength, index) => (
                      <li key={index} className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                        <span>•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                  <h5 className="font-medium text-orange-900 dark:text-orange-100 mb-2 flex items-center gap-2">
                    <span className="material-icons text-orange-600 dark:text-orange-400 text-sm">warning</span>
                    Critical Gaps
                  </h5>
                  <ul className="space-y-2">
                    {assessment.aiAnalysis!.gaps?.map((gap, index) => (
                      <li key={index} className="text-sm text-orange-800 dark:text-orange-200 flex items-start gap-2">
                        <span>•</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Category-Specific Recommendations */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-text-primary">Category-Specific Actions</h4>
          
          {sortedCategories.length === 0 ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <span className="material-icons text-white text-sm">check_circle</span>
                  </div>
                </div>
                <div>
                  <h5 className="text-lg font-bold text-green-900 dark:text-green-100">Excellent Readiness!</h5>
                  <p className="text-green-800 dark:text-green-200 mt-2">
                    Your organization shows strong performance across all categories. 
                    Focus on maintaining these high standards and consider sharing your best practices with other organizations.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedCategories.map(([categoryId, score]) => {
                const category = categoryInfo[categoryId];
                const recommendations = getSpecificRecommendations(categoryId, score);
                
                if (!category) return null;

                const priorityLevel = score < 5 ? "High Priority" : "Medium Priority";
                const priorityColor = score < 5 ? "red" : "yellow";

                return (
                  <div 
                    key={categoryId}
                    className={`border-l-4 ${
                      priorityColor === "red" ? "border-error" : "border-warning"
                    } bg-white dark:bg-gray-800 p-4 rounded-r-lg shadow-sm`}
                    data-testid={`recommendation-${categoryId}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          priorityColor === "red" ? "bg-error" : "bg-warning"
                        }`}>
                          <span className="material-icons text-white text-sm">
                            {priorityColor === "red" ? "priority_high" : "warning"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-semibold text-text-primary">
                            {category.title}
                          </h5>
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                            priorityColor === "red" 
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}>
                            {priorityLevel}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-text-secondary">
                            Score: {score.toFixed(1)}/10 - {score < 5 
                              ? `Critical improvements needed`
                              : `Good foundation with room for growth`
                            }
                          </p>
                          
                          <div className="pl-4 space-y-1">
                            {recommendations.map((rec, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                                <span className="text-primary mt-0.5">→</span>
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Implementation Timeline */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="material-icons text-primary">schedule</span>
            Suggested Implementation Timeline
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-20 text-sm font-medium text-primary">0-3 months</div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary">
                  Address high-priority gaps, establish governance structures, begin staff training
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-20 text-sm font-medium text-blue-600">3-6 months</div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary">
                  Implement medium-priority improvements, pilot AI tools, enhance data practices
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-20 text-sm font-medium text-green-600">6-12 months</div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary">
                  Scale successful initiatives, measure impact, refine strategies, share learnings
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}