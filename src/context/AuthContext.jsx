import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {createUserWithEmailAndPassword,onAuthStateChanged,signInWithEmailAndPassword,signOut as firebaseSignOut} from 'firebase/auth';
import {auth,firebaseEnabled} from '../services/firebase';

const AuthContext=createContext(null);
const DEMO_ADMIN_EMAIL=import.meta.env.VITE_ADMIN_EMAIL||'admin@knyharnia.ua';
const STORAGE_KEY='knyharnia-user';

function normalizeUser(user){
  if(!user)return null;
  const email=user.email||'';
  return {uid:user.uid||email,email,role:email.toLowerCase()===DEMO_ADMIN_EMAIL.toLowerCase()?'admin':'user'};
}

export function AuthProvider({children}){
  const [user,setUser]=useState(()=>{
    if(firebaseEnabled)return null;
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||null}catch{return null}
  });
  const [loading,setLoading]=useState(firebaseEnabled);

  useEffect(()=>{
    if(!firebaseEnabled||!auth)return;
    return onAuthStateChanged(auth,current=>{
      setUser(normalizeUser(current));
      setLoading(false);
    });
  },[]);

  async function login(email,password){
    if(firebaseEnabled){
      const result=await signInWithEmailAndPassword(auth,email,password);
      return normalizeUser(result.user);
    }
    if(!password||password.length<6)throw new Error('Пароль повинен містити щонайменше 6 символів');
    const next=normalizeUser({email,uid:email});
    localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
    setUser(next);
    return next;
  }

  async function register(email,password){
    if(firebaseEnabled){
      const result=await createUserWithEmailAndPassword(auth,email,password);
      return normalizeUser(result.user);
    }
    if(!password||password.length<6)throw new Error('Пароль повинен містити щонайменше 6 символів');
    const next=normalizeUser({email,uid:email});
    localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
    setUser(next);
    return next;
  }

  async function logout(){
    if(firebaseEnabled&&auth)await firebaseSignOut(auth);
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  const value=useMemo(()=>({user,loading,isAuthenticated:Boolean(user),isAdmin:user?.role==='admin',login,register,logout,firebaseEnabled}),[user,loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const context=useContext(AuthContext);
  if(!context)throw new Error('useAuth має використовуватися всередині AuthProvider');
  return context;
}
