import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function Class(props) {
    const { id } = useParams();
    const [abc, setAbc] = useState();
    const [user, setUser] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/classes/${id}`)
            .then(result => setAbc(result.data))
            .catch(err => console.log(err));
    }, [id]);
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
    }, []);

    const deleteClass = (id) => {
        axios.delete(`http://localhost:5000/classes/${id}`, { headers: { authorization: `Bearer ${user.token}` } })
            .then(res => navigate('/'))
            .catch(error => alert(error));
    };


    return (
        <div className="container">
            <div className="row">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Open</th>
                            <th>Max students</th>
                            <th>Time</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {abc && <tr>
                            <td>{abc.id}</td>
                            <td>{abc.name}</td>
                            <td>{abc.createdAt.split('T')[0].split('-').reverse().join('-')}</td>
                            <td>{abc.max_client}</td>
                            <td>
                                {abc.timetable.map((item, index) => <Table time={item} key={index} />)}
                            </td>
                            {user?.is_admin === false && <td><button className="btn btn-primary">Register</button></td>}
                            {user?.is_admin === true && (<td>
                                <Link className="btn btn-warning mr-2" to={`/update-class/${abc.id}`} >Update</Link>

                                <button className="btn btn-danger" onClick={() => deleteClass(abc.id)}>Delete</button></td>)}
                        </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
function Table({ time }) {
    return (
        <>
            <div><strong>{time.week_day.charAt(0).toUpperCase() + time.week_day.slice(1)}</strong>: {time.from.split(':')[0] + ':' + time.from.split(':')[1]}-{time.to.split(':')[0] + ':' + time.to.split(':')[1]}</div>
        </>
    );
}

export default Class;