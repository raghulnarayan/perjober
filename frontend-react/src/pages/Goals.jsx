import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TitleCard from '../components/TitleCard';
import { IconButton, Checkbox, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Goals = () => {
  const { state } = useLocation(); // Get topic data passed from Home
  const navigate = useNavigate();
  const [topic, setTopic] = useState(state?.topicData);
  const [newTask, setNewTask] = useState('');

  if (!topic) return <div style={{color:'white', padding:'20px'}}>No topic selected. <button onClick={() => navigate('/home')}>Go Back</button></div>;

  const toggleGoal = async (goalId, currentStatus) => {
    // Toggle the 'done' status
    const updatedGoals = topic.goals.map(g => g.id === goalId ? { ...g, done: !currentStatus } : g);
    await updateBackend(updatedGoals);
  };

  const addGoal = async () => {
    if (!newTask) return;
    // New tasks are always done: false (Pending)
    const newGoalObj = { id: crypto.randomUUID(), task: newTask, done: false };
    const updatedGoals = [...(topic.goals || []), newGoalObj];
    await updateBackend(updatedGoals);
    setNewTask('');
  };

  const deleteGoal = async (goalId) => {
    const updatedGoals = topic.goals.filter(g => g.id !== goalId);
    await updateBackend(updatedGoals);
  };

  const updateBackend = async (newGoals) => {
    setTopic({ ...topic, goals: newGoals }); // Optimistic UI update
    await axios.put(`http://127.0.0.1:8001/study/${topic._id}/goals`, { goals: newGoals });
  };

  // Split goals into two lists
  const pendingGoals = topic.goals?.filter(g => !g.done) || [];
  const completedGoals = topic.goals?.filter(g => g.done) || [];

  return (
    <div style={{ minHeight: '100vh', padding: '20px', color: 'white' }}>
      <TitleCard />
      <div className="glass-card" style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px' }}>
        
        {/* Header */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
             <h2 style={{ margin:0, borderBottom: '2px solid #bf953f', paddingBottom: '5px', textTransform:'capitalize' }}>
                Goals: <span style={{color:'#bf953f'}}>{topic.topic}</span>
             </h2>
             <Button variant="outlined" onClick={() => navigate('/home')} sx={{ color: '#bf953f', borderColor: '#bf953f' }}>
                ← Back to Plan
             </Button>
        </div>

        {/* Input Area */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background:'rgba(255,255,255,0.05)', padding:'15px', borderRadius:'10px' }}>
          <input 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)} 
            placeholder="Add new sub-task..." 
            onKeyDown={(e) => e.key === 'Enter' && addGoal()}
            style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #555', background:'transparent', color:'white', outline:'none' }} 
          />
          <Button 
            onClick={addGoal} 
            variant="contained" 
            startIcon={<AddCircleIcon />}
            sx={{ background: '#bf953f', color: 'black', fontWeight: 'bold', '&:hover': {background:'#a07d32'} }}
          >
            ADD
          </Button>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            {/* COLUMN 1: PENDING */}
            <div className="goal-column">
                <h3 style={{color:'#f44336', borderBottom:'1px solid #f44336', paddingBottom:'10px', marginTop:0}}>
                    ⏳ Pending ({pendingGoals.length})
                </h3>
                <div className="goal-list">
                    {pendingGoals.length === 0 && <p style={{color:'#666', fontStyle:'italic'}}>No pending tasks.</p>}
                    {pendingGoals.map((g) => (
                        <div key={g.id} className="goal-item" style={{borderLeft:'3px solid #f44336'}}>
                            <Checkbox 
                                checked={g.done} 
                                onChange={() => toggleGoal(g.id, g.done)} 
                                sx={{ color: '#aaa', '&.Mui-checked': { color: '#bf953f' } }} 
                            />
                            <span style={{ flex: 1 }}>{g.task}</span>
                            <IconButton color="error" size="small" onClick={() => deleteGoal(g.id)}><DeleteIcon /></IconButton>
                        </div>
                    ))}
                </div>
            </div>

            {/* COLUMN 2: COMPLETED */}
            <div className="goal-column">
                <h3 style={{color:'#4caf50', borderBottom:'1px solid #4caf50', paddingBottom:'10px', marginTop:0}}>
                    ✅ Completed ({completedGoals.length})
                </h3>
                <div className="goal-list">
                    {completedGoals.length === 0 && <p style={{color:'#666', fontStyle:'italic'}}>No completed tasks yet.</p>}
                    {completedGoals.map((g) => (
                        <div key={g.id} className="goal-item completed-item" style={{borderLeft:'3px solid #4caf50'}}>
                            <Checkbox 
                                checked={g.done} 
                                onChange={() => toggleGoal(g.id, g.done)} 
                                sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }} 
                            />
                            <span style={{ flex: 1, textDecoration: 'line-through', color: '#aaa' }}>{g.task}</span>
                            <IconButton color="error" size="small" onClick={() => deleteGoal(g.id)}><DeleteIcon /></IconButton>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>

      <style>{`
        .goal-column {
            background: rgba(0,0,0,0.2);
            padding: 20px;
            border-radius: 10px;
            min-height: 300px;
        }
        .goal-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .goal-item {
            display: flex; 
            align-items: center; 
            background: rgba(255,255,255,0.05); 
            padding: 8px; 
            borderRadius: 5px;
            transition: 0.2s;
        }
        .goal-item:hover {
            background: rgba(255,255,255,0.1);
        }
        .completed-item {
            opacity: 0.7;
        }
      `}</style>
    </div>
  );
};
export default Goals;