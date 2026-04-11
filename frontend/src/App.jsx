import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CloudRain, CloudSun, Droplets, Leaf, ShieldAlert,
    Sprout, MapPin, Ruler, Scaling, Tractor, LogOut, CheckCircle, Lightbulb, Moon, Sun, Plus, Trash2
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

const useAuthToken = () => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const saveToken = (userToken) => {
        localStorage.setItem('token', userToken);
        setToken(userToken);
    };
    const removeToken = () => {
        localStorage.removeItem('token');
        setToken(null);
    };
    return { token, saveToken, removeToken };
};

const api = {
    login: (username, password) => fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }),
    register: (username, password, farmDetails) => fetch(`${API_BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password, farmDetails }) }),
    getFarmDetails: (token) => fetch(`${API_BASE_URL}/farm`, { headers: { 'Authorization': `Bearer ${token}` } }),
    updateFarmDetails: (token, farmDetails) => fetch(`${API_BASE_URL}/farm`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(farmDetails) }),
    getCropInfo: (token, cropName) => fetch(`${API_BASE_URL}/crop/${cropName}`, { headers: { 'Authorization': `Bearer ${token}` } }),
    getWeatherForecast: (token, location) => fetch(`${API_BASE_URL}/weather/forecast?location=${location}`, { headers: { 'Authorization': `Bearer ${token}` } }),
};

const Card = ({ children, className = '' }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass dark:glass-dark rounded-2xl p-6 ${className}`}>
        {children}
    </motion.div>
);

const Button = ({ children, onClick, className = '', disabled = false, variant = 'primary', size = 'default' }) => {
    const defaultSize = size === 'sm' ? 'py-1.5 px-4 text-sm' : 'py-3 px-6';
    const baseStyle = `font-semibold ${defaultSize} rounded-xl transition duration-300 focus:outline-none flex items-center justify-center gap-2 shadow-sm whitespace-nowrap`;
    const variants = {
        primary: "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50",
        secondary: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700",
        outline: "bg-transparent text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400"
    };
    return (
        <button onClick={onClick} disabled={disabled} type={onClick ? "button" : "submit"} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

const Spinner = () => (
    <div className="flex justify-center items-center h-full p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-emerald-200 border-t-emerald-600"></div>
    </div>
);

const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50/80 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center mb-4 text-sm font-medium transition-all">
            <ShieldAlert className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{message}</span>
        </motion.div>
    );
};

const validateCrops = (acres, crops) => {
    const totalAcreage = parseFloat(acres) || 0;
    const allocated = crops.reduce((sum, c) => sum + (parseFloat(c.acresAllocated) || 0), 0);
    if (allocated > totalAcreage) return `Crop allocations (${allocated} acres) exceed total farm size (${totalAcreage} acres).`;
    if (crops.length === 0) return 'You must add at least one crop.';
    return '';
};

// Pages
const LoginPage = ({ onLogin, onSwitch }) => {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const res = await api.login(user, pass);
            if (res.ok) onLogin((await res.json()).token);
            else setError('Invalid credentials.');
        } catch { setError('Connection failed.'); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gradient-mesh dark:bg-slate-900 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-dark sm:w-full max-w-md p-8 rounded-[2rem] text-slate-100">
                <div className="text-center mb-8">
                    <div className="bg-emerald-500/20 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"><Leaf className="text-emerald-400 w-8 h-8" /></div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">TerraConnect</h1>
                    <p className="text-slate-400 mt-2">Welcome back to your digital farm</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <ErrorMessage message={error} />
                    <input type="text" placeholder="Username" value={user} onChange={e => setUser(e.target.value)} required className="w-full bg-slate-800/50 border border-slate-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition" />
                    <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required className="w-full bg-slate-800/50 border border-slate-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition" />
                    <Button type="submit" disabled={loading} className="w-full mt-6 !bg-gradient-to-r from-emerald-500 to-teal-500 border-none">
                        {loading ? 'Entering...' : 'Sign In'}
                    </Button>
                </form>
                <p className="text-center text-slate-400 mt-6 text-sm">
                    New to TerraConnect? <button onClick={onSwitch} className="text-emerald-400 hover:text-emerald-300 font-medium">Create an account</button>
                </p>
            </motion.div>
        </div>
    );
};

