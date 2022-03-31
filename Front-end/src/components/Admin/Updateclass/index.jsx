import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function Update(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [timetable, setTimetable] = useState({});
    const [user, setUser] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:5000/classes/${id}`)
            .then(res => {
                setData(res.data);
            })
            .catch(error => alert(error));
    }, [id]);

    const submitForm = (e) => {
        e.preventDefault();
        console.log(data);
        // axios.put(`http://localhost:5000/classes/${id}`, data, { headers: { authorization: `Bearer ${user.token}` } })
        //     .then(() => alert('Class updated')).catch(error => alert(error));
    };

    const deleteTime = (time_id) => {
        axios.delete(`http://localhost:5000/admins/class/${id}/timetable/${time_id}/delete`, { headers: { authorization: `Bearer ${user.token}` } })
            .then(() => alert('Deleted'))
            .catch(error => alert(error));
    };

    return (
        <div className="container">
            <div className="row w-100">
                <form className='w-100' onSubmit={submitForm}>
                    <div className="col-md-4 offset-md-4">
                        <div className="form-group ">
                            <label htmlFor="name">Name:</label>
                            <input type="text" className="form-control w-100" name='name' value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <input type="text" className="form-control w-100" name='description' value={data.description} onChange={e => setData({ ...data, description: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Max student:</label>
                            <input type="number" className="form-control w-100" name='max_client' value={data.max_client} onChange={e => setData({ ...data, max_client: e.target.value })} />
                        </div>
                        <button type='submit' className="btn btn-secondary w-100" >Update</button>
                    </div>
                </form>
            </div>
            <div className="row">
                <div className="container">
                    <div className="row">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Start time</th>
                                    <th>End time</th>
                                    <th>Day</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.timetable && <Timetable time={data.timetable} deleteTime={deleteTime} />}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Timetable = ({ time, deleteTime }) => {
    console.log(time);
    return (
        time.map(item => <tr key={item.id}>
            <td>{item.from}</td>
            <td>{item.to}</td>
            <td>{item.week_day}</td>
            <td><button className="btn btn-danger" onClick={() => deleteTime(time.id)} >Delete</button></td>
        </tr>
        )
    );
};

export default Update;