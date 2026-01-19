import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TitleCard from '../components/TitleCard';

const ForgotPassword = () => {
  const [stage, setStage] = useState(1); // 1 = Email, 2 = OTP & New Pass
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const navigate = useNavigate();

  const sendResetCode = async () => {
    try {
      // FIX: Use FormData instead of JSON
      const formData = new FormData();
      formData.append('email', email);
      
      await axios.post('http://127.0.0.1:8001/forgot-password-trigger', formData);
      setStage(2);
    } catch (e) { 
      console.error(e);
      alert('Error: Email not found or connection failed. Check console (F12) for details.'); 
    }
  };

  const resetPassword = async () => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('otp', otp);
      formData.append('new_password', newPass);

      await axios.post('http://127.0.0.1:8001/reset-password', formData);
      
      // --- CHANGED THIS PART ---
      alert('Password Reset Success! Logging you in...');
      localStorage.setItem('user', email); // 1. Save the session
      navigate('/home');                   // 2. Go straight to Dashboard
      // -------------------------

    } catch (e) { alert('Invalid Code or Server Error'); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <TitleCard />
      <div className="glass-card" style={{ padding: '40px', width: '400px', textAlign: 'center' }}>
        <h2>RESET PASSWORD</h2>
        {stage === 1 ? (
          <>
            <input className="dark-input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="gold-btn" onClick={sendResetCode} style={{ marginTop: '20px' }}>SEND CODE</button>
          </>
        ) : (
          <>
            <input className="dark-input" placeholder="OTP Code" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <input className="dark-input" type="password" placeholder="New Password" value={newPass} onChange={(e) => setNewPass(e.target.value)} style={{ marginTop: '10px' }} />
            <button className="gold-btn" onClick={resetPassword} style={{ marginTop: '20px' }}>RESET & LOGIN</button>
          </>
        )}
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#bf953f', marginTop: '20px', cursor: 'pointer' }}>Back to Login</button>
      </div>
      <style>{`.dark-input { width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: none; color: white; border-radius: 5px; } .gold-btn { width: 100%; padding: 12px; background: #bf953f; border: none; font-weight: bold; cursor: pointer; border-radius: 5px; }`}</style>
    </div>
  );
};
export default ForgotPassword;