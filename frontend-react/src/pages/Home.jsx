import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import TitleCard from '../components/TitleCard';
import { Tabs, Tab, Box, Button, IconButton, Slider, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Checkbox, ListItemText, FormControl, InputLabel, OutlinedInput, Grid, Card, CardContent, Typography, Menu } from '@mui/material';

// --- ⚡ IMPORT VIDEO FROM ASSETS ⚡ ---
// ⚠️ IMPORTANT: Ensure 'success.mp4' is inside the 'src/assets' folder!
import successVideo from '../assets/success.mp4';

// --- SAFE ICONS IMPORT ---
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; 
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; 
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SaveIcon from '@mui/icons-material/Save';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; 
import CloseIcon from '@mui/icons-material/Close'; 
import WarningIcon from '@mui/icons-material/Warning'; 
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import AddLinkIcon from '@mui/icons-material/Link'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 

// --- ⚡ 100 RAJAMOULI STYLE QUOTES ---
const MOTIVATIONAL_QUOTES = [
  "Do not count the hours you study. Make the hours tremble at your focus!",
  "The mountain does not bow to the wind. Be the mountain. Let the distractions break against your stillness.",
  "A rejection letter is merely paper. Your ambition is forged steel. Paper cannot cut steel!",
  "Why do you fear the difficult chapter? It is just a beast waiting to be tamed by your intellect. Attack!",
  "Consistency is not a habit. It is the war drum that frightens laziness away. Beat it loudly every morning!",
  "Let your sweat fall onto the pages today, so your tears do not fall on your results tomorrow.",
  "They told you 'No.' Good. Now show them the empire they missed out on building with you.",
  "Your pen is your sword. Your knowledge is your shield. Your desk is the battlefield. Go forth and conquer!",
  "Do not ask for an easy path. Ask for legs of iron to crush the difficult path beneath you.",
  "The sun does not ask permission to rise. It simply burns. Do not wait for motivation. Burn!",
  "Fatigue is a liar that whispers you are done. Duty is the king that commands you to continue. Heed the king.",
  "Every finished task is a severed head of the enemy called Procrastination. Build a mountain of them!",
  "You want the throne of success? Then you must bleed the ink of hard work. There is no other way.",
  "A small step taken every day is better than a giant leap taken only once. The river cuts the rock not through power, but through persistence!",
  "When the world sleeps, the champion sharpens his blade. Your books are waiting.",
  "Let them mock your silence today. Their applause will be deafening tomorrow.",
  "Do not look at how far you have to go. Look down at your feet and take one more step of thunder!",
  "Your resume is not just a document. It is a declaration of war against mediocrity.",
  "The fire of your dreams must be hotter than the fire of your excuses.",
  "If you fall seven times, it is destiny testing your spine. Stand up eight times and roar!",
  "Discipline is turning the small spark of desire into a towering inferno of action.",
  "Do not let a temporary failure become a permanent monument. Tear it down and build again!",
  "The glory is not in never failing, but in rising every time you fall, with dust on your face and fire in your eyes.",
  "Treat every application sent like an arrow fired into the heart of destiny. Do not stop shooting until you hit the mark.",
  "You are not tired. You are just preparing for the final charge. Hold the line!",
  "Today's struggle is the hammer that is forging tomorrow's crown. Do not drop the hammer.",
  "Let your focus be so intense that the world outside your study room ceases to exist.",
  "A warrior does not complain about the weight of his armor. Do not complain about the weight of the syllabus. Carry it!",
  "The greatest empires were built brick by brick. Your career is built day by day. Lay the brick!",
  "When you feel like quitting, remember why you started this war in the first place.",
  "Do not seek comfort. Seek the capacity to endure discomfort and still perform.",
  "Your potential is a sleeping giant. Waking it up requires the loud noise of consistent effort.",
  "Let the noise of your results silence the noise of your critics.",
  "The goal is not just to finish the syllabus. The goal is to master it so completely that it fears you.",
  "Waiting for the 'perfect time' is the strategy of a coward. The time is now. The battle is here.",
  "Every 'No' you hear brings you closer to the only 'Yes' that matters. March on.",
  "Do not yield to the pillow when your dreams are demanding your presence at the desk!",
  "Build a fortress of knowledge so strong that no interviewer can breach its walls.",
  "The storm of exams is coming? Good. Let it know you are the lightning.",
  "Ordinary effort brings ordinary results. If you want legendary glory, you must give legendary effort!",
  "Your willpower must be stronger than your wifi signal.",
  "You are not here to participate in the race. You are here to redefine the speed!",
  "Let your consistency be so terrifying that failure decides to leave you alone.",
  "A closed door is not an end. It is a challenge to build your own gate.",
  "Do not feed your fears with procrastination. Starve them with action.",
  "The distance between your dreams and reality is covered only by the bridge of discipline. Build the bridge!",
  "Your future self is begging you not to give up today. Listen to him.",
  "Do not be a victim of circumstances. Be the writer of your own epic. Take the pen.",
  "Success is not given to the swift, but to the one who endures when their legs are broken.",
  "Turn your anxiety into aggression against the task at hand. Attack it before it attacks you.",
  "The universe will bow to the stubborn heart. Be stubborn about your goals.",
  "Let every tick of the clock be a reminder that your destiny is waiting. Don't make it wait long.",
  "You are meant for Greatness. Do not insult your destiny with lazy efforts.",
  "When the interview gets tough, remember: diamonds are only formed under immense pressure. Shine!",
  "The weak wait for opportunities. The strong seize them. The legends create them.",
  "Do not look for inspiration. Be the inspiration. Let your work ethic set the standard.",
  "Your brain is a weapon. If you do not sharpen it daily, it will rust. Sharpen it!",
  "It is not over until you win. And even then, the next battle begins. Stay ready.",
  "Let your consistency be a roaring fire that burns down every obstacle.",
  "They ignored your application? Make them regret it when they see your success everywhere.",
  "The pain of discipline is ounces. The pain of regret is tons. Choose your burden wisely!",
  "Every day you skip is a victory for your past self over your future self. Who do you want to win?",
  "Do not try. Do. There is no room for trying on the battlefield of ambition.",
  "Let your routine be unbreakable, like the shield of a mighty warrior.",
  "The path to the throne is paved with thorns. You must walk on them until your feet become harder than the thorns.",
  "Do not lower your goals to the level of your abilities. Raise your abilities to the height of your goals!",
  "Your competition is not other people. Your competition is the lazy version of you in the mirror. Defeat him daily.",
  "Let the hunger for success in your belly be louder than the growl of fatigue.",
  "A river cuts through rock not because of its power, but because it never stops flowing. Flow!",
  "You did not come this far just to come this far. You came here to finish it.",
  "When you are overwhelmed, do not retreat. Dig in your heels and push back harder!",
  "The job market is a jungle? Then you must become the lion. Roar with your qualifications!",
  "Stop wishing for it and start working for it. Wishes are for children. Work is for legends.",
  "Let your preparation be so thorough that luck becomes irrelevant.",
  "The only easy day was yesterday. Today we fight again.",
  "Your dreams are too big to be held captive by small fears. Break free with action!",
  "Do not just read the words. Absorb them until they become part of your blood.",
  "Every checkmark on this tracker is a stepping stone to your kingdom.",
  "You are the architect of your destiny. Do not use cheap materials like laziness to build your palace.",
  "When they doubt you, do not argue. Work in silence and let your success scream the truth.",
  "The finish line is just the beginning of a new race. Keep running.",
  "Do not fear failure. Fear being in the exact same place next year as you are today.",
  "Let your dedication be a storm that washes away all doubt.",
  "It doesn't matter how slowly you go, as long as you do not stop. The tortoise beat the hare because he did not stop!",
  "Your mind will quit a thousand times before your body does. Do not listen to your mind.",
  "Focus like an arrow. Endure like a mountain. Strike like lightning.",
  "Do not give up because it is hard. Press on because it is hard. Glory lies in the difficulty!",
  "Every hour wasted is an insult to the potential sleeping inside you. Wake up!",
  "Be the kind of person that when your feet hit the floor in the morning, the devil says, 'Oh no, they are awake.'",
  "Build your skills until they are undeniable. Make them need you.",
  "The past cannot be changed. The future is yet in your power. Seize it today!",
  "Do not let the shadows of yesterday darken the light of today's opportunities.",
  "If the plan doesn't work, change the plan, but never change the goal. The goal is sacred!",
  "Your focus is a muscle. Train it daily in the gym of this study tracker until it can lift heavy dreams.",
  "The moment you want to quit is the moment the miracle is just about to happen. Push one more time!",
  "Let your resolve be written in stone, not in sand.",
  "You are forging a legacy. Do not let the hammer rest until the steel is shaped!",
  "Defeat is a state of mind. No one is ever defeated until defeat has been accepted as reality. Do not accept it!",
  "Your effort today is the down payment on the luxury of tomorrow. Pay up!",
  "Stand tall. Look at the challenge in the eye. And tell it: 'You will yield, for I will not.'"
];

