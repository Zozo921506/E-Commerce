import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './App.css';

function Command() {
  const [mobile, setMobile] = useState(false);
  const [articles, setArticles] = useState([]);
  const [quantities, setQuantities] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
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
    const list = async () => {
      const url = "http://localhost:8000/api/admin/products";
      try
      {
        const response = await fetch(url);
        const data = await response.json();
        setArticles(data);
      }
      catch (error)
      {
        console.log(error);
      }
    };

    list();
  }, []);

  const add = (id) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 0) + 1
    }));
  }

  const remove = (id) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 0) > 0 ? prevQuantities[id] - 1 : 0
    }));
  }

  const send_command = () => {
    alert('Your command will be there soon');
  }

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
      <form id="command">
        {articles.map((article) => {
          return (
            <div className="command_article" key={article.id}>
              <img src={article.image} alt={article.name} width={100}></img>
              <p>{article.name}</p>
              <div className="command_quantities">
                <button onClick={() => remove(article.id)} type="button" className="button_command">-</button>
                {quantities[article.id] || 0}
                <button onClick={() => add(article.id)} type="button" className="button_command">+</button>
              </div>
            </div>
          );
        })}
        <button type="submit" id="command_button" onClick={send_command}>Command</button>
      </form>
      <footer id="footer"></footer>
    </div>
  );
}

export default Command;
