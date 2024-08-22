import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.tsx";
import MainPage from "./pages/Main";
import RegisterPage from "./pages/Registro.tsx";


function App() {

  return (
     <Router>

         <Routes>
             <Route path='/' element={<Home />}/>
             <Route path='/home' element={<MainPage />}/>
             <Route path='/register' element={<RegisterPage />}/>
         </Routes>
     </Router>
  );
}

export default App;