const RegisterPage = ({ onRegister, onSwitch }) => {
    const [user, setUser] = useState(''); const [pass, setPass] = useState('');
    const [farm, setFarm] = useState({ acres: '', soilType: '', location: '', crops: [{ cropName: '', acresAllocated: '', expectedYield: '' }] });
    const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const validationError = validateCrops(farm.acres, farm.crops);
        if (validationError) return setError(validationError);
        
        setLoading(true); setError('');
        try {
            const res = await api.register(user, pass, farm);
            if (res.ok) onRegister((await res.json()).token);
            else setError(await res.text() || 'Registration failed.');
        } catch { setError('Connection failed.'); } finally { setLoading(false); }
    };

    const handleCropChange = (index, field, val) => {
        const nc = [...farm.crops];
        nc[index][field] = val;
        setFarm({...farm, crops: nc});
    };

    const addCrop = () => setFarm({...farm, crops: [...farm.crops, {cropName: '', acresAllocated: '', expectedYield: ''}]});
    const removeCrop = (i) => setFarm({...farm, crops: farm.crops.filter((_, idx)=>idx!==i)});

    return (
        <div className="min-h-screen bg-gradient-mesh dark:bg-slate-900 flex items-center justify-center p-4 py-12">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass dark:glass-dark dark:bg-slate-800 w-full max-w-2xl p-8 rounded-[2rem]">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Start Your Journey</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Join the polyculture farming network</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <ErrorMessage message={error} />
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Username" value={user} onChange={e => setUser(e.target.value)} required className="col-span-2 w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 dark:text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                        <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required className="col-span-2 w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 dark:text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                        
                        <div className="col-span-2 mt-4 mb-2"><h3 className="font-semibold text-slate-700 dark:text-slate-300">Total Farm Property</h3></div>
                        <input type="number" min="0" placeholder="Total Acres" value={farm.acres} onChange={e => setFarm({...farm, acres: e.target.value})} required className="w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 dark:text-white px-4 py-3 rounded-xl outline-none" />
                        <input placeholder="Base Soil (e.g. Alluvial)" value={farm.soilType} onChange={e => setFarm({...farm, soilType: e.target.value})} required className="w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 dark:text-white px-4 py-3 rounded-xl outline-none" />
                        <input placeholder="Location" value={farm.location} onChange={e => setFarm({...farm, location: e.target.value})} required className="col-span-2 w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 dark:text-white px-4 py-3 rounded-xl outline-none" />
                        
                        <div className="col-span-2 mt-4 flex items-center justify-between border-b dark:border-slate-700 pb-2">
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Crop Partitions</h3>
                            <Button type="button" onClick={addCrop} variant="outline" size="sm"><Plus className="w-4 h-4"/> Add Crop</Button>
                        </div>
                        {farm.crops.map((c, i) => (
                            <div key={i} className="col-span-2 grid grid-cols-12 gap-2 bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700 relative">
                                <input placeholder="Crop Name (e.g. Tomato)" required value={c.cropName} onChange={e=>handleCropChange(i, 'cropName', e.target.value)} className="col-span-4 bg-white dark:bg-slate-800 border p-2 rounded-lg dark:border-slate-600 dark:text-white" />
                                <input type="number" min="0" placeholder="Acres" required value={c.acresAllocated} onChange={e=>handleCropChange(i, 'acresAllocated', e.target.value)} className="col-span-3 bg-white dark:bg-slate-800 border p-2 rounded-lg dark:border-slate-600 dark:text-white" />
                                <input type="number" min="0" placeholder="Yield (T)" required value={c.expectedYield} onChange={e=>handleCropChange(i, 'expectedYield', e.target.value)} className="col-span-4 bg-white dark:bg-slate-800 border p-2 rounded-lg dark:border-slate-600 dark:text-white" />
                                {farm.crops.length > 1 && <button type="button" onClick={()=>removeCrop(i)} className="col-span-1 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-lg"><Trash2 className="w-5 h-5"/></button>}
                            </div>
                        ))}
                    </div>
                    <Button type="submit" disabled={loading} className="w-full mt-8 shadow-lg">
                        {loading ? 'Creating Ecosystem...' : 'Establish Farm'}
                    </Button>
                </form>
                <p className="text-center text-slate-500 dark:text-slate-400 mt-6 text-sm">
                    Already registered? <button onClick={onSwitch} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-semibold">Sign in</button>
                </p>
            </motion.div>
        </div>
    );
};

