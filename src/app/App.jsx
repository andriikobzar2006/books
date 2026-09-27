import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Book from '../pages/Book';
import Cart from '../pages/Cart';
import Favorites from '../pages/Favorites';
import Admin from '../pages/Admin';
import Login from '../pages/Login';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import {AdminRoute,PrivateRoute} from '../routes/ProtectedRoutes';

export default function App(){
  return <BrowserRouter><Routes><Route element={<Layout/>}>
    <Route index element={<Home/>}/>
    <Route path="about" element={<About/>}/>
    <Route path="login" element={<Login/>}/>
    <Route path="catalog" element={<PrivateRoute><Catalog/></PrivateRoute>}/>
    <Route path="book/:id" element={<PrivateRoute><Book/></PrivateRoute>}/>
    <Route path="cart" element={<PrivateRoute><Cart/></PrivateRoute>}/>
    <Route path="favorites" element={<PrivateRoute><Favorites/></PrivateRoute>}/>
    <Route path="admin" element={<AdminRoute><Admin/></AdminRoute>}/>
    <Route path="*" element={<NotFound/>}/>
  </Route></Routes></BrowserRouter>
}
