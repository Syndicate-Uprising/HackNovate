import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import './App.css';
import Main from './pages/Main';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Room from './pages/Room';
import JoinRoom from './pages/JoinRoom';
import { AuthProvider } from './pages/AuthContext';



function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/main',
      element: <ProtectedRoute><Main /></ProtectedRoute>,
    },
    {
      path: '/joinroom',
      element: <ProtectedRoute><JoinRoom /></ProtectedRoute>,
    },
    {
      path:'/room/:id',
      element:<ProtectedRoute><Room /></ProtectedRoute>
    }
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login', { replace: true });
    
    }
  }, [navigate]);

  return children;
}

export default App;