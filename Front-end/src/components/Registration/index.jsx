import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Table from './Table';

function Registration(props) {
    const [regis, setRegis] = useState([]);
    const [stt, setStt] = useState('accepted');
    useEffect(() => {
        axios.get(`http://localhost:5000/registrations/${stt}`)
            .then(res => { setRegis(res.data); })
            .catch(error => console.log(error));

    }, [stt]);
    return (
        <div className="container">
            <select name="opt" className=' mt-2' onClick={e => setStt(e.target.value)} style={{ padding: '5px', outline: 'none', border: '1px solid #c2c2c2', borderRadius: '5px', color: '#5e5d5d', fontSize: '15px' }}>
                <option value="accepted">accepted</option>
                <option value="pending">pending</option>
                <option value="rejected">rejected</option>
            </select>
            <div className="row">

                <table className="table table-hover" style={{ border: '1px solid #dbd6d6', borderRadius: '5px' }}>
                    <thead>
                        <tr>
                            <th>Client ID</th>
                            <th>Class ID</th>
                            <th>Admin ID</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {
                                regis && regis.map(item => <Table item={item} key={item.id} />)
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Registration;