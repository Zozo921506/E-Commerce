import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function Create() 
{
  const [countries, setCountries] = useState([]);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState(
    {
      name: '',
      description: '',
      stock: '',
      weight: '',
      source: '',
      image: '',
      price: ''
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

  const picture = (e) => {

    if (e.target.files.length > 0)
    {
      const file = e.target.files[0];
      const path = `/Image/${file.name}`
      setFormData({
        ...formData, image: path});
    }
  }
  
  const menu = () => {
    setMobile(!mobile);
  };

  const submited = async (e) => {
    e.preventDefault();
    const url = "http://localhost:8000/api/admin/products/create"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response.ok)
      {
        console.log("Article successfully created");
        navigate('/admin/products');
      }
      else
      {
        console.log("The article haven't been created");
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

  useEffect(() => {
    const getCountries = async () => {
      const url = "http://localhost:8000/api/admin/products/create/source";
      try
      {
          const response = await fetch(url);
          if (response.ok)
          {
              const data = await response.json();
              setCountries(data);
          }
          else
          {
              console.error('Failed to fetch countries');
          }
      }
      catch (error)
      {
          console.error('Error fetching countries:', error);
      }
    }
    getCountries();
  })

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
        <h1 id='form-admin'>New article</h1>
        <form onSubmit={submited} className="form-create">
          <div className="form-detail">
            <label>Name: </label>
            <input id="name" placeholder="Name" name="name" value={formData.name} onChange={change} pattern="^[A-zÀ-ú0-9\s+]*$" required></input>
          </div>
          <div className="form-detail">
            <label>Description: </label>
            <textarea id="description" placeholder="Description" name="description" value={formData.description} onChange={change} required></textarea>
          </div>
          <div className="form-detail">
            <label>Stock: </label>
            <input type='number' id="stock" placeholder="Stock" name="stock" value={formData.stock} onChange={change} pattern="^\d+$" min={0} required></input>
          </div>
          <div className="form-detail">
            <label>Weight: </label>
            <input id="weight" placeholder="Weight" name="weight" value={formData.weight} onChange={change} required></input>
          </div>
          <div className="form-detail">
            <label>Source: </label>
            <select id="source" placeholder="Source" name="source" value={formData.source} onChange={change} required>
              <option value=''></option>
              {countries.map((country) => {
                return <option value={country.name} key={country.id}>{country.name}</option>
              })}
            </select>
          </div>
          <div className="form-detail">
            <label>Image: </label>
            <input type='file' id="image" name="image" onChange={picture} required></input>
          </div>
          <div className="form-detail">
            <label>Price: </label>
            <input id="price" placeholder="Price" name="price" value={formData.price} onChange={change} required></input>
          </div>
          <button type="submit" id="submited-form">Create article</button>
        </form>
      </div>
      <footer id="footer"></footer>
    </div>
  );
}

export default Create;