import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Thermometer, 
  Droplets, 
  Activity, 
  Wind, 
  Zap, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sprout, 
  History, 
  Cpu, 
  Wifi, 
  Save, 
  Download,
  Bell,
  Search,
  Filter,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Lock,
  User,
  Bot,
  Sparkles,
  Send,
  MessageSquare
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';

// --- Gemini API Configuration ---
const apiKey = ""; // API Key will be injected by the environment automatically

// 1. Login Component
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin(username);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col md:flex-row">
        <div className="w-full p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Sprout className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Smart Farm <span className="text-emerald-500">Pro</span></h1>
          </div>
          
          <h2 className="text-xl font-semibold text-slate-700 mb-2">เข้าสู่ระบบ</h2>
          <p className="text-sm text-slate-400 mb-6">กรุณาล็อกอินเพื่อเข้าถึงแผงควบคุมฟาร์ม</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="admin"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-200 flex justify-center items-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : 'เข้าสู่ระบบ'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">System Status: <span className="text-emerald-500 font-medium">Online (ESP32 Ready)</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Mock Data ---
const mockGraphData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  temp: 28 + Math.random() * 5,
  humidity: 60 + Math.random() * 10,
  soilMoisture: 40 + Math.random() * 20,
  ec: 1.2 + Math.random() * 0.5,
  ph: 6.5 + Math.random() * 0.5 - 0.25
}));

const sensorHistoryData = Array.from({ length: 15 }, (_, i) => ({
  id: 1000 + i,
  timestamp: `2023-10-25 ${String(14-i).padStart(2,'0')}:30:00`,
  temp: (30 + Math.random()).toFixed(1),
  humidity: (65 + Math.random() * 5).toFixed(0),
  ph: (6.5 + Math.random() * 0.4).toFixed(1),
  ec: (1.2 + Math.random() * 0.3).toFixed(2),
  n: (120 + Math.random() * 10).toFixed(0),
  p: (45 + Math.random() * 5).toFixed(0),
  k: (180 + Math.random() * 20).toFixed(0),
}));

