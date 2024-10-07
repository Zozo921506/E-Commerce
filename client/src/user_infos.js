import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

const UserDetail = () => {
    const token = localStorage.getItem("token");
    const [main, setMain] = useState([]);
    const [birthday, setBirthday] = useState('');
    const [subs, setSubs] = useState([]);
    const [categorieList, setCategorieList] = useState({});
    const [mobile, setMobile] = useState(false);
    const navigate = useNavigate();
    const [cartArticles, setCartArticles] = useState(0);
    const [user_infos, setUserInfos] = useState({
        id: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        birthday: ''
    });
    const [formData, setFormData] = useState(
        {
            firstname: '',
            lastname: '',
            city: '',
            zipcode: '',
            adress: '',
            creditCard: '',
        }
    );

    const menu = () => {
        setMobile(!mobile);
      };

    const submenu = (id) => {
    setCategorieList((state) => ({
        ...state, [id]: !state[id]
    }));
    };

    const date = (string) => {
    if (string !== null)
    {
        var options = { year: 'numeric', month: 'long', day: 'numeric'};
        return new Date(string.date).toLocaleDateString([],options);
    }
    else
    {
        const update = "Not updated yet";
        return update;
    }
    }

    const change = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, [name]: value
        });
    };

    const changeUser = (e) => {
        const { name, value } = e.target;
        setUserInfos({
            ...user_infos, [name]: value
        });
    };

    const savePaymentInfo = async () => {
        const url = 'http://localhost:8000/api/payment/save_info';
        try
          {
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
              });
    
              if (response.ok)
              {
                console.log('Your info have successfully been save');
              }
              else
              {
                console.log("Can't save your info", response);
              }
          }
          catch (e)
          {
              console.error(e);
          }
      }

      const updateUser = async () => {
        const data = {email: user_infos.email, password: user_infos.password}
        const url = 'http://localhost:8000/api/update_user_infos';
        try
          {
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
              });
    
              if (response.ok)
              {
                console.log('Your info have successfully been save');
              }
              else
              {
                console.log("Can't save your info", response);
              }
          }
          catch (e)
          {
              console.error(e);
          }
      }

      const submited = async () => {
          savePaymentInfo();
          updateUser();
          alert('Your informations have been save')
      }

    useEffect(() => {
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

        mainCategorie();
        subCategorie();
    }, []);

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
                setUserInfos(data[0]);
                setBirthday(data[0].birthday)
                console.log(data[0]);
            }
            catch (error)
            {
                console.log(error);
            }
        }

        const getPaymentInfos = async () => {
            const url = "http://localhost:8000/api/payment/get_payment_info"
              try
              {
                const response = await fetch(url, {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                });
        
                if (response.ok)
                {
                  const data = await response.json();
                  setFormData(data[0]);
                }
                else
                {
                  console.log("You don't have save your informations yet")
                }
              }
              catch (e)
              {
                console.error(e);
              }
          }

        if (token)
        {
            showCartArticle();
            getUserInfos();
            getPaymentInfos();
        }
        else
        {
            navigate('/');
        }
    }, [token])

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
                        <li><strong><Link to='/my_account'>{user_infos.firstname}</Link></strong></li>
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
            <div className="form-container">
            <h1>Personal informations</h1>
                <div className='form-detail'>
                    <label><strong>Firstname: </strong></label>
                    <p>{user_infos.firstname}</p>
                </div>
                <div className='form-detail'>
                    <label><strong>Lastname: </strong></label>
                    <p>{user_infos.lastname}</p>
                </div>
                <div className='form-detail'>
                    <label><strong>Birthday: </strong></label>
                    <p>{date(birthday)}</p>
                </div>
                <div className='form-detail'>
                    <label><strong>Email: </strong></label>
                    <input value={user_infos.email} onChange={changeUser} name='email'/>
                </div>
                <div className='form-detail'>
                    <label><strong>Password: </strong></label>
                    <input type='password' placeholder='Password' onChange={changeUser} name='password'></input>
                </div>
                <h1>Credential informations</h1>
                {formData ? (
                    <>
                        <div className='form-detail'>
                            <label><strong>Firstname: </strong></label>
                            <input value={formData.firstname} onChange={change} name='firstname'/>
                        </div>
                        <div className='form-detail'>
                            <label><strong>Lastname: </strong></label>
                            <input value={formData.lastname} onChange={change} name='lastname'/>
                        </div>
                        <div className='form-detail'>
                            <label><strong>City: </strong></label>
                            <input value={formData.city} onChange={change} name='city'/>
                        </div>
                        <div className='form-detail'>
                            <label><strong>Zipcode: </strong></label>
                            <input value={formData.zipcode} onChange={change} name='zipcode'/>
                        </div>
                        <div className='form-detail'>
                            <label><strong>Adress: </strong></label>
                            <input value={formData.adress} onChange={change} name='adress'/>
                        </div>
                        <div className='form-detail'>
                            <label><strong>Credit card number: </strong></label>
                            <input value={formData.creditCard} onChange={change} name='creditCard'/>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='form-detail'>
                            <label><strong>Firstname: </strong></label>
                            <input placeholder='Firstname' onChange={change} name='firstname'/>
                        </div>
                        <div className='form-detail'>
                            <label><strong>Lastname: </strong></label>
                            <input placeholder='Lastname' onChange={change} name='lastname'/>
                        </div>
                        <div className='form-detail'>
                            <label><strong>City: </strong></label>
                            <input placeholder='City' onChange={change} name='city'/>
                        </div>
                        <div className='form-detail'>
                            <label><strong>Zipcode: </strong></label>
                            <input placeholder='Zipcode' onChange={change} name='zipcode'/>
                        </div>
                        <div className='form-detail'>
                            <label><strong>Adress: </strong></label>
                            <input placeholder='Adress' onChange={change} name='adress'/>
                        </div>
                        <div className='form-detail'>
                            <label><strong>Credit card number: </strong></label>
                            <input placeholder='Credit card' onChange={change} name='creditCard'/>
                        </div>
                    </>
                )}
                <button id="submited-form" onClick={submited}>Save</button>
            </div>
            <footer className="footer">
                <p>GAMER P@RADISE © 2024</p>
            </footer>
        </div>
    );
};

export default UserDetail;