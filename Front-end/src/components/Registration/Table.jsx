import React from 'react';
import { Link } from 'react-router-dom';

function Table({ item }) {
    return (
        <>
            <td>{item.client_id}</td>
            <td>{item.class_id}</td>
            <td>{item?.accept_by}</td>
            <td>{item.status}</td>
            {item.status === 'pending' && <td><button className="btn btn-primary mr-1">Approve</button>
                <button className="btn btn-danger">Reject</button>
            </td>}
        </>
    );
}

export default Table;