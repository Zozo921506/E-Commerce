import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function HomeAdmin() 
{
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const menu = () => {
    setMobile(!mobile);
  };

  const handleStatusChange = async (orderNumber, newStatus) => {
    const url = `http://localhost:8000/api/admin/update_order_status`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          order_number: orderNumber,
          status: newStatus
        })
      });

      if (response.ok)
      {
        setPurchases(purchases.map(purchase => 
          purchase.order_number === orderNumber ? { ...purchase, status: newStatus } : purchase
        ));
      }
    }
    catch (error)
    {
      console.log(error);
    }
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

    const getUserPurchase = async () => {
      const url = 'http://localhost:8000/api/admin/purchase_order';
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
          setPurchases(data);
        }
        catch (error)
        {
          console.log(error);
        }
    }

    checkAdmin();
    getUserPurchase();
  }, [token])

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
      <div id="pannel">
        <p>Order Number</p>
        <p>Email</p>
        <p>Product</p>
        <p>Quantity</p>
        <p>Price</p>
        <p>Gift</p>
        <p>Status</p>
      </div>
      {purchases.map((purchase) => {
        return <div key={purchase.id} className="purchase_orders_admin">
          <p>{purchase.order_number}</p>
          <p>{purchase.email}</p>
          <p>{purchase.product}</p>
          <p>{purchase.quantity}</p>
          <p>${purchase.price}</p>
          <p>{purchase.gift}</p>
          <select value={purchase.status} onChange={(e) => handleStatusChange(purchase.order_number, e.target.value)}>
            <option value='ongoing'>Ongoing</option>
            <option value='out for delivery'>Out for delivery</option>
            <option value='delivered'>Delivered</option>
          </select>
        </div>
      })}
      <footer id="footer"></footer>
    </div>
  );
}

export default HomeAdmin;
