import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CloudRain, CloudSun, Droplets, Leaf, ShieldAlert,
    Sprout, MapPin, Ruler, Scaling, Tractor, LogOut, CheckCircle, Lightbulb, Moon, Sun, Plus, Trash2, Globe
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

const UI_STRINGS = {
  en: { dashboard: "Polyculture Overview", intel: "Crop Intelligence", weather: "Weather Tracker", totalAcres: "Total Acres", location: "Location", save: "Save", editFarm: "Edit Farm", signOut: "Sign Out", cropsPlanted: "Planted", yield: "Aggregate Yield", soil: "Soil Profile", sustainability: "Sustainability Score", insights: "Ecosystem Insights", water: "Gross Water Envelope", phase: "Phase Shift Recommendations", guide: "Cultivation Guide", threats: "Biological Threats", matrix: "Growth Matrix", cancel: "Cancel", createAcc: "Create an account", signin: "Sign in", establish: "Establish Farm", baseSoil: "Base Soil", agrochem: "Agro-Chemical Guidance", fertilizer: "Fertilizer", pesticide: "Pesticide", genInfo: "General Information", pests: "Pests", rice: "Rice", wheat: "Wheat", corn: "Corn", tomato: "Tomato", onion: "Onion", soybean: "Soybean", cotton: "Cotton", sugarcane: "Sugarcane", potato: "Potato", banana: "Banana", millet: "Millet", groundnut: "Groundnut", editDetails: "Edit Farm Details", soilOpt: "Soil Quality", cropsLbl: "Crops", addCrop: "Add Crop" },
  hi: { dashboard: "पॉलीकल्चर सिंहावलोकन", intel: "फसल बुद्धिमत्ता", weather: "मौसम ट्रैकर", totalAcres: "कुल एकड़", location: "स्थान", save: "सहेजें", editFarm: "खेत संपादित करें", signOut: "साइन आउट", cropsPlanted: "रोपा गया", yield: "कुल उपज", soil: "मिट्टी प्रोफ़ाइल", sustainability: "स्थिरता स्कोर", insights: "पारिस्थितिकी तंत्र अंतर्दृष्टि", water: "सकल जल आवश्यकता", phase: "अगली फसल सिफारिशें", guide: "खेती की मार्गदर्शिका", threats: "जैविक खतरे", matrix: "विकास मैट्रिक्स", cancel: "रद्द करें", createAcc: "खाता बनाएं", signin: "साइन इन करें", establish: "खेत स्थापित करें", baseSoil: "बेस मिट्टी", agrochem: "कृषि-रासायनिक मार्गदर्शन", fertilizer: "उर्वरक", pesticide: "कीटनाशक", genInfo: "सामान्य जानकारी", pests: "कीट", rice: "चावल", wheat: "गेहूँ", corn: "मक्का", tomato: "टमाटर", onion: "प्याज", soybean: "सोयाबीन", cotton: "कपास", sugarcane: "गन्ना", potato: "आलू", banana: "केला", millet: "बाजरा", groundnut: "मूंगफली", editDetails: "खेत विवरण संपादित करें", soilOpt: "मिट्टी की गुणवत्ता", cropsLbl: "फसलें", addCrop: "फसल जोड़ें", "Legumes or Cover Crop": "फलियां या कवर फसल", "Cover Crop (e.g., Clover, Ryegrass)": "कवर फसल (जैसे, क्लोवर)", "Legumes (e.g., Soybeans, Chickpea, Moong)": "फलियां (जैसे, सोयाबीन, मूंग)", "Leafy Greens or Roots (e.g., Spinach, Onions)": "पत्तेदार साग या जड़ें (जैसे, पालक, प्याज)", "Corn or Wheat": "मक्का या गेहूँ", "Cover Crop (e.g., Clover, Sunhemp)": "कवर फसल (जैसे, सनई)" },
  ta: { dashboard: "பல்வகை பயிர் கண்ணோட்டம்", intel: "பயிர் நுண்ணறிவு", weather: "வானிலை கண்காணிப்பாளர்", totalAcres: "மொத்த ஏக்கர்", location: "இடம்", save: "சேமி", editFarm: "பண்ணையைத் திருத்து", signOut: "வெளியேறு", cropsPlanted: "பயிரிடப்பட்டது", yield: "மொத்த மகசூல்", soil: "மண் விவரம்", sustainability: "நிலைத்தன்மை மதிப்பெண்", insights: "சுற்றுச்சூழல் நுண்ணறிவு", water: "மொத்த நீர் தேவை", phase: "அடுத்த பயிர் பரிந்துரைகள்", guide: "சாகுபடி வழிகாட்டி", threats: "உயிரியல் அச்சுறுத்தல்கள்", matrix: "வளர்ச்சி அணி", cancel: "ரத்து செய்", createAcc: "கணக்கை உருவாக்கு", signin: "உள்நுழைக", establish: "பண்ணையை நிறுவு", baseSoil: "அடிப்படை மண்", agrochem: "வேளாண்-இரசாயன வழிகாட்டல்", fertilizer: "உரம்", pesticide: "பூச்சிக்கொல்லி", genInfo: "பொது தகவல்", pests: "பூச்சிகள்", rice: "நெல்", wheat: "கோதுமை", corn: "சோளம்", tomato: "தக்காளி", onion: "வெங்காயம்", soybean: "சோயாபீன்", cotton: "பருத்தி", sugarcane: "கரும்பு", potato: "உருளைக்கிழங்கு", banana: "வாழைப்பழம்", millet: "தினை", groundnut: "நிலக்கடலை", editDetails: "பண்ணை விவரத்தை திருத்து", soilOpt: "மண் தரம்", cropsLbl: "பயிர்கள்", addCrop: "பயிர் சேர்", "Legumes or Cover Crop": "பருப்பு வகைகள் அல்லது மூடுபயிர்", "Cover Crop (e.g., Clover, Ryegrass)": "மூடுபயிர் (உ.ம்., க்ளோவர்)", "Legumes (e.g., Soybeans, Chickpea, Moong)": "பருப்பு வகைகள் (உ.ம்., சோயாபீன், பயறு)", "Leafy Greens or Roots (e.g., Spinach, Onions)": "கீரைகள் அல்லது வேர்கள் (உ.ம்., வெங்காயம்)", "Corn or Wheat": "சோளம் அல்லது கோதுமை", "Cover Crop (e.g., Clover, Sunhemp)": "மூடுபயிர் (உ.ம்., சணம்பு)" },
  ml: { dashboard: "പോളി കൾച്ചർ അവലോകനം", intel: "വിള ഇന്റലിജൻസ്", weather: "കാലാവസ്ഥ ട്രാക്കർ", totalAcres: "ആകെ ഏക്കർ", location: "സ്ഥലം", save: "രക്ഷിക്കും", editFarm: "ഫാം എഡിറ്റ് ചെയ്യുക", signOut: "പുറത്തുകടക്കുക", cropsPlanted: "നട്ടു", yield: "മൊത്തം വിളവ്", soil: "മണ്ണ് പ്രൊഫൈൽ", sustainability: "സുസ്ഥിരത സ്കോർ", insights: "പരിസ്ഥിതി", water: "മൊത്തം ജല ആവശ്യകത", phase: "അടുത്ത വിള ശുപാർശകൾ", guide: "കൃഷിസ്ഥലം", threats: "ജൈവ ഭീഷണികൾ", matrix: "വളർച്ച മാട്രിക്സ്", cancel: "റദ്ദാക്കുക", createAcc: "അക്കൗണ്ട് സൃഷ്ടിക്കുക", signin: "ലോഗിൻ", establish: "ഫാം സ്ഥാപിക്കുക", baseSoil: "അടിസ്ഥാന മണ്ണ്", agrochem: "Agro-Chemical Guidance", fertilizer: "Fertilizer", pesticide: "Pesticide", genInfo: "General Information", pests: "Pests", rice: "Rice", wheat: "Wheat" },
  te: { dashboard: "పాలీకల్చర్ అవలోకనం", intel: "పంట ఇంటెలిజెన్స్", weather: "వాతావరణ ట్రాకర్", totalAcres: "మొత్తం ఎకరాలు", location: "స్థానం", save: "సేవ్", editFarm: "ఫార్మ్ సవరించండి", signOut: "సైన్ అవుట్", cropsPlanted: "నాటబడింది", yield: "మొత్తం దిగుబడి", soil: "నేల ప్రొఫైల్", sustainability: "స్థిరత్వం స్కోర్", insights: "పర్యావరణ", water: "నీటి అవసరం", phase: "తదుపరి పంట సిఫార్సులు", guide: "సాగు గైడ్", threats: "జీవ ముప్పులు", matrix: "వృద్ధి మ్యాట్రిక్స్", cancel: "రద్దు", createAcc: "ఖాతా సృష్టించండి", signin: "ప్రవేశించండి", establish: "స్థాపించండి", baseSoil: "బేస్ మట్టి", agrochem: "Agro-Chemical Guidance", fertilizer: "Fertilizer", pesticide: "Pesticide", genInfo: "General Information", pests: "Pests", rice: "Rice", wheat: "Wheat" },
  ur: { dashboard: "پولی کلچر کا جائزہ", intel: "فصل کی معلومات", weather: "موسم کا ٹریکر", totalAcres: "کل ایکڑ", location: "مقام", save: "محفوظ کریں", editFarm: "فارم میں ترمیم کریں", signOut: "سائن آؤٹ", cropsPlanted: "لگائے گئے", yield: "مجموعی پیداوار", soil: "مٹی کا پروفائل", sustainability: "پائیداری کا اسکور", insights: "ماحولیاتی نظام", water: "پانی کی ضرورت", phase: "اگلی فصل کی سفارشات", guide: "کاشت کی گائیڈ", threats: "حیاتیاتی خطرات", matrix: "گروتھ میٹرکس", cancel: "منسوخ کریں", createAcc: "اکاؤنٹ بنائیں", signin: "سائن ان کریں", establish: "فارم قائم کریں", baseSoil: "بنیادی مٹی", agrochem: "Agro-Chemical Guidance", fertilizer: "Fertilizer", pesticide: "Pesticide", genInfo: "General Information", pests: "Pests", rice: "Rice", wheat: "Wheat" },
  kn: { dashboard: "ಪಾಲಿಕಲ್ಚರ್ ಅವಲೋಕನ", intel: "ಬೆಳೆ ಬುದ್ಧಿಮತ್ತೆ", weather: "ಹವಾಮಾನ ಟ್ರ್ಯಾಕರ್", totalAcres: "ಒಟ್ಟು ಎಕರೆ", location: "ಸ್ಥಳ", save: "ಉಳಿಸಿ", editFarm: "ಫಾರ್ಮ್ ಸಂಪಾದಿಸಿ", signOut: "ಸೈನ್ ಔಟ್", cropsPlanted: "ನೆಡಲಾಗಿದೆ", yield: "ಒಟ್ಟು ಇಳುವರಿ", soil: "ಮಣ್ಣಿನ ಪ್ರೊಫೈಲ್", sustainability: "ಸುಸ್ಥಿರತೆ ಸ್ಕೋರ್", insights: "ಪರಿಸರ", water: "ಒಟ್ಟು ನೀರಿನ ಕ್ಯಾಪ್", phase: "ಮುಂದಿನ ಬೆಳೆ ಶಿಫಾರಸುಗಳು", guide: "ಕೃಷಿ ಮಾರ್ಗದರ್ಶಿ", threats: "ಜೈವಿಕ ಬೆದರಿಕೆಗಳು", matrix: "ಬೆಳವಣಿಗೆ ಮ್ಯಾಟ್ರಿಕ್ಸ್", cancel: "ರದ್ದುಮಾಡು", createAcc: "ಖಾತೆ ರಚಿಸಿ", signin: "ಸೈನ್ ಇನ್", establish: "ಫಾರ್ಮ್ ಸ್ಥಾಪಿಸಿ", baseSoil: "ಮೂಲ ಮಣ್ಣು", agrochem: "Agro-Chemical Guidance", fertilizer: "Fertilizer", pesticide: "Pesticide", genInfo: "General Information", pests: "Pests", rice: "Rice", wheat: "Wheat" },
  mr: { dashboard: "पॉलीकल्चर विहंगावलोकन", intel: "पीक बुद्धिमत्ता", weather: "हवामान ट्रॅकर", totalAcres: "एकूण एकर", location: "स्थान", save: "जतन करा", editFarm: "शेत संपादित करा", signOut: "साइन आउट", cropsPlanted: "लागवड", yield: "एकूण उत्पन्न", soil: "माती प्रोफाइल", sustainability: "सस्टेनेबिलिटी स्कोअर", insights: "इकोसिस्टम अंतर्दृष्टी", water: "पाण्याची गरज", phase: "पुढील पीक शिफारसी", guide: "लागवड मार्गदर्शक", threats: "जैविक धोके", matrix: "वाढ मॅट्रिक्स", cancel: "रद्द करा", createAcc: "खाते तयार करा", signin: "साइन इन करा", establish: "शेत स्थापन करा", baseSoil: "पायाभूत माती", agrochem: "Agro-Chemical Guidance", fertilizer: "Fertilizer", pesticide: "Pesticide", genInfo: "General Information", pests: "Pests", rice: "Rice", wheat: "Wheat" },
  bn: { dashboard: "পলিকালচার ওভারভিউ", intel: "শস্য বুদ্ধিমত্তা", weather: "আবহাওয়া ট্র্যাকার", totalAcres: "মোট একর", location: "অবস্থান", save: "সংরক্ষণ", editFarm: "খামার সম্পাদনা করুন", signOut: "সাইন আউট", cropsPlanted: "রোপণ করা হয়েছে", yield: "মোট ফলন", soil: "মাটির প্রোফাইল", sustainability: "স্থায়িত্ব স্কোর", insights: "বাস্তুতন্ত্র অন্তর্দৃষ্টি", water: "জলের প্রয়োজনীয়তা", phase: "পরবর্তী ফসল সুপারিশ", guide: "চাষ নির্দেশিকা", threats: "জৈবিক হুমকি", matrix: "বৃদ্ধির ম্যাট্রিক্স", cancel: "বাতিল", createAcc: "অ্যাকাউন্ট তৈরি করুন", signin: "সাইন ইন করুন", establish: "খামার স্থাপন করুন", baseSoil: "খাঁটি মাটি", agrochem: "Agro-Chemical Guidance", fertilizer: "Fertilizer", pesticide: "Pesticide", genInfo: "General Information", pests: "Pests", rice: "Rice", wheat: "Wheat" },
  or: { dashboard: "ପଲିକଲଚର ସମୀକ୍ଷା", intel: "ଫସଲ ବୁଦ୍ଧିମତ୍ତା", weather: "ପାଣିପାଗ ଟ୍ରାକର୍", totalAcres: "ମୋଟ ଏକର", location: "ସ୍ଥାନ", save: "ସେଭ୍ କରନ୍ତୁ", editFarm: "ଫାର୍ମ ସମ୍ପାଦନ", signOut: "ସାଇନ୍ ଆଉଟ୍", cropsPlanted: "ରୋପଣ", yield: "ମୋଟ ଅମଳ", soil: "ମୃତ୍ତିକା ପ୍ରୋଫାଇଲ୍", sustainability: "ସ୍ଥାୟୀତ୍ୱ ସ୍କୋର୍", insights: "ପରିବେଶ ଅନ୍ତର୍ଦୃଷ୍ଟି", water: "ଜଳ ଆବଶ୍ୟକତା", phase: "ପରବର୍ତ୍ତୀ ଫସଲ ସୁପାରିଶ", guide: "କୃଷି ଗାଇଡ୍", threats: "ଜୈବିକ ବିପଦ", matrix: "ବୃଦ୍ଧି ମ୍ୟାଟ୍ରିକ୍ସ", cancel: "ବାତିଲ୍", createAcc: "ଆକାଉଣ୍ଟ ଖୋଲନ୍ତୁ", signin: "ଲଗ୍ ଇନ୍", establish: "ଫାର୍ମ ପ୍ରତିଷ୍ଠା", baseSoil: "ମୂଳ ମାଟି", agrochem: "Agro-Chemical Guidance", fertilizer: "Fertilizer", pesticide: "Pesticide", genInfo: "General Information", pests: "Pests", rice: "Rice", wheat: "Wheat" },
  gu: { dashboard: "પોલીકલ્ચર ઝાંખી", intel: "પાક બુદ્ધિમત્તા", weather: "હવામાન ટ્રેકર", totalAcres: "કુલ એકર", location: "સ્થાન", save: "સાચવો", editFarm: "ફાર્મ સંપાદિત કરો", signOut: "સાઇન આઉટ", cropsPlanted: "વાવેતર", yield: "કુલ ઉપજ", soil: "માટી પ્રોફાઇલ", sustainability: "ટકાઉપણું સ્કોર", insights: "ઇકોસિસ્ટમ આંતરદૃષ્ટિ", water: "પાણીની જરૂરિયાત", phase: "આગામી પાક ભલામણો", guide: "ખેતી માર્ગદર્શિકા", threats: "જૈવિક ધમકીઓ", matrix: "વિકાસ મેટ્રિક્સ", cancel: "રદ કરો", createAcc: "એકાઉન્ટ બનાવો", signin: "સાઇન ઇન", establish: "ફાર્મ સ્થાપો", baseSoil: "બેઝ માટી", agrochem: "Agro-Chemical Guidance", fertilizer: "Fertilizer", pesticide: "Pesticide", genInfo: "General Information", pests: "Pests", rice: "Rice", wheat: "Wheat" }
};

