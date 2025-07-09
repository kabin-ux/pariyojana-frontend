import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import { useAuth } from './context/hooks';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WardOffice from './components/WardOffice';
import Projects from './components/Projects';
import Authentication from './components/Authentication';
import Inventory from './components/Inventory';
import ProjectMethods from './components/ProjectMethods';
import WardOfficeNew from './components/WardOfficeNew';
import SubjectCommittee from './components/SubjectCommittee';
import CityPrideProject from './components/CityPrideProject';
import BudgetCommittee from './components/BudgetCommittee';
import MunicipalOffice from './components/MunicipalOffice';
import CityAssembly from './components/CityAssembly';
import Reports from './components/Reports';
import Settings from './components/Settings';
import LoginPage from './pages/Login';
import UsersPage from './pages/UsersPage';
import { Toaster } from 'react-hot-toast';
import ProjectDetail from './components/ProjectDetail';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">{children}</div>
    </div>
  </div>
);

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/projects" element={<Layout><Projects /></Layout>} />
          {/* <Route path="/projects/:id" element={<Layout><ProjectDetail /></Layout>} /> */}
          <Route path="/authentication" element={<Layout><Authentication /></Layout>} />
          <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
          <Route path="/project-methods" element={<Layout><ProjectMethods /></Layout>} />
          <Route path="/ward-office-new" element={<Layout><WardOfficeNew /></Layout>} />
          <Route path="/subject-committee" element={<Layout><SubjectCommittee /></Layout>} />
          <Route path="/city-pride-project" element={<Layout><CityPrideProject /></Layout>} />
          <Route path="/budget-committee" element={<Layout><BudgetCommittee /></Layout>} />
          <Route path="/municipal-office" element={<Layout><MunicipalOffice /></Layout>} />
          <Route path="/city-assembly" element={<Layout><CityAssembly /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/users" element={<Layout><UsersPage /></Layout>} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <AppRoutes />
      </Router>
    </AppContextProvider>
  );
}

export default App;