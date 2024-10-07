import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './App.css';

function CreateCategorie() 
{
  const [categories, setCategories] = useState([]);
  const [mobile, setMobile] = useState(false);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState(
    {
      name: '',
      description: '',
      parent: ''
    }
  );

  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, [name]: value
    });
  };

  
  const submited = async (e) => {
    e.preventDefault();
    const url = "http://localhost:8000/api/admin/categories/create"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response.ok)
      {
        console.log("Categorie successfully created");
        navigate('/admin/categories');
      }
      else
      {
        console.log("The categorie haven't been created");
      }
    }
    catch(e)
    {
      console.error('Error: ', e);
    }
  }

  const menu = () => {
    setMobile(!mobile);
  };

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
    const list = async() => {
      const url = "http://localhost:8000/api/admin/categories";
      try
      {
        const response = await fetch(url);
        const data = await response.json();
        setCategories(data);
      }
      catch(error)
      {
        console.log(error);
      }
    };

    list()
  }, []);

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
        <h1 id="form-admin">New Categorie</h1>
        <form onSubmit={submited} className="form-create">
          <div className="form-categorie">
            <label>Name: </label>
            <input id="name" placeholder="Name" name="name" value={formData.name} onChange={change} required></input>
          </div>
          <div className="form-categorie">
            <label>Description: </label>
            <textarea id="description" placeholder="Description" name="description" value={formData.description} onChange={change}></textarea>
          </div>
          <div className="form-categorie">
            <label>Parent: </label>
            <select id="parent" name="parent" value={formData.parent} onChange={change}>
              <option value="">None</option>
              {categories.map((categorie) => {
                return <option value={categorie.name} key={categorie.id}>{categorie.name}</option>
              })}
            </select>
          </div>
          <button type="submit" id="submited-form">Create categorie</button>
        </form>
      </div>
      <footer id="footer"></footer>
    </div>
  );
}

export default CreateCategorie;