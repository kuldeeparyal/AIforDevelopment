import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
}

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  categories: Category[];
}

export default function ProgressStepper({ currentStep, totalSteps, categories }: ProgressStepperProps) {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Card className="shadow-md p-4 mb-6 bg-white border border-gray-200">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Assessment Progress</h2>
          <span className="text-sm font-medium text-gray-600 bg-blue-50 px-3 py-1 rounded-md" data-testid="text-progress">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out progress-bar"
              style={{ width: `${progressPercentage}%` }}
              data-testid="progress-bar"
            />
          </div>
          <div className="text-right mt-1">
            <span className="text-xs font-medium text-gray-500">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <span
              key={category.id}
              className={`px-2 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
                index <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              data-testid={`step-label-${category.id}`}
            >
              {category.title}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
