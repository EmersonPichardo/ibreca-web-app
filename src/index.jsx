import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginLayout from './componets/layouts/loginLayout/loginLayout';
import Login from './pages/login/login';

import MainLayout from './componets/layouts/mainLayout/mainLayout';
import Home from './pages/home/home';

import NotFound from './pages/notFound/notFound';

import './index.css';
import 'antd/dist/antd.css';

import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="login" element={<LoginLayout />}>
          <Route index element={<Login />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
