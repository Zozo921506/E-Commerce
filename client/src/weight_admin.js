import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function WeightAdmin() 
{
  const [weightTaxes, setWeightTaxes] = useState([])
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState(false);
  const token = localStorage.getItem("token");
  const menu = () => {
    setMobile(!mobile);
  };

  const [checked, setChecked] = useState([{
    id: '',
    name: '',
    delivery: '',
    taxes: '',
    authorization: ''
  }]);

  const navigate = useNavigate();
  const modify = async (e) => {
    e.preventDefault();
    setLoading(true)
    const url = "http://localhost:8000/api/admin/weight/modify"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(checked)
      })

      if (response.ok)
      {
        console.log("Weight taxes successfully modified");
        setLoading(false);
      }
      else
      {
        console.log("The weight taxes haven't been modified");
      }
    }
    catch(e)
    {
      console.error('Error: ', e);
    }
  }

  const del = async (e) => {
    e.preventDefault();
    const url = "http://localhost:8000/api/admin/weight/delete"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(checked)
      })

      if (response.ok)
      {
        console.log("Weight taxes successfully deleted");
        navigate('/admin/weight');
      }
      else
      {
        console.log("The weight taxes doesn't have been deleted");
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
    setWeightTaxes(
      weightTaxes.map(((weight) => weight.id === id ? { ...weight, [field]: value } : weight))
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
      const url = "http://localhost:8000/api/admin/weight";
      try
      {
        const response = await fetch(url);
        const data = await response.json();
        setWeightTaxes(data);
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
      <h1 id="title">Weight management</h1>
      <div id="pannel">
        <p>Min weight</p>
        <p>Max weight</p>
        <p>Price</p>
        <Link to={'/admin/weight/create'}><button>Add</button></Link>
        <button onClick={(e) => modify(e)}>Modify</button> 
        <button onClick={(e) => del(e)}>Delete</button>
        <Link to={'/admin/shipping'}><button>Shipping cost management</button></Link>
        <Link to={'/admin/country'}><button>Country management</button></Link>
      </div>
      <ul>
        {loading === true ? (<li>Loading...</li>) : (weightTaxes.map((weight) => {
          return <li key={weight.id} className="weight">
            <input value={weight.min_weight} onChange={(e) => inputChange(weight.id, "min_weight", e.target.value)} name="min_weight"/> 
            <input value={weight.max_weight} onChange={(e) => inputChange(weight.id, "max_weight", e.target.value)} name="max_weight" id="max_weight"></input>
            <div className="flex">
              <input value={weight.price} onChange={(e) => inputChange(weight.id, "price", e.target.value)} name="price"></input>
              <p>$</p>
            </div>
            <input type="checkbox" id={weight.id} onChange={(e) => change(weight, e)}/>
          </li>
        }))}
      </ul>
      <footer id="footer"></footer>
    </div>
  );
}

export default WeightAdmin;