const MetricCard = ({ title, value, icon: Icon, colorClass, delay=0 }) => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
        <div className={`p-4 rounded-xl ${colorClass}`}>
            <Icon className="w-7 h-7" />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white max-w-[200px] truncate" title={value}>{value}</p>
        </div>
    </motion.div>
);

const FarmDashboard = ({ token, farm, onUpdate }) => {
    const [edit, setEdit] = useState(false);
    const [data, setData] = useState(farm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => setData(farm), [farm]);

    const handleSave = async () => {
        const valError = validateCrops(data.acres, data.crops);
        if (valError) return setError(valError);
        
        setLoading(true); setError('');
        try {
            const res = await api.updateFarmDetails(token, data);
            if (res.ok) onUpdate(await res.json());
            setEdit(false);
        } catch { setError('Failed to update cluster.'); } finally { setLoading(false); }
    };

    const handleCropChange = (index, field, val) => {
        const nc = [...data.crops];
        nc[index][field] = val;
        setData({...data, crops: nc});
    };
    const addCrop = () => setData({...data, crops: [...data.crops, {cropName: '', acresAllocated: '', expectedYield: ''}]});
    const removeCrop = (i) => setData({...data, crops: data.crops.filter((_, idx)=>idx!==i)});

    if (!farm) return null;

    const aggregateYield = farm.crops.reduce((s, c) => s + (parseFloat(c.expectedYield) || 0), 0);
    const primaryCrop = farm.crops.length > 0 ? farm.crops.reduce((max, c) => (c.acresAllocated > max.acresAllocated) ? c : max) : {cropName: 'None'};
    const cropsList = farm.crops.map(c => c.cropName).join(', ');

    return (
        <div className="space-y-6">
            <ErrorMessage message={error} />
            <div className="flex justify-between items-center bg-white/50 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><MapPin className="text-emerald-500"/> {data.location}</h2>
                    <p className="text-slate-500 dark:text-slate-400">Polyculture configuration dashboard</p>
                </div>
                {!edit ? <Button onClick={() => setEdit(true)} variant="outline" size="sm">Edit Farm</Button> :
                 <div className="flex gap-2"><Button onClick={handleSave} disabled={loading} size="sm">Save</Button><Button onClick={()=>{setEdit(false); setData(farm); setError('');}} variant="secondary" size="sm">Cancel</Button></div>}
            </div>

            {edit && (
                <Card className="bg-white dark:bg-slate-800 !border-emerald-100 dark:!border-emerald-900 border-2 space-y-4">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pb-4 border-b dark:border-slate-700">
                        <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Acres</label><input type="number" min="0" value={data.acres} onChange={e=>setData({...data, acres: e.target.value})} className="mt-1 w-full p-2 bg-slate-50 dark:bg-slate-700 dark:text-white border dark:border-slate-600 rounded-lg" /></div>
                        <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Base Soil</label><input value={data.soilType} onChange={e=>setData({...data, soilType: e.target.value})} className="mt-1 w-full p-2 bg-slate-50 dark:bg-slate-700 dark:text-white border dark:border-slate-600 rounded-lg" /></div>
                        <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Location</label><input value={data.location} onChange={e=>setData({...data, location: e.target.value})} className="mt-1 w-full p-2 bg-slate-50 dark:bg-slate-700 dark:text-white border dark:border-slate-600 rounded-lg" /></div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Designated Zones</label>
                            <Button onClick={addCrop} variant="secondary" size="sm"><Plus className="w-4 h-4"/> Add Zone</Button>
                        </div>
                        <div className="space-y-2">
                            {data.crops.map((c, i) => (
                                <div key={i} className="flex gap-2 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg items-center">
                                    <input placeholder="Crop" value={c.cropName} onChange={e=>handleCropChange(i, 'cropName', e.target.value)} className="w-1/3 bg-white dark:bg-slate-800 p-2 border dark:border-slate-600 rounded dark:text-white text-sm" />
                                    <input type="number" min="0" placeholder="Acres" value={c.acresAllocated} onChange={e=>handleCropChange(i, 'acresAllocated', e.target.value)} className="w-1/3 bg-white dark:bg-slate-800 p-2 border dark:border-slate-600 rounded dark:text-white text-sm" />
                                    <input type="number" min="0" placeholder="Yield(T)" value={c.expectedYield} onChange={e=>handleCropChange(i, 'expectedYield', e.target.value)} className="w-1/3 bg-white dark:bg-slate-800 p-2 border dark:border-slate-600 rounded dark:text-white text-sm" />
                                    {data.crops.length > 1 && <button onClick={()=>removeCrop(i)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-5 h-5"/></button>}
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Acreage" value={`${farm.acres} Total`} icon={Ruler} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" delay={0.1} />
                <MetricCard title={`Crops (${farm.crops.length})`} value={farm.crops.length > 2 ? `${farm.crops.length} Planted` : cropsList || 'None'} icon={Sprout} colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" delay={0.2} />
                <MetricCard title="Aggregate Yield" value={`${aggregateYield.toFixed(1)}T`} icon={Scaling} colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" delay={0.3} />
                <MetricCard title="Soil Profile" value={farm.soilType} icon={Tractor} colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                <Card className="lg:col-span-1 border-none bg-gradient-to-br from-emerald-500 to-teal-600 !p-8 text-white relative overflow-hidden">
                    <Leaf className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
                    <h3 className="text-emerald-100 font-medium mb-2">Sustainability Score</h3>
                    <div className="flex items-end gap-3">
                        <span className="text-5xl font-black">{farm.sustainabilityScore || 0}</span>
                        <span className="text-emerald-200 mb-2 font-medium">/ 100</span>
                    </div>
                    {farm.sustainabilityScore > 75 ? <p className="mt-4 flex gap-2"><CheckCircle className="w-5 h-5"/> Excellent practices</p> :
                     <p className="mt-4 opacity-90 text-sm py-2">Weighted average of your polyculture health.</p>}
                </Card>
                
                <Card className="lg:col-span-2">
                    <h3 className="text-lg justify-start font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Lightbulb className="text-amber-500"/> Ecosystem Insights</h3>
                    <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl flex gap-4 items-start border border-blue-100 dark:border-blue-900/50">
                            <Droplets className="text-blue-500 mt-1 flex-shrink-0" />
                            <div><h4 className="font-semibold text-blue-900 dark:text-blue-300">Gross Water Envelope</h4><p className="text-blue-700 dark:text-blue-200/80 text-sm mt-1">Sustaining all {farm.crops.length} zones requires roughly <b>{Number(farm.waterRequirementLiters).toLocaleString(undefined, {maximumFractionDigits:0})} Liters</b> for the season.</p></div>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl flex gap-4 items-start border border-emerald-100 dark:border-emerald-900/50">
                            <Leaf className="text-emerald-500 mt-1 flex-shrink-0" />
                            <div><h4 className="font-semibold text-emerald-900 dark:text-emerald-300">Phase Shift Recommendations</h4><p className="text-emerald-800 dark:text-emerald-200/80 text-sm mt-1">Based on '{primaryCrop.cropName}' taking the primary partition, plan to sow: <b>{farm.recommendedNextCrop}</b> next to restore properties.</p></div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const CropIntelligenceWidget = ({ token, cropName }) => {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!cropName) { setLoading(false); return; }
        setLoading(true);
        api.getCropInfo(token, cropName).then(r => r.ok ? r.json() : Promise.reject('No data for this crop.')).then(setInfo).catch(setError).finally(()=>setLoading(false));
    }, [cropName, token]);

    if (loading) return <div className="py-12"><Spinner /></div>;
    if (error) return <ErrorMessage message={error}/>;
    if (!info) return null;

    return (
        <div className="space-y-6 relative z-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800/50 col-span-1 md:col-span-2 shadow-sm">
                    <h3 className="font-bold text-green-900 dark:text-green-300 text-lg mb-2 capitalize">Cultivation Guide: {info.cropName}</h3>
                    <p className="text-green-800 dark:text-green-200 leading-relaxed text-sm">{info.bestPractices}</p>
                </div>
                
                {(info.companionPlants || info.optimalPhLevel) && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/50 shadow-sm">
                        <h3 className="font-bold text-blue-900 dark:text-blue-300 text-lg mb-4 flex items-center gap-2"><Leaf className="w-5 h-5"/> Growth Matrix</h3>
                        <div className="space-y-3">
                            {info.companionPlants && <p className="text-sm text-blue-800 dark:text-blue-200"><span className="font-semibold block text-blue-950 dark:text-blue-100 mb-1">Companions</span> {info.companionPlants}</p>}
                            {info.optimalPhLevel && <p className="text-sm text-blue-800 dark:text-blue-200"><span className="font-semibold block text-blue-950 dark:text-blue-100 mb-1">Soil pH Targets</span> {info.optimalPhLevel}</p>}
                            {info.averageGrowthCycle && <p className="text-sm text-blue-800 dark:text-blue-200"><span className="font-semibold block text-blue-950 dark:text-blue-100 mb-1">Growth Index</span> {info.averageGrowthCycle}</p>}
                        </div>
                    </div>
                )}

                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-800/50 shadow-sm">
                    <h3 className="font-bold text-red-900 dark:text-red-300 text-lg mb-2 flex gap-2 items-center"><ShieldAlert className="w-5 h-5"/> Biological Threats</h3>
                    <p className="text-red-800 dark:text-red-200 leading-relaxed text-sm">{info.potentialDiseases}</p>
                </div>
            </div>
        </div>
    );
};

const CropDashboard = ({ token, crops }) => {
    const validCrops = crops && crops.length > 0 ? crops : [];
    const [selectedIdx, setSelectedIdx] = useState(0);

    return (
        <Card className="max-w-4xl mx-auto mt-8 relative overflow-hidden dark:bg-slate-800">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Sprout className="w-48 h-48" /></div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3"><Sprout className="text-emerald-500"/>Crop Knowledge Base</h2>
            
            {validCrops.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No crops allocated to your farm yet. Add zones in the Overview tab.</div>
            ) : (
                <>
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar relative z-10 border-b dark:border-slate-700">
                        {validCrops.map((c, i) => (
                            <button key={i} onClick={() => setSelectedIdx(i)} className={`px-4 py-2 rounded-t-lg font-semibold transition-colors whitespace-nowrap ${selectedIdx === i ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-400'}`}>
                                {c.cropName} ({c.acresAllocated} Ac)
                            </button>
                        ))}
                    </div>
                    <CropIntelligenceWidget token={token} cropName={validCrops[selectedIdx].cropName} />
                </>
            )}
        </Card>
    );
};

const WeatherForecast = ({ token, location }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!location) { setLoading(false); setError('Location missing.'); return; }
        api.getWeatherForecast(token, location).then(r => r.ok ? r.json() : Promise.reject('Failed to fetch weather.')).then(setData).catch(setError).finally(()=>setLoading(false));
    }, [location, token]);

    if(loading) return <Spinner />;
    if(error) return <Card><ErrorMessage message={error}/></Card>;
    if(!data || !data.list) return <Card><ErrorMessage message="No forecast data returned."/></Card>;

    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);

    return (
        <Card className="max-w-4xl mx-auto mt-8 dark:bg-slate-800">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 rounded-xl"><CloudSun className="w-6 h-6"/></div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">5-Day Forecast for {data.city?.name || location}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {dailyForecasts.map((day, i) => (
                    <div key={i} className="bg-gradient-to-b from-sky-50 to-white dark:from-slate-700 dark:to-slate-800 border border-sky-100 dark:border-slate-600 rounded-2xl p-4 text-center hover:shadow-md transition">
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">{new Date(day.dt * 1000).toLocaleDateString(undefined, {weekday:'short', month:'short', day:'numeric'})}</p>
                        <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt="weather" className="w-16 h-16 mx-auto drop-shadow-sm" />
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white my-1">{Math.round(day.main.temp)}°C</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{day.weather[0].description}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const MainDashboard = ({ onLogout }) => {
    const { token } = useAuthToken();
    const [farm, setFarm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState('farm');
    const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        if(token) api.getFarmDetails(token).then(r=>r.json()).then(setFarm).finally(()=>setLoading(false));
    }, [token]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const tabs = [
        { id: 'farm', label: 'Polyculture Overview', icon: LayoutDashboardIcon },
        { id: 'crop', label: 'Crop Intelligence', icon: Lightbulb },
        { id: 'weather', label: 'Weather Tracker', icon: CloudRain }
    ];

    if (loading) return <div className="h-screen flex bg-slate-50 dark:bg-slate-900"><Spinner /></div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row transition-colors duration-300">
            <nav className="w-full md:w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-sm z-10 sticky top-0 md:h-screen transition-colors duration-300">
                <div className="p-6 md:p-8 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 p-2 rounded-xl"><Leaf className="text-white w-6 h-6"/></div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">TerraConnect</h1>
                    </div>
                </div>
                
                <div className="flex-1 px-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar pb-4 md:pb-0">
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setPage(t.id)} className={`flex items-center gap-3 px-4 py-3 md:py-4 rounded-xl font-medium transition whitespace-nowrap ${page === t.id ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                            <t.icon className={`w-5 h-5 ${page === t.id ? 'text-emerald-500 dark:text-emerald-400' : ''}`} />
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="p-4 mt-auto mb-2 flex gap-2">
                    <button onClick={() => setIsDark(!isDark)} className="flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-3 rounded-xl transition text-slate-600 dark:text-slate-300">
                        {isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
                    </button>
                    <button onClick={onLogout} className="flex-1 flex items-center justify-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-700 rounded-xl transition font-medium">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-70 -z-10 animate-blob"></div>
                <div className="absolute top-0 right-72 w-96 h-96 bg-teal-100 dark:bg-teal-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-70 -z-10 animate-blob animation-delay-2000"></div>

                <AnimatePresence mode="wait">
                    <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                        {page === 'farm' && <FarmDashboard token={token} farm={farm} onUpdate={setFarm} />}
                        {page === 'crop' && <CropDashboard token={token} crops={farm?.crops || []} />}
                        {page === 'weather' && <WeatherForecast token={token} location={farm?.location} />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

const LayoutDashboardIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"></rect><rect x="14" y="3" width="7" height="5" rx="1"></rect><rect x="14" y="12" width="7" height="9" rx="1"></rect><rect x="3" y="16" width="7" height="5" rx="1"></rect></svg>

export default function App() {
    const { token, saveToken, removeToken } = useAuthToken();
    const [reg, setReg] = useState(false);
    if (!token) return reg ? <RegisterPage onRegister={saveToken} onSwitch={() => setReg(false)} /> : <LoginPage onLogin={saveToken} onSwitch={() => setReg(true)} />;
    return <MainDashboard onLogout={removeToken} />;
}
