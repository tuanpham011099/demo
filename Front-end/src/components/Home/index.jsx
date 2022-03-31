import React, { useEffect, useState } from 'react';
import Table from './Table';
import axios from 'axios';



function Home(props) {
    const [results, setResults] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/classes').then(result => {
            setResults(result.data);
        });
    }, []);
    return (
        <div className="container">
            <div className="row">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {results?.map(result => <Table result={result} key={result.id} />)}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Home;