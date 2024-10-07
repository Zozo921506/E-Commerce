import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './App.css';

function Present() 
{
  const [presents, setPresents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [checked, setChecked] = useState([{
    id: '',
    name: '',
    description: '',
    prix: '',
    image: ''
  }]);

  const modify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = "http://localhost:8000/api/admin/present/modify"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(checked),
      })

      if (response.ok)
      {
        console.log("Present successfully modified");
        setLoading(false);
      }
      else
      {
        console.log("The present haven't been modified");
      }
    }
    catch(e)
    {
      console.error('Error: ', e);
    }
  }

  const del = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = "http://localhost:8000/api/admin/present/delete"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(checked)
      })

      if (response.ok)
      {
        console.log("Present successfully deleted");
        
      }
      else
      {
        console.log("The present doesn't have been deleted");
      }
    }
    catch(e)
    {
      console.error('Error: ', e);
    }
  }

  const change = (present, e) => {
    if (e.target.checked) 
    {
      setChecked([...checked, present]);
    } 
    else 
    {
      setChecked(checked.filter(item => item !== present.id));
    }
  }

  const inputChange = (id, field, value) => {
    setPresents(
      presents.map(((present) => present.id === id ? { ...present, [field]: value } : present))
    )
  }

  const menu = () => {
    setMobile(!mobile);
  };

  const picture = (id, e) => {

    if (e.target.files.length > 0)
    {
      const file = e.target.files[0];
      const path = `/Image/${file.name}`
      setPresents(
        presents.map(present => (present.id === id ? { ...present, image: path } : present))
      );
      setChecked(
        checked.map(article => (article.id === id ? { ...article, image: path } : article))
      );
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
    const list = async() => {
      const url = "http://localhost:8000/api/admin/present";
      try
      {
        const response = await fetch(url);
        const data = await response.json();
        setPresents(data);
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
      <h1 id="title">Present management</h1>
      <div id="pannel">
        <p>Name</p>
        <p>Description</p>
        <p>Price</p>
        <p>Image</p>
        <Link to={'/admin/present/create'}><button>Add</button></Link>
        <button onClick={(e) => modify(e)}>Modify</button> 
        <button onClick={(e) => del(e)}>Delete</button>
      </div>
      <ul>
        {loading === true ?(<li>Loading...</li>) : (presents.map((present) => {
          return <li key={present.id} className="present_admin">
            <img src={present.image} alt={present.image} width={50} height={50} className="preview"></img>
            <input value={present.name} onChange={(e) => inputChange(present.id, "name", e.target.value)} name="name" id="image" pattern="^[A-zÀ-ú-9\s+]*$"/> 
            <textarea value={present.description} onChange={(e) => inputChange(present.id, "description", e.target.value)} name="description" id="description"></textarea>
            <div className="flex-present">
              <input value={present.price} onChange={(e) => inputChange(present.id, "price", e.target.value)} name="price" id="price"/> 
              <p>$</p> 
            </div>
            <input type="file" onChange={(e) => picture(present.id, e)} id="image" name="image"></input>
            <input type="checkbox" id={present.id} onChange={(e) => change(present, e)}/>
          </li>
        }))}
      </ul>
      <footer id="footer"></footer>
    </div>
  );
}

export default Present;