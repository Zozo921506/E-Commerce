import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
    const [main, setMain] = useState([]);
    const [subs, setSubs] = useState([]);
    const [categorieList, setCategorieList] = useState({});
    const token = localStorage.getItem("token");
    const [cartArticles, setCartArticles] = useState(0);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [user_infos, setUserInfos] = useState([]);
    const [carouselImages, setCarouselImages] = useState([
        '/Image/offrepsn.jpg',
        '/Image/fc25.avif',
        '/Image/precoNBA.png'
    ]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const submenu = (id) => {
        setCategorieList((state) => ({
            ...state, [id]: !state[id]
        }));
      };

    useEffect(() => {
        const listProduct = () => {
            fetch('http://localhost:8000/api/products')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setProducts(data);
                })
                .catch(error => {
                    console.error('There was an error fetching the products!', error);
                });
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

        listProduct();
        mainCategorie();
        subCategorie();
    }, []);

    const handleImageClick = (id) => {
        navigate(`/products/${id}`);
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        
        if (query.length > 0) {
            const filteredSuggestions = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.name);
        setSuggestions([]);
        navigate(`/products/${suggestion.id}`);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

        
        const setCookie = (name, value, days) => {
            let expires = "";
            if (days)
            {
                let date = new Date();
                date.setTime(date.getTime() + (days * 24 * 3600 * 1000));
                expires = "; expires=" + date.toUTCString();
                document.cookie = name + "=" + (value || '') + expires + "; path=/";
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
        if (!session_id)
        {
            session_id = crypto.randomUUID();
            setCookie("session_id", session_id, 1);
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

        setCookie();
        if (token)
        {    
            showCartArticle();
            getUserInfos();
        }
    }, [token])

    useEffect(() => {
        const interval = setInterval(() => {
            setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [carouselImages.length]);

    const handleNext = () => {
        setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    };

    const handlePrev = () => {
        setCarouselIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
    };

    return (
        <div className="home">
            <nav>
                <h1 className="logo"><Link to='/'>GAMER P@RADISE</Link></h1>
                <button className="hamburger" onClick={toggleMenu}>
                &#9776;
                </button>
                <form id="search">
                <input name="search" placeholder="Search" id="search_input" value={searchQuery} onChange={handleSearchChange}></input>
                <button id="search_icon">🔍</button>
                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion) => (
                            <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)} className='suggestion-flex'>
                                <img src={suggestion.image} alt={suggestion.image} width={20}></img>
                                <span>{suggestion.name}</span>
                                {suggestion.promo !== 0 ? (
                                    <span>{(suggestion.price - suggestion.price * suggestion.promo / 100).toFixed(2)}$</span>
                                ) : (
                                    <span>{suggestion.price}$</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
                </form>
                <ul className={`navbar ${menuOpen ? 'open' : ''}`}>
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
            {/* Carousel Component */}
            <div className="carousel-container">
                <button className="carousel-control left" onClick={handlePrev}>❮</button>
                <img src={carouselImages[carouselIndex]} alt="Carousel" className="carousel-image" />
                <button className="carousel-control right" onClick={handleNext}>❯</button>
            </div>
            <h2 id="nosproduits">Our products:</h2>
            <div className="products-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div className="product-card" key={product.id} onClick={() => handleImageClick(product.id)}>
                            <div className="product-image-container">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-image"
                                    />
                            </div>
                            <p className="product-description">{product.name}</p>
                            {product.promo !== 0 || null ? (
                                <>
                                    <p className='product-price'>Price: ${(product.price - product.price * product.promo / 100).toFixed(2)}</p>
                                    <p className='red'><strong>Promo</strong></p>
                                </>
                            ) : (
                                <p className="product-price">Price: ${product.price}</p>
                            )}
                            {product.new === true ? (<p className='red'><strong>NEW</strong></p>) : (<></>)}
                            {product.stock !== '0' ? (
                                <></>
                            ) : (
                                <p className='red'>OUT OF STOCK</p>
                            )}                      
                        </div>
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
            <footer>
                <p>GAMER P@RADISE © 2024</p>
            </footer>
        </div>
    );
};

export default Home;
