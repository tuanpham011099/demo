import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login(props) {

    const [data, setData] = useState({});
    const [error, setError] = useState();
    const [stt, setStt] = useState('users');
    const navigate = useNavigate();
    const formSubmit = async (e) => {
        e.preventDefault();
        axios.post(`http://localhost:5000/${stt}/login`, data)
            .then(res => {
                if (stt === 'users') {
                    res.data.is_admin = false;
                } else
                    res.data.is_admin = true;
                localStorage.setItem('user', JSON.stringify(res.data));
                window.location.reload();
                navigate('/');
            })
            .catch(error => setError('Wrong email or password'));
    };
    useEffect(() => {
        let user1 = localStorage.getItem('user');
        if (user1) navigate('/');
    }, [navigate]);
    return (
        <div className="container">
            <div className="row w-100">
                <form className='w-100' onSubmit={formSubmit}>
                    <div className="form-group ">
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="form-control w-100" name='email' onChange={e => setData({ ...data, [e.target.name]: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" className="form-control w-100" name='password' onChange={e => setData({ ...data, [e.target.name]: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Login as</label> <br />
                        <select name="stt" onChange={e => setStt(e.target.value)}>
                            <option value="users">USER</option>
                            <option value="admins">ADMIN</option>
                        </select>
                    </div>
                    {error && <h4 style={{ color: 'red', background: 'yellow' }}>{error}</h4>}
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;