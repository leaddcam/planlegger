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
        <Route path="/interesse/:navn" element={<Interesse />} />
        <Route path="/interesse/:navn/notatbok" element={<Notatbok />} />
        <Route path="/interesse/:navn/notatbok/notat/:notat" element={<Notat />} />
        <Route path="/interesse/:navn/notatbok/blokk/:blokk" element={<Notatblokk />} />
        <Route path="/interesse/:navn/notatbok/blokk/:blokk/notat/:notat" element={<Notat />} />
      </Routes>
    </Router>
  )
}

export default App;
