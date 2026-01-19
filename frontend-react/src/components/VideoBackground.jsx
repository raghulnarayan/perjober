import videoBg from '../assets/5192-183786490_medium.mp4';

const VideoBackground = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1 }}>
      <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)' }}></div>
      <video src={videoBg} autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
};
export default VideoBackground;