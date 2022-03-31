import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Add(props) {
    const [data, setData] = useState({});
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const submitForm = (e) => {
        e.preventDefault();
        console.log(data);
        if (!data.name || !data.description || !data.max_client) {
            alert("Invalid data");
        }
        const user = JSON.parse(localStorage.getItem('user'));
        axios.post('http://localhost:5000/classes', data, { headers: { authorization: `Bearer ${user.token}` } })
            .then(res => { alert('Class created'); navigate("/"); })
            .catch(error => alert(error));
    };

    return (
        <div className="container">
            <div className="row w-100">
                <div className="col-md-4 offset-md-4">
                    <form className='w-100' onSubmit={submitForm}>
                        <div className="form-group ">
                            <label htmlFor="name">Name:</label>
                            <input type="text" className="form-control w-100" name='name' onChange={e => setData({ ...data, [e.target.name]: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <input type="text" className="form-control w-100" name='description' onChange={e => setData({ ...data, [e.target.name]: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Max student:</label>
                            <input type="number" className="form-control w-100" name='max_client' onChange={e => setData({ ...data, [e.target.name]: e.target.value })} />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" >Add</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Add;