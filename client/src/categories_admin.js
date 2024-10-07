import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './App.css';

function Categorie() 
{
  const [categories, setCategories] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState(false);
  const token = localStorage.getItem("token");
  const [checked, setChecked] = useState([{
    id: '',
    name: '',
    description: '',
    parent: ''
  }]);

  const navigate = useNavigate();
  const modify = async (e) => {
    e.preventDefault();
    setLoading(true)
    const url = "http://localhost:8000/api/admin/categories/modify"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(checked)
      })

      if (response.ok)
      {
        console.log("Categorie successfully modified");
        setLoading(false);
      }
      else
      {
        console.log("The categorie haven't been modified");
      }
    }
    catch(e)
    {
      console.error('Error: ', e);
    }
  }

  const del = async (e) => {
    e.preventDefault();
    const url = "http://localhost:8000/api/admin/categories/delete"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(checked)
      })

      if (response.ok)
      {
        console.log("Categorie successfully deleted");
        navigate('/admin/categories');
      }
      else
      {
        console.log("The categorie doesn't have been deleted");
      }
    }
    catch(e)
    {
      console.error('Error: ', e);
    }
  }

  const change = (categorie, e) => {
    if (e.target.checked) 
    {
      setChecked([...checked, categorie]);
    } 
    else 
    {
      setChecked(checked.filter(item => item !== categorie.id));
    }
  }

  const inputChange = (id, field, value) => {
    setCategories(
      categories.map(((categorie) => categorie.id === id ? { ...categorie, [field]: value } : categorie))
    )
  }

  const date = (string) => {
    if (string !== null)
    {
      var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return new Date(string.date).toLocaleDateString([],options);
    }
    else
    {
      const update = "Not updated yet";
      return update;
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
        setParents(data);
      }
      catch(error)
      {
        console.log(error);
      }
    };

    list();
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
      <h1 id="title">Categories management</h1>
      <div id="pannel">
        <p>Name</p>
        <p>Description</p>
        <p>Created_at</p>
        <p>Update_at</p>
        <p>Parent</p>
        <Link to={'/admin/categories/create'}><button>Add</button></Link>
        <button onClick={(e) => modify(e)}>Modify</button> 
        <button onClick={(e) => del(e)}>Delete</button>
      </div>
      <ul>
        {loading === true ? (<li>Loading...</li>) : (categories.map((categorie) => {
          return <li key={categorie.id} className="categorie">
            <input value={categorie.name} onChange={(e) => inputChange(categorie.id, "name", e.target.value)} name="name" id="image"/> 
            <textarea value={categorie.description } onChange={(e) => inputChange(categorie.id, "description", e.target.value)} name="description" id="description"></textarea>
            <p>{date(categorie.created_at)}</p>
            <p>{date(categorie.update_at)}</p>
            <select value={categorie.parent} onChange={(e) => inputChange(categorie.id, "parent", e.target.value)} name="parent" id="parent" className="parent">
              <option value="">None</option>
              {parents.map((parent) => {
                if (parent.id !== categorie.id)
                {
                  return <option value={parent.name} key={parent.id}>{parent.name}</option>
                }
              })}
            </select>
            <input type="checkbox" id={categorie.id} onChange={(e) => change(categorie, e)}/>
          </li>
        }))}
      </ul>
      <footer id="footer"></footer>
    </div>
  );
}

export default Categorie;