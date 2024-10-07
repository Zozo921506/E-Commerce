import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function ShippingCreate() 
{
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState(
    {
      name: '',
      delivery: '',
      taxes: '',
      authorization: ''
    }
  );

  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, [name]: value
    });
  };
  
  const menu = () => {
    setMobile(!mobile);
  };

  const submited = async (e) => {
    e.preventDefault();
    const url = "http://localhost:8000/api/admin/shipping/create"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response.ok)
      {
        console.log("Shipping cost successfully created");
        navigate('/admin/shipping');
      }
      else
      {
        console.log("The shipping cost haven't been created");
      }
    }
    catch(e)
    {
      console.error('Error: ', e);
    }
  }

  useEffect(() => {
    if (!token)
    {
      navigate('/');
      return;
    }

    const checkAdmin = async () => {
      const url = 'http://localhost:8000/api/admin/checkout';
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
          if (!data)
          {
            navigate('/');
            return;
          }
        }
        catch (error)
        {
          console.log(error);
        }
    }

    checkAdmin();
  }, [token])

  return (
    <div>
      <nav>
      <h1 className="logo"><Link to='/'>GAMER P@RADISE</Link></h1>
        <button className="hamburger" onClick={menu}>
          &#9776;
        </button>
        <ul className={`navbar ${mobile ? 'open' : ''}`}>
          <li><strong><Link to='/admin/products' className='element'>Products</Link></strong></li>
          <li><strong><Link to='/admin/categories' className='element'>Categories</Link></strong></li>
          <li><strong><Link to='/admin/filter' className='element'>Filter</Link></strong></li>
          <li><strong><Link to='/admin/shipping' className="element">Shipping cost</Link></strong></li>
          <li><strong><Link to='/admin/command' className="element">Command</Link></strong></li>
          <li><strong><Link to='/admin/present' className="element">Present</Link></strong></li>
          <li><strong><Link to='/admin' className='element'>Admin</Link></strong></li>
        </ul>
      </nav>
      <div className="form-container">
        <h1 id='form-admin'>New shipping cost</h1>
        <form onSubmit={submited} className="form-create">
          <div className="form-detail">
            <label>Name: </label>
            <input id="name" placeholder="Name" name="name" value={formData.name} onChange={change} required></input>
          </div>
          <div className="form-detail">
            <label>Delivery: </label>
            <select id="delivery" name="delivery" value={formData.description} onChange={change} required>
              <option value=''></option>
              <option value='classic'>Classic</option>
              <option value='express'>Express</option>
            </select>
          </div>
          <div className="form-detail">
            <label>Taxes: </label>
            <input id="taxes" placeholder="Taxes" name="taxes" value={formData.stock} onChange={change}required></input>
          </div>
          <div className="form-detail">
            <label>Authorization: </label>
            <select id="authorization" name="authorization" value={formData.authorization} onChange={change} required>
              <option value=''></option>
              <option value='whitelist'>Whitelist</option>
              <option value='blacklist'>Blacklist</option>
            </select>
          </div>
          <button type="submit" id="create-shipping">Create shipping cost</button>
        </form>
      </div>
      <footer id="footer"></footer>
    </div>
  );
}

export default ShippingCreate;