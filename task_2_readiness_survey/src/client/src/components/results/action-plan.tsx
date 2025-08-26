import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import type { Assessment } from "@shared/schema";

interface ActionPlanProps {
  assessment: Assessment;
}

export default function ActionPlan({ assessment }: ActionPlanProps) {
  const handleExportReport = async () => {
    try {
      const response = await fetch(`/api/assessments/${assessment.id}/export`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-readiness-assessment-${assessment.id}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Report Exported",
        description: "Your assessment report has been downloaded as a Markdown file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const timelineActions = {
    first30Days: [
      "Conduct data quality assessment",
      "Form digital transformation committee", 
      "Survey staff digital skill levels",
      "Research data governance frameworks"
    ],
    days31to60: [
      "Implement data governance policies",
      "Launch staff training program",
      "Pilot AI tool in one department",
      "Establish partnership with tech vendor"
    ],
    days61to90: [
      "Evaluate pilot project results",
      "Expand successful initiatives", 
      "Document lessons learned",
      "Plan next phase of transformation"
    ]
  };

  return (
    <>
      {/* 90-Day Action Plan */}
      <Card className="shadow-material p-8 mb-8">
        <CardContent className="p-0">
          <h3 className="text-2xl font-bold text-text-primary mb-6">90-Day Action Plan</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="timeline-section">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">30</span>
                </div>
                <h4 className="text-lg font-bold text-text-primary">First 30 Days</h4>
              </div>
              <ul className="space-y-3 text-sm text-text-secondary">
                {timelineActions.first30Days.map((action, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="material-icons text-primary text-sm mt-0.5">check_circle_outline</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="timeline-section">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">60</span>
                </div>
                <h4 className="text-lg font-bold text-text-primary">Days 31-60</h4>
              </div>
              <ul className="space-y-3 text-sm text-text-secondary">
                {timelineActions.days31to60.map((action, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="material-icons text-warning text-sm mt-0.5">schedule</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="timeline-section">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">90</span>
                </div>
                <h4 className="text-lg font-bold text-text-primary">Days 61-90</h4>
              </div>
              <ul className="space-y-3 text-sm text-text-secondary">
                {timelineActions.days61to90.map((action, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="material-icons text-gray-400 text-sm mt-0.5">radio_button_unchecked</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card className="shadow-material p-6">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Export Your Report</h3>
              <p className="text-text-secondary">Save and share your assessment results and recommendations</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={handleExportReport}
                variant="outline"
                className="flex items-center justify-center space-x-2 border-primary text-primary hover:bg-blue-50"
                data-testid="button-export-markdown"
              >
                <span className="material-icons">description</span>
                <span>Export as Markdown</span>
              </Button>
              <Link href="/">
                <Button 
                  className="flex items-center justify-center space-x-2 btn-primary w-full sm:w-auto"
                  data-testid="button-retake-assessment"
                >
                  <span className="material-icons">refresh</span>
                  <span>Retake Assessment</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
