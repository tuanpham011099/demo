import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './components/Home';
import Login from './components/Login';
import Class from './components/Class';
import Add from './components/Admin/Addclass';
import Update from './components/Admin/Updateclass';
import Registration from './components/Registration';
import Profile from './components/Profile';

function App(props) {
    return (
        <Router>
            <Nav />
            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/class/:id' element={<Class />}></Route>
                <Route path='/add-class' element={<Add />}></Route>
                <Route path='/registration' element={<Registration />}></Route>
                <Route path='/update-class/:id' element={<Update />}></Route>
                <Route path='/me/:id' element={<Profile />}></Route>
            </Routes>

        </Router>
    );
}

export default App;