const I18nContext = createContext();

const useAuthToken = () => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const saveToken = (userToken) => { localStorage.setItem('token', userToken); setToken(userToken); };
    const removeToken = () => { localStorage.removeItem('token'); setToken(null); };
    return { token, saveToken, removeToken };
};

const api = {
    login: (username, password) => fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }),
    register: (username, password, farmDetails) => fetch(`${API_BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password, farmDetails }) }),
    getFarmDetails: (token) => fetch(`${API_BASE_URL}/farm`, { headers: { 'Authorization': `Bearer ${token}` } }),
    updateFarmDetails: (token, farmDetails) => fetch(`${API_BASE_URL}/farm`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(farmDetails) }),
    getCropInfo: (token, cropName, lang="en") => fetch(`${API_BASE_URL}/crop/${cropName}?lang=${lang}`, { headers: { 'Authorization': `Bearer ${token}` } }),
    getWeatherForecast: (token, location) => fetch(`${API_BASE_URL}/weather/forecast?location=${location}`, { headers: { 'Authorization': `Bearer ${token}` } }),
};

const Card = ({ children, className = '' }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass dark:glass-dark rounded-2xl p-6 ${className}`}>{children}</motion.div>
);

const Button = ({ children, onClick, className = '', disabled = false, variant = 'primary', size = 'default' }) => {
    const defaultSize = size === 'sm' ? 'py-1.5 px-4 text-sm' : 'py-3 px-6';
    const baseStyle = `font-semibold ${defaultSize} rounded-xl transition duration-300 focus:outline-none flex items-center justify-center gap-2 shadow-sm whitespace-nowrap`;
    const variants = {
        primary: "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50",
        secondary: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700",
        outline: "bg-transparent text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
    };
    return <button onClick={onClick} disabled={disabled} type={onClick ? "button" : "submit"} className={`${baseStyle} ${variants[variant]} ${className}`}>{children}</button>;
};

const Spinner = () => (
    <div className="flex justify-center items-center h-full p-20"><div className="animate-spin rounded-full h-12 w-12 border-[3px] border-emerald-200 border-t-emerald-600"></div></div>
);

const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50/80 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center mb-4 text-sm font-medium transition-all">
            <ShieldAlert className="w-5 h-5 mr-2 flex-shrink-0" /><span>{message}</span>
        </motion.div>
    );
};

// Pages
const LoginPage = ({ onLogin, onSwitch }) => {
    const { t } = useContext(I18nContext);
    const [user, setUser] = useState(''); const [pass, setPass] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try { const res = await api.login(user, pass); if (res.ok) onLogin((await res.json()).token); else setError('Invalid credentials.'); } catch { setError('Connection failed.'); } finally { setLoading(false); }
    };
    return (
        <div className="min-h-screen bg-gradient-mesh dark:bg-slate-900 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-dark sm:w-full max-w-md p-8 rounded-[2rem] text-slate-100">
                <div className="text-center mb-8">
                    <div className="bg-emerald-500/20 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"><Leaf className="text-emerald-400 w-8 h-8" /></div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">TerraConnect</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <ErrorMessage message={error} />
                    <input type="text" placeholder="Username" value={user} onChange={e => setUser(e.target.value)} required className="w-full bg-slate-800/50 border border-slate-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition" />
                    <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required className="w-full bg-slate-800/50 border border-slate-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition" />
                    <Button type="submit" disabled={loading} className="w-full mt-6 !bg-gradient-to-r from-emerald-500 to-teal-500 border-none">{loading ? '...' : t.signin}</Button>
                </form>
                <p className="text-center text-slate-400 mt-6 text-sm"><button onClick={onSwitch} className="text-emerald-400 hover:text-emerald-300 font-medium">{t.createAcc}</button></p>
            </motion.div>
        </div>
    );
};

