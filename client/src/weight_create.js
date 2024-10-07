import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function WeightCreate() 
{
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState(
    {
      min_weight: '',
      max_weight: '',
      price: '',
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
    const url = "http://localhost:8000/api/admin/weight/create"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response.ok)
      {
        console.log("Weight taxes successfully created");
        navigate('/admin/weight');
      }
      else
      {
        console.log("The weight taxes haven't been created");
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
        <h1 id='form-admin'>New Weight taxes</h1>
        <form onSubmit={submited} className="form-create">
            <div className="form-detail">
                <label>Min weight: </label>
                <input id="min_weight" placeholder="Min weight" name="min_weight" value={formData.min_weight} onChange={change} required></input>
            </div>
          <div className="form-detail">
            <label>Max weight: </label>
            <input id="max_weight" placeholder="Max weight" name="max_weight" value={formData.max_weight} onChange={change} required></input>
          </div>
          <div className="form-detail">
            <label>Price: </label>
            <input id="price" placeholder="Price" name="price" value={formData.price} onChange={change} required></input>
          </div>

          <button type="submit" id="submited-form">Create weight</button>
        </form>
      </div>
      <footer id="footer"></footer>
    </div>
  );
}

export default WeightCreate;