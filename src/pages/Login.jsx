import {useEffect,useState} from 'react';
import {Navigate,useLocation,useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useAuth} from '../context/AuthContext';

export default function Login(){
  const [isLogin,setIsLogin]=useState(true);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [submitting,setSubmitting]=useState(false);
  const {login,register,isAuthenticated,firebaseEnabled}=useAuth();
  const navigate=useNavigate();
  const location=useLocation();
  const from=location.state?.from?.pathname||'/catalog';

  useEffect(()=>{
    if(location.state?.reason==='auth')toast.info('Спочатку увійдіть або зареєструйтеся');
  },[location]);

  if(isAuthenticated)return <Navigate to="/catalog" replace/>;

  async function submit(e){
    e.preventDefault();
    setSubmitting(true);
    try{
      const user=isLogin?await login(email,password):await register(email,password);
      toast.success(isLogin?'Вхід виконано':'Реєстрацію завершено');
      navigate(user.role==='admin'?'/admin':from,{replace:true});
    }catch(error){
      const messages={
        'auth/invalid-credential':'Неправильний email або пароль',
        'auth/email-already-in-use':'Цей email уже зареєстрований',
        'auth/weak-password':'Пароль повинен містити щонайменше 6 символів'
      };
      toast.error(messages[error.code]||error.message||'Не вдалося виконати операцію');
    }finally{setSubmitting(false)}
  }

  return <section className="mx-auto max-w-md px-4 py-20">
    <form onSubmit={submit} className="rounded-3xl bg-white p-8 shadow-xl dark:bg-stone-900">
      <h1 className="text-3xl font-black">{isLogin?'Вхід':'Реєстрація'}</h1>
      <p className="mt-2 text-sm text-stone-500">{firebaseEnabled?'Авторизація через Firebase':'Деморежим. Адміністратор: admin@knyharnia.ua'}</p>
      <input type="email" placeholder="Email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-6 w-full rounded-xl bg-stone-100 p-4 dark:bg-stone-800"/>
      <input type="password" placeholder="Пароль" minLength="6" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-3 w-full rounded-xl bg-stone-100 p-4 dark:bg-stone-800"/>
      <button disabled={submitting} className="mt-5 w-full rounded-xl bg-amber-500 py-4 font-black text-white disabled:opacity-60">{submitting?'Зачекайте...':isLogin?'Увійти':'Зареєструватися'}</button>
      <button type="button" onClick={()=>setIsLogin(!isLogin)} className="mt-4 w-full text-sm">{isLogin?'Створити акаунт':'Уже маю акаунт'}</button>
    </form>
  </section>
}
