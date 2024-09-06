import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './component/NavigationBar';
import Possessions from './component/Possessions';
import Patrimoine from './component/Patrimoine';
import PossessionForm from './component/PossessionForm'; // Le formulaire pour créer une nouvelle possession

function App() {
  return (
    <Router>
      <NavigationBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Possessions />} />
          <Route path="/patrimoine" element={<Patrimoine />} />
          <Route path="/create-possession" element={<PossessionForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;