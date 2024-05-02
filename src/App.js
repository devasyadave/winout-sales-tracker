import { React, createContext, useState, useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import { AddSalesLotPage } from './pages/add_sales_lot/add_sales_lot';
import { Login } from './pages/login/login';
import { FirebaseAuthProvider } from './api/auth';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers';

export const useAuth = () => {
  return useContext(AuthContext);
}


const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(FirebaseAuthProvider.get_user());

  let login = (email, password, callback) => {
    FirebaseAuthProvider.login(email, password, (user) => {
      setUser(user);
      callback(user);
    })
  }

  let logout = (callback) => {
    FirebaseAuthProvider.logout(() => {
      setUser(null);
      callback();
    })
  }


  let value = { user, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace></Navigate>
  }

  return children;
}

function App() {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path='/' element={<Navigate to="/add_sales_lot" />} />
              <Route path='/login' element={<Login />} />

              <Route path='/add_sales_lot' element={<RequireAuth><AddSalesLotPage /></RequireAuth>}></Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
