import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Survey from "@/pages/survey";
import Results from "@/pages/results";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/survey" component={Survey} />
      <Route path="/results/:id" component={Results} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <header className="bg-white/95 backdrop-blur-sm shadow-material-lg sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="material-icons text-white text-2xl">assessment</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">AI Readiness Assessment</h1>
                    <p className="text-base text-gray-600">Non-Profit Digital Transformation</p>
                  </div>
                </div>
                <button 
                  className="p-3 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                  data-testid="button-help"
                >
                  <span className="material-icons text-gray-600 text-xl">help_outline</span>
                </button>
              </div>
            </div>
          </header>
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
