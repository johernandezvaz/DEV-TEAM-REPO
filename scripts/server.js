const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;
const stripe = require("stripe")(process.env.SECRET_KEY);

app.use(cors());
app.use(express.static("public"));
app.use(express.json());


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
  const { ticketType } = req.body;
  let amount = 0;

  // Asignar el monto basado en el tipo de boleto
  switch (ticketType) {
    case "general":
      amount = 2000;
      break;
    case "instituto":
      amount = 1500;
      break;
    case "estudiante":
      amount = 1000;
      break;
    default:
      return res.status(400).send({ error: "Invalid ticket type" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "mxn",
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