const RegisterPage = ({ onRegister, onSwitch }) => {
    const { t } = useContext(I18nContext);
    const [user, setUser] = useState(''); const [pass, setPass] = useState('');
    const [farm, setFarm] = useState({ acres: '', soilType: '', soilQuality: 'Normal', location: '', crops: [{ cropName: '', acresAllocated: '' }] });
    const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const allocated = farm.crops.reduce((sum, c) => sum + (parseFloat(c.acresAllocated) || 0), 0);
        if (allocated > parseFloat(farm.acres)) return setError("Too many acres allocated.");
        setLoading(true); setError('');
        try { const res = await api.register(user, pass, farm); if (res.ok) onRegister((await res.json()).token); else setError('Registration failed.'); } catch { setError('Connection failed.'); } finally { setLoading(false); }
    };

    const handleCropChange = (index, field, val) => { const nc = [...farm.crops]; nc[index][field] = val; setFarm({...farm, crops: nc}); };
    const handleRemoveCrop = (index) => { const nc = [...farm.crops]; nc.splice(index, 1); setFarm({...farm, crops: nc}); };
    return (
        <div className="min-h-screen bg-gradient-mesh dark:bg-slate-900 flex items-center justify-center p-4 py-12">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass dark:glass-dark dark:bg-slate-800 w-full max-w-2xl p-8 rounded-[2rem]">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <ErrorMessage message={error} />
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Username" value={user} onChange={e => setUser(e.target.value)} required className="col-span-2 w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 dark:text-white px-4 py-3 rounded-xl outline-none" />
                        <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required className="col-span-2 w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 dark:text-white px-4 py-3 rounded-xl outline-none" />
                        <input type="number" min="0" placeholder={t.totalAcres} value={farm.acres} onChange={e => setFarm({...farm, acres: e.target.value})} required className="w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 dark:text-white px-4 py-3 rounded-xl" />
                        <input placeholder={t.baseSoil} value={farm.soilType} onChange={e => setFarm({...farm, soilType: e.target.value})} required className="w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 dark:text-white px-4 py-3 rounded-xl" />
                        <select value={farm.soilQuality} onChange={e => setFarm({...farm, soilQuality: e.target.value})} required className="w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 dark:text-white px-4 py-3 rounded-xl appearance-none outline-none">
                            <option value="Poor">Poor Quality</option>
                            <option value="Normal">Normal Quality</option>
                            <option value="Premium">Premium Quality</option>
                        </select>
                        <input placeholder={t.location} value={farm.location} onChange={e => setFarm({...farm, location: e.target.value})} required className="col-span-2 w-full bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 dark:text-white px-4 py-3 rounded-xl" />
                        
                        <div className="col-span-2 mt-4 flex items-center justify-between border-b dark:border-slate-700 pb-2">
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Crops</h3>
                            <Button type="button" onClick={() => setFarm({...farm, crops: [...farm.crops, {cropName: '', acresAllocated: ''}]})} variant="outline" size="sm"><Plus className="w-4 h-4"/> Add Crop</Button>
                        </div>
                        {farm.crops.map((c, i) => (
                            <div key={i} className="col-span-2 flex items-center gap-2 bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700 relative">
                                <input placeholder="Crop" required value={c.cropName} onChange={e=>handleCropChange(i, 'cropName', e.target.value)} className="flex-1 bg-white dark:bg-slate-800 border p-2 rounded-lg dark:border-slate-600 dark:text-white" />
                                <input type="number" placeholder="Acres" required value={c.acresAllocated} onChange={e=>handleCropChange(i, 'acresAllocated', e.target.value)} className="w-24 bg-white dark:bg-slate-800 border p-2 rounded-lg dark:border-slate-600 dark:text-white" />
                                {farm.crops.length > 1 && (
                                    <button type="button" onClick={() => handleRemoveCrop(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                        <Trash2 className="w-5 h-5"/>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <Button type="submit" disabled={loading} className="w-full mt-8">{t.establish}</Button>
                </form>
                <p className="text-center text-slate-500 mt-6 text-sm"><button onClick={onSwitch} className="text-emerald-600 font-semibold">{t.signin}</button></p>
            </motion.div>
        </div>
    );
};

const MetricCard = ({ title, value, icon: Icon, colorClass, delay=0 }) => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
        <div className={`p-4 rounded-xl ${colorClass}`}><Icon className="w-7 h-7" /></div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white max-w-[200px] truncate" title={value}>{value}</p>
        </div>
    </motion.div>
);

const FarmDashboard = ({ token, farm, onUpdate }) => {
    const { t } = useContext(I18nContext);
    const [edit, setEdit] = useState(false); const [data, setData] = useState(farm); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
    useEffect(() => setData(farm), [farm]);

    const handleSave = async () => {
        const allocated = data.crops.reduce((sum, c) => sum + (parseFloat(c.acresAllocated) || 0), 0);
        if (allocated > parseFloat(data.acres)) { setError("Allocated crops exceed total farm acres!"); return; }
        setLoading(true); setError('');
        try { const res = await api.updateFarmDetails(token, data); if (res.ok) { onUpdate(await res.json()); setEdit(false); } else setError('Failed to update.'); } catch { setError('Network Error.'); } finally { setLoading(false); }
    };
    
    const hDataChange = (field, val) => setData({...data, [field]: val});
    const hCropChange = (i, field, val) => { const nc = [...data.crops]; nc[i][field] = val; setData({...data, crops: nc}); };
    const hAddCrop = () => setData({...data, crops: [...data.crops, {cropName: '', acresAllocated: ''}]});
    const hRemoveCrop = (i) => { const nc = [...data.crops]; nc.splice(i, 1); setData({...data, crops: nc}); };
    
    if (!farm) return null;
    const aggregateYield = farm.crops.reduce((s, c) => s + (parseFloat(c.expectedYield) || 0), 0);
    const primaryCrop = farm.crops.length > 0 ? farm.crops.reduce((max, c) => (c.acresAllocated > max.acresAllocated) ? c : max) : {cropName: 'None'};

    return (
        <div className="space-y-6">
            <ErrorMessage message={error} />
            <div className="flex justify-between items-center bg-white/50 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                {!edit ? (
                    <div><h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><MapPin className="text-emerald-500"/> {data.location}</h2></div>
                ) : (
                    <input value={data.location} onChange={e=>hDataChange('location', e.target.value)} className="text-xl font-bold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1 outline-none text-slate-800 dark:text-white" />
                )}
                {!edit ? <Button onClick={() => setEdit(true)} variant="outline" size="sm">{t.editFarm}</Button> :
                 <div className="flex gap-2"><Button onClick={handleSave} disabled={loading} size="sm">{t.save}</Button><Button onClick={()=>{setEdit(false); setData(farm);}} variant="secondary" size="sm">{t.cancel}</Button></div>}
            </div>
            
            {edit ? (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.editDetails || "Edit Farm Details"}</h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">{t.totalAcres}</label>
                            <input type="number" value={data.acres} onChange={e=>hDataChange('acres', e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 outline-none dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">{t.baseSoil}</label>
                            <input value={data.soilType} onChange={e=>hDataChange('soilType', e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 outline-none dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">{t.soilOpt || "Soil Quality"}</label>
                            <select value={data.soilQuality} onChange={e=>hDataChange('soilQuality', e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 outline-none dark:text-white appearance-none">
                                <option value="Poor">Poor</option><option value="Normal">Normal</option><option value="Premium">Premium</option>
                            </select>
                        </div>
                    </div>
                    <div className="border-t dark:border-slate-700 pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-slate-700 dark:text-slate-300">{t.cropsLbl || "Crops"}</h4>
                            <Button onClick={hAddCrop} variant="outline" size="sm"><Plus className="w-4 h-4"/> {t.addCrop || "Add Crop"}</Button>
                        </div>
                        <div className="space-y-2">
                            {data.crops.map((c, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input placeholder="Crop Name" value={c.cropName} onChange={e=>hCropChange(i, 'cropName', e.target.value)} className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 outline-none dark:text-white" />
                                    <input type="number" placeholder="Acres" value={c.acresAllocated} onChange={e=>hCropChange(i, 'acresAllocated', e.target.value)} className="w-24 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 outline-none dark:text-white" />
                                    {data.crops.length > 1 && (
                                        <button type="button" onClick={() => hRemoveCrop(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                            <Trash2 className="w-5 h-5"/>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard title={t.totalAcres} value={`${farm.acres}`} icon={Ruler} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
                    <MetricCard title={t.cropsPlanted} value={`${farm.crops.length}`} icon={Sprout} colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
                    <MetricCard title={t.yield} value={`${aggregateYield.toFixed(1)}T`} icon={Scaling} colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
                    <MetricCard title={`${t.soil} (${farm.soilQuality || 'Normal'})`} value={farm.soilType} icon={Tractor} colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                <Card className="lg:col-span-1 border-none bg-gradient-to-br from-emerald-500 to-teal-600 !p-8 text-white">
                    <h3 className="text-emerald-100 font-medium mb-2">{t.sustainability}</h3>
                    <div className="flex items-end gap-3"><span className="text-5xl font-black">{farm.sustainabilityScore || 0}</span><span className="text-emerald-200 mb-2">/ 100</span></div>
                </Card>
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Lightbulb className="text-amber-500"/> {t.insights}</h3>
                    <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl flex gap-4 border border-blue-100 dark:border-blue-900/50">
                            <Droplets className="text-blue-500 mt-1" />
                            <div><h4 className="font-semibold text-blue-900 dark:text-blue-300">{t.water}</h4><p className="text-blue-700 dark:text-blue-200/80 text-sm mt-1">{Number(farm.waterRequirementLiters).toLocaleString()}</p></div>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl flex gap-4 border border-emerald-100 dark:border-emerald-900/50">
                            <Leaf className="text-emerald-500 mt-1" />
                            <div><h4 className="font-semibold text-emerald-900 dark:text-emerald-300">{t.phase}</h4><p className="text-emerald-800 dark:text-emerald-200/80 text-sm mt-1">{t[farm.recommendedNextCrop] || farm.recommendedNextCrop}</p></div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const CropIntelligenceWidget = ({ token, cropName, lang }) => {
    const { t } = useContext(I18nContext);
    const [info, setInfo] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
    useEffect(() => {
        if (!cropName) { setLoading(false); return; }
        setLoading(true);
        api.getCropInfo(token, cropName, lang).then(r => r.ok ? r.json() : Promise.reject('No data.')).then(setInfo).catch(setError).finally(()=>setLoading(false));
    }, [cropName, token, lang]);

    if (loading) return <Spinner />;
    if (error) return <ErrorMessage message={error}/>;
    if (!info) return null;

    return (
        <div className="space-y-6 relative z-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800/50 col-span-1 md:col-span-2">
                    <h3 className="font-bold text-green-900 dark:text-green-300 text-lg mb-2">{t.guide}: {info.cropName}</h3>
                    <p className="text-green-800 dark:text-green-200 text-sm">{info.bestPractices}</p>
                </div>
                {(info.companionPlants || info.optimalPhLevel) && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                        <h3 className="font-bold text-blue-900 dark:text-blue-300 text-lg mb-4 flex items-center gap-2"><Leaf className="w-5 h-5"/> {t.matrix}</h3>
                        <div className="space-y-3">
                            {info.companionPlants && <p className="text-sm text-blue-800 dark:text-blue-200">{info.companionPlants}</p>}
                            {info.optimalPhLevel && <p className="text-sm text-blue-800 dark:text-blue-200">{info.optimalPhLevel}</p>}
                            {info.averageGrowthCycle && <p className="text-sm text-blue-800 dark:text-blue-200">{info.averageGrowthCycle}</p>}
                        </div>
                    </div>
                )}
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-800/50">
                    <h3 className="font-bold text-red-900 dark:text-red-300 text-lg mb-2 flex gap-2"><ShieldAlert className="w-5 h-5"/> {t.threats}</h3>
                    <p className="text-red-800 dark:text-red-200 text-sm mb-2">{info.potentialDiseases}</p>
                    {info.commonPests && <p className="text-red-800 dark:text-red-200 text-sm"><strong>{t.pests || "Pests"}:</strong> {info.commonPests}</p>}
                </div>
                {(info.fertilizerRecommendation || info.pesticideRecommendation) && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-800/50 col-span-1 md:col-span-2">
                        <h3 className="font-bold text-amber-900 dark:text-amber-300 text-lg mb-2 flex gap-2">{t.agrochem || "Agro-Chemical Guidance"}</h3>
                        {info.fertilizerRecommendation && <p className="text-amber-800 dark:text-amber-200 text-sm mb-1"><strong>{t.fertilizer || "Fertilizer"}:</strong> {info.fertilizerRecommendation}</p>}
                        {info.pesticideRecommendation && <p className="text-amber-800 dark:text-amber-200 text-sm"><strong>{t.pesticide || "Pesticide"}:</strong> {info.pesticideRecommendation}</p>}
                    </div>
                )}
                {info.generalInfo && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 col-span-1 md:col-span-2">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-2">{t.genInfo || "General Information"}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">{info.generalInfo}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CropDashboard = ({ token, crops, lang }) => {
    const { t } = useContext(I18nContext);
    const validCrops = crops && crops.length > 0 ? crops : [];
    const [selectedIdx, setSelectedIdx] = useState(0);

    return (
        <Card className="max-w-4xl mx-auto mt-8 relative overflow-hidden dark:bg-slate-800">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3"><Sprout className="text-emerald-500"/>{t.intel}</h2>
            {validCrops.length === 0 ? ( <div className="p-8 text-center text-slate-500">No crops allocated.</div> ) : (
                <>
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar relative z-10 border-b dark:border-slate-700">
                        {validCrops.map((c, i) => {
                            const dispName = c.cropName && t[c.cropName.toLowerCase()] ? t[c.cropName.toLowerCase()] : c.cropName;
                            return (
                                <button key={i} onClick={() => setSelectedIdx(i)} className={`px-4 py-2 rounded-t-lg font-semibold transition-colors whitespace-nowrap ${selectedIdx === i ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-400'}`}>
                                    {dispName} ({c.acresAllocated} Ac)
                                </button>
                            );
                        })}
                    </div>
                    <CropIntelligenceWidget token={token} cropName={validCrops[selectedIdx].cropName} lang={lang} />
                </>
            )}
        </Card>
    );
};

const WeatherForecast = ({ token, location }) => {
    const [data, setData] = useState(null); const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!location) { setLoading(false); return; }
        api.getWeatherForecast(token, location).then(r => r.ok ? r.json() : Promise.reject('Failed')).then(setData).catch(console.error).finally(()=>setLoading(false));
    }, [location, token]);

    if(loading) return <Spinner />;
    if(!data || !data.list) return null;
    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);

    return (
        <Card className="max-w-4xl mx-auto mt-8 dark:bg-slate-800">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 rounded-xl"><CloudSun className="w-6 h-6"/></div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Forecast - {data.city?.name || location}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {dailyForecasts.map((day, i) => (
                    <div key={i} className="bg-gradient-to-b from-sky-50 to-white dark:from-slate-700 dark:to-slate-800 border border-sky-100 dark:border-slate-600 rounded-2xl p-4 text-center">
                        <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt="weather" className="w-16 h-16 mx-auto" />
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white my-1">{Math.round(day.main.temp)}°C</h4>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const MainDashboard = ({ onLogout }) => {
    const { token } = useAuthToken();
    const [farm, setFarm] = useState(null); const [loading, setLoading] = useState(true); const [page, setPage] = useState('farm');
    const { t, lang, setLang, isDark, setIsDark } = useContext(I18nContext);

    useEffect(() => { if(token) api.getFarmDetails(token).then(r=>r.json()).then(setFarm).finally(()=>setLoading(false)); }, [token]);

    const tabs = [
        { id: 'farm', label: t.dashboard, icon: Leaf },
        { id: 'crop', label: t.intel, icon: Lightbulb },
        { id: 'weather', label: t.weather, icon: CloudRain }
    ];

    if (loading) return <div className="h-screen bg-slate-50 dark:bg-slate-900 relative"><Spinner /></div>;

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
                    <div className="relative mb-6 px-4">
                        <Globe className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500"/>
                        <select value={lang} onChange={e=>setLang(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-emerald-100 rounded-xl pl-10 pr-4 py-2 appearance-none font-medium cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="en">English (US)</option>
                            <option value="hi">हिन्दी (Hindi)</option>
                            <option value="ta">தமிழ் (Tamil)</option>
                            <option value="ml">മലയാളം (Malayalam)</option>
                            <option value="te">తెలుగు (Telugu)</option>
                            <option value="ur">اردو (Urdu)</option>
                            <option value="kn">ಕನ್ನಡ (Kannada)</option>
                            <option value="mr">मराठी (Marathi)</option>
                            <option value="bn">বাংলা (Bengali)</option>
                            <option value="or">ଓଡ଼ିଆ (Odia)</option>
                            <option value="gu">ગુજરાતી (Gujarati)</option>
                        </select>
                    </div>
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setPage(tab.id)} className={`flex items-center gap-3 px-4 py-3 md:py-4 rounded-xl font-medium transition whitespace-nowrap ${page === tab.id ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700'}`}>
                            <tab.icon className={`w-5 h-5 ${page === tab.id ? 'text-emerald-500' : ''}`} />{tab.label}
                        </button>
                    ))}
                </div>
                <div className="p-4 mt-auto mb-2 flex gap-2">
                    <button onClick={() => setIsDark(!isDark)} className="flex items-center justify-center bg-slate-100 dark:bg-slate-700 p-3 rounded-xl transition text-slate-600 dark:text-slate-300">
                        {isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
                    </button>
                    <button onClick={onLogout} className="flex-1 flex items-center justify-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 bg-slate-100 dark:bg-slate-700 rounded-xl transition font-medium">
                        <LogOut className="w-5 h-5" /> {t.signOut}
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full relative">
                <AnimatePresence mode="wait">
                    <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                        {page === 'farm' && <FarmDashboard token={token} farm={farm} onUpdate={setFarm} />}
                        {page === 'crop' && <CropDashboard token={token} crops={farm?.crops || []} lang={lang} />}
                        {page === 'weather' && <WeatherForecast token={token} location={farm?.location} />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default function App() {
    const { token, saveToken, removeToken } = useAuthToken();
    const [reg, setReg] = useState(false);
    const [lang, setLang] = useState('en');
    const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const t = UI_STRINGS[lang];

    return (
        <I18nContext.Provider value={{ t, lang, setLang, isDark, setIsDark }}>
            {!token ? (reg ? <RegisterPage onRegister={saveToken} onSwitch={() => setReg(false)} /> : <LoginPage onLogin={saveToken} onSwitch={() => setReg(true)} />) : <MainDashboard onLogout={removeToken} />}
        </I18nContext.Provider>
    );
}
