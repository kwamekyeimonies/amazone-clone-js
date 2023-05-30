import { CardElement,useElements, useStripe } from '@stripe/react-stripe-js';
import React,{useState,useEffect} from 'react'
import CurrencyFormat from 'react-currency-format';
import { Link, useHistory } from 'react-router-dom';
import { getBasketTotal } from '../../reducer';
import { useStateValue } from '../../StateProvider';
import CheckoutProduct from '../CheckoutProduct/CheckoutProduct';
import "./Payment.css"; 
import axios from "../../axios";
import {db} from "../../firebase";

function Payment() {

    const [{basket, user} , dispatch] = useStateValue();
    const history = useHistory();

    const stripe = useStripe();
    const elements = useElements();

    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState(null)
    const [succeeded,setSucceeded] = useState(false);
    const [processing,setProcessing] = useState("");
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(()=>{
        const getClientSecret = async ()  =>{
            const response = await axios({
                method:'post',
                //stripe expect thte total in currencies submits
                url:`/payments/create?total=${getBasketTotal(basket) *100}`
            });

            setClientSecret(response.data.clientSecret)
        }
        getClientSecret();
    },[basket])

    console.log('The secret is >>> ',clientSecret);
    console.log('User', user);

    const handleSubmit= async(event)=>{
        //stripe staffs
        event.preventDefault();
        setProcessing(true);


        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method:{
                card: elements.getElement(CardElement)
            }
        }).then(({paymentIntent})=>{
            //paymentIntent=payment confirmation

            db
            .collection('users')
            .doc(user?.uid)
            .collection('orders')
            .doc(paymentIntent.id)
            .set({
                basket:basket,
                amout:paymentIntent.amount,
                created:paymentIntent.created
            })

            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type:'EMPTY_BASKET'
            })

            history.replace('/orders')
        })
        

    }

    const handleChange = event =>{
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");    
    }

    return (
        <div className="payment">
            <div className="payment__container">
            <h1>
                Checkout (
                    <Link to ="/checkout">{basket?.length} items </Link>
                )
            </h1>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>

                    <div className="payment__address">
                        <p>{user?.email} </p>
                        <p>123 Ofankor Accra</p>
                        <p>Accra Ghana</p>
                    </div>
                </div>

                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Review items and delivery</h3>
                    </div>

                    <div className="payment__items">
                        {basket.map(item=>(
                            <CheckoutProduct
                            id={item.id}
                            title={item.title}
                            image={item.image}
                            price={item.price}
                            rating={item.rating}
                            />
                        ))}
                    </div>
                </div>

                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Payment Method</h3>
                    </div>

                    <div className="payment__details">
                        <form onSubmit={handleSubmit}>
                            <CardElement  onChange={handleChange}  />

                            <div className="payment__priceContainer">
                                <CurrencyFormat
                                renderText={(value)=>(
                                    <>
                                    <h3>Order Total: {value} </h3>
                                    </>
                                )}

                                decimalScale= {2}
                                value={getBasketTotal(basket)}

                                display={"text"}
                                thousandSeparator={true}
                                prefix={"GHC."}
                                />

                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? <p>Processing</p> : "Buy Now"} </span>
                                </button>
                            </div>
                            {
                                error && <div>{error} </div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment
