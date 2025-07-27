import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import { Provider as ReduxProvider } from "react-redux";
import store from "@/store";
import Header from "./components/Header";
import AppRoutes from "./AppRoutes";
const queryClient = new QueryClient();

const App = () => (
  <ReduxProvider store={store}>

  
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header/>
          <main className="flex-1">
            <AppRoutes />
          </main>
          <Toaster/>
          <Sonner/>
        </div>
        
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ReduxProvider>
);

export default App;