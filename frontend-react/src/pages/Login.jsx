import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TitleCard from '../components/TitleCard';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Correctly importing from the config file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      alert("Error logging in: " + error.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <TitleCard />
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>LOGIN</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
          <button 
            type="submit"
            disabled={loading}
            style={buttonStyle} // Applying the style object defined below
          >
            {loading ? "Entering System..." : "Enter System"}
          </button>
        </form>
        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
          <Link to="/forgot-password" style={{ color: '#ccc' }}>Forgot Password?</Link>
          <Link to="/signup" style={{ color: '#bf953f' }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
};

const inputStyle = { padding: '12px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' };
const buttonStyle = { padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(45deg, #bf953f, #aa771c)', color: 'black', fontWeight: 'bold', cursor: 'pointer' };

export default Login;