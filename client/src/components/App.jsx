import React, {useEffect} from 'react';
import Navbar from "./navbar/Navbar";
import './app.css'
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import Registration from "./authorization/Registration";
import Login from "./authorization/Login";
import {useDispatch, useSelector} from "react-redux";
import {auth} from "../actions/user";
import Disk from "./disk/Disk";
import Profile from "./profile/Profile";

function App() {
    const isAuth = useSelector(state => state.user.isAuth)
    const dispatch = useDispatch()

useEffect(() => {dispatch(auth())}, [])
if(isAuth)
    return (
<BrowserRouter>//
  <div className='app'>
     <Navbar/>
      <div className="wrap">
  {!isAuth ?
   <Routes>
     <Route path='/login' element={<Login/>}/>
     <Route path='/registration' element={<Registration/>}/>
   </Routes>
:
  <Routes>
    <Route path='/' element={<Disk/>}/>
    <Route path='/profile' element={<Profile/>}/>
    <Route path='*' element={<Disk/>}/>
  </Routes>
 }
      </div>
  </div>
</BrowserRouter>
    )
}

export default App;
