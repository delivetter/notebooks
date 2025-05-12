import { Switch, Route, Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Comparison from "@/pages/Comparison";
import Simulation from "@/pages/Simulation";

function SwitchRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/comparison" component={Comparison} />
      <Route path="/simulation" component={Simulation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <Router>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <SwitchRouter />
            </div>
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
    </Router>
  );
}

export default App;
