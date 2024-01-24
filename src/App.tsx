import React from 'react'
import { HelmetProvider } from 'react-helmet-async';
import RoutesComponent from "./routes/PublicRoutes.routes";
import Sidebar from './components/Sidebar/Sidebar';
import ToasterComponent from './components/ToasterComponent/ToasterComponent';

function App() {
  const helmetContext = {};

  return (
    <>
      <HelmetProvider context={helmetContext}>
        <Sidebar />
        <ToasterComponent />
        <RoutesComponent />
      </HelmetProvider> 
    </>
  )
}

export default App
