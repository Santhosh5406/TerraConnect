import React, { useState, useEffect, useCallback } from 'react';

// --- Helper & Hook Functions ---
const API_BASE_URL = 'http://localhost:8080/api';

// Custom hook to manage JWT token in localStorage
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

// --- API Call Functions ---
const api = {
    login: (username, password) => 
        fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        }),
    register: (username, password, farmDetails) =>
        fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, farmDetails }),
        }),
    getFarmDetails: (token) =>
        fetch(`${API_BASE_URL}/farm`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }),
    updateFarmDetails: (token, farmDetails) =>
        fetch(`${API_BASE_URL}/farm`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(farmDetails),
        }),
    getCropInfo: (token, cropName) =>
        fetch(`${API_BASE_URL}/crop/${cropName}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }),
    getWeatherForecast: (token, location) =>
        fetch(`${API_BASE_URL}/weather/forecast?location=${location}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }),
};

// --- UI Components ---
const Card = ({ title, children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        {title && <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>}
        {children}
    </div>
);

const Button = ({ children, onClick, className = '', type = 'button', disabled = false }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 disabled:bg-gray-400 ${className}`}
    >
        {children}
    </button>
);

const Spinner = () => (
    <div className="flex justify-center items-center h-full p-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
    </div>
);

const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
        </div>
    );
};

// --- Page/Feature Components ---
const LoginPage = ({ onLogin, onSwitchToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.login(username, password);
            if (response.ok) {
                const data = await response.json();
                onLogin(data.token);
            } else {
                setError('Invalid credentials or server error.');
            }
        } catch (err) {
            setError('Failed to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-800">Farmer Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <ErrorMessage message={error} />
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToRegister} className="font-medium text-green-600 hover:underline">
                        Register here
                    </button>
                </p>
            </div>
        </div>
    );
};

const RegisterPage = ({ onRegister, onSwitchToLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [farmDetails, setFarmDetails] = useState({
        acres: '',
        soilType: '',
        location: '',
        currentCrop: '',
        expectedYield: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFarmDetailsChange = (field, value) => {
        setFarmDetails(prev => ({ ...prev, [field]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.register(username, password, farmDetails);
            if (response.ok) {
                const data = await response.json();
                onRegister(data.token);
            } else {
                const errorData = await response.text();
                setError(errorData || 'Registration failed.');
            }
        } catch (err) {
            setError('Failed to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-800">Register New Farmer</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <ErrorMessage message={error} />
                    <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
                    <h2 className="text-xl font-semibold pt-2">Farm Details</h2>
                    <input type="number" placeholder="Farm Acres" value={farmDetails.acres} onChange={e => handleFarmDetailsChange('acres', e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
                    <input placeholder="Soil Type" value={farmDetails.soilType} onChange={e => handleFarmDetailsChange('soilType', e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
                    <input placeholder="Location (e.g., London)" value={farmDetails.location} onChange={e => handleFarmDetailsChange('location', e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
                    <input placeholder="Current Crop" value={farmDetails.currentCrop} onChange={e => handleFarmDetailsChange('currentCrop', e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
                    <input type="number" placeholder="Expected Yield (in tons)" value={farmDetails.expectedYield} onChange={e => handleFarmDetailsChange('expectedYield', e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </form>
                 <p className="text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="font-medium text-green-600 hover:underline">
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};


const FarmDashboard = ({ token, farmDetails, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [details, setDetails] = useState(farmDetails);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        setDetails(farmDetails);
    }, [farmDetails]);

    const handleSave = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.updateFarmDetails(token, details);
            if (response.ok) {
                const updatedFarm = await response.json();
                onUpdate(updatedFarm);
                setIsEditing(false);
            } else {
                setError('Failed to update farm details.');
            }
        } catch (err) {
            setError('Server error while updating farm details.');
        } finally {
            setLoading(false);
        }
    };
    
    if (!details) return <Card title="Farm Dashboard"><p>No farm details available.</p></Card>;

    const handleChange = (field, value) => {
        setDetails(prev => ({...prev, [field]: value}));
    }

    return (
        <Card title="My Farm Dashboard">
            <ErrorMessage message={error} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                {isEditing ? (
                    <>
                        <div><label className="font-bold">Acres:</label><input type="number" value={details.acres} onChange={e => handleChange('acres', e.target.value)} className="w-full p-1 border rounded" /></div>
                        <div><label className="font-bold">Soil Type:</label><input value={details.soilType} onChange={e => handleChange('soilType', e.target.value)} className="w-full p-1 border rounded" /></div>
                        <div><label className="font-bold">Location:</label><input value={details.location} onChange={e => handleChange('location', e.target.value)} className="w-full p-1 border rounded" /></div>
                        <div><label className="font-bold">Current Crop:</label><input value={details.currentCrop} onChange={e => handleChange('currentCrop', e.target.value)} className="w-full p-1 border rounded" /></div>
                        <div><label className="font-bold">Expected Yield (tons):</label><input type="number" value={details.expectedYield} onChange={e => handleChange('expectedYield', e.target.value)} className="w-full p-1 border rounded" /></div>
                    </>
                ) : (
                    <>
                        <p><span className="font-bold">Acres:</span> {details.acres}</p>
                        <p><span className="font-bold">Soil Type:</span> {details.soilType}</p>
                        <p><span className="font-bold">Location:</span> {details.location}</p>
                        <p><span className="font-bold">Current Crop:</span> {details.currentCrop}</p>
                        <p><span className="font-bold">Expected Yield:</span> {details.expectedYield} tons</p>
                    </>
                )}
            </div>
            <div className="mt-6">
                {isEditing ? (
                    <div className="flex space-x-4">
                        <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...':'Save'}</Button>
                        <Button onClick={() => {setIsEditing(false); setDetails(farmDetails);}} className="bg-gray-500 hover:bg-gray-600">Cancel</Button>
                    </div>
                ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
                )}
            </div>
        </Card>
    );
};

const CropDashboard = ({ token, cropName }) => {
    const [cropInfo, setCropInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (cropName && token) {
            setLoading(true);
            setError('');
            api.getCropInfo(token, cropName)
                .then(res => {
                    if (!res.ok) throw new Error(`Information for "${cropName}" is not available in the database.`);
                    return res.json();
                })
                .then(data => setCropInfo(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
            if (!cropName) {
                setError('Enter a crop in your farm details to see information here.');
            }
        }
    }, [cropName, token]);

    return (
        <Card title="Crop Information">
            {loading ? <Spinner /> : error ? <ErrorMessage message={error} /> : (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Showing info for: <span className="text-green-600">{cropInfo.cropName}</span></h3>
                    <div>
                        <h4 className="font-bold">Best Practices:</h4>
                        <p className="text-gray-700">{cropInfo.bestPractices}</p>
                    </div>
                    <div>
                        <h4 className="font-bold">Potential Diseases:</h4>
                        <p className="text-gray-700">{cropInfo.potentialDiseases}</p>
                    </div>
                </div>
            )}
        </Card>
    );
};

const WeatherForecast = ({ token, location }) => {
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (location && token) {
            setLoading(true);
            setError('');
            api.getWeatherForecast(token, location)
                .then(res => {
                    if (!res.ok) throw new Error('Could not fetch weather data. Ensure your location is valid and the API key is correct.');
                    return res.json();
                })
                .then(data => setForecast(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
            if (!location) {
                setError('Enter a location in your farm details to see the forecast.');
            }
        }
    }, [location, token]);

    return (
        <Card title="5-Day Weather Forecast">
            {loading ? <Spinner /> : error ? <ErrorMessage message={error} /> : (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Forecast for {forecast.location}</h3>
                    <ul className="divide-y divide-gray-200">
                        {forecast.days.map((day, index) => (
                            <li key={index} className="py-2 flex justify-between items-center flex-wrap">
                                <span className="font-semibold">{day.date}</span>
                                <div className="flex items-center space-x-2">
                                    <img src={day.iconUrl} alt={day.description} className="w-10 h-10"/>
                                    <span className="text-right">{day.temp}°C, {day.description}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    );
};


const Navigation = ({ activePage, onNavClick }) => {
    const navItems = [
        { id: 'farm', label: 'Farm Dashboard' },
        { id: 'crop', label: 'Crop Dashboard' },
        { id: 'weather', label: 'Weather Forecast' },
    ];
    
    return (
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-6">
                <div className="flex">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onNavClick(item.id)}
                            className={`py-4 px-6 block hover:text-green-500 focus:outline-none font-medium transition duration-200
                                ${activePage === item.id ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`
                            }
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}

const MainDashboard = ({ onLogout }) => {
    const { token } = useAuthToken();
    const [farmDetails, setFarmDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState('farm');
    
    const fetchFarmDetails = useCallback(() => {
        if (token) {
            setLoading(true);
            api.getFarmDetails(token)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch farm details');
                    return res.json();
                })
                .then(data => setFarmDetails(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [token]);

    useEffect(() => {
        fetchFarmDetails();
    }, [fetchFarmDetails]);
    
    const handleUpdate = (updatedFarm) => {
        setFarmDetails(updatedFarm);
    };

    const renderCurrentPage = () => {
        if (loading) return <Spinner />;
        if (error) return <ErrorMessage message={error} />;
        if (!farmDetails) return <Card><p>No farm details found.</p></Card>;

        switch (currentPage) {
            case 'crop':
                return <CropDashboard token={token} cropName={farmDetails.currentCrop} />;
            case 'weather':
                return <WeatherForecast token={token} location={farmDetails.location} />;
            case 'farm':
            default:
                return <FarmDashboard token={token} farmDetails={farmDetails} onUpdate={handleUpdate} />;
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-green-600">Farm Management</h1>
                    <Button onClick={onLogout} className="w-auto">Logout</Button>
                </div>
            </header>
            <Navigation activePage={currentPage} onNavClick={setCurrentPage} />
            <main className="container mx-auto p-6">
                {renderCurrentPage()}
            </main>
        </div>
    );
};


// --- Main App Component ---
function App() {
    const { token, saveToken, removeToken } = useAuthToken();
    const [isRegistering, setIsRegistering] = useState(false);
    
    if (!token) {
        return isRegistering 
            ? <RegisterPage onRegister={saveToken} onSwitchToLogin={() => setIsRegistering(false)} />
            : <LoginPage onLogin={saveToken} onSwitchToRegister={() => setIsRegistering(true)} />;
    }

    return <MainDashboard onLogout={removeToken} />;
}

export default App;

