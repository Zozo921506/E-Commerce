import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './App.css';

function CreateFilter() 
{
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mobile, setMobile] = useState(false);
  const [formData, setFormData] = useState(
    {
      categorie_name: '',
      article_name: ''
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
    const url = "http://localhost:8000/api/admin/filter/create"
    try
    {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (response.ok)
      {
        console.log("Filter successfully created");
        navigate('/admin/filter');
      }
      else
      {
        console.log("The filter haven't been created");
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
          <li><strong><Link to='/admin' className='element'>Admin</Link></strong></li>
        </ul>
      </nav>
      <div className="form-container">
        <h1 id="form-admin">New Filter</h1>
        <form onSubmit={submited} className="form-create">
          <div className="form-categorie">
            <label>Categorie name: </label>
            <select id="categorie_name" placeholder="Categorie name" name="categorie_name" value={formData.categorie_name} onChange={change} required>
                <option value=''></option>
                {categories.map((categorie) => {
                    return <option value={categorie.name} key={categorie.id}>{categorie.name}</option>
                })}
            </select>
          </div>
          <div className="form-categorie">
            <label>Article name: </label>
            <select id="article_name" name="article_name" value={formData.article_name} onChange={change} required>
                <option value=''></option>
              {articles.map((article) => {
                return <option value={article.name} key={article.id}>{article.name}</option>
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

export default CreateFilter;