import './App.css';
import './styles/global.css'
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';


import { SharedProvider, useSharedContext } from './SharedContext';

import { AuthRoutes } from './routes/authRoutes.jsx';
import { PhotographerRoutes } from './routes/photographerRoutes.jsx';
import { CustomerRoutes } from './routes/customerRoutes.jsx';

function AppRoutes() {
  const { user } = useSharedContext();
  const location = useLocation();

  const isRoot = location.pathname === "/";

  // Handle root path separately
  if (isRoot) {
    return user.isAuthenticated ? <PhotographerRoutes /> : <AuthRoutes />;
  }

  return (user.role === "photographer" || user.role === "studio_owner") ? <PhotographerRoutes /> : <CustomerRoutes />;
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
