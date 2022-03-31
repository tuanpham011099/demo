import React from 'react';
import { Link } from 'react-router-dom';

function Table({ result }) {
    return (
        <tr>
            <td>{result.id}</td>
            <td>{result.name}</td>
            <td>{result.description}</td>
            <td><Link to={`/class/${result.id}`}>Details-&gt;</Link></td>
        </tr>
    );
}

export default Table;