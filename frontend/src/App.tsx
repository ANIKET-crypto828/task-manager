import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { AuthProvider } from './hooks/useAuth';
import { SocketProvider } from './hooks/useSocket';
import { Layout } from './components/layout/Layout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Dashboard } from './pages/Dashboard';
import { TaskList } from './components/tasks/TaskList';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,  // ADDED: Prevent revalidation on reconnect
        shouldRetryOnError: false,
        dedupingInterval: 10000,        // ADDED: Dedupe requests within 10 seconds
        refreshInterval: 0,             // ADDED: Disable automatic refresh
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<TaskList />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </SWRConfig>
  );
}

export default App;