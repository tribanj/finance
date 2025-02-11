import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/home/Hompage';
import Navbar from './components/nav/Navbar';
import Carousel from './components/pages/home/Cerausel';
import Footer from './components/footer/Footer';
import About from './components/pages/about/About'; // Create this component
import Contact from './components/pages/contact/Contact'; // Create this component
import NotFound from './components/pages/NotFound.jsx'; // Optional: Create this component
import FaQ from './components/pages/FaQ.jsx';
import PrivacyPolicy from './components/pages/PrvacyPolicy.jsx';
import Signup from './components/auth/Signup.jsx';
import Login from './components/auth/Login.jsx';
import TermsAndConditions from './components/pages/TermsAndCondition.jsx';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Home Route */}
            <Route 
              path="/" 
              element={
                <>
                  <Carousel />
                  <HomePage />
                </>
              } 
            />
            
            {/* About Route */}
            <Route path="/about" element={<About />} />

            <Route path="/signup" element={<Signup />} />

            <Route path="/login" element={<Login />} />
            
            {/* Contact Route */}
            <Route path="/contact" element={<Contact />} />

            <Route path="/faq" element={<FaQ />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            <Route path="/terms&condition" element={<TermsAndConditions />} />
            
            {/* 404 Route - Optional */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;