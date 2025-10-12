// routing
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// style
import './App.css'
// pages
import {Startside, Login, Signup, Home, Emne, Interesse, Notatbok, Notatblokk, Notat} from './pages';
// auth
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './auth/AuthContext';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Startside />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/emne/:emnekode" element={<Emne />} />
          <Route path="/emne/:emnekode/notatbok" element={<Notatbok />} />
          <Route path="/interesse/:interesse" element={<Interesse />} />
          <Route path="/interesse/:interesse/notatbok" element={<Notatbok />} />
          <Route path="/interesse/:interesse/notatbok/notat/:notatId" element={<Notat />} />
          <Route path="/emne/:emnekode/notatbok/notat/:notatId" element={<Notat />} />
          <Route path="/interesse/:interesse/notatbok/blokk/:blokkId" element={<Notatblokk />} />
          <Route path="/emne/:emnekode/notatbok/blokk/:blokkId" element={<Notatblokk />} />
          <Route path="/interesse/:interesse/notatbok/blokk/:blokkId/notat/:notatId" element={<Notat />} />
          <Route path="/emne/:emnekode/notatbok/blokk/:blokkId/notat/:notatId" element={<Notat />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;
