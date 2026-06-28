import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import VideoBackground from './components/VideoBackground';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import OTP from './pages/otp';
import Home from './pages/Home';
import Goals from './pages/Goals';
import SplashScreen from './pages/SplashScreen'; // Import the new page

function App() {
  return (
    <BrowserRouter>
      <VideoBackground />
      <Routes>
  <Route path="/" element={<SplashScreen />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/otp" element={<OTP />} />
  
  {/* THIS LINE MUST EXIST EXACTLY LIKE THIS */}
  <Route path="/home" element={<Home />} /> 
  
  <Route path="/goals" element={<Goals />} />
</Routes>
    </BrowserRouter>
  );
}
export default App;