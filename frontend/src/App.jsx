import { BrowserRouter as Router, Routes, Route, useNavigate, Form } from 'react-router-dom';
//import BirthCertificate from './Form';
//import CertificateReturn from './CertificateUi';
import BirthCertificate from './Form';
import CertificateReturn from './CertificateUi';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome</h1>
      <div className="space-x-4">
        <button onClick={() => navigate('/register')} className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800">Go to Register Form</button>
        <button onClick={() => navigate('/certificate')} className="px-4 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800">Go to Certificate Return</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<BirthCertificate />} />
        <Route path="/certificate" element={<CertificateReturn />} />
      </Routes>
    </Router>
  );
}

export default App;