const Home = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('user'); 
  const [userName, setUserName] = useState('User'); 
  const [welcomeMsg, setWelcomeMsg] = useState('Welcome'); 
   
  // Quote State
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  const effectRan = useRef(false);

  const [tabIndex, setTabIndex] = useState(0);
  const [studyData, setStudyData] = useState([]);
  const [jobs, setJobs] = useState([]);
   
  const [newTopic, setNewTopic] = useState({ 
      topic: '', subject: '', status: 'to-do', progress: 0, links: '', 
      target_date: '' 
  });
  const [newFiles, setNewFiles] = useState([]); 

  const [expandedId, setExpandedId] = useState(null); 
  const [editFiles, setEditFiles] = useState([]);

  // States for Link Inputs & Menu
  const [tempLinkName, setTempLinkName] = useState('');
  const [tempLinkUrl, setTempLinkUrl] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); 

  // --- Calendar View Control ---
  const [calendarView, setCalendarView] = useState('selection');

  // Pop-up States
  const [showStudyDatePopup, setShowStudyDatePopup] = useState(false);
  const [selectedStudyDateDetails, setSelectedStudyDateDetails] = useState(null); 

  const [showJobCalendarPopup, setShowJobCalendarPopup] = useState(false);
  const [selectedJobDateDetails, setSelectedJobDateDetails] = useState(null);

  const [compareList, setCompareList] = useState([]); 
  const [showLimitWarning, setShowLimitWarning] = useState(false); 

  // --- ⚡ NEW STATE: Success Animation ⚡ ---
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  // ⚡ VIDEO REF FORCED PLAY ⚡
  const videoRef = useRef(null);

  const [newJob, setNewJob] = useState({ company: '', role: '', status: 'Applied', date: new Date().toISOString().split('T')[0] });
  const [chartType, setChartType] = useState('Bar'); 
  const [soloTopic, setSoloTopic] = useState(null);

  const brightColors = ['#bf953f', '#00e5ff', '#ff4081', '#76ff03', '#ea80fc', '#ffea00', '#FF5722', '#1E88E5', '#D500F9', '#00C853']; 

  useEffect(() => {
    if (!userEmail) {
        navigate('/login');
    } else {
        fetchData();
        fetchUserName();
        handleWelcomeMessage();
        generateRandomQuote(); 
    }
  }, [userEmail]);

  useEffect(() => {
      if (studyData.length > 0 && compareList.length === 0) {
          setCompareList(studyData.slice(0, 5).map(i => i.topic));
      }
  }, [studyData]);

  // ⚡ FORCE VIDEO PLAY ON MOUNT ⚡
  useEffect(() => {
      if (showSuccessAnim && videoRef.current) {
          videoRef.current.play().catch(error => console.log("Video Play Error:", error));
      }
  }, [showSuccessAnim]);

  const fetchUserName = async () => {
    try {
        const res = await axios.get(`http://127.0.0.1:8001/get-user-name/${userEmail}`);
        if (res.data.name) setUserName(res.data.name);
    } catch (e) { console.log("Could not fetch name"); }
  };

  const handleWelcomeMessage = () => {
    if (!userEmail) return;
    const key = `hasVisited_v2_${userEmail}`;
    const hasVisited = localStorage.getItem(key);

    if (hasVisited) {
        setWelcomeMsg('Welcome Back');
    } else {
        setWelcomeMsg('Welcome');
        setTimeout(() => { localStorage.setItem(key, 'true'); }, 2000);
    }
  };

  const generateRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      setCurrentQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  };

  const fetchData = async () => {
    try {
      const sRes = await axios.get(`http://127.0.0.1:8001/study/${userEmail}`);
      setStudyData(sRes.data);
      const jRes = await axios.get(`http://127.0.0.1:8001/jobs/${userEmail}`);
      setJobs(jRes.data);
    } catch (err) { console.error(err); }
  };

  const formatDate = (dateString) => {
      if (!dateString) return '';
      const parts = dateString.split('-');
      if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`; 
      }
      return dateString;
  };

  const getLocalDateString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };

  const isLate = (actual, target) => {
      if (!actual || !target) return false;
      return actual > target; 
  };

  const isOverdue = (targetDate, status) => {
      if (!targetDate || status === 'completed') return false;
      const today = new Date().toISOString().split('T')[0];
      return today > targetDate;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '14px', fontWeight: 'bold', filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.9))' }}>
        <tspan x={x} dy="-0.6em" style={{fontSize: '15px'}}>{name}</tspan>
        <tspan x={x} dy="1.2em" style={{fill: '#fff', fontSize: '13px'}}>{`${(percent * 100).toFixed(0)}%`}</tspan>
      </text>
    );
  };

  // --- CALENDAR LOGIC ---
  const tileContentStudy = ({ date, view }) => {
    if (view === 'month') {
        const dateStr = getLocalDateString(date); 
        const todayStr = getLocalDateString(new Date());

        const dueToday = studyData.filter(t => t.target_date === dateStr && t.status !== 'completed');
        const completedOnThisDay = studyData.filter(t => t.actual_end_date === dateStr);
        const lateCompletions = completedOnThisDay.filter(t => isLate(t.actual_end_date, t.target_date));
        const onTimeCompletions = completedOnThisDay.filter(t => !isLate(t.actual_end_date, t.target_date));

        let aggregatedOverdueCount = 0;
        if (dateStr === todayStr) {
            const allOverdueItems = studyData.filter(t => {
                if (!t.target_date) return false;
                if (t.target_date < todayStr && t.status !== 'completed') return true;
                return false;
            });
            aggregatedOverdueCount = allOverdueItems.length;
        }

        return (
            <div style={{fontSize:'12px', fontWeight:'bold', lineHeight:'1.3', marginTop:'4px', textShadow: '0px 0px 1px black'}}>
                {dateStr >= todayStr && dueToday.length > 0 && <div style={{color:'#ff9800'}}>● {dueToday.length} Due</div>}
                {aggregatedOverdueCount > 0 && <div style={{color:'#f44336'}}>⚠️ {aggregatedOverdueCount} Overdue</div>}
                {onTimeCompletions.length > 0 && <div style={{color:'#2e7d32'}}>✔ {onTimeCompletions.length} Done</div>}
                {lateCompletions.length > 0 && <div style={{color:'#d32f2f'}}>✔ {lateCompletions.length} Late</div>}
            </div>
        );
    }
    return null;
  };

  const onStudyDateClick = (date) => {
      const dateStr = getLocalDateString(date); 
      const todayStr = getLocalDateString(new Date());

      let targets = studyData.filter(t => t.target_date === dateStr);
      const completed = studyData.filter(t => t.actual_end_date === dateStr);
      
      if (dateStr === todayStr) {
          const overdueItems = studyData.filter(t => {
              if (!t.target_date) return false;
              if (t.target_date < todayStr && t.status !== 'completed') return true;
              return false;
          });
          targets = [...targets, ...overdueItems];
      } 
      else if (dateStr < todayStr) {
          targets = targets.filter(t => t.status === 'completed'); 
      }

      setSelectedStudyDateDetails({ date: formatDate(dateStr), targets, completed });
      setShowStudyDatePopup(true); 
  };

  const JOB_COLORS = {
      'Applied': '#bf953f',
      'Interviewing': '#2196f3',
      'Offer': '#4caf50',
      'Rejected': '#f44336'
  };

  const tileContentJob = ({ date, view }) => {
      if (view === 'month') {
          const dateStr = getLocalDateString(date);
          const dayJobs = jobs.filter(j => j.date === dateStr);
          return (
              <div style={{display:'flex', gap:'2px', justifyContent:'center', flexWrap:'wrap', marginTop:'2px'}}>
                  {dayJobs.map((j, i) => (
                      <div key={i} style={{width:'8px', height:'8px', borderRadius:'50%', backgroundColor: JOB_COLORS[j.status] || 'white', title: j.company}}></div>
                  ))}
              </div>
          );
      }
      return null;
  };

  const onJobDateClick = (date) => {
      const dateStr = getLocalDateString(date);
      const dayJobs = jobs.filter(j => j.date === dateStr);
      setSelectedJobDateDetails({ date: formatDate(dateStr), jobs: dayJobs });
      setShowJobCalendarPopup(true);
  }

  const handleCompareChange = (event) => {
      const { target: { value } } = event;
      const newSelection = typeof value === 'string' ? value.split(',') : value;
      if (newSelection.length > 5) {
          setShowLimitWarning(true);
      } else {
          setCompareList(newSelection);
      }
  };

  const getFilteredChartData = () => {
      return studyData.filter(item => compareList.includes(item.topic));
  };

  const handleLegendClick = (e) => {
      const topicName = e.dataKey;
      setSoloTopic(prev => prev === topicName ? null : topicName);
  };

  const getHistoryChartData = () => {
    const allDates = new Set();
    studyData.forEach(topic => {
        if (topic.history) topic.history.forEach(h => allDates.add(h.date.split(' ')[0]));
    });
    const sortedDates = Array.from(allDates).sort();
    return sortedDates.map(date => {
        const row = { date: formatDate(date) };
        studyData.forEach(topic => {
            if (topic.history) {
                const validEntries = topic.history.filter(h => h.date.split(' ')[0] <= date);
                row[topic.topic] = validEntries.length > 0 ? validEntries[validEntries.length - 1].progress : 0;
            } else {
                row[topic.topic] = 0;
            }
        });
        return row;
    });
  };

  const updateItem = async (id, newStatus, newProgress) => {
    let actualEndDate = null; 
    
    // Check for completion to trigger success animation
    if (newStatus === 'completed' || newProgress === 100) {
        newStatus = 'completed';
        newProgress = 100;
        actualEndDate = new Date().toISOString().split('T')[0];
        
        // ⚡ TRIGGER SUCCESS ANIMATION ⚡
        setShowSuccessAnim(true);
    } else if (newStatus === 'to-do') {
        newProgress = 0;
        actualEndDate = ""; 
    } else if (newStatus === 'in-progress') {
        actualEndDate = ""; 
    }

    const updatedData = studyData.map(item => 
        item._id === id ? { 
            ...item, 
            status: newStatus, 
            progress: newProgress, 
            actual_end_date: actualEndDate !== null ? actualEndDate : item.actual_end_date 
        } : item
    );
    setStudyData(updatedData);

    const formData = new FormData();
    formData.append('status', newStatus);
    formData.append('progress', newProgress);
    if (actualEndDate !== null) formData.append('actual_end_date', actualEndDate);

    await axios.put(`http://127.0.0.1:8001/study/${id}`, formData);
  };

  const handleFileSelect = (e, isEditMode = false) => {
    const files = Array.from(e.target.files);
    if (isEditMode) setEditFiles(prev => [...prev, ...files]);
    else setNewFiles(prev => [...prev, ...files]);
    e.target.value = null; 
  };

  const removeFile = (index, isEditMode = false) => {
    if (isEditMode) setEditFiles(editFiles.filter((_, i) => i !== index));
    else setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const handleNewStatusChange = (e) => {
      const status = e.target.value;
      let progress = 0;
      if (status === 'completed') progress = 100;
      if (status === 'in-progress') progress = 50; 
      setNewTopic({ ...newTopic, status, progress });
  };

  const addTopic = async () => {
    if (!newTopic.topic) return;
    if (!newTopic.target_date) {
        alert("Please select target date, it is mandatory"); 
        return;
    }

    const formData = new FormData();
    formData.append('user_email', userEmail);
    Object.keys(newTopic).forEach(k => formData.append(k, newTopic[k]));
    formData.append('start_date', new Date().toISOString().split('T')[0]);
    formData.append('target_date', newTopic.target_date); 
    newFiles.forEach(file => formData.append('files', file));

    setNewTopic({ topic: '', subject: '', status: 'to-do', progress: 0, links: '', target_date: '' }); 
    setNewFiles([]);
    await axios.post('http://127.0.0.1:8001/study', formData);
    fetchData(); 
  };

  const handleAddLink = async (itemId) => {
      if (!tempLinkName || !tempLinkUrl) {
          alert("Please enter both Link Name and URL.");
          return;
      }

      const itemIndex = studyData.findIndex(i => i._id === itemId);
      if (itemIndex === -1) return;
      const item = studyData[itemIndex];
      
      if (item.links && item.links.length >= 7) {
          alert("You can only add a maximum of 7 links per topic.");
          return;
      }

      const newItemString = `${tempLinkName} | ${tempLinkUrl}`;
      const newLinks = [...(item.links || []), newItemString];

      const updatedData = [...studyData];
      updatedData[itemIndex] = { ...item, links: newLinks };
      setStudyData(updatedData);

      const formData = new FormData();
      formData.append('links', newLinks.join('\n')); 
      await axios.put(`http://127.0.0.1:8001/study/${itemId}`, formData);

      setTempLinkName('');
      setTempLinkUrl('');
  };

  const handleDeleteLink = async (itemId, indexToRemove) => {
      const itemIndex = studyData.findIndex(i => i._id === itemId);
      if (itemIndex === -1) return;
      const item = studyData[itemIndex];
      
      const newLinks = item.links.filter((_, i) => i !== indexToRemove);

      const updatedData = [...studyData];
      updatedData[itemIndex] = { ...item, links: newLinks };
      setStudyData(updatedData);

      const formData = new FormData();
      formData.append('links', newLinks.join('\n')); 
      await axios.put(`http://127.0.0.1:8001/study/${itemId}`, formData);
  };

  const uploadFilesOnly = async (id) => {
      const formData = new FormData();
      editFiles.forEach(file => formData.append('files', file));
      await axios.put(`http://127.0.0.1:8001/study/${id}`, formData);
      setEditFiles([]);
      fetchData(); 
  };

  const deleteTopic = async (id) => {
    setStudyData(studyData.filter(item => item._id !== id));
    await axios.delete(`http://127.0.0.1:8001/study/${id}`);
  };

  const goToGoals = (topicData) => navigate('/goals', { state: { topicData } });

  const addJob = async () => {
    if (!newJob.company) return;
    const tempJob = { ...newJob, _id: Date.now() };
    setJobs([...jobs, tempJob]);
    setNewJob({ company: '', role: '', status: 'Applied', date: new Date().toISOString().split('T')[0] }); 
    const formData = new FormData();
    formData.append('user_email', userEmail);
    Object.keys(newJob).forEach(k => formData.append(k, newJob[k]));
    await axios.post('http://127.0.0.1:8001/jobs', formData);
    fetchData(); 
  };

  const updateJobStatus = async (id, newStatus) => {
    const job = jobs.find(j => j._id === id);
    if (!job) return;
    const updatedJobs = jobs.map(j => j._id === id ? { ...j, status: newStatus } : j);
    setJobs(updatedJobs);
    const formData = new FormData();
    formData.append('company', job.company);
    formData.append('role', job.role);
    formData.append('status', newStatus);
    formData.append('date', job.date);
    await axios.put(`http://127.0.0.1:8001/jobs/${id}`, formData);
  };

  const deleteJob = async (id) => {
      setJobs(jobs.filter(j => j._id !== id));
      await axios.delete(`http://127.0.0.1:8001/jobs/${id}`);
  };

  const getJobsByStatus = (status) => jobs.filter(j => j.status === status);

  const chartAxisStyle = { fill: '#ffffff', fontSize: 13, fontWeight: 'bold' };

  // Helper to parse Link | Name
  const parseLink = (linkStr) => {
      if (!linkStr) return { name: 'Invalid Link', url: '#' };
      if (linkStr.includes('|')) {
          const parts = linkStr.split('|');
          const name = parts[0].trim();
          const url = parts.slice(1).join('|').trim();
          return { name: name || 'Link', url: url };
      }
      return { name: 'Open Link', url: linkStr.trim() };
  }

  // --- MENU HANDLERS ---
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', paddingBottom: '100px' }}>
      <TitleCard />
      <div className="glass-card" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* --- HEADER SECTION --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
          
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 style={{ textTransform: 'capitalize', margin: 0 }}>
                 {welcomeMsg}, <span style={{color: '#bf953f'}}>{userName}</span>
              </h3>
              <Button variant="outlined" color="error" onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}>Logout</Button>
          </div>

          <div className="quote-container">
              <h1 className="gradient-text">
                  "{currentQuote}"
              </h1>
          </div>

        </div>

        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} centered sx={{ '& .MuiTab-root': { color: 'white' }, '& .Mui-selected': { color: '#bf953f !important' }, '& .MuiTabs-indicator': { backgroundColor: '#bf953f' } }}>
          <Tab label="Study Plan" />
          <Tab label="Visual Progress" />
          <Tab label="Job Tracker" />
          <Tab label="Calendars" /> 
        </Tabs>

        {/* ... (TAB 1: STUDY PLAN) ... */}
        {tabIndex === 0 && (
          <Box sx={{ mt: 4 }}>
            <div className="glass-card" style={{ padding: '20px', marginBottom: '30px' }}>
                <h4 style={{marginBottom:'15px'}}>Add New Topic</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <input placeholder="Topic" className="dark-input" value={newTopic.topic} onChange={(e) => setNewTopic({...newTopic, topic: e.target.value})} />
                    <input placeholder="Subject" className="dark-input" value={newTopic.subject} onChange={(e) => setNewTopic({...newTopic, subject: e.target.value})} />
                    <select className="dark-input fixed-select" value={newTopic.status} onChange={handleNewStatusChange}>
                        <option value="to-do">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                {newTopic.status === 'in-progress' && (
                    <div style={{ marginBottom: '15px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '5px' }}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                            <label style={{color:'#bf953f', fontSize:'0.9em', fontWeight:'bold'}}>Set Initial Progress</label>
                            <span style={{color:'white', fontWeight:'bold'}}>{newTopic.progress}%</span>
                        </div>
                        <Slider value={newTopic.progress} onChange={(e, val) => setNewTopic({...newTopic, progress: val})} sx={{ color: '#bf953f', height: 8 }} />
                    </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '15px', alignItems:'start' }}>
                    <div>
                        <label style={{color:'#aaa', fontSize:'0.8em', marginBottom:'5px', display:'block'}}>Target Completion Date <span style={{color:'#f44336'}}>*</span></label>
                        <input type="date" className="dark-input" value={newTopic.target_date} onChange={(e) => setNewTopic({...newTopic, target_date: e.target.value})} />
                    </div>
                    <div>
                        <label style={{color:'#aaa', fontSize:'0.8em', marginBottom:'5px', display:'block'}}>Study Links (Format: Name | URL)</label>
                        <textarea placeholder="Example: GFG | https://geeksforgeeks.org (one per line)..." className="dark-input" rows={2} value={newTopic.links} onChange={(e) => setNewTopic({...newTopic, links: e.target.value})} style={{resize:'vertical'}} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{color:'white', borderColor:'rgba(255,255,255,0.3)'}}>Attach Files <input type="file" hidden multiple onChange={(e) => handleFileSelect(e, false)} /></Button>
                    <div style={{flex: 1, display:'flex', gap:'5px', flexWrap:'wrap'}}>{newFiles.map((f, i) => (<Chip key={i} label={f.name} onDelete={() => removeFile(i, false)} sx={{bgcolor:'rgba(255,255,255,0.1)', color:'white'}} />))}</div>
                    <Button variant="contained" sx={{ background: '#bf953f', color: 'black', fontWeight:'bold' }} onClick={addTopic}>ADD TOPIC</Button>
                </div>
            </div>
            {studyData.map((item) => {
                const overdue = isOverdue(item.target_date, item.status);
                const late = isLate(item.actual_end_date, item.target_date);
                
                const allLinks = item.links || [];
                const visibleLinks = allLinks.slice(0, 5);
                const hiddenLinks = allLinks.slice(5);

                return (
                  <div key={item._id} className="glass-card" style={{ padding: '15px', marginBottom: '10px', borderLeft: overdue ? '4px solid #f44336' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '20%' }}>
                            <h4 style={{ margin: 0, color: '#bf953f', fontSize:'1.4em' }}>{item.topic}</h4>
                            <div style={{ color: '#e0e0e0', fontSize: '1.1em', fontWeight: 'bold', marginTop: '5px' }}>{item.subject}</div>
                            <div style={{marginTop:'10px', fontSize:'0.95em', color:'#ccc'}}>
                                <div>🎯 Target: <span style={{color:'white', fontWeight:'bold'}}>{formatDate(item.target_date) || 'N/A'}</span></div>
                                {overdue && <div style={{color:'#f44336', fontWeight:'bold', marginTop:'3px'}}>⚠️ OVERDUE</div>}
                                {!overdue && item.status !== 'completed' && <div style={{color:'#ff9800', fontWeight:'bold', marginTop:'3px'}}>⏳ Due</div>}
                                
                                {item.actual_end_date && (
                                    <div style={{color: late ? '#f44336' : '#4caf50', fontWeight:'bold', marginTop:'3px'}}>{late ? '⚠️ Late: ' : '✅ Done: '} {formatDate(item.actual_end_date)}</div>
                                )}
                            </div>
                        </div>
                        <div style={{ width: '15%' }}>
                            <select className="dark-input fixed-select" value={item.status} onChange={(e) => updateItem(item._id, e.target.value, item.progress)}>
                                <option value="to-do">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Slider value={typeof item.progress === 'number' ? item.progress : 0} onChange={(e, val) => updateItem(item._id, item.status, val)} sx={{ color: '#bf953f', height: 8, '& .MuiSlider-thumb': { width: 24, height: 24, backgroundColor: '#fff', border: '2px solid #bf953f' } }} />
                            <span style={{ minWidth: '40px', fontWeight: 'bold' }}>{item.progress}%</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button startIcon={<ListAltIcon />} size="small" variant="outlined" sx={{color:'white', borderColor:'white'}} onClick={() => goToGoals(item)}>Goals</Button>
                            <Button startIcon={<ExpandMoreIcon />} size="small" variant="outlined" sx={{color:'#bf953f', borderColor:'#bf953f'}} onClick={() => { if(expandedId === item._id) setExpandedId(null); else { setExpandedId(item._id); setTempLinkName(''); setTempLinkUrl(''); setEditFiles([]); } }}>Details</Button>
                            <IconButton color="error" onClick={() => deleteTopic(item._id)}><DeleteIcon /></IconButton>
                        </div>
                    </div>
                    {expandedId === item._id && (
                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'30px'}}>
                                <div style={{background: 'rgba(0,0,0,0.2)', padding:'15px', borderRadius:'10px'}}>
                                    <h4 style={{margin:'0 0 15px 0', color:'#bf953f', display:'flex', alignItems:'center', gap:'10px'}}><LinkIcon /> Reference Links</h4>
                                    
                                    <div style={{display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'20px', alignItems:'flex-start'}}>
                                        {visibleLinks.length > 0 ? (
                                            visibleLinks.map((linkStr, i) => {
                                            const {name, url} = parseLink(linkStr);
                                            return (
                                                <div key={i} style={{display:'flex', alignItems:'center', background:'rgba(255,255,255,0.05)', borderRadius:'5px', paddingRight:'5px'}}>
                                                    <Button size="small" startIcon={<OpenInNewIcon />} href={url} target="_blank" sx={{color:'white', textTransform:'none'}}>
                                                        {name}
                                                    </Button>
                                                    <IconButton size="small" onClick={() => handleDeleteLink(item._id, i)} sx={{color:'#f44336', padding:'2px'}}>
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </div>
                                            )})
                                        ) : <span style={{color:'#666', fontSize:'0.9em'}}>No links added yet.</span>}

                                        {hiddenLinks.length > 0 && (
                                            <>
                                                <Button 
                                                    variant="outlined" 
                                                    size="small"
                                                    onClick={handleMenuClick} 
                                                    endIcon={<ExpandMoreIcon />}
                                                    sx={{color: '#bf953f', borderColor: '#bf953f', height: '34px'}}
                                                >
                                                    More ({hiddenLinks.length})
                                                </Button>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleMenuClose}
                                                    PaperProps={{ style: { backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #333' } }}
                                                >
                                                    {hiddenLinks.map((linkStr, idx) => {
                                                        const {name, url} = parseLink(linkStr);
                                                        const actualIndex = 5 + idx; 
                                                        return (
                                                            <MenuItem key={idx} sx={{display:'flex', justifyContent:'space-between', gap:'20px', '&:hover':{bgcolor:'rgba(255,255,255,0.1)'}}}>
                                                                <a href={url} target="_blank" rel="noopener noreferrer" style={{color:'white', textDecoration:'none', flex: 1, display:'flex', alignItems:'center'}}>
                                                                    <OpenInNewIcon fontSize="small" sx={{mr: 1, color:'#bf953f'}} /> {name}
                                                                </a>
                                                                <IconButton size="small" onClick={() => handleDeleteLink(item._id, actualIndex)} sx={{color:'#f44336'}}>
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Menu>
                                            </>
                                        )}
                                    </div>

                                    <div style={{borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'15px'}}>
                                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px'}}>
                                            <input 
                                                placeholder="Link Name (e.g., GFG)" 
                                                className="dark-input" 
                                                value={tempLinkName} 
                                                onChange={(e) => setTempLinkName(e.target.value)} 
                                            />
                                            <input 
                                                placeholder="Link URL (https://...)" 
                                                className="dark-input" 
                                                value={tempLinkUrl} 
                                                onChange={(e) => setTempLinkUrl(e.target.value)} 
                                            />
                                        </div>
                                        <Button 
                                            variant="contained" 
                                            startIcon={<AddLinkIcon />} 
                                            size="small" 
                                            sx={{background:'#333', color:'white', width:'100%', '&:hover':{background:'#555'}}} 
                                            onClick={() => handleAddLink(item._id)}
                                        >
                                            Add Link
                                        </Button>
                                    </div>

                                </div>
                                <div style={{background: 'rgba(0,0,0,0.2)', padding:'15px', borderRadius:'10px'}}>
                                    <h4 style={{margin:'0 0 15px 0', color:'#bf953f', display:'flex', alignItems:'center', gap:'10px'}}><ListAltIcon /> Attached Files</h4>
                                    <div style={{marginBottom:'15px', display:'flex', flexDirection:'column', gap:'5px'}}>
                                        {item.files && item.files.length > 0 ? (item.files.map((f, i) => (<div key={i} style={{display:'flex', justifyContent:'space-between', background:'rgba(255,255,255,0.05)', padding:'5px 10px', borderRadius:'5px'}}><span style={{fontSize:'0.9em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'200px'}}>{f.split('_').slice(1).join('_')}</span><a href={`http://127.0.0.1:8001/view/${f}`} target="_blank" style={{color:'#4fc3f7', textDecoration:'none', fontSize:'0.8em', fontWeight:'bold'}}>OPEN</a></div>))) : <span style={{color:'#666', fontSize:'0.9em'}}>No files attached.</span>}
                                    </div>
                                    <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                        <Button component="label" size="small" variant="outlined" startIcon={<CloudUploadIcon />} sx={{color:'#bf953f', borderColor:'#bf953f'}}>Select Files <input type="file" hidden multiple onChange={(e) => handleFileSelect(e, true)} /></Button>
                                        <Button variant="contained" size="small" sx={{background:'#bf953f', color:'black', fontWeight:'bold'}} onClick={() => uploadFilesOnly(item._id)}>Upload Files</Button>
                                    </div>
                                    <div style={{display:'flex', gap:'5px', flexWrap:'wrap', marginTop:'10px'}}>{editFiles.map((f, i) => (<Chip key={i} label={f.name} onDelete={() => removeFile(i, true)} size="small" sx={{bgcolor:'rgba(255,255,255,0.1)', color:'white'}} />))}</div>
                                </div>
                            </div>
                        </div>
                    )}
                  </div>
                );
            })}
          </Box>
        )}

        {/* ... (TAB 2: VISUAL PROGRESS) ... */}
        {tabIndex === 1 && (
          // ⚡ FIXED HEIGHT 400px FOR BAR CHART ⚡
          <Box sx={{ mt: 4, height: 900 }}>
            {chartType === 'Bar' && (
                <div style={{marginBottom:'20px', display:'flex', justifyContent:'center'}}>
                    <FormControl sx={{ m: 1, width: 400, maxWidth:'90%' }}>
                        <InputLabel sx={{color:'white', '&.Mui-focused': {color:'#bf953f'}}}>Select Topics (Max 5)</InputLabel>
                        <Select multiple value={compareList} onChange={handleCompareChange} input={<OutlinedInput label="Select Topics (Max 5)" />} renderValue={(selected) => (<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{selected.map((value) => (<Chip key={value} label={value} sx={{bgcolor:'#bf953f', color:'black', fontWeight:'bold', height:'24px'}} />))}</Box>)} MenuProps={{ PaperProps: { sx: { bgcolor: '#1e1e1e', color:'white', border:'1px solid #333' } } }} sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#bf953f' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#bf953f' }, '.MuiSvgIcon-root': { color: '#bf953f' } }}>{studyData.map((item) => (<MenuItem key={item._id} value={item.topic} sx={{'&.Mui-selected': { bgcolor: 'rgba(191, 149, 63, 0.2)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }}}><Checkbox checked={compareList.indexOf(item.topic) > -1} sx={{color:'white', '&.Mui-checked':{color:'#bf953f'}}} /><ListItemText primary={item.topic} /></MenuItem>))}</Select>
                    </FormControl>
                </div>
            )}
            <div style={{marginBottom: '20px', textAlign:'center'}}>
                <select className="dark-input fixed-select" style={{width: '200px'}} onChange={(e) => setChartType(e.target.value)}>
                    <option value="Bar">Bar Chart</option>
                    <option value="History">Progress History (Line)</option>
                    <option value="Pie">Pie Chart</option>
                </select>
            </div>
            
            {/* ⚡ UNIFIED MARGINS & WHITE TOOLTIPS ⚡ */}
            <ResponsiveContainer width="100%" height="50%">
              {chartType === 'Bar' && (
                <BarChart data={getFilteredChartData()} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                  <XAxis dataKey="topic" tick={chartAxisStyle} stroke="white" />
                  {/* ⚡ FIX 1: Added width={50} to force labels inside ⚡ */}
                  <YAxis tick={chartAxisStyle} stroke="white" domain={[0, 100]} width={50} /> 
                  {/* ⚡ FIX 2: Tooltip background white, text black ⚡ */}
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border:'1px solid #bf953f', color:'black', borderRadius:'5px' }} cursor={{fill: 'rgba(255,255,255,0.1)'}}/>
                  <Bar dataKey="progress" maxBarSize={120}>
                    {getFilteredChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={brightColors[index % brightColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
              
              {chartType === 'History' && (
                <LineChart data={getHistoryChartData()} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                  <XAxis dataKey="date" stroke="white" tick={chartAxisStyle} tickMargin={10} />
                  {/* ⚡ FIX 1: Added width={50} ⚡ */}
                  <YAxis stroke="white" domain={[0, 100]} tick={chartAxisStyle} width={50} />
                  {/* ⚡ FIX 2: Tooltip background white, text black ⚡ */}
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #bf953f', borderRadius: '5px' }} itemStyle={{ color: 'black', fontSize:'14px' }} labelStyle={{ color: '#bf953f', fontWeight: 'bold', marginBottom:'5px' }} />
                  <Legend onClick={handleLegendClick} cursor="pointer" wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => <span style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold', marginRight: '15px', opacity: soloTopic && soloTopic !== value ? 0.2 : 1, transition: 'opacity 0.3s', cursor: 'pointer' }}>{value}</span>} />
                  {studyData.map((topic, index) => (
                    <Line key={topic._id} type="monotone" dataKey={topic.topic} hide={soloTopic && soloTopic !== topic.topic} stroke={brightColors[index % brightColors.length]} connectNulls strokeWidth={3} dot={{r:5, fill: 'white', strokeWidth: 2}} activeDot={{r: 8, stroke: 'white', strokeWidth: 2}} />
                  ))}
                </LineChart>
              )}
              
              {chartType === 'Pie' && (
                // ⚡ FIX 1: Balanced margins for Pie chart centering ⚡
                <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                  <Pie data={studyData} dataKey="progress" nameKey="topic" cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius="90%" fill="#8884d8">
                    {studyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={brightColors[index % brightColors.length]} />
                    ))}
                  </Pie>
                  {/* ⚡ FIX 2: Tooltip background white, text black ⚡ */}
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border:'1px solid #bf953f', color: 'black', borderRadius:'5px' }} />
                  <Legend formatter={(value) => <span style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>{value}</span>} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </Box>
        )}

        {/* ... (TAB 3: JOB TRACKER) ... */}
        {tabIndex === 2 && (
          <Box sx={{ mt: 4 }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
              <input placeholder="Company" className="dark-input" value={newJob.company} onChange={(e) => setNewJob({...newJob, company: e.target.value})} />
              <input placeholder="Role" className="dark-input" value={newJob.role} onChange={(e) => setNewJob({...newJob, role: e.target.value})} />
              <select className="dark-input fixed-select" value={newJob.status} onChange={(e) => setNewJob({...newJob, status: e.target.value})}>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
              </select>
              <input type="date" className="dark-input" value={newJob.date} onChange={(e) => setNewJob({...newJob, date: e.target.value})} />
              <Button variant="contained" sx={{ background: '#bf953f', color: 'black' }} onClick={addJob}>ADD</Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
                {['Applied', 'Interviewing', 'Offer', 'Rejected'].map(status => (
                    <div key={status} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px' }}>
                        <h4 style={{textAlign:'center', borderBottom: `2px solid ${status==='Offer'?'#4caf50':status==='Rejected'?'#f44336':status==='Interviewing'?'#2196f3':'#bf953f'}`}}>{status}</h4>
                        {getJobsByStatus(status).map(job => (
                            <div key={job._id} style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', marginBottom: '5px', borderRadius: '5px', position:'relative' }}>
                                <strong>{job.company}</strong><br/>
                                <small>{job.role}</small><br/>
                                <small style={{color:'#aaa'}}>{formatDate(job.date)}</small>
                                
                                {status === 'Applied' && (<select className="dark-input fixed-select" style={{marginTop:'5px', padding:'5px', fontSize:'0.8em', width:'100%', border:'1px solid #555'}} value={job.status} onChange={(e) => updateJobStatus(job._id, e.target.value)}><option value="Applied" disabled>Applied</option><option value="Interviewing">Interviewing</option><option value="Rejected">Rejected</option></select>)}
                                {status === 'Interviewing' && (<select className="dark-input fixed-select" style={{marginTop:'5px', padding:'5px', fontSize:'0.8em', width:'100%', border:'1px solid #555'}} value={job.status} onChange={(e) => updateJobStatus(job._id, e.target.value)}><option value="Interviewing" disabled>Interviewing</option><option value="Offer">Offer</option><option value="Rejected">Rejected</option></select>)}

                                <div style={{position:'absolute', top: 5, right: 5}}><DeleteIcon fontSize="small" style={{cursor:'pointer', color:'#f44336'}} onClick={() => deleteJob(job._id)} /></div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
          </Box>
        )}

        {/* ... (TAB 4: CALENDARS - SELECTION MODE) ... */}
        {tabIndex === 3 && (
            <Box sx={{ mt: 4 }}>
                {/* ⚡ SHOW SELECTION BUTTONS IF NO CALENDAR SELECTED ⚡ */}
                {calendarView === 'selection' ? (
                    <Grid container spacing={3} sx={{marginBottom: '30px', justifyContent:'center'}}>
                        <Grid item xs={12} md={5}>
                            <Card 
                                onClick={() => setCalendarView('study')} 
                                sx={{ bgcolor: '#1e1e1e', color: 'white', border: '1px solid #bf953f', textAlign: 'center', cursor: 'pointer', height:'200px', display:'flex', flexDirection:'column', justifyContent:'center', '&:hover': {bgcolor: 'rgba(191, 149, 63, 0.1)'} }}
                            >
                                <CardContent>
                                    <SchoolIcon sx={{ fontSize: 60, color: '#bf953f', marginBottom: 1 }} />
                                    <Typography variant="h4" component="div" sx={{fontWeight:'bold'}}>STUDY CALENDAR</Typography>
                                    <Typography sx={{ mt: 1, color: '#aaa' }}>Track your learning deadlines</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Card 
                                onClick={() => setCalendarView('job')}
                                sx={{ bgcolor: '#1e1e1e', color: 'white', border: '1px solid #2196f3', textAlign: 'center', cursor: 'pointer', height:'200px', display:'flex', flexDirection:'column', justifyContent:'center', '&:hover': {bgcolor: 'rgba(33, 150, 243, 0.1)'} }}
                            >
                                <CardContent>
                                    <WorkIcon sx={{ fontSize: 60, color: '#2196f3', marginBottom: 1 }} />
                                    <Typography variant="h4" component="div" sx={{fontWeight:'bold'}}>JOB CALENDAR</Typography>
                                    <Typography sx={{ mt: 1, color: '#aaa' }}>Manage applications & Interviews</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                ) : calendarView === 'study' ? (
                    // ⚡ STUDY CALENDAR VIEW ⚡
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                        <div style={{width:'100%', maxWidth:'800px', marginBottom:'10px', display:'flex', alignItems:'center'}}>
                            <Button startIcon={<ArrowBackIcon />} onClick={() => setCalendarView('selection')} sx={{color:'#bf953f'}}>Back to Selection</Button>
                        </div>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', color: 'black', width: '100%', maxWidth: '800px' }}>
                            <h3 style={{textAlign:'center', color: '#bf953f'}}>Study Plan Calendar</h3>
                            <Calendar tileContent={tileContentStudy} onClickDay={onStudyDateClick} />
                        </div>
                    </div>
                ) : (
                    // ⚡ JOB CALENDAR VIEW ⚡
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                        <div style={{width:'100%', maxWidth:'800px', marginBottom:'10px', display:'flex', alignItems:'center'}}>
                            <Button startIcon={<ArrowBackIcon />} onClick={() => setCalendarView('selection')} sx={{color:'#2196f3'}}>Back to Selection</Button>
                        </div>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', color: 'black', width: '100%', maxWidth: '800px' }}>
                            <h3 style={{textAlign:'center', color: '#2196f3'}}>Job Application Calendar</h3>
                            <Calendar tileContent={tileContentJob} onClickDay={onJobDateClick} />
                            <div style={{marginTop: '20px'}}>
                                <h4>Upcoming Events</h4>
                                {jobs
                                  .filter(j => new Date(j.date) >= new Date().setHours(0,0,0,0)) 
                                  .sort((a,b) => new Date(a.date) - new Date(b.date))
                                  .map(j => (
                                    <div key={j._id} style={{borderBottom:'1px solid #ccc', padding:'5px', display:'flex', alignItems:'center', gap:'10px'}}>
                                        <div style={{width:'10px', height:'10px', borderRadius:'50%', backgroundColor: JOB_COLORS[j.status]}}></div>
                                        <strong>{formatDate(j.date)}:</strong> {j.company} 
                                        <span style={{color: JOB_COLORS[j.status], fontWeight:'bold', fontSize:'0.9em'}}>({j.status})</span>
                                    </div>
                                ))}
                                {jobs.filter(j => new Date(j.date) >= new Date().setHours(0,0,0,0)).length === 0 && <p style={{color:'#777'}}>No upcoming events.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </Box>
        )}
      </div>

      <div style={{textAlign: 'center', marginTop: '50px', color: '#666', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px'}}>
        <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
            <EmailIcon fontSize="small" /> Service Support: <strong>support@studyjobtracker.com</strong>
        </p>
      </div>

      <Dialog open={showLimitWarning} onClose={() => setShowLimitWarning(false)} PaperProps={{ style: { backgroundColor: '#1e1e1e', border: '1px solid #bf953f', color: 'white' } }}>
          <DialogTitle style={{display:'flex', alignItems:'center', gap:'10px', color:'#f44336'}}><WarningIcon /> Limit Exceeded</DialogTitle>
          <DialogContent><p>You can only compare a maximum of <strong>5</strong> topics at a time.</p><p style={{fontSize:'0.9em', color:'#aaa'}}>Please unselect a topic before adding a new one.</p></DialogContent>
          <DialogActions><Button onClick={() => setShowLimitWarning(false)} sx={{color:'#bf953f', fontWeight:'bold'}}>OK</Button></DialogActions>
      </Dialog>

      {/* --- ⚡ NEW STUDY DATE DIALOG (Replaces Big Modal) ⚡ --- */}
      <Dialog open={showStudyDatePopup} onClose={() => setShowStudyDatePopup(false)} PaperProps={{ style: { backgroundColor: '#1e1e1e', border: '1px solid #bf953f', color: 'white' } }}>
          <DialogTitle style={{color:'#bf953f', textAlign:'center'}}>
              {selectedStudyDateDetails?.date} Details
          </DialogTitle>
          <DialogContent>
              {selectedStudyDateDetails && (
                  <>
                    <div style={{marginBottom:'15px'}}>
                        <div style={{color:'#ff9800', fontWeight:'bold', fontSize:'0.9em', marginBottom:'5px'}}>🎯 Due / Overdue Today</div>
                        {selectedStudyDateDetails.targets.length === 0 && <div style={{fontSize:'0.8em', color:'#666', fontStyle:'italic'}}>Nothing due.</div>}
                        {selectedStudyDateDetails.targets.map(t => {
                            const isOverdueItem = isOverdue(t.target_date, t.status);
                            return (
                                <div key={t._id} style={{fontSize:'0.9em', marginLeft:'10px', color: isOverdueItem ? '#f44336' : '#ddd', display:'flex', alignItems:'center', marginBottom:'3px'}}>
                                    <span style={{color: isOverdueItem ? '#f44336' : '#ff9800', marginRight:'5px'}}>•</span> 
                                    {t.topic} 
                                    {isOverdueItem && <span style={{fontSize:'0.8em', marginLeft:'5px'}}>(Overdue since {formatDate(t.target_date)})</span>}
                                </div>
                            );
                        })}
                    </div>
                    
                    <div>
                        <div style={{color:'#fff', fontWeight:'bold', fontSize:'0.9em', marginBottom:'5px'}}>Completed Today</div>
                        {selectedStudyDateDetails.completed.length === 0 && <div style={{fontSize:'0.8em', color:'#666', fontStyle:'italic'}}>Nothing completed.</div>}
                        {selectedStudyDateDetails.completed.map(t => { 
                            const late = isLate(t.actual_end_date, t.target_date); 
                            return (
                                <div key={t._id} style={{fontSize:'0.9em', marginLeft:'10px', color:'#ddd', display:'flex', alignItems:'center'}}>
                                    <span style={{color: late ? '#f44336' : '#4caf50', marginRight:'5px'}}>{late ? '⚠️' : '✔'}</span> 
                                    <span style={{textDecoration: late ? 'none' : 'none', color: late ? '#f44336' : '#4caf50'}}>{t.topic}</span>
                                    {late && <span style={{fontSize:'0.8em', color:'#f44336', marginLeft:'5px'}}>(Late)</span>}
                                </div>
                            ); 
                        })}
                    </div>
                  </>
              )}
          </DialogContent>
          <DialogActions><Button onClick={() => setShowStudyDatePopup(false)} sx={{color:'#bf953f'}}>Close</Button></DialogActions>
      </Dialog>

      {/* --- JOB CALENDAR POPUP --- */}
      <Dialog open={showJobCalendarPopup} onClose={() => setShowJobCalendarPopup(false)} PaperProps={{ style: { backgroundColor: '#1e1e1e', border: '1px solid #2196f3', color: 'white' } }}>
          <DialogTitle style={{color:'#2196f3', textAlign:'center'}}>
              {selectedJobDateDetails?.date} Events
          </DialogTitle>
          <DialogContent>
              {selectedJobDateDetails && selectedJobDateDetails.jobs.length > 0 ? (
                  selectedJobDateDetails.jobs.map(job => (
                      <div key={job._id} style={{marginBottom:'10px', paddingBottom:'10px', borderBottom:'1px solid #333'}}>
                          <div style={{fontSize:'1.1em', fontWeight:'bold'}}>{job.company}</div>
                          <div style={{color:'#aaa'}}>{job.role}</div>
                          <Chip label={job.status} size="small" sx={{marginTop:'5px', bgcolor: JOB_COLORS[job.status], color:'white', fontWeight:'bold'}} />
                      </div>
                  ))
              ) : (
                  <p style={{color:'#aaa', fontStyle:'italic'}}>No events on this date.</p>
              )}
          </DialogContent>
          <DialogActions><Button onClick={() => setShowJobCalendarPopup(false)} sx={{color:'#2196f3'}}>Close</Button></DialogActions>
      </Dialog>

      {/* --- ⚡ SUCCESS VIDEO POP-UP (SMALL WINDOW) ⚡ --- */}
      <Dialog 
        open={showSuccessAnim} 
        onClose={() => setShowSuccessAnim(false)}
        maxWidth="xs" // Makes it a small popup box
        PaperProps={{
            style: {
                backgroundColor: '#1e1e1e', // Dark Card Background
                border: '2px solid #bf953f', // Gold Border
                borderRadius: '15px',
                boxShadow: '0 0 20px rgba(191, 149, 63, 0.5)',
                overflow: 'hidden',
                padding: '10px'
            }
        }}
      >
        <DialogContent style={{ padding: 0, textAlign: 'center', background: '#000', display:'flex', justifyContent:'center', alignItems:'center' }}>
             <video 
               ref={videoRef}
               autoPlay 
               muted 
               playsInline
               onEnded={() => setShowSuccessAnim(false)} // Auto-close when done
               onError={(e) => console.error("Video Error:", e)}
               style={{ 
                   width: '100%', 
                   height: 'auto', 
                   maxHeight: '300px',
                   objectFit: 'contain'
               }} 
             >
                <source src={successVideo} type="video/mp4" />
             </video>
        </DialogContent>
      </Dialog>

      <style>{`
        .quote-container {
          background: rgba(0,0,0,0.3);
          padding: 30px 20px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 20px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .gradient-text {
          font-family: 'Arial Black', sans-serif;
          font-size: 1.8em;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 0;
          background: linear-gradient(to right, #ff0000, #0000ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        .dark-input { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 10px; color: white; border-radius: 5px; width: 100%; outline: none; font-family: inherit; box-sizing: border-box; }
        .fixed-select option { background-color: #333; color: white; }
        .dark-input:focus { border-color: #bf953f; }
        .react-calendar { width: 100%; max-width: 100%; background: white; border: 1px solid #a0a096; font-family: Arial, Helvetica, sans-serif; line-height: 1.125em; }
        .react-calendar__tile { height: 80px; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; }
        .react-calendar__tile--active { background: #bf953f !important; color: black !important; }
      `}</style>
    </div>
  );
};
export default Home;