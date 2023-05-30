import React from 'react'
import CheckoutProduct from '../CheckoutProduct/CheckoutProduct';
import "./Order.css";
import CurrencyFormat from "react-currency-format";
import { useStateValue } from '../../StateProvider';
import {getBasketTotal} from "../../reducer";
import moment from "moment"


function Order({order}) {

    const [{basket,user} , dispatch] =useStateValue();

    return (
        <div className="order">
            <h2>Order</h2>
            <p>{
                moment.unix(order.data.created).format("MMM Do yy, h:MMA")
            } </p>

            <p className="order__id">
                <small>{order.id} </small>
            </p>

            {
                order.data.basket?.map(item=>(
                    <CheckoutProduct
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    price={item.price}
                    rating={item.rating}
                    />
                ))
            }

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
        </div>
    )
}

export default Order
