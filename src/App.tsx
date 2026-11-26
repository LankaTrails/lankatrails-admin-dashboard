import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import store from "@/store";
import AppRoutes from "./AppRoutes";

const App = () => (
  <ReduxProvider store={store}>
    <TooltipProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">
            <AppRoutes />
          </main>
        </div>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </ReduxProvider>
);

export default App;
