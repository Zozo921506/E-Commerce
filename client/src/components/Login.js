import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";


const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Login successful');
                localStorage.setItem('token', data.token);
                if (data.admin)
                {
                    navigate('/admin');
                    return;
                }
                else
                {
                    navigate('/');
                    return;
                }
            } else {
                console.log('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    useEffect(() => {
        localStorage.removeItem('token');
    });

    return (
        <div>
        <header>
                <h1>GAMER P@RADISE</h1>
            </header>
            <main>
        <form onSubmit={handleSubmit} id='form-login'>
        <h4>Log in</h4>
        <div className='champ'>
            E-mail :<input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
            />
            
            
            Password :<input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
            />
        <div className='button'>
            <button type="submit">Login</button>
        </div>
            <Link to='/register' className='link'>You don't have an account yet? Sign up here</Link>
        </div>
        </form>
        </main>
        <footer>
            
            </footer>
        </div>
    );
};

export default Login;