// --- Main App Component ---
const SmartFarmPro = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  
  // Real-time Data Simulation
  const [sensorData, setSensorData] = useState({
    temp: 32.5,
    humidity: 68,
    soilMoisture: 45,
    ph: 6.8,
    ec: 1.45,
    n: 125,
    p: 42,
    k: 168
  });

  const [devices, setDevices] = useState([
    { id: 'd1', name: 'ปั๊มน้ำหลัก', type: 'pump', status: false, lastActive: '10:30 AM' },
    { id: 'd2', name: 'พัดลมระบายอากาศ', type: 'fan', status: true, lastActive: 'Running' },
    { id: 'd3', name: 'วาล์วพ่นหมอก', type: 'valve', status: false, lastActive: '09:00 AM' },
    { id: 'd4', name: 'ไฟ LED โรงเรือน', type: 'light', status: false, lastActive: 'Yesterday' },
  ]);

  const [rules, setRules] = useState([
    { id: 1, name: 'รดน้ำเมื่อดินแห้ง', condition: 'ความชื้นดิน < 40%', action: 'เปิดปั๊มน้ำ 5 นาที', active: true },
    { id: 2, name: 'ระบายอากาศร้อน', condition: 'อุณหภูมิ > 35°C', action: 'เปิดพัดลม', active: true },
    { id: 3, name: 'เตือนค่า pH', condition: 'pH < 5.5 หรือ > 7.5', action: 'แจ้งเตือน Line Notify', active: false },
  ]);

  // AI Chat State
  const [aiChatHistory, setAiChatHistory] = useState([
    { role: 'model', text: 'สวัสดีครับ ผมคือผู้ช่วย AI ประจำฟาร์มของคุณ มีปัญหาเรื่องการปลูกพืช หรือต้องการวิเคราะห์ข้อมูลฟาร์ม ถามผมได้เลยครับ! 🌱' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatHistory]);

  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        setSensorData(prev => ({
          temp: +(prev.temp + (Math.random() * 0.2 - 0.1)).toFixed(1),
          humidity: Math.round(prev.humidity + (Math.random() * 2 - 1)),
          soilMoisture: Math.round(prev.soilMoisture + (Math.random() * 1 - 0.5)),
          ph: +(prev.ph + (Math.random() * 0.1 - 0.05)).toFixed(1),
          ec: +(prev.ec + (Math.random() * 0.02 - 0.01)).toFixed(2),
          n: prev.n,
          p: prev.p,
          k: prev.k
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const toggleDevice = (id) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, status: !d.status } : d));
  };

  const toggleRule = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  // --- Gemini API Function ---
  const callGeminiAI = async (prompt, isAnalysis = false) => {
    setIsAiThinking(true);
    
    // Construct system context with current sensor data
    const farmContext = `
      Current Farm Sensor Data:
      - Temperature: ${sensorData.temp}°C
      - Humidity: ${sensorData.humidity}%
      - Soil Moisture: ${sensorData.soilMoisture}%
      - pH: ${sensorData.ph}
      - EC: ${sensorData.ec} mS/cm
      - NPK: N=${sensorData.n}, P=${sensorData.p}, K=${sensorData.k} mg/kg
      
      Active Devices: ${devices.filter(d => d.status).map(d => d.name).join(', ') || 'None'}
      
      Role: You are an expert agricultural AI assistant for a Smart Farm system.
      Instruction: Answer in Thai language. Be helpful, concise, and scientific.
      If analyzing data, look for anomalies based on general crop standards (e.g. general vegetables or melons).
    `;

    const fullPrompt = isAnalysis 
      ? `Based on the sensor data provided, please analyze the current farm health status and suggest immediate actions if needed. Keep it to 3 bullet points.`
      : prompt;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: farmContext + "\n\nUser Question: " + fullPrompt }]
            }]
          })
        }
      );

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        if (isAnalysis) {
          // If it's a quick analysis, add to chat history as a special summary
          setAiChatHistory(prev => [
            ...prev, 
            { role: 'user', text: '⚡ วิเคราะห์สุขภาพฟาร์มอัตโนมัติ' },
            { role: 'model', text: aiResponse }
          ]);
        } else {
          // Normal chat
          setAiChatHistory(prev => [...prev, { role: 'model', text: aiResponse }]);
        }
      } else {
        throw new Error("No response from AI");
      }
    } catch (error) {
      console.error("AI Error:", error);
      setAiChatHistory(prev => [...prev, { role: 'model', text: 'ขออภัยครับ ระบบ AI ขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง' }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleSendMessage = () => {
    if (!aiInput.trim()) return;
    
    // Add user message immediately
    setAiChatHistory(prev => [...prev, { role: 'user', text: aiInput }]);
    const currentInput = aiInput;
    setAiInput('');
    
    // Call AI
    callGeminiAI(currentInput);
  };

  const handleQuickAnalysis = () => {
    setActiveTab('ai-assistant');
    callGeminiAI('', true);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={(user) => { setCurrentUser(user); setIsLoggedIn(true); }} />;
  }

  // --- Sub-components for Layout ---

  const SidebarItem = ({ id, icon: Icon, label, special }) => (
    <button 
      onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${
        activeTab === id 
        ? special ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} className={special ? (activeTab !== id ? 'text-indigo-400 group-hover:text-white' : '') : ''} />
      <span className="font-medium">{label}</span>
      {special && <Sparkles size={16} className={`ml-auto ${activeTab === id ? 'text-yellow-300' : 'text-indigo-400'}`} />}
    </button>
  );

  const Card = ({ title, value, unit, icon: Icon, color, subValue, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10 group-hover:opacity-20 transition-opacity`} style={{ backgroundColor: color }}></div>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: color }}>
          <Icon size={24} style={{ color: color }} />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
            {trend === 'up' ? '↑ High' : '↓ Normal'}
          </span>
        )}
      </div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        <span className="text-sm text-slate-400">{unit}</span>
      </div>
      {subValue && <p className="text-xs text-slate-400 mt-2">{subValue}</p>}
    </div>
  );

  const NPKBar = ({ label, value, max, color }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1 font-medium">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-800">{value} mg/kg</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div 
          className="h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${(value/max)*100}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Sprout className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Smart Farm</h1>
            <p className="text-xs text-slate-400">Pro Edition</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="ai-assistant" icon={Bot} label="ผู้ช่วย AI" special={true} />
          <SidebarItem id="sensors" icon={Activity} label="ข้อมูลเซ็นเซอร์" />
          <SidebarItem id="control" icon={Zap} label="ควบคุมอุปกรณ์" />
          <SidebarItem id="history" icon={History} label="ประวัติ & กราฟ" />
          <SidebarItem id="automation" icon={Cpu} label="ระบบอัตโนมัติ" />
          <SidebarItem id="settings" icon={Settings} label="ตั้งค่าระบบ" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all">
            <LogOut size={20} />
            <span className="font-medium">ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

        {/* Header */}
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold text-slate-800 hidden sm:block">
              {activeTab === 'dashboard' && 'ภาพรวมฟาร์ม (Dashboard)'}
              {activeTab === 'ai-assistant' && <span className="flex items-center gap-2 text-indigo-600"><Sparkles size={18} /> ผู้ช่วยฟาร์มอัจฉริยะ (AI Assistant)</span>}
              {activeTab === 'sensors' && 'ข้อมูลเซ็นเซอร์ (Sensor Data)'}
              {activeTab === 'control' && 'ควบคุมอุปกรณ์ (Device Control)'}
              {activeTab === 'history' && 'ประวัติและกราฟ (Analytics)'}
              {activeTab === 'automation' && 'ระบบอัตโนมัติ (Automation Rules)'}
              {activeTab === 'settings' && 'การตั้งค่า (System Settings)'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-xs font-semibold text-emerald-700">ESP32 Online</span>
             </div>
             <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
               <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                 <User size={16} className="text-slate-500" />
               </div>
               <div className="hidden sm:block">
                 <p className="text-sm font-medium text-slate-700">{currentUser || 'Admin'}</p>
                 <p className="text-xs text-slate-400">Owner</p>
               </div>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          
          {/* VIEW: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* AI Insight Banner */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                 <div>
                   <h3 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-yellow-300" /> วิเคราะห์สุขภาพฟาร์มด้วย AI</h3>
                   <p className="text-indigo-100 mt-1 text-sm">ใช้ Gemini AI ประมวลผลค่าเซนเซอร์ทั้งหมดเพื่อหาความผิดปกติและแนะนำแนวทางแก้ไข</p>
                 </div>
                 <button 
                  onClick={handleQuickAnalysis}
                  className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-md hover:bg-indigo-50 transition-all active:scale-95 whitespace-nowrap"
                 >
                   วิเคราะห์ทันที ✨
                 </button>
              </div>

              {/* Top Sensor Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Card 
                  title="อุณหภูมิอากาศ" 
                  value={sensorData.temp} 
                  unit="°C" 
                  icon={Thermometer} 
                  color="#f43f5e" 
                  subValue="Optimal: 28-32°C"
                  trend={sensorData.temp > 32 ? 'up' : 'down'}
                />
                <Card 
                  title="ความชื้นอากาศ" 
                  value={sensorData.humidity} 
                  unit="%" 
                  icon={Droplets} 
                  color="#3b82f6" 
                  subValue="Optimal: 60-70%"
                />
                <Card 
                  title="ความชื้นในดิน" 
                  value={sensorData.soilMoisture} 
                  unit="%" 
                  icon={Sprout} 
                  color="#10b981" 
                  subValue="Status: Moist"
                />
                <Card 
                  title="ความเป็นกรดด่าง" 
                  value={sensorData.ph} 
                  unit="pH" 
                  icon={Activity} 
                  color="#8b5cf6" 
                  subValue="Optimal: 6.0-7.0"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Soil Nutrients (NPK) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                   <div className="flex items-center justify-between mb-6">
                     <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <Sprout size={20} className="text-emerald-500"/> ธาตุอาหารในดิน (NPK)
                     </h3>
                     <span className="text-xs text-slate-400">Update: Realtime</span>
                   </div>
                   <div className="space-y-6">
                     <NPKBar label="Nitrogen (N)" value={sensorData.n} max={200} color="#3b82f6" />
                     <NPKBar label="Phosphorus (P)" value={sensorData.p} max={100} color="#f59e0b" />
                     <NPKBar label="Potassium (K)" value={sensorData.k} max={300} color="#ef4444" />
                   </div>
                   <div className="mt-6 pt-4 border-t border-slate-100">
                     <div className="flex justify-between items-center">
                       <span className="text-sm text-slate-600 font-medium">ค่าการนำไฟฟ้า (EC)</span>
                       <span className="text-xl font-bold text-slate-800">{sensorData.ec} <span className="text-sm font-normal text-slate-400">mS/cm</span></span>
                     </div>
                   </div>
                </div>

                {/* Device Status Quick View */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Zap size={20} className="text-orange-500"/> สถานะอุปกรณ์
                  </h3>
                  <div className="space-y-4">
                    {devices.map(device => (
                      <div key={device.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${device.status ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                          <span className="font-medium text-slate-700">{device.name}</span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${device.status ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                          {device.status ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Automation Log */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Cpu size={20} className="text-purple-500"/> แจ้งเตือนระบบ
                  </h3>
                  <div className="space-y-4 relative pl-4 border-l-2 border-slate-100">
                     <div className="relative mb-4">
                       <span className="absolute -left-[21px] top-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                       <p className="text-xs text-slate-400 mb-1">10:45 AM</p>
                       <p className="text-sm text-slate-700">ระบบอัตโนมัติ: <span className="font-semibold text-emerald-600">เปิดปั๊มน้ำ</span> เนื่องจากความชื้นต่ำกว่า 40%</p>
                     </div>
                     <div className="relative mb-4">
                       <span className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></span>
                       <p className="text-xs text-slate-400 mb-1">09:30 AM</p>
                       <p className="text-sm text-slate-700">Modbus Read: อ่านค่า 7-in-1 สำเร็จ</p>
                     </div>
                     <div className="relative">
                       <span className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></span>
                       <p className="text-xs text-slate-400 mb-1">08:00 AM</p>
                       <p className="text-sm text-slate-700">System Startup: เชื่อมต่อ WiFi สำเร็จ</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: AI ASSISTANT (New Feature) */}
          {activeTab === 'ai-assistant' && (
            <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
               {/* Chat Header */}
               <div className="p-4 border-b border-slate-100 bg-indigo-50 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="bg-indigo-500 p-2 rounded-lg text-white">
                     <Bot size={24} />
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-800">Smart Farm Assistant</h3>
                     <p className="text-xs text-slate-500">Powered by Gemini AI • เชื่อมต่อข้อมูล Real-time</p>
                   </div>
                 </div>
                 <div className="text-xs text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full font-medium hidden sm:block">
                    Live Context: Temp {sensorData.temp}°C | Hum {sensorData.humidity}%
                 </div>
               </div>

               {/* Chat History */}
               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                 {aiChatHistory.map((msg, idx) => (
                   <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl shadow-sm whitespace-pre-line ${
                       msg.role === 'user' 
                       ? 'bg-indigo-600 text-white rounded-tr-none' 
                       : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                     }`}>
                       {msg.role === 'model' && <div className="flex items-center gap-2 mb-2 text-indigo-500 font-bold text-xs"><Sparkles size={12} /> AI Advice</div>}
                       {msg.text}
                     </div>
                   </div>
                 ))}
                 {isAiThinking && (
                   <div className="flex justify-start">
                     <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-slate-500 text-sm">
                       <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                       <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
                       <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                       กำลังวิเคราะห์ข้อมูล...
                     </div>
                   </div>
                 )}
                 <div ref={chatEndRef}></div>
               </div>

               {/* Chat Input */}
               <div className="p-4 bg-white border-t border-slate-100">
                 <div className="flex gap-2 relative">
                   <input 
                    type="text" 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="ถามปัญหาการเกษตร หรือขอคำแนะนำ..."
                    className="flex-1 pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                   />
                   <button 
                    onClick={handleSendMessage}
                    disabled={isAiThinking || !aiInput.trim()}
                    className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
                   >
                     <Send size={18} />
                   </button>
                 </div>
                 <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                   <button onClick={() => setAiInput('วิเคราะห์สุขภาพฟาร์มให้หน่อย')} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-full border border-slate-200 transition-colors whitespace-nowrap">
                     📊 วิเคราะห์ภาพรวม
                   </button>
                   <button onClick={() => setAiInput('ตอนนี้ควรใส่ปุ๋ยไหม?')} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-full border border-slate-200 transition-colors whitespace-nowrap">
                     🧪 ควรใส่ปุ๋ยไหม?
                   </button>
                   <button onClick={() => setAiInput('อากาศร้อนไปสำหรับผักสลัดไหม?')} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-full border border-slate-200 transition-colors whitespace-nowrap">
                     ☀️ อากาศร้อนไปไหม?
                   </button>
                 </div>
               </div>
            </div>
          )}

          {/* VIEW: SENSORS (Data Table) */}
          {activeTab === 'sensors' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="font-bold text-lg text-slate-800">ข้อมูลเซ็นเซอร์ย้อนหลัง (Data Log)</h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                    <Download size={16} /> Export CSV
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                    <Filter size={16} /> Filter
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Timestamp</th>
                      <th className="p-4 font-semibold text-right">Temp (°C)</th>
                      <th className="p-4 font-semibold text-right">Hum (%)</th>
                      <th className="p-4 font-semibold text-right">pH</th>
                      <th className="p-4 font-semibold text-right">EC (mS)</th>
                      <th className="p-4 font-semibold text-right">N (mg)</th>
                      <th className="p-4 font-semibold text-right">P (mg)</th>
                      <th className="p-4 font-semibold text-right">K (mg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {sensorHistoryData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium font-mono text-slate-500">{row.timestamp}</td>
                        <td className="p-4 text-right">{row.temp}</td>
                        <td className="p-4 text-right">{row.humidity}</td>
                        <td className="p-4 text-right">{row.ph}</td>
                        <td className="p-4 text-right">{row.ec}</td>
                        <td className="p-4 text-right text-blue-600">{row.n}</td>
                        <td className="p-4 text-right text-orange-600">{row.p}</td>
                        <td className="p-4 text-right text-red-600">{row.k}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: CONTROL */}
          {activeTab === 'control' && (
            <div>
              <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="text-blue-500 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-blue-700">Manual Control Mode</h4>
                  <p className="text-sm text-blue-600">การกดปุ่มสั่งงานที่นี่จะเป็นการ Override ระบบอัตโนมัติชั่วคราว คำสั่งจะถูกส่งไปยัง ESP32 ผ่าน Modbus</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {devices.map(device => (
                  <div key={device.id} className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all cursor-pointer group ${device.status ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-slate-100 hover:border-slate-300'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-xl transition-colors ${device.status ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {device.type === 'pump' && <Droplets size={32} />}
                        {device.type === 'fan' && <Wind size={32} />}
                        {device.type === 'valve' && <Settings size={32} />}
                        {device.type === 'light' && <Zap size={32} />}
                      </div>
                      <div className={`w-3 h-3 rounded-full ${device.status ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{device.name}</h3>
                    <p className="text-sm text-slate-400 mb-6">Last Active: {device.lastActive}</p>
                    
                    <button 
                      onClick={() => toggleDevice(device.id)}
                      className={`w-full py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2
                        ${device.status 
                          ? 'bg-emerald-500 text-white shadow-emerald-200 hover:bg-emerald-600' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                    >
                      {device.status ? 'กำลังทำงาน (ON)' : 'ปิดการทำงาน (OFF)'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: HISTORY (Graphs) */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex gap-2 mb-4">
                 <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50">วันนี้ (24h)</button>
                 <button className="px-4 py-2 bg-transparent text-slate-400 rounded-lg text-sm font-medium hover:text-slate-600">7 วัน</button>
                 <button className="px-4 py-2 bg-transparent text-slate-400 rounded-lg text-sm font-medium hover:text-slate-600">30 วัน</button>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-6">อุณหภูมิและความชื้นสัมพันธ์ (Temperature & Humidity)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockGraphData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="temp" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" name="Temperature" />
                      <Area type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorHum)" name="Humidity" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-6">ค่าความเป็นกรดด่าง (pH Level)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockGraphData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[0, 14]} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="ph" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                        {/* Reference Line for optimal pH */}
                        <Line type="monotone" dataKey={() => 7} stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Neutral" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-6">ค่าความชื้นในดิน (Soil Moisture)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockGraphData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="soilMoisture" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: AUTOMATION */}
          {activeTab === 'automation' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-lg font-bold text-slate-800">กฎการทำงานอัตโนมัติ (Automation Rules)</h3>
                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium">
                    <Plus size={16} /> เพิ่มกฎใหม่ (Add Rule)
                 </button>
              </div>

              <div className="grid gap-4">
                {rules.map(rule => (
                  <div key={rule.id} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${rule.active ? 'border-l-emerald-500' : 'border-l-slate-300'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-lg text-slate-800">{rule.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${rule.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {rule.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg inline-flex">
                        <span className="font-mono font-medium text-blue-600">IF {rule.condition}</span>
                        <span className="text-slate-400">→</span>
                        <span className="font-mono font-medium text-emerald-600">THEN {rule.action}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                       <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={rule.active} onChange={() => toggleRule(rule.id)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                      <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

           {/* VIEW: SETTINGS */}
           {activeTab === 'settings' && (
            <div className="max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="p-6 border-b border-slate-100">
                 <h3 className="font-bold text-lg text-slate-800">ตั้งค่าระบบ (System Settings)</h3>
                 <p className="text-sm text-slate-400">จัดการการเชื่อมต่อและพารามิเตอร์ต่างๆ ของ ESP32</p>
               </div>
               
               <div className="p-6 space-y-8">
                 {/* Connection Section */}
                 <div>
                   <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                     <Wifi size={18} /> การเชื่อมต่อ (Connection)
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-medium text-slate-600 mb-1">WiFi SSID (ESP32)</label>
                       <input type="text" defaultValue="SmartFarm_2.4G" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-slate-600 mb-1">WiFi Password</label>
                       <input type="password" defaultValue="********" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none" />
                     </div>
                   </div>
                 </div>

                 {/* Notification Section */}
                 <div>
                   <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                     <Bell size={18} /> การแจ้งเตือน (Notification)
                   </h4>
                   <div>
                       <label className="block text-sm font-medium text-slate-600 mb-1">Line Notify Token</label>
                       <div className="flex gap-2">
                         <input type="password" defaultValue="token_xyz_123" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none bg-slate-50" />
                         <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm">Test</button>
                       </div>
                   </div>
                 </div>

                 {/* Threshold Section */}
                 <div>
                   <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                     <Activity size={18} /> ค่าวิกฤต (Thresholds)
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div>
                       <label className="block text-sm font-medium text-slate-600 mb-1">Min Moisture (%)</label>
                       <input type="number" defaultValue="40" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-slate-600 mb-1">Max Temp (°C)</label>
                       <input type="number" defaultValue="35" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-slate-600 mb-1">Min pH</label>
                       <input type="number" defaultValue="5.5" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none" />
                     </div>
                   </div>
                 </div>

                 <div className="pt-6 border-t border-slate-100 flex justify-end">
                   <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
                     <Save size={18} /> บันทึกการตั้งค่า
                   </button>
                 </div>
               </div>
            </div>
           )}

        </div>
      </main>
    </div>
  );
};

export default SmartFarmPro;