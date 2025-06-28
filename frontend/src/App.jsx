// routing
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// style
import './App.css'
// pages
import {Startside, Home, Emne, Interesse, Notatbok, Notatblokk, Notat} from './pages';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startside />} />
        <Route path="/home" element={<Home />} />
        <Route path="/emne/:emnekode" element={<Emne />} />
        <Route path="/interesse/:interesse" element={<Interesse />} />
        <Route path="/interesse/:interesse/notatbok" element={<Notatbok />} />
        <Route path="/interesse/:interesse/notatbok/notat/:notatId" element={<Notat />} />
        <Route path="/interesse/:interesse/notatbok/blokk/:blokkId" element={<Notatblokk />} />
        <Route path="/interesse/:interesse/notatbok/blokk/:blokkId/notat/:notatId" element={<Notat />} />
      </Routes>
    </Router>
  )
}

export default App;
