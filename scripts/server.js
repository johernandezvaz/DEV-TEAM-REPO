const express = require("express");
const cors = require("cors");
require('dotenv').config();

'use strict';
const bizSdk = require('facebook-nodejs-business-sdk');
const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const CustomData = bizSdk.CustomData;
const Content = bizSdk.Content;

const access_token =  process.env.ACCESS_TOKEN;
const pixel_id = process.env.PIXEL_ID;
const api = bizSdk.FacebookAdsApi.init(access_token);

let current_timestamp = Math.floor(new Date() / 1000);

const userData_0 = (new UserData())
    .setEmails(["7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068"])
    .setPhones([]);
const customData_0 = (new CustomData())
    .setValue(2000)
    .setCurrency("MXN");
const serverEvent_0 = (new ServerEvent())
    .setEventName("Purchase")
    .setEventTime(1725931888)
    .setUserData(userData_0)
    .setCustomData(customData_0)
    .setActionSource("website");

const eventsData = [serverEvent_0];
const eventRequest = (new EventRequest(access_token, pixel_id))
    .setEvents(eventsData);
eventRequest.execute();


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
  const { ticketType } = req.body;  // Obtener el tipo de boleto desde el cuerpo de la solicitud
  let amount = 0;

  // Asignar el monto basado en el tipo de boleto
  switch (ticketType) {
    case "general":
      amount = 2000;
      break;
    case "Colegios e Instituciones":
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
      amount: amount * 100,  // Stripe maneja los montos en centavos
      currency: "mxn",
      payment_method_types: ['card'],
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
