import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AnimatePresence } from 'framer-motion';

// Pages
import { Dashboard } from '@/pages/Dashboard';
import { Chat } from '@/pages/Chat';
import { Biometrics } from '@/pages/Biometrics';
import { Analytics } from '@/pages/Analytics';
import { MentalHealth } from '@/pages/MentalHealth';
import { Community } from '@/pages/Community';

// Components
import { Sidebar } from '@/components/ui-custom';

// MSW
import { worker } from '@/mocks/browser';

// Initialize MSW in development
if (import.meta.env.DEV) {
  worker.start({
    onUnhandledRequest: 'bypass',
  });
}

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    // Add dark class to html element
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-dark text-white">
          <Sidebar />
          
          <main className="lg:ml-[280px] min-h-screen transition-all duration-300">
            <div className="p-6 lg:p-8">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/biometrics" element={<Biometrics />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/mental-health" element={<MentalHealth />} />
                  <Route path="/community" element={<Community />} />
                </Routes>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </BrowserRouter>
      
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
