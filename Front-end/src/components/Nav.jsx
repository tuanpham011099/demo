import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Nav(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
    }, []);

    const logout = () => {
        localStorage.removeItem('user');
        window.location.reload();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-sm bg-dark" style={{ justifyContent: 'space-between' }}>
            {user && <div className='mr-5'>
                <Link to={`/me/${user.id}`}><img width='50px' src={user.avatar} alt={user.name} style={{ border: '1px solid #c5c3c3', borderRadius: '50%' }} /></Link>
            </div>}
            <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                    <Link to='/' className="nav-link">Home</Link>
                </li>
                {!user && <li className="nav-item">
                    <Link to='/login' className="nav-link">Login</Link>
                </li>}
                {user && user.is_admin === true && <>
                    <li className="nav-item">
                        <Link to='/add-class' className="nav-link">Add class</Link>

                    </li>
                    <li className="nav-item">
                        <Link to='/' className="nav-link">Timetable</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/registration' className="nav-link">Registration</Link>
                    </li>
                </>

                }


            </ul>
            {user && <div className='mr-5'>
                <button className="btn btn-danger" onClick={logout}>Logout</button>
            </div>}
        </nav >
    );
}

export default Nav;