import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SecurityContextProvider from './contexts/securityContext';
import PageContextProvider from './contexts/pageContext';

import LoginLayout from './componets/layouts/loginLayout/loginLayout';
import Login from './pages/login/login';

import MainLayout from './componets/layouts/mainLayout/mainLayout';
import Home from './pages/home/home';
import BlogEntriesList from './pages/blogEntries/list/blogEntriesList';
import BlogEntriesForm from './pages/blogEntries/form/blogEntriesForm';
import AnnouncementsList from './pages/announcements/list/announcementsList';
import AnnouncementsForm from './pages/announcements/form/announcementsForm';

import NotFound from './pages/notFound/notFound';

import './index.css';
import 'antd/dist/antd.css';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={
        <SecurityContextProvider element={
          <PageContextProvider element={<MainLayout />} />
        } />
      }>
        <Route index element={<Home />} />
        <Route path="/blog/entries" element={<BlogEntriesList />} />
        <Route path="/blog/entries/add" element={<BlogEntriesForm />} />
        <Route path="/blog/entries/edit/:id" element={<BlogEntriesForm />} />
        <Route path="/announcements" element={<AnnouncementsList />} />
        <Route path="/announcements/add" element={<AnnouncementsForm />} />
        <Route path="/announcements/edit/:id" element={<AnnouncementsForm />} />
      </Route>

      <Route path="login" element={<SecurityContextProvider element={<LoginLayout />} />}>
        <Route index element={<Login />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
