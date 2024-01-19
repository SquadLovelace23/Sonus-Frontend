import { HelmetProvider } from 'react-helmet-async';
import RoutesComponent from "./routes/PublicRoutes.routes";
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  const helmetContext = {};

  return (
    <>
      <HelmetProvider context={helmetContext}>
        <Sidebar />
        <RoutesComponent />
      </HelmetProvider> 
    </>
  )
}

export default App
