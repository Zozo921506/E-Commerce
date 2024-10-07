import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Crud from "./articles_admin";
import Home from "./home";
import HomeAdmin from "./home_admin";
import Create from "./create_article";
import Register from './components/Register';
import Categorie from "./categories_admin";
import CreateCategorie from "./create_categorie";
import Login from './components/Login';
import ProductDetail from './ProductDetail';
import Filter from './filter';
import CreateFilter from './add_filter';
import Command from './command';
import SubCategorie from './sub_categorie';
import Cart from './Cart';
import ShippingCostAdmin from './shipping_cost_admin';
import ShippingCreate from './shipping_cost_create';
import WeightAdmin from './weight_admin';
import WeightCreate from './weight_create';
import CountryAdmin from './countries_admin';
import CountryCreate from './country_create';
import Payment from './payment';
import Present from './present';
import PresentCreate from './present_create';
import PurchaseOrder from './purchase_order';
import UserDetail from './user_infos';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<HomeAdmin />} />
            <Route path="/admin/products" element={<Crud />} />
            <Route path="/admin/products/create" element={<Create />} />
            <Route path="/admin/categories" element={<Categorie />} />
            <Route path="/admin/categories/create" element={<CreateCategorie />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/admin/filter" element={<Filter />} />
            <Route path="/admin/filter/create" element={<CreateFilter />} />
            <Route path="/admin/command" element={<Command />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/:name" element={<SubCategorie />} />
            <Route path='/admin/shipping' element={<ShippingCostAdmin />} />
            <Route path='/admin/shipping/create' element={<ShippingCreate />} />
            <Route path='/admin/weight' element={<WeightAdmin />} />
            <Route path='/admin/weight/create' element={<WeightCreate />} />
            <Route path='/admin/country' element={<CountryAdmin />} />
            <Route path='/admin/country/create' element={<CountryCreate />} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/admin/present' element={<Present />} />
            <Route path='/admin/present/create' element={<PresentCreate />} />
            <Route path='/purchase_order' element={<PurchaseOrder />} />
            <Route path='/my_account' element={<UserDetail />} />
        </Routes>
    );
};

export default AppRouter;
