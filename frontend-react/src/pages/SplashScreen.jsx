import { useNavigate } from 'react-router-dom';
import introVideo from '../assets/intro.mp4'; // Make sure file is in src/assets/

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'black', zIndex: 9999 }}>
      <video 
        autoPlay 
        muted 
        playsInline
        onEnded={() => navigate('/login')} // Jump to login when video ends
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      >
        <source src={introVideo} type="video/mp4" />
      </video>
    </div>
  );
};

export default SplashScreen;