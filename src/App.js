import { React, createContext, useState, useContext, useEffect } from 'react';
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
import { RecaptchaVerifier } from 'firebase/auth';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { getUserProfile } from './api/user_profiles';
import { AdminLayout } from './smart_components/adminLayout';
import { Container, Typography } from '@mui/material';
import { SalesAdmin } from './pages/admin/sales_admin';
import CreateUserProfilePage from './pages/create_user_profile/create_user_profile';
import UsersAdmin from './pages/admin/users_admin';
import PendingActivation from './pages/misc/PendingActivation';
import { ProductsAdmin } from './pages/admin/products_admin';
import PaymentsAdmin from './pages/admin/payments_admin';
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

  let setupRecaptcha = (callback) => {
    FirebaseAuthProvider.setupRecaptcha(callback)
  }




  let value = { user, setUser, login, logout, setupRecaptcha }
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
const RequireActive = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  const [userActive, setUserActive] = useState(null);
  const fetchUserProfile = async () => {
    if (auth.user) {
      const userProfile = await getUserProfile(auth.user.uid)
      console.log(userProfile)
      if (userProfile && userProfile.isActive) {
        setUserActive(userProfile.isActive)
      }
      else { setUserActive(false); }
    }
  }
  useEffect(() => {
    fetchUserProfile()
  }, [])
  if (userActive == null) {
    return null
  }
  if (userActive == true) {
    return children
  }

  if (userActive == false) {
    return <PendingActivation></PendingActivation>
  }
}
const RequireAdmin = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);

  const fetchUserProfile = async () => {
    if (auth.user) {
      const userProfile = await getUserProfile(auth.user.uid)
      console.log(userProfile)
      if (userProfile && userProfile.role) {
        setUserRole(userProfile.role)
      }
      else { setUserRole("user"); }
    }

  }
  useEffect(() => {
    fetchUserProfile()
  }, [])
  console.log(userRole)
  if (userRole == null) {
    return null
  }
  if (userRole === "admin") {
    return children
  }

  if (userRole != "admin") {
    return <Navigate to='/' replace></Navigate>
  }
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
              <Route path='/admin' element={<RequireAdmin><AdminLayout></AdminLayout></RequireAdmin>}>
                <Route path='dashboard' element={<SalesAdmin />}></Route>
                <Route path='users' element={<UsersAdmin />}></Route>
                <Route path='products' element={<ProductsAdmin />}></Route>
                <Route path='payments' element={<PaymentsAdmin />}></Route>
              </Route>
              <Route path='/add_sales_lot' element={<RequireAuth><RequireActive><AddSalesLotPage /></RequireActive></RequireAuth>}></Route>
              <Route path='/create_user_profile' element={<RequireAuth><CreateUserProfilePage /></RequireAuth>}></Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
