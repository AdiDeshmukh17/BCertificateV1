import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import BirthCertificate from './Form';
import CertificateReturn from './CertificateUi';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome</h1>

      <div className="space-x-4 mb-6">
        <button 
          onClick={() => navigate('/register')} 
          className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800"
        >
          Go to Register Form
        </button>
        <button 
          onClick={() => navigate('/certificate')} 
          className="px-4 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800"
        >
          Go to Certificate Return
        </button>
      </div>

      {/* 🔽 Swiper Slider */}
      <div className="w-full max-w-xl">
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          loop
        >
          <SwiperSlide>
            <h2 className="text-xl font-semibold text-center">This isn't the final implementation</h2>
          </SwiperSlide>
          <SwiperSlide>
            <h2 className="text-xl font-semibold text-center">It's a prototype version</h2>
          </SwiperSlide>
          <SwiperSlide>
            <h2 className="text-xl font-semibold text-center">Developed based on client requirements</h2>
          </SwiperSlide>
        </Swiper>
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
