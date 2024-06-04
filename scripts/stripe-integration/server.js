const express = require('express');
const stripe = require('stripe')('sk_test_51PMBSuRrcN86aWIF9ambO5vcKrSTlRvy5qbypSyPVZJg5mcQIJxNIlr4JCOC5ljdDQix8jjEjfDwkiXEXjnwRmgB00CGcrZrrB'); // Reemplaza con tu clave secreta de Stripe
const app = express();
const PORT = process.env.PORT || 3000;
const { createClient } = require('@supabase/supabase-js');

// Configurar Supabase
const supabaseUrl = 'https://qndgdxhhlzxeokoqiubs.supabase.co'; // Reemplaza con tu URL de Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZGdkeGhobHp4ZW9rb3FpdWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3NDE3NTEsImV4cCI6MjAzMTMxNzc1MX0.GTfhPLaHhE6lNCQ5XjK4oCMxItAzX3qbmy41HuzFigg'; // Reemplaza con tu clave pública de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json()); // Usar el método incluido en Express para analizar JSON
app.use(express.static('public')); // Asegúrate de que tus archivos estáticos estén en una carpeta llamada 'public'

app.post('/create-checkout-session', async (req, res) => {
    const { nombre, apellido, email, telefono } = req.body;
    
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Producto de ejemplo',
                        },
                        unit_amount: 2000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel.html`,
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, 'tu_clave_webhook_secreta'); // Reemplaza con tu clave secreta de webhook
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Guardar los datos en Supabase
        const { nombre, apellido, email, telefono } = session.metadata;
        
        const { data, error } = await supabase
            .from('participantes')
            .insert([
                { nombre, apellido, email, telefono }
            ]);

        if (error) {
            console.error('Error insertando datos en Supabase:', error.message);
        } else {
            console.log('Datos insertados en Supabase:', data);
        }
    }

    res.status(200).json({ received: true });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});