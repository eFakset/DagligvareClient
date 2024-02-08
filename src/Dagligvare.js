import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NewUser from "./pages/NewUser";
import Login from "./pages/Login";
import Municipalities from "./pages/Municipalities";
import Stores from "./pages/Stores";
import ArticleCategories from "./pages/ArticleCategories";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";

export default function Dagligvare() 
{ 
    return (

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="stores" element={<Stores />} />
              <Route path="articlecategories" element={<ArticleCategories />} />
              <Route path="customers" element={<Customers />} />
              <Route path="sales" element={<Sales />} />
              <Route path="register" element={<Register />} />
              <Route path="municipalities" element={<Municipalities />} />
              <Route path="*" element={<NoPage />} />
              <Route path="newuser" element={<NewUser />} />
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
    );
}