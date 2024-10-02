import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Landing from './Landing';
import Profile from './Profile';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/landing" />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/app" element={<App />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    </Router>
);
