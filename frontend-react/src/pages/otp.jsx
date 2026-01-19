import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TitleCard from '../components/TitleCard';

const OTP = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('temp_email');

  const verify = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('email', email);
    data.append('otp', otp);
    try {
      await axios.post('http://127.0.0.1:8001/verify-signup', data);
      localStorage.setItem('user', email);
      navigate('/home');
    } catch (err) { alert('Invalid Code'); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <TitleCard />
      <div className="glass-card" style={{ padding: '40px', width: '350px' }}>
        <h2 style={{ textAlign: 'center' }}>VERIFY OTP</h2>
        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9em' }}>Check your registered email for the code</p>
        <form onSubmit={verify} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Enter 4-digit Code" onChange={(e) => setOtp(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', textAlign: 'center', letterSpacing: '5px', fontSize: '1.2em' }} />
          <button type="submit" style={{ padding: '12px', borderRadius: '8px', background: '#bf953f', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>VERIFY</button>
        </form>
      </div>
    </div>
  );
};
export default OTP;