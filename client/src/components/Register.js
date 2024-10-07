import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
// import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        birthday: "",
        email: "",
        password: "",
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
            const response = await fetch("http://localhost:8000/api/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log('Registration successful');
                navigate('/login');
            } else {
                console.log('Registration failed');
            }
        } catch (error) {
            console.error(error);
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
                <form onSubmit={handleSubmit} id="form-register">
                    <h4>Sign-up</h4>
                    <div className="champ">
                        <div>
                        Firstname : <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} required/>
                        &nbsp;
                        Lastname : <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} required/>
                        </div>
                        <div>
                            Date de naissance &nbsp; : <input type="date" name="birthday" onChange={handleChange} required/>
                            E-mail &nbsp; : <input type="email" name="email" placeholder="Email" onChange={handleChange} required/>
                        </div>
                        <div>
                            Password : <input type="password" name="password" placeholder="Password" onChange={handleChange} required/>
                            <div className="button">
                                <button type="submit">Register</button>
                            </div>
                        </div>
                        <Link to='/login' className="link">You already have an account? Log in here</Link>
                    </div>
                </form>
            </main>
        <footer>
            <p>GAMER P@RADISE © 2024</p>
            </footer>
        </div>
    );
};

export default Register;