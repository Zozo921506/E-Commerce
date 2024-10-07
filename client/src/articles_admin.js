import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './App.css';

function Crud() 
{
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [countries, setCountries] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [checked, setChecked] = useState([{
    id: '',
    name: '',
    description: '',
    stock: '',
    weight: '',
    source: '',
    prix: '',
    new: '',
    promo: '',
    image: ''
  }]);

  const modify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = "http://localhost:8000/api/admin/products/modify"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(checked),
      })

      if (response.ok)
      {
        console.log("Article successfully modified");
        setLoading(false);
      }
      else
      {
        console.log("The article haven't been modified");
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
    const url = "http://localhost:8000/api/admin/products/delete"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(checked)
      })

      if (response.ok)
      {
        console.log("Article successfully deleted");
        
      }
      else
      {
        console.log("The article doesn't have been deleted");
      }
    }
    catch(e)
    {
      console.error('Error: ', e);
    }
  }

  const change = (article, e) => {
    if (e.target.checked) 
    {
      setChecked([...checked, article]);
    } 
    else 
    {
      setChecked(checked.filter(item => item !== article.id));
    }
  }

  const inputChange = (id, field, value) => {
    setArticles(
      articles.map(((article) => article.id === id ? { ...article, [field]: value } : article))
    )
    console.log(articles);
  }

  const picture = (id, e) => {

    if (e.target.files.length > 0)
    {
      const file = e.target.files[0];
      const path = `/Image/${file.name}`
      setArticles(
        articles.map(article => (article.id === id ? { ...article, image: path } : article))
      );
      setChecked(
        checked.map(article => (article.id === id ? { ...article, image: path } : article))
      );
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
    };

    const listCountries = async() => {
      const url = "http://localhost:8000/api/admin/products/create/source";
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
    listCountries();
  }, []);

  return (
    <div>
      <nav>
      <h1 className="logo"><Link to='/'>GAMER P@RADISE</Link></h1>
        <button className="hamburger" onClick={menu}>
          &#9776;
        </button>
        <ul className={`navbar ${mobile ? 'open' : ''}`}>
          <li key='products'><strong><Link to='/admin/products' className='element'>Products</Link></strong></li>
          <li key='categorie'><strong><Link to='/admin/categories' className='element'>Categories</Link></strong></li>
          <li key='filter'><strong><Link to='/admin/filter' className='element'>Filter</Link></strong></li>
          <li key='shipping'><strong><Link to='/admin/shipping' className="element">Shipping cost</Link></strong></li>
          <li key='command'><strong><Link to='/admin/command' className="element">Command</Link></strong></li>
          <li key='present'><strong><Link to='/admin/present' className="element">Present</Link></strong></li>
          <li key='admin'><strong><Link to='/admin' className='element'>Admin</Link></strong></li>
        </ul>
      </nav>
      <h1 id="title">Articles management</h1>
      <div id="pannel">
        <p>Name</p>
        <p>Description</p>
        <p>Stock</p>
        <p>Weight</p>
        <p>Source</p>
        <p>Price</p>
        <p>New</p>
        <p>Promo</p>
        <p>Image</p>
        <Link to={'/admin/products/create'}><button>Add</button></Link>
        <button onClick={(e) => modify(e)}>Modify</button> 
        <button onClick={(e) => del(e)}>Delete</button>
      </div>
      <ul>
        {loading === true ?(<li key='loading'>Loading...</li>) : (articles.map((article) => {
          return <li key={article.id} className="article_admin">
            <img src={article.image} alt={article.image} width={50} height={50} className="preview"></img>
            <input value={article.name} onChange={(e) => inputChange(article.id, "name", e.target.value)} name="name" id="image" pattern="^[A-zÀ-ú-9\s+]*$"/> 
            <textarea value={article.description} onChange={(e) => inputChange(article.id, "description", e.target.value)} name="description" id="description"></textarea>
            <div className="display-stock">
              <input type="number" value={article.stock} onChange={(e) => inputChange(article.id, "stock", e.target.value)} name="stock" id="stock" pattern="^\d+$" min={0}/>
              {article.stock === '0' && <p className="out_of_stock">OUT OF STOCK</p>}
            </div>
            <div className="flex-article">
              <input value={article.weight} onChange={(e) => inputChange(article.id, "weight", e.target.value)} name="weight" id="weight"></input>
              <p>Kg</p>
            </div>
            <select value={article.source} onChange={(e) => inputChange(article.id, "source", e.target.value)} name="source" id="source" className="source-select">
              <option value={article.source}>{article.source}</option>
              {countries.map((country) => {
                if (country.name !== article.source)
                {
                  return <option value={country.name}>{country.name}</option>
                }
              })}
            </select>
            <div className="flex-article">
              <input value={article.price} onChange={(e) => inputChange(article.id, "price", e.target.value)} name="price" id="price"/> 
              <p>$</p> 
            </div>
            <select value={article.new} onChange={(e) => inputChange(article.id, "new", e.target.value)} name="new" id="new">
              <option value='true'>New</option>
              <option value='false'>Old</option>
            </select>
            <div className="flex-article">
              <input value={article.promo} type='number' onChange={(e) => inputChange(article.id, "promo", e.target.value)} name="promo" id="promo" pattern="^\d+$" min={0}></input>
              <p>%</p>
            </div>
            <input type="file" onChange={(e) => picture(article.id, e)} id="image" name="image"></input>
            <input type="checkbox" id={article.id} onChange={(e) => change(article, e)}/>
          </li>
        }))}
      </ul>
      <footer id="footer"></footer>
    </div>
  );
}

export default Crud;