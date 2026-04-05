import React from "react";
import { Link } from "react-router-dom";
import { Table } from "reactstrap";

const HomeFolders = ({ theme }) => {
    // Switches folder page styling based on selected theme.
    if (theme === 'light') {
        return (
            <div>
                <div>
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item active" aria-current="page">Home</li>
                        </ol>
                    </nav>
                </div>
                <Table light>
                    <thead>
                        <tr>
                            <th>Folders</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li><Link style={{ textDecoration: 'none', color: 'black' }} to="/home">Exercises</Link></li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    } else if (theme === 'dark') {
        return (
            <div>
                <div>
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li aria-current="page">Home</li>
                        </ol>
                    </nav>
                </div>
                <Table dark>
                    <thead>
                        <tr>
                            <th>Folders</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li><Link style={{ textDecoration: 'none', color: 'whitesmoke' }} to="/home">Exercises</Link></li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default HomeFolders
