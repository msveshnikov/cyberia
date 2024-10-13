import { ChakraProvider } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga4';

const Landing = lazy(() => import('./Landing'));
const App = lazy(() => import('./App'));
const Profile = lazy(() => import('./Profile'));
const Login = lazy(() => import('./Login'));
const Register = lazy(() => import('./Register'));
const Chat = lazy(() => import('./Chat'));
const Privacy = lazy(() => import('./Privacy'));

const LoadingFallback = () => <div>Loading...</div>;

const AppWithAnalytics = () => {
    useEffect(() => {
        ReactGA.initialize('G-E5XZ9W8ZWN');
    }, []);

    return (
        <ChakraProvider>
            <Router>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/app" element={<App />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/chat/:tileid" element={<Chat />} />
                        <Route path="/privacy" element={<Privacy />} />
                    </Routes>
                </Suspense>
            </Router>
        </ChakraProvider>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<AppWithAnalytics />);
