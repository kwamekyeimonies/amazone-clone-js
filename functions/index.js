const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')
(
    "sk_test_51HgHDKIIFNsfM6oOSmfMEdRJr5B2MsCZvPK70k82FNJur1QDytdgqv1DN2JfZC8Zt9meqZmbyl3fxgK0eKXwcush00wIlH3HFm"
)

//API
//App Config
const app = express();


//Middlewares
app.use(cors({origin: true}));
app.use(express.json());

//API Routes

app.get('/', (request,response) => response.status(200).send('Hello Dex world'));

app.post("/payments/create", async (request,response) => {
    const total = request.query.total;

    console.log('Payment Request Received BOM!!!! for this amout >>> ', total)

    const paymentIntent = await stripe.paymentIntent.create({
        amout:total,
        currency:"usd"
    });

    response.status(201).send({
        clientSecret : paymentIntent.client_secret,
    })
})


//Listen command

exports.api = functions.https.onRequest(app);