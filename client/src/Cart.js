import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [main, setMain] = useState([]);
    const [subs, setSubs] = useState([]);
    const [categorieList, setCategorieList] = useState({});
    const [mobile, setMobile] = useState(false);
    const [cartArticles, setCartArticles] = useState(0);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [formData, setFormData] = useState([]);
    const [user_infos, setUserInfos] = useState([]);

    const fetchCartItems = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
                const command = data.map(item => ({
                    price: item.product.price,
                    weight: item.product.weight,
                    quantity: item.quantity,
                    source: item.product.source,
                    id_product: item.product.id
                }));

                setFormData(command);
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch cart items:', errorData);
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setCartItems([]);
        }
    };

    const fetchCartTotal = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/cart_total', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTotal(data);
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch cart total:', errorData);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error fetching cart total:', error);
            setTotal(0); 
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

    const handleRemove = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/cart/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchCartItems();
                fetchCartTotal();
                fetchCartArticlesCount();
            } else {
                console.error('Failed to remove cart item');
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };

    const handleCheckout = async () => {
        const url = 'http://localhost:8000/api/cart/payment_token';
        try
        {
            console.log(formData);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({items: formData})
            });
            if (response.ok)
            {
                navigate('/payment');
                return;
            }
            else
            {
                console.log("Something went wrong", response);
            }
        }
        catch (e)
        {
            console.error(e);
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
        if (!token) {
            navigate('/login');
            return;
        }
        fetchCartItems();
        fetchCartTotal();
        const showCartArticle = async () => {
            const url = "http://localhost:8000/api/cart/nb_articles";
            try
            {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setCartArticles(data);
            }
            catch (error)
            {
                console.log(error);
            }
        }

        const deleteCommandToken = async () => {
            const url = `http://localhost:8000/api/product/payment_token/delete`;
            try
            {
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.ok)
                {
                    console.log('You have no command yet');
                }
                else
                {
                    console.log("Can't remove a previous command", response);
                }
            }
            catch (e)
            {
                console.error(e);
            }
        }

        const getUserInfos = async () => {
            const url = 'http://localhost:8000/api/get_user_infos';
            try
            {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setUserInfos(data);
            }
            catch (error)
            {
                console.log(error);
            }
        }
    
        showCartArticle();
        fetchCartArticlesCount();
        deleteCommandToken();
        getUserInfos();
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
                </ul>
            </nav>
            <div className="cart-container">
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.product.image} alt={item.product.name} />
                            <div className="item-details">
                                <h2>{item.product.name}</h2>
                                {item.product.promo !== 0 ? (
                                    <p>Price: ${(item.product.price - item.product.price * item.product.promo / 100).toFixed(2)}</p>
                                ) : (
                                <p>Price: ${item.product.price * item.quantity}</p>
                                )}
                                <p>Quantity: {item.quantity}</p>
                                <button className="remove-button" onClick={() => handleRemove(item.id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
                <div id='total_price'>
                    <h3>Total: ${(total).toFixed(2)}</h3>
                </div>
                {cartItems.length > 0 && <button className="checkout-button" onClick={handleCheckout}>Payment</button>}
            </div>
            <footer>
                <p>GAMER P@RADISE © 2024</p>
            </footer>
        </div>
    );
};

export default Cart;
