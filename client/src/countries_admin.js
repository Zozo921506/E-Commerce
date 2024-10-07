import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function CountryAdmin() 
{
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState(false);
  const token = localStorage.getItem("token");
  const menu = () => {
    setMobile(!mobile);
  };

  const [checked, setChecked] = useState([{
    id: '',
    name: '',
    delivered_to: '',
    taxes: '',
  }]);

  const navigate = useNavigate();
  const modify = async (e) => {
    e.preventDefault();
    setLoading(true)
    const url = "http://localhost:8000/api/admin/country/modify"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(checked)
      })

      if (response.ok)
      {
        console.log("Country taxe successfully modified");
        setLoading(false);
      }
      else
      {
        console.log("The country taxe haven't been modified");
      }
    }
    catch(e)
    {
      console.error('Error: ', e);
    }
  }

  const del = async (e) => {
    e.preventDefault();
    const url = "http://localhost:8000/api/admin/country/delete"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(checked)
      })

      if (response.ok)
      {
        console.log("Country taxe successfully deleted");
        navigate('/admin/country');
      }
      else
      {
        console.log("The country taxe doesn't have been deleted");
      }
    }
    catch(e)
    {
      console.error('Error: ', e);
    }
  }

  const change = (shipping, e) => {
    if (e.target.checked) 
    {
      setChecked([...checked, shipping]);
    } 
    else 
    {
      setChecked(checked.filter(item => item !== shipping.id));
    }
  }

  const inputChange = (id, field, value) => {
    setCountries(
      countries.map(((country) => country.id === id ? { ...country, [field]: value } : country))
    )
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
      const url = "http://localhost:8000/api/admin/country";
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
      <h1 id="title">Country management</h1>
      <div id="pannel">
        <p>Name</p>
        <p>Delivered to</p>
        <p>Taxes</p>
        <Link to={'/admin/country/create'}><button>Add</button></Link>
        <button onClick={(e) => modify(e)}>Modify</button> 
        <button onClick={(e) => del(e)}>Delete</button>
        <Link to={'/admin/shipping'}><button>Shipping cost management</button></Link>
        <Link to={'/admin/weight'}><button>Weight management</button></Link>
      </div>
      <ul>
        {loading === true ? (<li>Loading...</li>) : (countries.map((country) => {
          return <li key={country.id} className="country_admin">
            <input value={country.name} onChange={(e) => inputChange(country.id, "name", e.target.value)} name="name"/> 
            <input value={country.delivered_to} onChange={(e) => inputChange(country.id, "delivered_to", e.target.value)} name="delivered_to"></input>
            <div className="flex">
                <input value={country.taxes} onChange={(e) => inputChange(country.id, "taxes", e.target.value)} name="taxes"></input>
                <p>$</p>
            </div>
            <input type="checkbox" id={country.id} onChange={(e) => change(country, e)}/>
          </li>
        }))}
      </ul>
      <footer id="footer"></footer>
    </div>
  );
}

export default CountryAdmin;
