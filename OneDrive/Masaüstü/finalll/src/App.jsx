import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import RoadmapSection from './components/RoadmapSection';
import Chatbot from './components/Chatbot';
import { AuthProvider } from './context/AuthContext';

// Simple Landing Page Component
const LandingPage = () => (
  <>
    <Hero />
    <div id="roadmap-section">
      <RoadmapSection />
    </div>
  </>
);

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      <AuthProvider>
        <Router>
          <Navbar />
          <main className="flex-grow pt-16 relative">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                {/* Keep other routes accessible if needed, but Landing is main */}
                <Route path="/roadmap" element={<RoadmapSection />} />
              </Routes>
            </div>
          </main>
          <Footer />
          <Chatbot />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
