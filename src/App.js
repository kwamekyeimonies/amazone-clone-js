import React,{useEffect} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from  "react-router-dom"
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Checkout from './pages/Checkout/Checkout';
import Login from "./pages/Login/Login";
import {auth} from "./firebase";
import { useStateValue } from './StateProvider';
import Payment from './pages/Payment/Payment';
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import Orders from './pages/Orders/Orders';


const promise = loadStripe(
  "pk_test_51HgHDKIIFNsfM6oODV44F5JIJ9dyCsl98Wh6eLU182vqDVcJCXOooAQlCceCFXhUiQY1bcmOcoQLTD5Bvhmvx6S800JIcCHHJi"
);

function App() {

  const [{}, dispatch] = useStateValue();

  useEffect(()=>{

    auth.onAuthStateChanged(authUser => {
      console.log('The User is >> ', authUser);

      if(authUser){
        //the user just logged in
        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      }

      else{
        //user is logged out
        dispatch({
          type:'SET_USER',
          user:null
        })
      }
    })
  },[])

  return (
   <Router>
     <div className="app" >
    <Switch>

    <Route path="/payment">
      <Elements stripe={promise}>
        <Payment  />
      </Elements>
    </Route>

    <Route path="/checkout">
      <Header />
      <Checkout />
    </Route>

    <Route path="/orders">
      <Header />
      <Orders />
    </Route>

    <Route path="/login">
      <Login  />
    </Route>

    <Route path="/">
     <Header />
     <Home  />
    </Route>

    </Switch>
   </div>
   </Router>
  );
}




export default App;
