import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import ProgressStepper from "@/components/survey/progress-stepper";
import QuestionCard from "@/components/survey/question-card";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Assessment, Category, Question } from "@shared/schema";

interface SurveyConfig {
  categories: (Category & { questions: Question[] })[];
}

export default function Survey() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, number | string>>({});
  const [organizationName, setOrganizationName] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  // Fetch survey configuration from database
  const surveyQuery = useQuery({
    queryKey: ["/api/survey-config"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/survey-config");
      return res.json() as Promise<SurveyConfig>;
    },
  });

  const submitAssessment = useMutation({
    mutationFn: async (data: { 
      responses: Record<string, number | string>;
      organizationName?: string;
      contactEmail?: string;
    }) => {
      const res = await apiRequest("POST", "/api/assessments", data);
      return res.json() as Promise<Assessment>;
    },
    onSuccess: (assessment) => {
      toast({
        title: "Assessment Complete!",
        description: "Your readiness report has been generated.",
      });
      navigate(`/results/${assessment.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (surveyQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (surveyQuery.error || !surveyQuery.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load assessment</p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </div>
    );
  }

  const { categories } = surveyQuery.data;
  const currentCategory = categories[currentStep];
  const totalSteps = categories.length;
  const isLastStep = currentStep === totalSteps - 1;

  const handleResponseChange = (questionId: string, value: number | string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (isLastStep) {
      submitAssessment.mutate({
        responses,
        organizationName: organizationName || undefined,
        contactEmail: contactEmail || undefined,
      });
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    // Check if all non-conditional questions in current category are answered
    const visibleQuestions = getVisibleQuestions(currentCategory.questions);
    return visibleQuestions.every(q => {
      if (q.type === 'text') {
        // Text questions should have at least some content
        return responses[q.id] && (responses[q.id] as string).trim().length > 0;
      }
      return responses[q.id] !== undefined;
    });
  };

  const getVisibleQuestions = (questions: any[]) => {
    return questions.filter(q => {
      // If no conditional dependency, always show
      if (!q.conditionalOn) return true;
      
      // Check if conditional question should be shown
      const triggerValue = responses[q.conditionalOn];
      if (triggerValue === undefined) return false;
      
      // Check if the trigger value matches the conditional value
      if (Array.isArray(q.conditionalValue)) {
        return q.conditionalValue.includes(triggerValue);
      }
      return triggerValue === q.conditionalValue;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProgressStepper
        currentStep={currentStep}
        totalSteps={totalSteps}
        categories={categories}
      />

      <Card className="shadow-md p-6 bg-white border border-gray-200">
        <CardContent className="p-0">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="material-icons text-white text-lg">{currentCategory.icon}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{currentCategory.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{currentCategory.description}</p>
            </div>
          </div>

          {/* Organization Info Collection (First Step Only) */}
          {currentStep === 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-gray-900 mb-3 text-sm flex items-center space-x-2">
                <span className="material-icons text-blue-600 text-base">business</span>
                <span>Optional: Organization Information</span>
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Your organization name (optional)"
                    data-testid="input-organization-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="your.email@organization.org (optional)"
                    data-testid="input-contact-email"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4" data-testid="questions-container">
            {getVisibleQuestions(currentCategory.questions).map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                value={responses[question.id]}
                onChange={(value) => handleResponseChange(question.id, value)}
                index={index}
              />
            ))}
          </div>

          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center space-x-2 text-sm px-4 py-2 disabled:opacity-50"
              data-testid="button-previous"
            >
              <span className="material-icons text-sm">chevron_left</span>
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || submitAssessment.isPending}
              className="flex items-center space-x-2 text-sm px-4 py-2 disabled:opacity-50"
              data-testid="button-next"
            >
              <span>
                {submitAssessment.isPending 
                  ? "Processing..." 
                  : isLastStep 
                    ? "Complete Assessment" 
                    : "Next"
                }
              </span>
              {!submitAssessment.isPending && (
                <span className="material-icons text-sm">
                  {isLastStep ? "check_circle" : "chevron_right"}
                </span>
              )}
              {submitAssessment.isPending && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
