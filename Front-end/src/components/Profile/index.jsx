import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function Profile(props) {
    const { id } = useParams();
    const [user, setUser] = useState();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('user'));
        if (data.is_admin === false) {
            axios.get(`http://localhost:5000/users/${id}`, { headers: { authorization: `Bearer ${data.token}` } })
                .then(res => setUser(res.result)).catch(error => alert('error'));
        }
    });

    return (
        <div className="container">
            <div className="row mt-2">
                <div className="col-md-6 offset-md-3">
                    <div className="card" style={{ width: "400px" }}>
                        <img className="card-img-top" src="img_avatar1.png" alt="Card" />
                        <div className="card-body">
                            <h4 className="card-title">John Doe</h4>
                            <p className="card-text">Some example text.</p>
                        </div>
                        <div className="card-footer">
                            <Link to={'/'} className="btn btn-secondary">Change info</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;