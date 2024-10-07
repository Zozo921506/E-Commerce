import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [path, setPath] = useState('');
    const token = localStorage.getItem("token");
    const [main, setMain] = useState([]);
    const [subs, setSubs] = useState([]);
    const [categorieList, setCategorieList] = useState({});
    const [mobile, setMobile] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const [cartArticles, setCartArticles] = useState(0);
    const [total, setTotal] = useState(0);
    const [user_infos, setUserInfos] = useState([]);

    const menu = () => {
        setMobile(!mobile);
      };

      const submenu = (id) => {
        setCategorieList((state) => ({
            ...state, [id]: !state[id]
        }));
      };

      const handleIncrease = () => {
        if (product && quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const addToCart = async () => {
        if (token === null)
        {
            navigate('/login');
            return;
        }
        const url = `http://localhost:8000/api/add/${id}`;
        try
        {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity })
            })
            if (response.ok)
            {
                console.log("Product added to cart");
                navigate(`/products/${id}`);
            }
            else
            {
                console.log("The product haven't been added to cart", response);
            }
        }
        catch(e)
        {
        console.error('Error: ', e);
        }
    }

    const getCookie = (name) => {
        let cookie_name = name + "=";
        let split = document.cookie.split(';');
        for (let i = 0; i < split.length; i ++)
        {
            let cookie = split[i];
            while (cookie.charAt(0) === ' ')
            {
                cookie = cookie.substring(1, cookie.length);
            } 
            if (cookie.indexOf(cookie_name) === 0)
            {
                return cookie.substring(cookie_name.length, cookie.length);
            }
            return null;
        }
    }

    let session_id = getCookie("session_id");

    const buy = async () => {
        if (token)
        {
           let price_total = total * quantity;
           let total_weight = product.weight * quantity;
            const data = {
                price: price_total,
                weight: total_weight,
                quantity: quantity,
                source: product.source,
                id_product: product.id 
            }
            console.log(data);
            const url = `http://localhost:8000/api/product/payment_token`;
            try
            {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
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
        }
        else
        {
            let redirect = window.confirm("Do you want to log in to purchase this article ?")
            if (redirect === true)
            {
                navigate('/login');
                return;
            }
            else
            {
                let price_total = total * quantity;
                let total_weight = product.weight * quantity;
                const data = {
                    price: price_total,
                    id_session: session_id,
                    weight: total_weight,
                    quantity: quantity,
                    source: product.source,
                    id_product: product.id
                }
                
                const url = `http://localhost:8000/api/product/payment`;
                try
                {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
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
            }
        }
    }

    useEffect(() => {
        const details = async () => {
            console.log(`Fetching product with ID: ${id}`);
            fetch(`http://localhost:8000/api/products/${id}`)
                .then(response => {
                    console.log('Response status:', response.status); 
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Product data:', data);
                    setProduct(data);
                    if (data.promo !== 0)
                    {
                        setTotal((data.price - data.price * data.promo / 100).toFixed(2));
                    }
                    else
                    {
                        setTotal(data.price);
                    }
                })
                .catch(error => {
                    console.error('There was an error fetching the product!', error);
                });
        }

        const breadcrumbs = async() => {
            const url = `http://localhost:8000/api/filter/${id}`;
            try
            {
                const response = await fetch(url);
                const data = await response.json();
                setPath(`Home > Products > ${data[0].categorie_name} > ${data[0].article_name}`);
            }
            catch(e)
            {
                console.error(e);
            }
        }

        const mainCategorie = async () => {
            const url = "http://localhost:8000/api/categories";
            try
            {
                const response = await fetch(url);
                const data = await response.json();
                setMain(data);
            }
            catch (error)
            {
                console.log(error);
            }
        }

        const subCategorie = async () => {
            const url = "http://localhost:8000/api/categories_sub";
            try
            {
                const response = await fetch(url);
                const data = await response.json();
                setSubs(data);
            }
            catch (error)
            {
                console.log(error);
            }
        }

        details();
        breadcrumbs();
        mainCategorie();
        subCategorie();
    }, [id]);

    useEffect(() => {
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
                    headers: { 'Authorization': `Bearer ${token}` }
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

        const deleteCommand = async () => {
            const url = `http://localhost:8000/api/product/payment/delete/${session_id}`;
            try
            {
                const response = await fetch(url, {
                    method: 'DELETE',
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

        if (token)
        {
            showCartArticle();
            deleteCommandToken();
            getUserInfos();
        }
        else
        {
            deleteCommand();
        }
    }, [token])

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <nav>
                <h1 className="logo"><Link to='/'>GAMER P@RADISE</Link></h1>
                <button className="hamburger" onClick={menu}>
                &#9776;
                </button>
                <form id="search">
                <input name="search" placeholder="Search" id="search_input"></input>
                <button id="search_icon">🔍</button>
                </form>
                <ul className={`navbar ${mobile ? 'open' : ''}`}>
                {main.map((categorie) => {
                    return <li key={categorie.id}><strong><a href='#' onClick={() => submenu(categorie.id)}>{categorie.name}</a></strong><ul className={`categorie_children ${categorieList[categorie.id] ? 'open' : ''}`}>
                    {subs.map((sub) => {
                        if (sub.parent === categorie.name)
                        {
                            return <li className='sub' key={sub.id}><Link to={`/${sub.name}`}>{sub.name}</Link></li>
                        }
                    })}
                    </ul></li>
                })}
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
            <p className='breadcrumbs'>{path}</p>
            <div className="product-detail">
                <h1>{product.name}</h1>
                <img src={product.image} alt={product.name} />
                <p>{product.description}</p>
                {product.promo !== 0 || null ? (
                    <>
                        <p id='promo-price'>Price: ${product.price}</p>
                        <p id='new_price'>New Price: ${(parseFloat(product.price) - parseFloat(product.price) * parseInt(product.promo) / 100).toFixed(2)}</p>
                    </>
                ) : (
                <p className="price">Price: ${product.price}</p>
                )}
                <p className="stock">Stock: {product.stock}</p>
                <div className="add-to-cart-container">
                    <button onClick={handleDecrease}>-</button>
                    <input value={quantity} readOnly />
                    <button onClick={handleIncrease}>+</button>
                </div>
                <div id='detail-buy'>
                    <button className="add-to-cart" onClick={addToCart}>Add to cart</button>
                    <button className='buy-article' onClick={buy}>Buy</button>
                </div>
            </div>
            <footer className="footer">
                <p>GAMER P@RADISE © 2024</p>
            </footer>
        </div>
    );
};

export default ProductDetail;