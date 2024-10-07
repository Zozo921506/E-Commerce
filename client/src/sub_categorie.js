import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import './home.css';

const SubCategorie = () => {
    const { name } = useParams();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [main, setMain] = useState([]);
    const [subs, setSubs] = useState([]);
    const [categorieList, setCategorieList] = useState({});
    const [mobile, setMobile] = useState(false);
    const [path, setPath] = useState('');
    const token = localStorage.getItem("token");
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [cartArticles, setCartArticles] = useState(0);
    const [user_infos, setUserInfos] = useState([]);
    const menu = () => {
        setMobile(!mobile);
      };

      const submenu = (id) => {
        setCategorieList((state) => ({
            ...state, [id]: !state[id]
        }));
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
        const listProduct = () => {
            fetch(`http://localhost:8000/api/categories_sub/products/${name}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    setProducts(data);
                })
                .catch(error => {
                    console.error('There was an error fetching the products!', error);
                });
        }

        const breadCrumbs = () => {
            fetch(`http://localhost:8000/api/categories_sub/${name}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    setPath(`Home > ${data[0].parent} > ${data[0].name}`);
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
        breadCrumbs();
        mainCategorie();
        subCategorie();
    }, [name]);

    const handleImageClick = (id) => {
        navigate(`/products/${id}`);
    };

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
        showCartArticle();
    },)

    return (
        <div className="home">
            <nav>
            <h1 className="logo"><Link to='/'>GAMER P@RADISE</Link></h1>
                <button className="hamburger" onClick={menu}>
                &#9776;
                </button>
                <form id="search">
                <input 
                    name="search" 
                    placeholder="Search" 
                    id="search_input" 
                    value={searchQuery} 
                    onChange={handleSearchChange}
                />
                <button id="search_icon">🔍</button>
                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion) => (
                            <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)} className='suggestion-flex'>
                                <img src={suggestion.image} alt={suggestion.image} width={20}></img>
                                <span>{suggestion.name}</span>
                                <span>{suggestion.price}$</span>
                            </li>
                        ))}
                    </ul>
                )}
                </form>
                <ul className={`navbar ${mobile ? 'open' : ''}`}>
                {main.map((categorie) => {
                    return <li key={categorie.id}><strong><a href='#' onClick={() => submenu(categorie.id)}>{categorie.name}</a></strong><ul className={`categorie_children ${categorieList[categorie.id] ? 'open' : ''}`}>
                    {subs.map((sub) => {
                        if (sub.parent === categorie.name)
                        {
                            return <li key={sub.id} className='sub'><Link to={`/${sub.name}`}>{sub.name}</Link></li>
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

export default SubCategorie;