/* eslint-disable react-refresh/only-export-components */
import { ChakraProvider } from '@chakra-ui/react';
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Landing = lazy(() => import('./Landing'));
const App = lazy(() => import('./App'));
const Profile = lazy(() => import('./Profile'));

const LoadingFallback = () => <div>Loading...</div>;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ChakraProvider>
            <Router>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/app" element={<App />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </Suspense>
            </Router>
        </ChakraProvider>
    </React.StrictMode>
);
