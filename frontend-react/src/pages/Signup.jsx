import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import TitleCard from '../components/TitleCard';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);

    try {
      await axios.post('http://127.0.0.1:8001/signup-trigger', data);
      localStorage.setItem('temp_email', formData.email);
      navigate('/otp');
    } catch (err) { alert('Error: User likely already exists'); }
  };

  const inputStyle = { padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' };
  const buttonStyle = { padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(45deg, #bf953f, #aa771c)', color: 'black', fontWeight: 'bold', cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <TitleCard />
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h2 style={{ textAlign: 'center' }}>SIGN UP</h2>
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyle} />
          <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} />
          <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} style={inputStyle} />
          <button type="submit" style={buttonStyle}>GET OTP</button>
        </form>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#bf953f', textDecoration: 'none' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};
export default Signup;