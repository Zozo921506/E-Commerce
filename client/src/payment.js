import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function Payment() 
{
    const token = localStorage.getItem("token");
    const [main, setMain] = useState([]);
    const [subs, setSubs] = useState([]);
    const [cartArticles, setCartArticles] = useState(0);
    const [categorieList, setCategorieList] = useState({});
    const [price, setPrice] = useState(0);
    const [priceSession, setPriceSession] = useState(0);
    const [weight, setWeight] = useState(0);
    const [weightPrice, setWeightPrice] = useState(0);
    const [countries, setCountries] = useState([]);
    const [deliveryTaxe, setDeliveryTaxe] = useState(0);
    const [sourceTaxe, setSourceTaxe] = useState(0);
    const [id_products, setIdProducts] = useState([]);
    const [paperGifts, setPaperGifts] = useState([]);
    const [giftTaxe, setGiftTaxe] = useState(0);
    const [image, setImage] = useState("");
    const [user_infos, setUserInfos] = useState([]);
  
    const [form, setForm] = useState(
        {
          name: '',
          delivery: '',
          giftPaper: ''
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

  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();
  const submenu = (id) => {
    setCategorieList((state) => ({
        ...state, [id]: !state[id]
    }));
  };

  const change = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, [name]: value
    });
  };

  const changeAdditional = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form, [name]: value
    });
  };
  
  const menu = () => {
    setMobile(!mobile);
  };

  const removeArticle = async (e) => {
    const form = {session_id: id_session}
    const url = `http://localhost:8000/api/payment/remove_article`;
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(form), 
      });

      if (response.ok)
      {
        console.log('The stock of the article successfully decrease');
      }
      else
      {
        console.log('Something went wrong', response);
      }
    }
    catch (e)
    {
      console.error(e);
    }
  }

  const removeArticleToken = async (e) => {
    const url = `http://localhost:8000/api/payment/remove_article_token`;
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }, 
      });

      if (response.ok)
      {
        console.log('The stock of the article successfully decrease');
      }
      else
      {
        console.log('Something went wrong', response);
      }
    }
    catch (e)
    {
      console.error(e);
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
    const url = `http://localhost:8000/api/product/payment/delete/${id_session}`;
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

  const removeCartItem = async () => {
    const url = `http://localhost:8000/api/product/payment/delete_cart`;
    try
    {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok)
        {
            console.log('Your cart is now empty');
        }
        else
        {
            console.log("Can't clear your cart", response);
        }
    }
    catch (e)
    {
        console.error(e);
    }
  }

  const orderNumber = async () => {
    let date = new Date();
    let formatDate = `${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getHours()}${date.getMinutes()}`;
    let taxes = deliveryTaxe + sourceTaxe + weightPrice;
    let data = {order_number: formatDate, id_session: id_session, delivery: taxes, adress: formData.adress, gift: form.giftPaper};
    const url = 'http://localhost:8000/api/payment/order_number';
    try
      {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok)
            {
                console.log('Your order number have been created');
            }
            else
            {
                console.log("Can't create your order number", response);
            }
      }
      catch (e)
      {
          console.error(e);
      }
  }

  const orderNumberToken = async () => {
    let date = new Date();
    let formatDate = `${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getHours()}${date.getMinutes()}`;
    let data = {order_number: formatDate, delivery: deliveryTaxe, adress: formData.adress, gift: form.giftPaper};
    const url = 'http://localhost:8000/api/payment/order_number_token';
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
                console.log('Your order number have been created');
            }
            else
            {
                console.log("Can't create your order number", response);
            }
      }
      catch (e)
      {
          console.error(e);
      }
  }

  const saveEmail = async (email) => {
    const url = `http://localhost:8000/api/payment/save_email/${id_session}`;
    
    let data = {email: email};
      try
      {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok)
        {
          console.log('Your email have successfully been save');
        }
    }
    catch (e)
    {
      console.error(e);
    }
  }

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

  const submited = async (e) => {
    e.preventDefault();
    if (token)
    {
      let isChecked = document.getElementById("remember_me").checked;
      if (isChecked)
      {
        savePaymentInfo();
      }
      removeArticleToken();
      if (id_products.length > 1)
      {
        removeCartItem();
      }
      orderNumberToken();
      deleteCommandToken();
      navigate('/');
    }
    else
    { 
      let email = prompt('Enter your email');
      if (email === null || email.trim() === '')
      {
        alert('Please provide an email to purchase this article');
        return;
      }

      saveEmail(email);
      orderNumber();
      removeArticle();
      deleteCommand();
      navigate('/');
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

  const id_session = getCookie('session_id');

  const weightDetails = async () => {
      try {
          const response = await fetch(`http://localhost:8000/api/cart_size/${weight}`, {
          });
          if (response.ok) {
              const data = await response.json();
              setWeightPrice(data);
          } else {
              const errorData = await response.json();
              console.error('Failed to fetch weight details:', errorData);
              setWeightPrice(0);
          }
      } catch (error) {
          console.error('Error fetching weight details:', error);
          setWeightPrice(0);
      }
  };

  const expedition = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:8000/api/cart/delivery';
    try
      {
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(form),
          });
          const data = await response.json();
          setDeliveryTaxe(data);
          if (form.giftPaper)
          {
            paperGiftTaxe();
            paperGiftImg();
          }
          else
          {
            setGiftTaxe(0);
            setImage('');            
          }

          if (token)
          {
            fetchSourceTaxeToken();
          }
          else
          {
            fetchSourceTaxe();
          }
      }
      catch (e)
      {
          console.error(e);
      }
  }

  const fetchCartWeight = async () => {
    try {
        const response = await fetch(`http://localhost:8000/api/payment_weight/${id_session}`, {
        });
        if (response.ok) {
            const data = await response.json();
            setWeight(data);
        } else {
            const errorData = await response.json();
            console.error('Failed to fetch cart weight:', errorData);
            setWeight(0);
        }
    } catch (error) {
        console.error('Error fetching cart weight:', error);
        setWeight(0);
    }
  };

  const fetchSourceTaxe = async () => {
      const url = `http://localhost:8000/api/payment/source_taxe/${id_session}`;
      try
      {
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(form),
          });
          const data = await response.json();
          setSourceTaxe(data);
      }
      catch (e)
      {
          console.error(e);
      }
  }

  const fetchSourceTaxeToken = async () => {
    const url = 'http://localhost:8000/api/cart/source_taxe';
    try
    {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form),
        });
        const data = await response.json();
        setSourceTaxe(data);
    }
    catch (e)
    {
        console.error(e);
    }
  }

  const paperGiftTaxe = async () => {
    const present_taxe = form.giftPaper;
    const url = `http://localhost:8000/api/payment/gift_taxe/${present_taxe}`;
        try
        {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setGiftTaxe(data);
        }
        catch (error)
        {
            console.log(error);
        }
  }

  const paperGiftImg = async () => {
    const present_taxe = form.giftPaper;
    const url = `http://localhost:8000/api/payment/gift_image/${present_taxe}`;
        try
        {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setImage(data);
        }
        catch (error)
        {
            console.log(error);
        }
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

    const displayPriceToken = async () => {
      const url = "http://localhost:8000/api/payment_token_display_price"
      try
      {
          const response = await fetch(url, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });

          const data = await response.json();
          setPrice(data);
      }
      catch (e)
      {
        console.error(e);
      }
    }

    const displayPrice = async () => {
      const url = `http://localhost:8000/api/payment_display_price/${id_session}`
      try
      {
          const response = await fetch(url, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          setPriceSession(data);
      }
      catch (e)
      {
        console.error(e);
      }
    }

    const list = async() => {
      const url = "http://localhost:8000/api/shipping";
      try
      {
          const response = await fetch(url);
          const data = await response.json();
          setCountries(data);
      }
      catch(error)
      {
          console.log(error);
      }
    };

    const getProductId = async() => {
      
      const url = `http://localhost:8000/api/payment/get_product_id/${id_session}`;
      try
      {
        const response = await fetch(url);
        const data = await response.json();
        setIdProducts(data)
      }
      catch (e)
      {
        console.error(e);
      }
    }

    const getProductIdToken = async() => {
      const url = `http://localhost:8000/api/payment/get_product_id_token`;
      try
      {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok)
        {
          const data = await response.json();
          setIdProducts(data)
        }
        else
        {
          console.log("Something went wrong");
        }
      }
      catch (e)
      {
        console.error(e);
      }
    }

    const getPaperGift = async () => {
      const url = `http://localhost:8000/api/payment/paper_gift`;
      try
      {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok)
        {
          const data = await response.json();
          setPaperGifts(data)
        }
        else
        {
          console.log("Something went wrong");
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

  fetchCartWeight();
  list();
  mainCategorie();
  subCategorie();
  displayPrice();
  weightDetails();
  getPaperGift();

  if (token)
  {
    showCartArticle();
    displayPriceToken();
    getProductIdToken();
    getPaymentInfos();
    getUserInfos();
  }
  else
  {
    getProductId();
  }
}, [token]);

  return (
    <div>
      <nav>
        <h1 className="logo"><Link to='/'>GAMER P@RADISE</Link></h1>
        <button className="hamburger" onClick={menu}>
        &#9776;var isChecked = document.getElementById("myCheckbox").checked;
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
                return <Link to='/my_account' key={info.id}>{info.firstname}</Link>
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
      <div className="form-container">
        <h1 id='form-payment'>Payment</h1>
        <form onSubmit={submited} className="form-create">
          {formData ? (
            <>
              <div className="form-detail">
                <label>Firstname: </label>
                <input id="firstname" placeholder="Firstname" name="firstname" value={formData.firstname} onChange={change} pattern="^[A-zÀ-ú0-9\s+]*$" required></input>
              </div>
              <div className="form-detail">
                <label>Lastname: </label>
                <input id="lastname" placeholder="Lastname" name="lastname" value={formData.lastname} onChange={change} pattern="^[A-zÀ-ú0-9\s+]*$" required></input>
              </div>
              <div className="form-detail">
                <label>City: </label>
                <input id="city" placeholder="City" name="city" value={formData.city} onChange={change} pattern="^[A-zÀ-ú0-9\s+]*$" required></input>
              </div>
              <div className="form-detail">
                <label>Zipcode: </label>
                <input id="zipcode" placeholder="Zipcode" name="zipcode" value={formData.zipcode} onChange={change} pattern="[0-9]+" required></input>
              </div>
              <div className="form-detail">
                <label>Adress: </label>
                <input id="adress" placeholder="Adress" name="adress" value={formData.adress} onChange={change} required></input>
              </div>
              <div className="form-detail">
                <label>Credit card number: </label>
                <input id="credit_card" placeholder="Credit card number" name="creditCard" value={formData.creditCard} onChange={change} required></input>
              </div>
              <div className="form-detail">
                <label>CVC: </label>
                <input id="cvc" placeholder="CVC" name="cvc" value={formData.cvc} onChange={change} pattern='\d{3,3}' required></input>
              </div>
              <div className="form-detail">
                {token ? (
                  <div>
                    <label>Remember me: </label>
                    <input type="checkbox" id="remember_me"  name="remember_me" onChange={change}></input>
                  </div>
                ) : (<></>)}
              </div>
            </>
          ) : (
            <>
              <div className="form-detail">
                <label>Firstname: </label>
                <input id="firstname" placeholder="Firstname" name="firstname" onChange={change} pattern="^[A-zÀ-ú0-9\s+]*$" required></input>
              </div>
              <div className="form-detail">
                <label>Lastname: </label>
                <input id="lastname" placeholder="Lastname" name="lastname" onChange={change} pattern="^[A-zÀ-ú0-9\s+]*$" required></input>
              </div>
              <div className="form-detail">
                <label>City: </label>
                <input id="city" placeholder="City" name="city" onChange={change} pattern="^[A-zÀ-ú0-9\s+]*$" required></input>
              </div>
              <div className="form-detail">
                <label>Zipcode: </label>
                <input id="zipcode" placeholder="Zipcode" name="zipcode" onChange={change} pattern="[0-9]+" required></input>
              </div>
              <div className="form-detail">
                <label>Adress: </label>
                <input id="adress" placeholder="Adress" name="adress" onChange={change} required></input>
              </div>
              <div className="form-detail">
                <label>Credit card number: </label>
                <input id="credit_card" placeholder="Credit card number" name="creditCard" onChange={change} required></input>
              </div>
              <div className="form-detail">
                <label>CVC: </label>
                <input id="cvc" placeholder="CVC" name="cvc" onChange={change} pattern='\d{3,3}' required></input>
              </div>
              <div className="form-detail">
                {token ? (
                  <div>
                    <label>Remember me: </label>
                    <input type="checkbox" id="remember_me"  name="remember_me" onChange={change}></input>
                  </div>
                ) : (<></>)}
              </div>
            </>
          )}
          <h4 className="payment-total">Country: 
              <select onChange={changeAdditional} name='name' value={form.name} required>
                  <option value=''></option>
                  {countries.map((country) => {
                      return <option value={country.name} key={country.id}>{country.name}</option>
                  })}
              </select>
          </h4>
          <h4 className="payment-total">Delivery:
              <select onChange={changeAdditional} value={form.delivery} name='delivery' required>
                  <option value=''></option>
                  <option value='classic'>Classic</option>
                  <option value='express'>Express</option>
              </select>
          </h4>
          <h4 className="payment-total">Paper gift: 
            <select onChange={changeAdditional} value={form.giftPaper} name="giftPaper">
              <option value=''></option>
              {paperGifts.map((gift) => {
                return <option value={gift.name} key={gift.id}>{gift.name}</option>
              })}
            </select>
          </h4>
          {image ? (
            <div className="payment-total">
              <img src={image} alt="gift paper" className="gift_paper_display"/>
            </div>
          ) : (<></>)}
          <div className="payment-total">
            <button type='button' onClick={expedition} id="delivery-button">Choose your delivery method</button>
          </div>
          <div id="total_price">
            {token ? (
              <>
                <h5 className="payment-total">Additionnal weight price: {weightPrice}</h5>
                <h5 className="payment-total">Additionnal delivery price: {deliveryTaxe}</h5>
                <h5 className="payment-total">Additionnal source price: {sourceTaxe}</h5>
                <h5 className="payment-total">Additionnal paper gift price: {giftTaxe}</h5>
                <h5 className="payment-total">Total without additionnal: ${(price).toFixed(2)}</h5>
                <h3 className="payment-total">Total: ${(parseFloat(price) + parseFloat(weightPrice) + parseFloat(sourceTaxe) + parseFloat(deliveryTaxe) + parseFloat(giftTaxe)).toFixed(2)}</h3>
              </>
            ) : (
              <>
                <h5 className="payment-total">Additionnal weight price: {weightPrice}</h5>
                <h5 className="payment-total">Additionnal delivery price: {deliveryTaxe}</h5>
                <h5 className="payment-total">Additionnal source price: {sourceTaxe}</h5>
                <h5 className="payment-total">Additionnal paper gift price: {giftTaxe}</h5>
                <h5 className="payment-total">Total without additionnal: ${(priceSession).toFixed(2)}</h5>
                <h3 className="payment-total">Total: ${(parseFloat(priceSession) + parseFloat(weightPrice) + parseFloat(sourceTaxe) + parseFloat(deliveryTaxe) + parseFloat(giftTaxe)).toFixed(2)}</h3>
              </>
            )}
          </div>
          <button type="submit" id="submited-form">Payment</button>
        </form>
      </div>
      <footer id="footer"></footer>
    </div>
  );
}

export default Payment;