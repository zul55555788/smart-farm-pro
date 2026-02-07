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
  MessageSquare, 
  Image as ImageIcon, 
  Camera, 
  Clock, 
  Edit3, 
  Calendar, 
  ChevronRight, 
  FlaskConical, 
  Timer, 
  Repeat, 
  Check, 
  Layers,
  BarChart2
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
  Area,
  Legend,
  ComposedChart
} from 'recharts';

// --- Gemini API Configuration ---
const apiKey = "AIzaSyBo9lG-T9b_uoCKkmRksDxizrGLM-fflhw"; 

// ⚠️ URL ของ Google Apps Script
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbz55C0d_DJdUyVvSBrU1tlJho5ZIybY__0FLcyj4P2C9UGSYYKzBf9mELHjhTz76mvupw/exec";

// 1. Login Component
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      setLoading(false);
      if (username === 'SmartFarmPro' && password === '432548') {
        onLogin(username);
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (กรุณาลองใหม่)');
      }
    }, 800);
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
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="SmartFarmPro" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="••••••••" required />
              </div>
            </div>
            {error && (<div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-sm"><AlertTriangle size={16} />{error}</div>)}
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-200 flex justify-center items-center">{loading ? (<span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>) : 'เข้าสู่ระบบ'}</button>
          </form>
          <div className="mt-6 text-center"><p className="text-xs text-slate-400">System Status: <span className="text-emerald-500 font-medium">Online (ESP32 Ready)</span></p></div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
const SmartFarmPro = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [lastUpdateTime, setLastUpdateTime] = useState('-');

  // 1️⃣ STATE สำหรับข้อมูลจริง
  const [sensorData, setSensorData] = useState({
    airTemp: 0, airHum: 0,
    soilTemp: 0, soilMoisture: 0, ph: 0, ec: 0,
    n: 0, p: 0, k: 0
  });

  // State สำหรับเก็บประวัติเซนเซอร์จริง
  const [realSensorHistory, setRealSensorHistory] = useState([]);
  
  // State สำหรับข้อมูลกราฟที่แปลงแล้ว
  const [graphData, setGraphData] = useState([]);

  // Devices List
  const [devices, setDevices] = useState([
    { id: 'pump1', name: 'ปั๊มน้ำหลัก', type: 'pump', status: false, lastActive: '-', schedule: null },
    { id: 'vitA', name: 'ปั๊มวิตามิน A', type: 'chemical', status: false, lastActive: '-', schedule: null },
    { id: 'vitB', name: 'ปั๊มวิตามิน B', type: 'chemical', status: false, lastActive: '-', schedule: null },
    { id: 'fan', name: 'พัดลมระบายอากาศ', type: 'fan', status: false, lastActive: '-', schedule: null },
    { id: 'led', name: 'ไฟ LED โรงเรือน', type: 'light', status: false, lastActive: '-', schedule: null },
  ]);

  // --- Automation & Other States ---
  const [rules, setRules] = useState([]); 
  const [systemLogs, setSystemLogs] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [schedules, setSchedules] = useState([]); 
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [selectedDeviceForTimer, setSelectedDeviceForTimer] = useState(null);
  const [timerMode, setTimerMode] = useState('timer');
  const [scheduleConfig, setScheduleConfig] = useState({ durationVal: '10', durationUnit: 'minutes', timeSlots: [{ id: 1, time: '08:00', active: true }, { id: 2, time: '12:00', active: false }, { id: 3, time: '17:00', active: false }], repeatMode: 'everyday', selectedDays: [0, 1, 2, 3, 4, 5, 6] });
  const [aiChatHistory, setAiChatHistory] = useState([{ role: 'model', text: 'สวัสดีครับ ผมคือผู้ช่วย AI ประจำฟาร์มของคุณ มีปัญหาเรื่องการปลูกพืช หรือต้องการวิเคราะห์ข้อมูลฟาร์ม ถามผมได้เลยครับ! 🌱' }]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', sensor: 'airTemp', operator: '>', value: '', actionDevice: 'pump1', actionState: 'true' });

  // --- 🟢 REAL DATA FETCHING FUNCTIONS ---
  const fetchRealData = async () => {
    try {
      // 1. Fetch Sensor Data
      const sensorRes = await fetch(`${SHEET_API_URL}?action=getSensor`);
      const sensorJson = await sensorRes.json();
      
      if (sensorJson) {
        setSensorData(prev => ({
          ...prev,
          airTemp: parseFloat(sensorJson.air_temp) || 0,
          airHum: parseFloat(sensorJson.air_humidity) || 0,
          soilTemp: parseFloat(sensorJson.soil_temp) || prev.soilTemp || 0,
          soilMoisture: parseFloat(sensorJson.soil_moisture) || 0,
          ph: parseFloat(sensorJson.ph) || 0,
          ec: parseFloat(sensorJson.ec) || prev.ec || 0,
          n: parseFloat(sensorJson.n) || prev.n || 0,
          p: parseFloat(sensorJson.p) || prev.p || 0,
          k: parseFloat(sensorJson.k) || prev.k || 0,
        }));
        setLastUpdateTime(new Date().toLocaleTimeString('th-TH'));
      }

      // 2. Fetch Device Status
      const deviceRes = await fetch(`${SHEET_API_URL}?action=getDevices`);
      const deviceJson = await deviceRes.json();

      if (Array.isArray(deviceJson)) {
        setDevices(prevDevices => 
          prevDevices.map(localDev => {
            const remoteDev = deviceJson.find(r => r.device === localDev.id || r.device === localDev.name);
            if (remoteDev) {
              return {
                 ...localDev,
                 status: remoteDev.state === 'ON' || remoteDev.state === 1 || remoteDev.state === true
              };
            }
            return localDev;
          })
        );
      }

      // 3. Fetch System Logs
      const logsRes = await fetch(`${SHEET_API_URL}?action=getLogs`);
      const logsJson = await logsRes.json();
      if (Array.isArray(logsJson)) {
        setSystemLogs(logsJson);
      }

      // 4. Fetch Sensor History & Prepare Graph Data
      const historyRes = await fetch(`${SHEET_API_URL}?action=getSensorHistory`);
      const historyJson = await historyRes.json();
      if (Array.isArray(historyJson)) {
          setRealSensorHistory(historyJson);
          
          // แปลงข้อมูลสำหรับกราฟ (กลับด้านเพื่อให้เวลาเดินจากซ้ายไปขวา)
          const formattedGraphData = [...historyJson].reverse().map(item => ({
            time: item.timestamp.split(' ')[1], // เอาแค่เวลา HH:mm
            fullDate: item.timestamp,
            airTemp: parseFloat(item.air_temp),
            airHum: parseFloat(item.air_humidity),
            soilTemp: parseFloat(item.soil_temp),
            soilMoisture: parseFloat(item.soil_moisture),
            ph: parseFloat(item.ph),
            ec: parseFloat(item.ec),
            n: parseFloat(item.n),
            p: parseFloat(item.p),
            k: parseFloat(item.k)
          }));
          setGraphData(formattedGraphData);
      }

      // 5. Fetch Rules
      const rulesRes = await fetch(`${SHEET_API_URL}?action=getRules`);
      const rulesJson = await rulesRes.json();
      if (Array.isArray(rulesJson)) {
          const formattedRules = rulesJson.map(r => ({
              ...r,
              active: r.active === true || r.active === 'TRUE' || r.active === 'true',
              actionState: String(r.actionState)
          }));
          setRules(formattedRules);
      }

    } catch (err) {
      // console.error("Error fetching data:", err); 
    }
  };

  // --- ฟังก์ชันสำหรับส่งคำสั่งไป Google Sheets ---
  const sendControlToAPI = async (deviceId, state, mode = 'manual', duration = 0) => {
    try {
      await fetch(SHEET_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'control_device',
          device_id: deviceId,
          state: state ? 'ON' : 'OFF',
          mode: mode,
          duration: duration
        })
      });
      if(mode === 'manual') setTimeout(() => { fetchRealData(); }, 1000);
    } catch (error) {
      console.error("Error sending command:", error);
    }
  };

  // --- Main Effect: Fetch Loop ---
  useEffect(() => {
    if (isLoggedIn) {
      fetchRealData();
      const interval = setInterval(() => {
        fetchRealData();
      }, 3000); 

      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // --- 🤖 AUTOMATION LOGIC ---
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkAutomation = () => {
      rules.forEach(rule => {
        if (!rule.active) return;

        let currentValue = 0;
        if (rule.sensor === 'airTemp') currentValue = sensorData.airTemp;
        else if (rule.sensor === 'airHum') currentValue = sensorData.airHum;
        else if (rule.sensor === 'soilMoisture') currentValue = sensorData.soilMoisture;
        else if (rule.sensor === 'soilTemp') currentValue = sensorData.soilTemp;
        else if (rule.sensor === 'ph') currentValue = sensorData.ph;
        else if (rule.sensor === 'ec') currentValue = sensorData.ec;

        let isConditionMet = false;
        const ruleValue = parseFloat(rule.value);
        
        if (rule.operator === '>' && currentValue > ruleValue) isConditionMet = true;
        if (rule.operator === '<' && currentValue < ruleValue) isConditionMet = true;
        if (rule.operator === '=' && Math.abs(currentValue - ruleValue) < 0.1) isConditionMet = true;

        if (isConditionMet) {
            if (rule.actionDevice === 'notify') {
                // Future: แจ้งเตือน Line
            } else {
                const targetDevice = devices.find(d => d.id === rule.actionDevice);
                const targetState = String(rule.actionState) === 'true'; 

                if (targetDevice && targetDevice.status !== targetState) {
                    addSystemLog(`🤖 กฎ "${rule.name}" ทำงาน: สั่ง ${targetDevice.name} -> ${targetState ? 'เปิด' : 'ปิด'}`, 'warning');
                    sendControlToAPI(targetDevice.id, targetState, 'auto');
                    setDevices(prev => prev.map(d => d.id === targetDevice.id ? { ...d, status: targetState } : d));
                }
            }
        }
      });
    };

    checkAutomation();

  }, [sensorData, rules, devices, isLoggedIn]);


  // --- Other Helpers ---
  const addSystemLog = (message, type = 'info') => {
    const id = Date.now();
    const newLog = { id, time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }), message, type };
    setSystemLogs(prev => [newLog, ...prev].slice(0, 20));
    setToasts(prev => [...prev, newLog]);
    setTimeout(() => { setToasts(prev => prev.filter(log => log.id !== id)); }, 4000);
  };

  const getDeviceName = (id) => { if (id === 'notify') return 'แจ้งเตือน Line'; const dev = devices.find(d => d.id === id); return dev ? dev.name : id; };
  const getSensorLabel = (key) => { 
      const labels = { 
          airTemp: 'อุณหภูมิอากาศ (DHT11)', 
          airHum: 'ความชื้นอากาศ (DHT11)', 
          soilMoisture: 'ความชื้นดิน (Modbus)', 
          soilTemp: 'อุณหภูมิดิน (Modbus)',
          ph: 'pH (Modbus)', 
          ec: 'EC (Modbus)' 
      }; 
      return labels[key] || key; 
  };

  useEffect(() => { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [aiChatHistory]);

  const handleDeviceClick = (device) => {
    if (device.status) {
      setDevices(prev => prev.map(d => d.id === device.id ? { ...d, status: false } : d));
      addSystemLog(`สั่งปิด ${device.name}`, 'normal');
      sendControlToAPI(device.id, false); 
    } else {
      setSelectedDeviceForTimer(device);
      setScheduleConfig({ durationVal: '10', durationUnit: 'minutes', timeSlots: [{ id: 1, time: '08:00', active: true }, { id: 2, time: '12:00', active: false }, { id: 3, time: '17:00', active: false }], repeatMode: 'everyday', selectedDays: [0, 1, 2, 3, 4, 5, 6] });
      setTimerMode('timer');
      setShowTimerModal(true);
    }
  };

  const confirmTimerSettings = () => {
    if (!selectedDeviceForTimer) return;
    const val = parseInt(scheduleConfig.durationVal);
    if (!val || val <= 0) return;
    let unitLabel = scheduleConfig.durationUnit === 'seconds' ? 'วินาที' : scheduleConfig.durationUnit === 'minutes' ? 'นาที' : 'ชั่วโมง';
    
    if (timerMode === 'timer') {
        let durationMs = val * 1000;
        if (scheduleConfig.durationUnit === 'minutes') durationMs *= 60;
        if (scheduleConfig.durationUnit === 'hours') durationMs *= 3600;

        setDevices(prev => prev.map(d => d.id === selectedDeviceForTimer.id ? { ...d, status: true } : d));
        addSystemLog(`สั่งเปิด ${selectedDeviceForTimer.name} เป็นเวลา ${val} ${unitLabel}`, 'success');
        sendControlToAPI(selectedDeviceForTimer.id, true, 'manual', val); 

        setTimeout(() => {
            setDevices(prev => prev.map(d => {
                if (d.id === selectedDeviceForTimer.id && d.status) {
                    addSystemLog(`ครบเวลา: ปิด ${d.name} อัตโนมัติ`, 'warning');
                    sendControlToAPI(d.id, false); 
                    return { ...d, status: false };
                } return d;
            }));
        }, durationMs);
    } else {
        const newSchedule = { id: Date.now(), deviceId: selectedDeviceForTimer.id, config: { ...scheduleConfig } };
        setSchedules(prev => [...prev.filter(s => s.deviceId !== selectedDeviceForTimer.id), newSchedule]);
        const activeSlots = scheduleConfig.timeSlots.filter(s => s.active).length;
        setDevices(prev => prev.map(d => d.id === selectedDeviceForTimer.id ? { ...d, schedule: `${activeSlots} เวลา` } : d));
        addSystemLog(`ตั้งเวลา ${selectedDeviceForTimer.name} เรียบร้อย`, 'info');
    }
    setShowTimerModal(false);
    setSelectedDeviceForTimer(null);
  };

  const cancelSchedule = (deviceId) => { setSchedules(prev => prev.filter(s => s.deviceId !== deviceId)); setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, schedule: null } : d)); addSystemLog(`ยกเลิกการตั้งเวลาของ ${getDeviceName(deviceId)}`, 'warning'); };
  const toggleDevice = (id) => handleDeviceClick(devices.find(d => d.id === id)); 
  
  const toggleRule = async (id) => {
    const targetRule = rules.find(r => r.id === id);
    if (!targetRule) return;
    const newActiveState = !targetRule.active;

    setRules(prev => prev.map(r => r.id === id ? { ...r, active: newActiveState } : r));
    
    if (!newActiveState) {
        if (targetRule.actionDevice !== 'notify') {
             sendControlToAPI(targetRule.actionDevice, false, 'auto');
             setDevices(prev => prev.map(d => d.id === targetRule.actionDevice ? { ...d, status: false } : d));
             addSystemLog(`⛔ ปิดกฎ "${targetRule.name}" -> สั่งปิด ${getDeviceName(targetRule.actionDevice)} ทันที`, 'warning');
        }
    }

    try {
        await fetch(SHEET_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'toggle_rule',
                rule_id: id,
                active: newActiveState
            })
        });
        if (newActiveState) {
            addSystemLog(`เปลี่ยนสถานะกฎ "${targetRule.name}": เปิดใช้งาน`, 'info');
        }
    } catch (error) {
        console.error("Toggle rule error:", error);
    }
  };

  const deleteRule = async (id, ruleName) => {
    if (window.confirm(`คุณต้องการลบกฎ "${ruleName}" ใช่หรือไม่?`)) {
      setRules(prev => prev.filter(r => r.id !== id));
      addSystemLog(`กำลังลบกฎ: ${ruleName}`, 'warning');
      try {
          await fetch(SHEET_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'delete_rule',
                rule_id: id
            })
          });
          setTimeout(() => { fetchRealData(); }, 1500);
      } catch (error) {
          console.error("Delete rule error:", error);
      }
    }
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    const ruleToAdd = {
        name: newRule.name,
        sensor: newRule.sensor,
        operator: newRule.operator,
        value: parseFloat(newRule.value),
        actionDevice: newRule.actionDevice,
        actionState: newRule.actionState,
        active: true
    };

    const tempId = Date.now();
    setRules(prev => [...prev, { ...ruleToAdd, id: tempId }]);
    setIsAddRuleModalOpen(false);
    setNewRule({ name: '', sensor: 'airTemp', operator: '>', value: '', actionDevice: 'pump1', actionState: 'true' });
    addSystemLog(`กำลังบันทึกกฎ: ${ruleToAdd.name}`, 'info');

    try {
        await fetch(SHEET_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'add_rule',
                ...ruleToAdd
            })
        });
        setTimeout(() => { fetchRealData(); addSystemLog(`บันทึกกฎสำเร็จ`, 'success'); }, 1500);
    } catch (error) {
        console.error("Add rule error:", error);
        addSystemLog(`บันทึกกฎล้มเหลว`, 'warning');
    }
  };

  // --- AI Functions ---
  const convertToBase64 = (file) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error); });
  const handleImageSelect = (e) => { const file = e.target.files[0]; if (file) { const previewUrl = URL.createObjectURL(file); setSelectedImage({ file, previewUrl }); } };
  const clearSelectedImage = () => { if (selectedImage?.previewUrl) URL.revokeObjectURL(selectedImage.previewUrl); setSelectedImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; };
  const callGeminiAI = async (prompt, isAnalysis = false, imageBase64 = null, imageMimeType = null) => {
    setIsAiThinking(true);
    const farmContext = `Current Farm Data (Realtime): Air Temp ${sensorData.airTemp}°C, Air Hum ${sensorData.airHum}%, Soil Moisture ${sensorData.soilMoisture}%, Soil Temp ${sensorData.soilTemp}°C, pH ${sensorData.ph}, EC ${sensorData.ec}. Active Devices: ${devices.filter(d=>d.status).map(d=>d.name).join(',')||'None'}.`;
    const parts = [{ text: farmContext + "\n\nUser: " + (prompt || "Analyze") }];
    if (imageBase64) parts.push({ inline_data: { mime_type: imageMimeType || "image/jpeg", data: imageBase64 } });
    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
    let success = false; let aiResponse = ""; let finalError = "";
    for (const model of models) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts }] }) });
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        if (data.candidates) { aiResponse = data.candidates[0].content.parts[0].text; success = true; break; }
      } catch (e) { finalError = e.message; }
    }
    const msg = { role: 'model', text: success ? aiResponse : `ระบบ AI ขัดข้อง: ${finalError}` };
    setAiChatHistory(prev => isAnalysis ? [...prev, { role: 'user', text: '⚡ วิเคราะห์สุขภาพฟาร์ม' }, msg] : [...prev, msg]);
    setIsAiThinking(false);
  };
  const handleSendMessage = async () => { if (!aiInput.trim() && !selectedImage) return; let img = null, mime = null; let msg = { role: 'user', text: aiInput }; if (selectedImage) { const b64 = await convertToBase64(selectedImage.file); img = b64.split(',')[1]; mime = selectedImage.file.type; msg.image = b64; if (!aiInput.trim()) msg.text = "ส่งรูปภาพ..."; } setAiChatHistory(prev => [...prev, msg]); const txt = aiInput; setAiInput(''); clearSelectedImage(); callGeminiAI(txt, false, img, mime); };
  const handleQuickAnalysis = () => { setActiveTab('ai-assistant'); callGeminiAI('', true); };

  // --- UI Components Helpers ---
  const SidebarItem = ({ id, icon: Icon, label, special }) => ( <button onClick={() => { setActiveTab(id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${activeTab === id ? special ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}> <Icon size={20} className={special ? (activeTab !== id ? 'text-indigo-400 group-hover:text-white' : '') : ''} /> <span className="font-medium">{label}</span> {special && <Sparkles size={16} className={`ml-auto ${activeTab === id ? 'text-yellow-300' : 'text-indigo-400'}`} />} </button> );
  const Card = ({ title, value, unit, icon: Icon, color, subValue, trend, subtitle }) => ( <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow"> <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10 group-hover:opacity-20 transition-opacity`} style={{ backgroundColor: color }}></div> <div className="flex justify-between items-start mb-4"> <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: color }}> <Icon size={24} style={{ color: color }} /> </div> {trend && ( <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}> {trend === 'up' ? '↑ High' : '↓ Normal'} </span> )} </div> <p className="text-slate-500 text-sm font-medium mb-1">{title}</p> <div className="flex items-baseline gap-1"> <h3 className="text-3xl font-bold text-slate-800">{value}</h3> <span className="text-sm text-slate-400">{unit}</span> </div> {subtitle && <p className="text-[10px] uppercase text-slate-400 mt-1 font-semibold tracking-wider">{subtitle}</p>} {subValue && <p className="text-xs text-slate-400 mt-2">{subValue}</p>} </div> );
  const NPKBar = ({ label, value, max, color }) => ( <div className="mb-3"> <div className="flex justify-between text-xs mb-1 font-medium"> <span className="text-slate-600">{label}</span> <span className="text-slate-800">{value} mg/kg</span> </div> <div className="w-full bg-slate-100 rounded-full h-2.5"> <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${(value/max)*100}%`, backgroundColor: color }}></div> </div> </div> );
  // Modals helpers & Render (Keep as provided in previous full code)
  const toggleDaySelection = (dayIndex) => { const currentDays = scheduleConfig.selectedDays; if (currentDays.includes(dayIndex)) { setScheduleConfig({ ...scheduleConfig, selectedDays: currentDays.filter(d => d !== dayIndex) }); } else { setScheduleConfig({ ...scheduleConfig, selectedDays: [...currentDays, dayIndex] }); } };
  const toggleTimeSlot = (id) => { const newSlots = scheduleConfig.timeSlots.map(slot => slot.id === id ? { ...slot, active: !slot.active } : slot); setScheduleConfig({ ...scheduleConfig, timeSlots: newSlots }); };
  const updateTimeSlot = (id, newTime) => { const newSlots = scheduleConfig.timeSlots.map(slot => slot.id === id ? { ...slot, time: newTime } : slot); setScheduleConfig({ ...scheduleConfig, timeSlots: newSlots }); };
  const days = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  if (!isLoggedIn) return <LoginScreen onLogin={(user) => { setCurrentUser(user); setIsLoggedIn(true); }} />;

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans text-slate-800 overflow-hidden relative">
      
      {/* ... (TIMER MODAL & ADD RULE MODAL - ใช้โค้ดเดิมได้เลยครับ ละไว้เพื่อความสั้น) ... */}
      {showTimerModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"><div className="bg-white rounded-2xl p-6 w-full max-w-sm"><h3 className="text-lg font-bold mb-4">ตั้งเวลา {selectedDeviceForTimer?.name}</h3><div className="flex gap-2 mb-4"><input type="number" value={scheduleConfig.durationVal} onChange={e=>setScheduleConfig({...scheduleConfig, durationVal:e.target.value})} className="border p-2 rounded w-full" placeholder="ระยะเวลา"/><select className="border p-2 rounded" onChange={e=>setScheduleConfig({...scheduleConfig, durationUnit:e.target.value})}><option value="minutes">นาที</option><option value="seconds">วินาที</option></select></div><div className="flex gap-2"><button onClick={()=>setShowTimerModal(false)} className="flex-1 p-2 border rounded">ยกเลิก</button><button onClick={confirmTimerSettings} className="flex-1 p-2 bg-emerald-500 text-white rounded">เริ่มทำงาน</button></div></div></div>)}
      {isAddRuleModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white rounded-2xl p-6 w-full max-w-lg"><h3 className="text-lg font-bold mb-4">เพิ่มกฎอัตโนมัติ</h3><form onSubmit={handleAddRule} className="space-y-4"><input type="text" placeholder="ชื่อกฎ" required className="w-full border p-2 rounded" value={newRule.name} onChange={e=>setNewRule({...newRule, name:e.target.value})} /><div className="grid grid-cols-3 gap-2"><select className="border p-2 rounded" value={newRule.sensor} onChange={e=>setNewRule({...newRule, sensor:e.target.value})}><option value="airTemp">อุณหภูมิอากาศ</option><option value="airHum">ความชื้นอากาศ</option><option value="soilMoisture">ความชื้นดิน</option><option value="ph">pH</option><option value="ec">EC</option></select><select className="border p-2 rounded" value={newRule.operator} onChange={e=>setNewRule({...newRule, operator:e.target.value})}><option value=">">มากกว่า</option><option value="<">น้อยกว่า</option></select><input type="number" className="border p-2 rounded" placeholder="ค่า" required value={newRule.value} onChange={e=>setNewRule({...newRule, value:e.target.value})} /></div><div className="grid grid-cols-2 gap-2"><select className="border p-2 rounded" value={newRule.actionDevice} onChange={e=>setNewRule({...newRule, actionDevice:e.target.value})}>{devices.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select><select className="border p-2 rounded" value={newRule.actionState} onChange={e=>setNewRule({...newRule, actionState:e.target.value})}><option value="true">เปิด (ON)</option><option value="false">ปิด (OFF)</option></select></div><div className="flex gap-2 pt-4"><button type="button" onClick={()=>setIsAddRuleModalOpen(false)} className="flex-1 p-2 border rounded">ยกเลิก</button><button type="submit" className="flex-1 p-2 bg-emerald-500 text-white rounded">บันทึก</button></div></form></div></div>)}


      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800"><div className="bg-emerald-500 p-2 rounded-lg"><Sprout className="text-white" size={20} /></div><div><h1 className="text-xl font-bold tracking-tight">Smart Farm</h1><p className="text-xs text-slate-400">Pro Edition</p></div></div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="ai-assistant" icon={Bot} label="ผู้ช่วย AI" special={true} />
          <SidebarItem id="sensors" icon={Activity} label="ข้อมูลเซ็นเซอร์" />
          <SidebarItem id="control" icon={Zap} label="ควบคุมอุปกรณ์" />
          <SidebarItem id="history" icon={History} label="ประวัติ & กราฟ" />
          <SidebarItem id="automation" icon={Cpu} label="ระบบอัตโนมัติ" />
          <SidebarItem id="settings" icon={Settings} label="ตั้งค่าระบบ" />
        </nav>
        <div className="p-4 border-t border-slate-800"><button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all"><LogOut size={20} /><span className="font-medium">ออกจากระบบ</span></button></div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 z-20 sticky top-0">
             <div className="flex items-center gap-4"><button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Menu size={24} /></button><h2 className="text-lg font-bold text-slate-800 hidden sm:block">Smart Farm Dashboard</h2></div>
             <div className="flex items-center gap-4"><div className="text-right hidden xl:block"><p className="text-xs text-slate-400">Last Update</p><p className="text-sm font-mono font-medium text-slate-600">{lastUpdateTime}</p></div><div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span className="text-xs font-semibold text-emerald-700">Online</span></div><div className="flex items-center gap-3 pl-4 border-l border-slate-200"><div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><User size={16} className="text-slate-500" /></div></div></div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Cards & Widgets */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4"><div><h3 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-yellow-300" /> วิเคราะห์สุขภาพฟาร์มด้วย AI</h3><p className="text-indigo-100 mt-1 text-sm">ใช้ Gemini AI ประมวลผลค่าเซนเซอร์ทั้งหมดเพื่อหาความผิดปกติและแนะนำแนวทางแก้ไข</p></div><button onClick={handleQuickAnalysis} className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-md hover:bg-indigo-50 transition-all active:scale-95 whitespace-nowrap">วิเคราะห์ทันที ✨</button></div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Wind size={16}/> สภาพอากาศ (DHT11)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"><Card title="อุณหภูมิอากาศ" value={sensorData.airTemp} unit="°C" icon={Thermometer} color="#f43f5e" subValue="DHT11 Sensor" subtitle="Air Temp" /><Card title="ความชื้นอากาศ" value={sensorData.airHum} unit="%" icon={Droplets} color="#3b82f6" subValue="DHT11 Sensor" subtitle="Air Humidity" /></div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Layers size={16}/> ดินและปุ๋ย (7-in-1 Modbus RS485)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"><Card title="ความชื้นในดิน" value={sensorData.soilMoisture} unit="%" icon={Sprout} color="#10b981" subtitle="Soil Moisture" /><Card title="อุณหภูมิดิน" value={sensorData.soilTemp} unit="°C" icon={Thermometer} color="#f59e0b" subtitle="Soil Temp" /><Card title="ค่า pH" value={sensorData.ph} unit="pH" icon={Activity} color="#8b5cf6" subtitle="Acidity" /><Card title="ค่า EC" value={sensorData.ec} unit="mS/cm" icon={Zap} color="#6366f1" subtitle="Conductivity" /></div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6"><div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"><div className="flex items-center justify-between mb-6"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Sprout size={20} className="text-emerald-500"/> ธาตุอาหาร (NPK)</h3><span className="text-xs text-slate-400">7-in-1 Sensor</span></div><div className="space-y-6"><NPKBar label="Nitrogen (N)" value={sensorData.n} max={200} color="#3b82f6" /><NPKBar label="Phosphorus (P)" value={sensorData.p} max={100} color="#f59e0b" /><NPKBar label="Potassium (K)" value={sensorData.k} max={300} color="#ef4444" /></div></div><div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 xl:col-span-2"><h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Cpu size={20} className="text-purple-500"/> ประวัติการทำงานระบบ (System Logs)</h3><div className="space-y-4 relative pl-4 border-l-2 border-slate-100 max-h-[250px] overflow-y-auto">{systemLogs.length === 0 ? (<p className="text-sm text-slate-400">ยังไม่มีการแจ้งเตือนใหม่</p>) : (systemLogs.map(log => (<div key={log.id} className="relative mb-4 last:mb-0"><span className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${log.type === 'success' ? 'bg-emerald-500' : log.type === 'warning' ? 'bg-orange-500' : log.type === 'info' ? 'bg-blue-500' : 'bg-slate-400'}`}></span><p className="text-xs text-slate-400 mb-1">{log.time}</p><p className="text-sm text-slate-700">{log.message}</p></div>)))}</div></div></div>
            </div>
          )}

          {/* AI, SENSORS, CONTROL, SETTINGS ... (เหมือนเดิม) */}
          {/* ... (Copy ส่วน AI, Sensors, Control, Settings จากโค้ดเดิมได้เลย หรือใช้จากไฟล์ที่แล้วก็ได้ครับ) ... */}

          {/* HISTORY (ฉบับปรับปรุง) */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Wind size={20} className="text-blue-500"/> สภาพอากาศ (Air Condition)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={graphData}>
                      <defs>
                        <linearGradient id="colorAirTemp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                        <linearGradient id="colorAirHum" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend />
                      <Area type="monotone" dataKey="airTemp" stroke="#f43f5e" fill="url(#colorAirTemp)" name="Air Temp (°C)" strokeWidth={2} />
                      <Area type="monotone" dataKey="airHum" stroke="#3b82f6" fill="url(#colorAirHum)" name="Air Humidity (%)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                 <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Layers size={20} className="text-emerald-500"/> ดิน (Soil Condition)</h3>
                 <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={graphData}>
                         <defs>
                           <linearGradient id="colorSoilHum" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                           <linearGradient id="colorSoilTemp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="time" />
                         <YAxis />
                         <Tooltip contentStyle={{ borderRadius: '12px' }} />
                         <Legend />
                         <Area type="monotone" dataKey="soilMoisture" stroke="#10b981" fill="url(#colorSoilHum)" name="Soil Moisture (%)" strokeWidth={2} />
                         <Area type="monotone" dataKey="soilTemp" stroke="#f59e0b" fill="url(#colorSoilTemp)" name="Soil Temp (°C)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Activity size={20} className="text-purple-500"/> เคมีในดิน (Chemical)</h3>
                    <div className="h-64 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={graphData}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
                             <XAxis dataKey="time" hide />
                             <YAxis yAxisId="left" domain={[0, 14]} label={{ value: 'pH', angle: -90, position: 'insideLeft' }} />
                             <YAxis yAxisId="right" orientation="right" domain={[0, 5]} label={{ value: 'EC', angle: 90, position: 'insideRight' }} />
                             <Tooltip />
                             <Legend />
                             <Line yAxisId="left" type="monotone" dataKey="ph" stroke="#8b5cf6" name="pH" strokeWidth={2} dot={false} />
                             <Line yAxisId="right" type="monotone" dataKey="ec" stroke="#6366f1" name="EC (mS/cm)" strokeWidth={2} dot={false} />
                          </ComposedChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Sprout size={20} className="text-green-600"/> ธาตุอาหาร (Nutrients)</h3>
                    <div className="h-64 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={graphData}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
                             <XAxis dataKey="time" hide />
                             <YAxis />
                             <Tooltip />
                             <Legend />
                             <Bar dataKey="n" fill="#3b82f6" name="N" stackId="a" />
                             <Bar dataKey="p" fill="#f59e0b" name="P" stackId="a" />
                             <Bar dataKey="k" fill="#ef4444" name="K" stackId="a" />
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* ... (Tabs อื่นๆ automation, settings เหมือนเดิม) ... */}
          {activeTab === 'automation' && <div className="space-y-6"><div className="flex justify-between items-center"><h3 className="text-lg font-bold text-slate-800">กฎการทำงานอัตโนมัติ (Automation Rules)</h3><button onClick={() => setIsAddRuleModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium shadow-md shadow-slate-200"><Plus size={16} /> เพิ่มกฎใหม่ (Add Rule)</button></div><div className="grid gap-4">{rules.map(rule => (<div key={rule.id} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${rule.active ? 'border-l-emerald-500' : 'border-l-slate-300'}`}><div className="flex-1"><div className="flex items-center gap-2 mb-2"><h4 className="font-bold text-lg text-slate-800">{rule.name}</h4><span className={`px-2 py-0.5 rounded text-xs font-bold ${rule.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{rule.active ? 'ACTIVE' : 'INACTIVE'}</span></div><div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg inline-flex flex-wrap"><span className="font-mono font-medium text-blue-600 uppercase flex items-center gap-1">IF {getSensorLabel(rule.sensor)} {rule.operator} {rule.value}</span><span className="text-slate-400"><ChevronRight size={16}/></span><span className="font-mono font-medium text-emerald-600 uppercase flex items-center gap-1">THEN {getDeviceName(rule.actionDevice)} {rule.actionDevice === 'notify' ? '' : (rule.actionState ? '(ON)' : '(OFF)')}</span></div></div><div className="flex items-center gap-4"><label className="relative inline-flex items-center cursor-pointer" title="เปิด/ปิด กฎนี้"><input type="checkbox" checked={rule.active} onChange={() => toggleRule(rule.id)} className="sr-only peer" /><div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div></label><button onClick={() => deleteRule(rule.id, rule.name)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="ลบกฎ"><Trash2 size={20} /></button></div></div>))}</div></div>}
          
          {/* ... (Toasts) ... */}
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map(log => (
                <div key={log.id} className="bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-in slide-in-from-right duration-300">
                    <div className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-emerald-500' : log.type === 'warning' ? 'bg-orange-500' : log.type === 'info' ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                    <div><p className="text-xs text-slate-400">{log.time}</p><p className="text-sm font-medium text-slate-700">{log.message}</p></div>
                </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default SmartFarmPro;