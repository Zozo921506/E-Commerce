import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function CountryCreate() 
{
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState(
    {
      name: '',
      delivered_to: '',
      taxes: '',
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
    const url = "http://localhost:8000/api/admin/country/create"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response.ok)
      {
        console.log("Country taxe successfully created");
        navigate('/admin/country');
      }
      else
      {
        console.log("The country taxe cost haven't been created");
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
        <h1 id='form-admin'>New country taxe</h1>
        <form onSubmit={submited} className="form-create">
          <div className="form-detail">
            <label>Name: </label>
            <input id="name" placeholder="Name" name="name" value={formData.name} onChange={change} required></input>
          </div>
          <div className="form-detail">
            <label>Delivered to: </label>
            <input id="delivered_to" placeholder="Delivered to" name="delivered_to" value={formData.delivered_to} onChange={change} required></input>
          </div>
          <div className="form-detail">
            <label>Taxes: </label>
            <input id="taxes" placeholder="Taxes" name="taxes" value={formData.taxes} onChange={change}required></input>
          </div>
          <button type="submit" id="create-shipping">Create country taxe</button>
        </form>
      </div>
      <footer id="footer"></footer>
    </div>
  );
}

export default CountryCreate;