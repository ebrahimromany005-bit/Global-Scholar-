import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Opportunities from "@/pages/Opportunities";
import OpportunityDetail from "@/pages/OpportunityDetail";
import Countries from "@/pages/Countries";
import CountryDetail from "@/pages/CountryDetail";
import Applications from "@/pages/Applications";
import Documents from "@/pages/Documents";
import Learn from "@/pages/Learn";
import CalendarPage from "@/pages/Calendar";
import Assistant from "@/pages/Assistant";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import Premium from "@/pages/Premium";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <div className="pb-40">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/opportunities" component={Opportunities} />
          <Route path="/opportunities/:id" component={OpportunityDetail} />
          <Route path="/countries" component={Countries} />
          <Route path="/countries/:code" component={CountryDetail} />
          <Route path="/applications" component={Applications} />
          <Route path="/documents" component={Documents} />
          <Route path="/learn" component={Learn} />
          <Route path="/calendar" component={CalendarPage} />
          <Route path="/assistant" component={Assistant} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/profile" component={Profile} />
          <Route path="/premium" component={Premium} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <I18nProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </I18nProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
