import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './App.css';

function Filter() 
{
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState(false);
  const token = localStorage.getItem("token");
  const [checked, setChecked] = useState([{
    id: '',
    categorie_name: '',
    article_name: '',
  }]);

  const navigate = useNavigate();
  const modify = async (e) => {
    e.preventDefault();
    setLoading(true)
    const url = "http://localhost:8000/api/admin/filter/modify"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(checked)
      })

      if (response.ok)
      {
        console.log("Filter successfully modified");
        setLoading(false);
      }
      else
      {
        console.log("The filter haven't been modified");
      }
    }
    catch(e)
    {
      console.error('Error: ', e);
    }
  }

  const del = async (e) => {
    e.preventDefault();
    const url = "http://localhost:8000/api/admin/filter/delete"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(checked)
      })

      if (response.ok)
      {
        console.log("Filter successfully deleted");
        navigate('/admin/filter');
      }
      else
      {
        console.log("The filter doesn't have been deleted");
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

  const selectChange = (filterId, field, value) => {
    setFilters(
      filters.map((filter) =>
        filter.id === filterId ? { ...filter, [field]: value } : filter
      )
    );
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
        const url = "http://localhost:8000/api/admin/filter";
        try
        {
            const response = await fetch(url);
            const data = await response.json();
            setFilters(data);
        }
        catch(error)
        {
            console.log(error);
        }
    }

    const listCategories = async() => {
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

    const listArticles = async() => {
        const url = "http://localhost:8000/api/admin/products";
        try
        {
            const response = await fetch(url);
            const data = await response.json();
            setArticles(data);
        }
        catch(error)
        {
            console.log(error);
        }
    }

    list();
    listCategories();
    listArticles();
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
      <h1>Filter management</h1>
      <div id="pannel">
        <p>Categorie name</p>
        <p>Article name</p>
        <Link to={'/admin/filter/create'}><button>Add</button></Link>
        <button onClick={(e) => modify(e)}>Modify</button> 
        <button onClick={(e) => del(e)}>Delete</button>
      </div>
      <ul>
        {loading === true ? (<li>Loading...</li>) : (filters.map((filter) => {
            return <li key={filter.id} className="filter_admin">
                <select id="categorie_name" name="categorie_name" onChange={(e) =>
                  selectChange(filter.id, 'categorie_name', e.target.value)} value={filter.categorie_name} required>
                    {categories.map((categorie) => {
                        return <option value={categorie.name} key={categorie.id}>{categorie.name}</option>
                    })}
                </select>
                <select id="article_name" name="article_name" onChange={(e) =>
                  selectChange(filter.id, 'article_name', e.target.value)} value={filter.article_name} required>
                    {articles.map((article) => {
                        return <option value={article.name} key={article.id}>{article.name}</option>
                    })}
                </select>
                <input type="checkbox" id={filter.id} onChange={(e) => change(filter, e)}/>
            </li>
        }))}
      </ul>
      <footer id="footer"></footer>
    </div>
  );
}

export default Filter;