import { ChakraProvider } from '@chakra-ui/react';
import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Landing = lazy(() => import('./Landing'));
const App = lazy(() => import('./App'));
const Profile = lazy(() => import('./Profile'));
const Login = lazy(() => import('./Login'));
const Register = lazy(() => import('./Register'));
const Chat = lazy(() => import('./Chat'));
const Privacy = lazy(() => import('./Privacy'));

const LoadingFallback = () => <div>Loading...</div>;

ReactDOM.createRoot(document.getElementById('root')).render(
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
                    <Route path="/privacy" element={<Privacy />} />
                </Routes>
            </Suspense>
        </Router>
    </ChakraProvider>
);