import './App.css';
import './styles/global.css'
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';


import { SharedProvider, useSharedContext } from './SharedContext';

import { AlbumClient } from './pages/albumClient.jsx';
import { AuthRoutes } from './routes/authRoutes.jsx';
import { PhotographerRoutes } from './routes/photographerRoutes.jsx';
import { CustomerRoutes } from './routes/customerRoutes.jsx';
import useRouteParams from './hooks/useRouteParams.js';
import useQueryParams from './hooks/useQueryParams.js';

function AppRoutes() {
  const { user } = useSharedContext();
  const queryParams = useQueryParams();

  // Check for 'role' parameter in the URL
  const roleFromURL = queryParams.get('role'); // e.g., 'customer'
  if  (roleFromURL === 'customer') {
    return <CustomerRoutes />
  }

  if (!user.isAuthenticated) {
    // Render auth-related routes if the user is not logged in
    return <AuthRoutes />;
  }

  // Render role-specific routes
  return user.role === "photographer" ? <PhotographerRoutes /> : <CustomerRoutes />;
}

function App() {
  return (
    <SharedProvider>
      <BrowserRouter>
        <div className="outer-container">
          <main className='main-outer-container'>
            {/* <Routes>
              <Route path='/album' element={<AlbumClient />} />
            </Routes> */}
            <AppRoutes />
          </main>
        </div>
      </BrowserRouter>
    </SharedProvider>
  );
}

export default App;
