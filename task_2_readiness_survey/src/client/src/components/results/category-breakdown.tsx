import { Card, CardContent } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";
import { getCategoryInfo, getCategoryStatus } from "@/lib/scoring";
import type { Assessment } from "@shared/schema";

interface CategoryBreakdownProps {
  assessment: Assessment;
}

export default function CategoryBreakdown({ assessment }: CategoryBreakdownProps) {
  const categoryInfo = getCategoryInfo();
  
  // Prepare data for radar chart
  const radarData = Object.entries(assessment.categoryScores).map(([categoryId, score]) => ({
    category: categoryInfo[categoryId]?.title || categoryId,
    score: score,
    baseline: 5, // Baseline average
  }));

  return (
    <div className="grid lg:grid-cols-2 gap-8 mb-8">
      {/* Score Visualization */}
      <Card className="shadow-material p-6">
        <CardContent className="p-0">
          <h3 className="text-xl font-bold text-text-primary mb-6">Category Performance</h3>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12, fill: '#757575' }}
                  className="text-xs"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 10]} 
                  tick={{ fontSize: 10, fill: '#757575' }}
                />
                <Radar
                  name="Your Organization"
                  dataKey="score"
                  stroke="hsl(207, 90%, 54%)"
                  fill="hsl(207, 90%, 54%)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ fill: 'hsl(207, 90%, 54%)', strokeWidth: 2, r: 4 }}
                />
                <Radar
                  name="Baseline Average"
                  dataKey="baseline"
                  stroke="#E0E0E0"
                  fill="#E0E0E0"
                  fillOpacity={0.1}
                  strokeWidth={1}
                  dot={{ fill: '#E0E0E0', strokeWidth: 1, r: 2 }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <Card className="shadow-material p-6">
        <CardContent className="p-0">
          <h3 className="text-xl font-bold text-text-primary mb-6">Detailed Scores</h3>
          <div className="space-y-4">
            {Object.entries(assessment.categoryScores).map(([categoryId, score]) => {
              const category = categoryInfo[categoryId];
              const status = getCategoryStatus(score);
              
              if (!category) return null;

              return (
                <div key={categoryId} className="animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="material-icons text-primary">{category.icon}</span>
                      <span className="font-medium text-text-primary">{category.title}</span>
                    </div>
                    <span 
                      className="text-lg font-bold text-text-primary"
                      data-testid={`score-${categoryId}`}
                    >
                      {score.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          status.color === "success" ? "bg-success" :
                          status.color === "warning" ? "bg-warning" :
                          "bg-error"
                        }`}
                        style={{ width: `${score * 10}%` }}
                        data-testid={`progress-${categoryId}`}
                      />
                    </div>
                    <span 
                      className={`text-sm font-medium ${
                        status.color === "success" ? "text-success" :
                        status.color === "warning" ? "text-warning" :
                        "text-error"
                      }`}
                      data-testid={`status-${categoryId}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
