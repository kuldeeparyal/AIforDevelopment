import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ExecutiveSummary from "@/components/results/executive-summary";
import CategoryBreakdown from "@/components/results/category-breakdown";
import DetailedScores from "@/components/results/detailed-scores";
import Recommendations from "@/components/results/recommendations";
import ActionPlan from "@/components/results/action-plan";
import { Card, CardContent } from "@/components/ui/card";
import type { Assessment } from "@shared/schema";

export default function Results() {
  const { id } = useParams();
  
  const { data: assessment, isLoading, error } = useQuery<Assessment>({
    queryKey: ["/api/assessments", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-error text-2xl">error_outline</span>
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Assessment Not Found</h2>
            <p className="text-text-secondary mb-4">
              The assessment you're looking for could not be found or may have expired.
            </p>
            <button 
              onClick={() => window.location.href = "/"}
              className="btn-primary"
              data-testid="button-return-home"
            >
              Return Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ExecutiveSummary assessment={assessment} />
      <DetailedScores assessment={assessment} />
      <CategoryBreakdown assessment={assessment} />
      <Recommendations assessment={assessment} />
      <ActionPlan assessment={assessment} />
    </div>
  );
}
