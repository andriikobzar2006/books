import {BookOpen,Heart,LogOut,Menu,Moon,ShoppingBag,Sun,UserRound,X} from 'lucide-react';
import {useEffect,useState} from 'react';
import {Link,NavLink,Outlet,useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import {useTheme} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';

export default function Layout(){
  const [open,setOpen]=useState(false);
  const cart=useSelector(s=>s.shop.cart);
  const fav=useSelector(s=>s.shop.favorites);
  const {dark,setDark}=useTheme();
  const {user,isAuthenticated,isAdmin,logout}=useAuth();
  const location=useLocation();

  useEffect(()=>{
    if(location.state?.reason==='admin')toast.error('Адмін-панель доступна лише адміністратору');
  },[location]);

  const links=[['/','Головна'],...(isAuthenticated?[['/catalog','Каталог']]:[]),['/about','Про нас'],...(isAdmin?[['/admin','Адмін']]:[])];

  async function handleLogout(){
    await logout();
    toast.info('Ви вийшли з акаунта');
  }

  return <div className="min-h-screen bg-stone-50 text-stone-800 dark:bg-stone-950 dark:text-stone-100">
    <header className="glass sticky top-0 z-50 border-b border-stone-200 dark:border-stone-800 dark:bg-stone-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-black"><span className="rounded-xl bg-amber-500 p-2 text-white"><BookOpen/></span>Книгарня</Link>
        <nav className="hidden gap-7 md:flex">{links.map(([to,t])=><NavLink key={to} to={to} className={({isActive})=>isActive?'font-bold text-amber-600':'hover:text-amber-600'}>{t}</NavLink>)}</nav>
        <div className="flex items-center gap-2">
          <button onClick={()=>setDark(!dark)} className="rounded-full p-2 hover:bg-stone-200 dark:hover:bg-stone-800" aria-label="Змінити тему">{dark?<Sun/>:<Moon/>}</button>
          {isAuthenticated&&<>
            <Link to="/favorites" className="relative rounded-full p-2 hover:bg-stone-200 dark:hover:bg-stone-800"><Heart/><b className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 text-xs text-white">{fav.length}</b></Link>
            <Link to="/cart" className="relative rounded-full p-2 hover:bg-stone-200 dark:hover:bg-stone-800"><ShoppingBag/><b className="absolute -right-1 -top-1 rounded-full bg-amber-500 px-1.5 text-xs text-white">{cart.reduce((n,i)=>n+i.qty,0)}</b></Link>
          </>}
          {isAuthenticated?<div className="hidden items-center gap-2 sm:flex"><span className="max-w-40 truncate text-sm font-bold">{user.email}</span><button onClick={handleLogout} className="rounded-full p-2 hover:bg-stone-200 dark:hover:bg-stone-800" aria-label="Вийти"><LogOut/></button></div>:<Link to="/login" className="rounded-full p-2 hover:bg-stone-200 dark:hover:bg-stone-800" aria-label="Увійти"><UserRound/></Link>}
          <button className="md:hidden" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
        </div>
      </div>
      {open&&<nav className="grid gap-3 border-t p-4 md:hidden">{links.map(([to,t])=><Link onClick={()=>setOpen(false)} key={to} to={to}>{t}</Link>)}{isAuthenticated&&<button onClick={async()=>{setOpen(false);await handleLogout()}} className="text-left">Вийти</button>}</nav>}
    </header>
    <main><Outlet/></main>
    <footer className="mt-20 bg-stone-900 px-4 py-10 text-stone-300"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3"><div><h3 className="text-xl font-black text-white">Книгарня</h3><p className="mt-2">Книги, що знаходять своїх читачів.</p></div><div><b className="text-white">Навігація</b><p className="mt-2">Каталог · Доставка · Повернення · Контакти</p></div><div><b className="text-white">Контакти</b><p className="mt-2">hello@knyharnia.ua<br/>+380 00 000 00 00</p></div></div></footer>
  </div>
}
