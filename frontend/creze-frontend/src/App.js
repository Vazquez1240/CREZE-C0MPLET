import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.tsx";
import MainPage from "./pages/Main";
import RegisterPage from "./pages/Registro.tsx";
import ErrorPage from "./pages/Error.tsx";


function App() {

  return (
     <Router>

         <Routes>
             <Route path='/' element={<Home />}/>
             <Route path='/home' element={<MainPage />}/>
             <Route path='/register' element={<RegisterPage />}/>
             <Route path='/error' element={<ErrorPage />}/>
         </Routes>
     </Router>
  );
}

export default App;
