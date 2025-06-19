import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'

{/* importerer pages */}
import Home from './pages/Home';
import Startside from './pages/Startside';
import Emne from './pages/Emne';
import Interesse from './pages/Interesse';
import Notatblokk from './pages/Notatblokk';
import NotatSide from './pages/NotatSide';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startside />} />
        <Route path="/home" element={<Home />} />
        <Route path="/emne/:emnekode" element={<Emne />} />
        <Route path="/interesse/:navn" element={<Interesse />} />
        <Route path="/interesse/:navn/notater" element={<Notatblokk />} />
        <Route path="/interesse/:navn/notater/:notatId" element={<NotatSide />} />
      </Routes>
    </Router>
  )
}

export default App;
