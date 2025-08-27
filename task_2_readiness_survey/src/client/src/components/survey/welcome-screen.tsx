import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WelcomeScreen() {
  const categories = [
    {
      icon: "business_center",
      title: "Strategy & Leadership",
      description: "Leadership commitment and strategic planning"
    },
    {
      icon: "people",
      title: "People & Culture", 
      description: "Staff skills and organizational culture"
    },
    {
      icon: "computer",
      title: "Technology & Infrastructure",
      description: "IT systems and digital tools"
    },
    {
      icon: "analytics", 
      title: "Data & Analytics",
      description: "Data management and analysis capabilities"
    },
    {
      icon: "settings",
      title: "Processes & Governance", 
      description: "Operational processes and policies"
    },
    {
      icon: "account_balance",
      title: "Resources & Partnerships",
      description: "Budget allocation and external support"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Card className="shadow-material-lg p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
        <CardContent className="p-0">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI & Digital Transformation Readiness Assessment
          </h2>
          
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
            Evaluate your organization's preparedness for AI and digital transformation initiatives. 
            This comprehensive assessment covers 6 key readiness areas and takes approximately 10 minutes to complete.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <span className="material-icons text-blue-600 text-3xl mb-3 block">timer</span>
              <h3 className="font-semibold text-blue-800 text-lg">10 Minutes</h3>
              <p className="text-blue-600">Quick assessment</p>
            </div>
            <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <span className="material-icons text-indigo-600 text-3xl mb-3 block">insights</span>
              <h3 className="font-semibold text-indigo-800 text-lg">6 Categories</h3>
              <p className="text-indigo-600">Comprehensive evaluation</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <span className="material-icons text-slate-600 text-3xl mb-3 block">description</span>
              <h3 className="font-semibold text-slate-800 text-lg">Detailed Report</h3>
              <p className="text-slate-600">Actionable recommendations</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-text-primary mb-6">Assessment Categories</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              {categories.map((category, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="material-icons text-white text-lg">{category.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{category.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-white text-lg">info</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-3 text-lg">Assessment Information</h4>
                  <ul className="text-blue-800 space-y-2">
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>All responses are confidential and stored locally</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Questions use a 0-10 scale for consistent scoring</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>You can save progress and return later</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Final report includes personalized recommendations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Link href="/survey">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xl px-12 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                  data-testid="button-start-assessment"
                >
                  <span className="flex items-center space-x-3">
                    <span className="material-icons text-2xl">rocket_launch</span>
                    <span>Start Assessment</span>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
