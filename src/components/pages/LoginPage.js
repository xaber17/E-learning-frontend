import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import '../../App.css'

export default function Login({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
          username,
          password
        });
        setToken(token);
      }
    return (
        <div className="text-center m-5-auto">
            <h2>Log in to E-Learning</h2>
            <form onSubmit={handleSubmit}>
                <p>
                    <label>Username</label><br/>
                    <input type="text" name="username" required onChange={e => setUserName(e.target.value)}/>
                </p>
                <p>
                    <label>Password</label>
                    <br/>
                    <input type="password" name="password" required onChange={e => setPassword(e.target.value)}/>
                </p>
                <p>
                    <button id="sub_btn" type="submit">Login</button>
                </p>
            </form>
            <footer>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    )
}

async function loginUser(credentials) {
    return fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }