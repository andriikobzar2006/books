import {Navigate,useLocation} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

function Loading(){return <div className="grid min-h-[50vh] place-items-center text-lg font-bold">Завантаження...</div>}

export function PrivateRoute({children}){
  const {isAuthenticated,loading}=useAuth();
  const location=useLocation();
  if(loading)return <Loading/>;
  return isAuthenticated?children:<Navigate to="/login" replace state={{from:location,reason:'auth'}}/>;
}

export function AdminRoute({children}){
  const {isAuthenticated,isAdmin,loading}=useAuth();
  const location=useLocation();
  if(loading)return <Loading/>;
  if(!isAuthenticated)return <Navigate to="/login" replace state={{from:location,reason:'auth'}}/>;
  return isAdmin?children:<Navigate to="/catalog" replace state={{reason:'admin'}}/>;
}
