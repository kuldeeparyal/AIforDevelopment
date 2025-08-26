import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Assessment } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

interface DetailedScoresProps {
  assessment: Assessment;
}

export default function DetailedScores({ assessment }: DetailedScoresProps) {
  const categoryDisplayNames: Record<string, string> = {
    'strategy_governance': 'Strategy & Governance',
    'data_tech_infrastructure': 'Data & Tech Infrastructure',
    'people_skills': 'People & Skills',
    'process_data_practices': 'Process & Data Practices',
    'ai_applications_risks': 'AI Applications & Risks'
  };

  const categoryIcons: Record<string, string> = {
    'strategy_governance': 'strategy',
    'data_tech_infrastructure': 'storage',
    'people_skills': 'groups',
    'process_data_practices': 'tune',
    'ai_applications_risks': 'smart_toy'
  };

  const categoryWeights: Record<string, number> = {
    'strategy_governance': 20,
    'data_tech_infrastructure': 25,
    'people_skills': 20,
    'process_data_practices': 15,
    'ai_applications_risks': 20
  };

  const getScoreColor = (score: number): string => {
    if (score >= 8) return "text-success";
    if (score >= 6) return "text-warning";
    if (score >= 4) return "text-orange-500";
    return "text-error";
  };

  const getProgressColor = (score: number): string => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    if (score >= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card className="mb-8" data-testid="detailed-scores-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="material-icons text-primary">analytics</span>
          Detailed Scores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Score Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Overall Readiness Score</h3>
                <p className="text-sm text-text-secondary mt-1">{assessment.readinessLevel}</p>
              </div>
              <div className="text-3xl font-bold text-primary">
                {assessment.overallScore}%
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 bg-gradient-to-r from-blue-500 to-primary rounded-full transition-all duration-500"
                style={{ width: `${assessment.overallScore}%` }}
              ></div>
            </div>
          </div>

          {/* Category Scores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(assessment.categoryScores).map(([categoryId, score]) => {
              const displayName = categoryDisplayNames[categoryId] || categoryId;
              const icon = categoryIcons[categoryId] || 'category';
              const weight = categoryWeights[categoryId] || 20;
              const scorePercentage = Math.round(score * 10); // Convert 0-10 to 0-100
              
              return (
                <div 
                  key={categoryId}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                  data-testid={`score-card-${categoryId}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-primary text-xl">{icon}</span>
                      <div>
                        <h4 className="font-medium text-text-primary">{displayName}</h4>
                        <p className="text-xs text-text-secondary">Weight: {weight}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                        {score.toFixed(1)}
                      </div>
                      <div className="text-xs text-text-secondary">out of 10</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(score)}`}
                        style={{ width: `${scorePercentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-text-secondary">
                      <span>Contribution: {Math.round(score * weight / 10 * 10) / 10} points</span>
                      <span>{scorePercentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Score Interpretation */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <span className="material-icons text-blue-600 dark:text-blue-400 text-sm mt-0.5">info</span>
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-medium mb-1">Score Interpretation:</p>
                <ul className="space-y-1 ml-4">
                  <li>• <span className="font-medium">8-10:</span> Strong capability, ready for advanced initiatives</li>
                  <li>• <span className="font-medium">6-7.9:</span> Good foundation with room for targeted improvements</li>
                  <li>• <span className="font-medium">4-5.9:</span> Developing capability, focus on strengthening fundamentals</li>
                  <li>• <span className="font-medium">0-3.9:</span> Early stage, requires foundational development</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}