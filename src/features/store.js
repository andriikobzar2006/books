import {configureStore,createSlice} from '@reduxjs/toolkit';
import {initialBooks} from '../data/books';
const saved=JSON.parse(localStorage.getItem('bookstore_state')||'null');
const shop=createSlice({name:'shop',initialState:saved||{books:initialBooks,cart:[],favorites:[],orders:[]},reducers:{
 addToCart:(s,a)=>{const x=s.cart.find(i=>i.id===a.payload.id);x?x.qty++:s.cart.push({...a.payload,qty:1})},
 removeFromCart:(s,a)=>{s.cart=s.cart.filter(i=>i.id!==a.payload)},
 changeQty:(s,a)=>{const x=s.cart.find(i=>i.id===a.payload.id);if(x)x.qty=Math.max(1,a.payload.qty)},
 toggleFavorite:(s,a)=>{s.favorites.includes(a.payload)?s.favorites=s.favorites.filter(id=>id!==a.payload):s.favorites.push(a.payload)},
 addBook:(s,a)=>s.books.unshift({...a.payload,id:crypto.randomUUID()}),
 updateBook:(s,a)=>{const i=s.books.findIndex(b=>b.id===a.payload.id);if(i>=0)s.books[i]=a.payload},
 deleteBook:(s,a)=>{s.books=s.books.filter(b=>b.id!==a.payload)},
 checkout:(s,a)=>{s.orders.unshift({id:Date.now(),items:s.cart,total:s.cart.reduce((n,i)=>n+i.price*i.qty,0),date:new Date().toISOString(),customer:a.payload,status:'Нове'});s.cart=[]}
}});
export const {addToCart,removeFromCart,changeQty,toggleFavorite,addBook,updateBook,deleteBook,checkout}=shop.actions;
export const store=configureStore({reducer:{shop:shop.reducer}});store.subscribe(()=>localStorage.setItem('bookstore_state',JSON.stringify(store.getState().shop)));
