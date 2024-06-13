const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;
const stripe = require("stripe")(process.env.SECRET_KEY);

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  return 1400;
};

app.get("/config", (req, res) => {
  res.send({
    publicKey: process.env.PUBLIC_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    emailjsKey: process.env.EMAILJS_KEY,
    templateKey: process.env.TEMPLATE_KEY,
    serviceKey: process.env.SERVICE_KEY,
    port: port,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "mxn",
      price: 2000,
      quantity: 1,
      payment_method_types: ['card', 'oxxo'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).send({ error: "Failed to create PaymentIntent" });
  }
});

app.listen(port, () => {
  console.log(`Node server listening on port ${port}!`);
});
