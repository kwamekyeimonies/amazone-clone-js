import React,{useState,useEffect} from 'react';
import { useStateValue } from '../../StateProvider';
import Order from "./Order";
import "./Orders.css";
import {db} from "../../firebase"

function Orders() {

    const [orders,setOrders] = useState([]);
    const [{basket,user}, dispatch] =useStateValue();

    useEffect(()=>{

       if(user){
        db
        .collection('users')
        .doc(user?.uid)
        .collection('orders')
        .orderBy('created','desc')
        .onSnapshot(snapshot=>(
            setOrders(snapshot.docs.map(doc=>({
                id:doc.doc.id,
                data:doc.data()
            })))
        ))
       }
       else{
           setOrders([[]])
       }
    },[])

    return (
        <div className="orders">
            <h1>Your Orders</h1>

            <div className="orders__order">
                {
                    orders?.map(order=>(
                        <Order order={order}    />
                    ))
                }
            </div>
        </div>
    )
}

export default Orders
