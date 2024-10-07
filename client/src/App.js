import React from 'react';
import './App.css';
import AppRouter from './Routes';
import { BrowserRouter as Router} from 'react-router-dom';


export default function MyApp() {
  

  return (
    <Router>
      <AppRouter />
    </Router>
    
  );
}
