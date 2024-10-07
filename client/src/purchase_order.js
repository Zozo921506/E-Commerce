import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import './Cart.css';

const PurchaseOrder = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [main, setMain] = useState([]);
    const [subs, setSubs] = useState([]);
    const [categorieList, setCategorieList] = useState({});
    const [mobile, setMobile] = useState(false);
    const [cartArticles, setCartArticles] = useState(0);
    const token = localStorage.getItem("token");
    const [user_infos, setUserInfos] = useState([]);

    const getCookie = (name) => {
        let cookie_name = name + "=";
        let split = document.cookie.split(';');
        for (let i = 0; i < split.length; i ++) {
            let cookie = split[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            } 
            if (cookie.indexOf(cookie_name) === 0) {
                return cookie.substring(cookie_name.length, cookie.length);
            }
            return null;
        }
    }
    
    const id_session = getCookie('session_id');

    const displayPurchaseOrder = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/purchase_order/${id_session}`, {
                headers: { 
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPurchaseOrders(data);
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch purchase order:', errorData);
                setPurchaseOrders([]);
            }
        } catch (error) {
            console.error('Error fetching purchase order:', error);
            setPurchaseOrders([]);
        }
    };

    const displayPurchaseOrderToken = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/purchase_order`, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPurchaseOrders(data);
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch purchase order:', errorData);
                setPurchaseOrders([]);
            }
        } catch (error) {
            console.error('Error fetching purchase order:', error);
            setPurchaseOrders([]);
        }
    };

    const fetchCartArticlesCount = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/cart/nb_articles', {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCartArticles(data);
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch cart articles count:', errorData);
                setCartArticles(0);
            }
        } catch (error) {
            console.error('Error fetching cart articles count:', error);
            setCartArticles(0);
        }
    };

    const toggleMenu = () => {
        setMobile(!mobile);
    };

    const submenu = (id) => {
        setCategorieList((state) => ({
            ...state, [id]: !state[id]
        }));
    };

    useEffect(() => {
        const getUserInfos = async () => {
            const url = 'http://localhost:8000/api/get_user_infos';
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setUserInfos(data);
            } catch (error) {
                console.log(error);
            }
        }

        if (token) {
            fetchCartArticlesCount();
            displayPurchaseOrderToken();
            getUserInfos();
        } else {
            displayPurchaseOrder();
        }
    }, [token]);

    useEffect(() => {
        const mainCategorie = async () => {
            const url = "http://localhost:8000/api/categories";
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setMain(data);
                } else {
                    console.error('Failed to fetch main categories');
                }
            } catch (error) {
                console.error('Error fetching main categories:', error);
            }
        };

        const subCategorie = async () => {
            const url = "http://localhost:8000/api/categories_sub";
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setSubs(data);
                } else {
                    console.error('Failed to fetch sub categories');
                }
            } catch (error) {
                console.error('Error fetching sub categories:', error);
            }
        };

        mainCategorie();
        subCategorie();
    }, []);

    const downloadPDF = () => {
        const doc = new jsPDF();
        let yPosition = 10;
        const pageHeight = doc.internal.pageSize.height;
    
        doc.setFontSize(16);
        doc.text('Purchase Order Details', 10, yPosition);
        yPosition += 10;
    
        purchaseOrders.forEach((order) => {
            if (yPosition + 60 > pageHeight) { 
                doc.addPage(); 
                yPosition = 10;
            }
    
            doc.setFontSize(12);
            doc.text(`Order Number: ${order.order_number}`, 10, yPosition);
            yPosition += 10;
            doc.text(`Name: ${order.name}`, 10, yPosition);
            yPosition += 10;
            doc.text(`Quantity: ${order.quantity}`, 10, yPosition);
            yPosition += 10;
            doc.text(`Address: ${order.adress}`, 10, yPosition);
            yPosition += 10;
            doc.text(`Price: $${order.price}`, 10, yPosition);
            yPosition += 10;
            doc.text(`Status: ${order.status}`, 10, yPosition);
            yPosition += 10;
    
            if (order.gift) {
                doc.text(`Gift: ${order.gift}`, 10, yPosition);
                yPosition += 10;
            }
        });
    
        yPosition += 20;
        if (yPosition + 30 > pageHeight) {
            doc.addPage();
            yPosition = 10;
        }
        
        doc.setFontSize(14);
        doc.text('Delivery for:', 10, yPosition);
        yPosition += 10;
        doc.setFontSize(12);
        if (user_infos.length > 0) {
            const user = user_infos[0];
            doc.text(`Name: ${user.firstname} ${user.lastname}`, 10, yPosition);
        } else {
            doc.text('No user information available.', 10, yPosition);
        }
    
        doc.save('purchase_order.pdf');
    };

    return (
        <div>
            <nav>
                <h1 className="logo"><Link to='/'>GAMER P@RADISE</Link></h1>
                <button className="hamburger" onClick={toggleMenu}>
                    &#9776;
                </button>
                <form id="search">
                    <input name="search" placeholder="Search" id="search_input" />
                    <button id="search_icon">🔍</button>
                </form>
                <ul className={`navbar ${mobile ? 'open' : ''}`}>
                    {main.map(categorie => (
                        <li key={categorie.id}>
                            <strong>
                                <a href='#' onClick={() => submenu(categorie.id)}>{categorie.name}</a>
                            </strong>
                            <ul className={`categorie_children ${categorieList[categorie.id] ? 'open' : ''}`}>
                                {subs.filter(sub => sub.parent === categorie.name).map(sub => (
                                    <li className='sub' key={sub.id}>
                                        <Link to={`/${sub.name}`}>{sub.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                    <li><Link to='/purchase_order'><strong>Purchase Order</strong></Link></li>
                    {token ? (
                    <>
                        {cartArticles === 0 ? (
                            <li>
                                <div id='cart_nb_articles_logged'>
                                    <a href='/Cart' className='element'><img className="panier" src="/Image/panier.png"  alt='panier'></img></a>
                                </div>
                            </li>
                        ) : (
                        <li> 
                            <div id='cart_nb_articles_logged'>
                                <a href='/Cart' className='element'><img className="panier" src="/Image/panier.png"  alt='panier'></img></a>
                                <h4><strong>{cartArticles}</strong></h4>
                            </div>
                        </li>
                        )}
                        <li><strong>{user_infos.map((info) => {
                            return <Link to='/my_account'>{info.firstname}</Link>
                        })}</strong></li>
                    </>
                    ) : (
                        <>
                            <li>
                                <div id='cart_nb_articles'>
                                    <a href='/Cart' className='element'><img className="panier" src="/Image/panier.png"  alt='panier'></img></a>
                                </div>
                            </li>
                            <li><strong><Link to='/login' className="element">Login</Link></strong></li>
                            <li><strong><Link to='/register' className='element'>Sign-up</Link></strong></li>
                        </>
                    )}
                </ul>
            </nav>
            <div className="cart-container">
                <h1>Purchase order</h1>
                {purchaseOrders.length === 0 ? (
                    <p>Your didn't buy anything yet</p>
                ) : (
                    <>
                        {purchaseOrders.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="item-details">
                                    <h3>Order Number: {item.order_number}</h3>
                                    <h3>{item.name}</h3>
                                    <h3>Quantity: {item.quantity}</h3>
                                    <h3>Address: {item.adress}</h3>
                                    <h3>Price: ${item.price}</h3>
                                    {item.gift ? (<h3>Gift paper: {item.gift}</h3>) : (<> </>)}
                                    <h3>Status: {item.status}</h3>
                                </div>
                            </div>
                        ))}
                        <button onClick={downloadPDF} className="download-pdf-button">Download PDF</button>
                    </>
                )}
            </div>
            <footer>
                <p>GAMER P@RADISE © 2024</p>
            </footer>
        </div>
    );
};

export default PurchaseOrder;
