let stripe;
let elements;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const configResponse = await fetch("https://codec-x7w2.onrender.com/config");
        const config = await configResponse.json();

        stripe = Stripe(config.publicKey);

        document.querySelector("#registroForm").addEventListener("submit", function (e) {
            e.preventDefault();
            if (validateRegistroForm() && validateTicketSelection()) {
                switchSection("#registro-section", "#pago-section");
                initializePayment(config);
            }
        });
        

        document.querySelector("#payment-form").addEventListener("submit", async function (e) {
            e.preventDefault();
            if (!validateTicketSelection()) {
                return;
            }
            setLoading(true);
        
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Do not specify return_url here
                },
                redirect: 'if_required'
            });
        
            if (error) {
                showErrorPopper(document.getElementById('payment-form'),"Su pago no pudo ser procesado, favor de volver a intentarlo");
                setLoading(false);
            } else {
                if (paymentIntent.status === 'succeeded') {
                    showMessage("Pago exitoso!");
                    await handleSuccessfulPayment(config);
                } else {
                    showErrorPopper(document.getElementById('payment-form'),+ paymentIntent.status);
                }
                setLoading(false);
            }
        });        

        await checkStatus(config);
    } catch (error) {
        console.error('Error inicializando la página:', error);
    }
});

async function initializePayment(config) {
    try {
        const ticketType = document.querySelector('input[name="ticket-type"]:checked').value;

        const response = await fetch("https://codec-x7w2.onrender.com/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ticketType }),
        });

        const { clientSecret } = await response.json();

        const appearance = {
            theme: 'flat',
            variables: {
                fontFamily: ' "Gill Sans", sans-serif',
                fontLineHeight: '1.5',
                borderRadius: '10px',
                colorBackground: '#F6F8FA',
                accessibleColorOnColorPrimary: '#4D869C'
            },
            rules: {
                '.Block': {
                    backgroundColor: 'var(--colorBackground)',
                    boxShadow: 'none',
                    padding: '12px'
                },
                '.Input': {
                    padding: '12px'
                },
                '.Input:disabled, .Input--invalid:disabled': {
                    color: 'lightgray'
                },
                '.Tab': {
                    padding: '10px 12px 8px 12px',
                    border: 'none'
                },
                '.Tab:hover': {
                    border: 'none',
                    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
                },
                '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
                    border: 'none',
                    backgroundColor: '#fff',
                    boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
                },
                '.Label': {
                    color: '#fff',
                    fontWeight: '500'
                }
            }
        };
        elements = stripe.elements({ appearance, clientSecret });

        const paymentElementOptions = {
            layout: "tabs",
        };

        const paymentElement = elements.create("payment", paymentElementOptions);
        paymentElement.mount("#payment-element");
    } catch (error) {
        console.error('Error inicializando el pago:', error);
    }
}

async function checkStatus(config) {
    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

    if (!clientSecret) {
        return;
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
        case "succeeded":
            showMessage("Payment succeeded!");
            await handleSuccessfulPayment(config);
            break;
        case "processing":
            showErrorPopper(document.querySelector(".modal-body"),"Su pago esta procesandose.");
            break;
        case "requires_payment_method":
            showErrorPopper(document.getElementById('pago-section'), "Su pago no pudo ser procesado, favor de volver a intentarlo");
            break;
        default:
            showMessage("Something went wrong.");
            break;
    }
}




async function verifyEmailUniqueness() {
    const correo = document.getElementById('email').value;
    const response = await fetch(`https://codec-x7w2.onrender.com/check-email?email=${correo}`);
    const { exists } = await response.json();

    if (exists) {
        showMessage("El correo ya existe en la base de datos. No puedes usar el mismo correo para registrarte nuevamente.");
        return false;
    }
    return true;
}


async function handleSuccessfulPayment(config) {
    emailjs.init(config.emailjsKey); // Sustituye con tu User ID de EmailJS

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('email').value;
    const telefono = document.getElementById('phone').value;
    const asistira = document.querySelector('input[name="asistencia_rompehielos"]:checked')?.value;
    const ticketType = document.querySelector('input[name="ticket-type"]:checked').value;

    const qrDataDiaUno = `Nombre: ${nombre}, Apellido: ${apellido}, Correo: ${correo}, Teléfono: ${telefono},Tipo de boleto: ${ticketType}, Asistencia Rompe Hielos: ${asistira}, Día: Uno`;
    const qrDataDiaDos = `Nombre: ${nombre}, Apellido: ${apellido}, Correo: ${correo}, Teléfono: ${telefono}, Tipo de boleto: ${ticketType}, Asistencia Rompe Hielos: ${asistira}, Día: Dos`;

    const supabaseUrl = config.supabaseUrl;
    const supabaseKey = config.supabaseKey;
    const sb = supabase.createClient(supabaseUrl, supabaseKey);

    const { data, error } = await sb
        .from('participantes')
        .insert([{ nombre, apellido, email: correo, telefono, asistencia_rompehielos: asistira, tipo_boleto: ticketType }])
        .select('id')
        .single();

    if (error) {
        alert('Error al guardar los datos en la base de datos.');
        return;
    }

    const participanteId = data.id;

    if (ticketType === 'estudiante') {
        const participacionCarteles = document.querySelector('input[name="asistencia_cartes"]:checked')?.value;

        const { error: estudianteError } = await sb
            .from('tabla_estudiantes')
            .insert([{ id_usuario: participanteId, participacion_carteles: participacionCarteles }]);

        if (estudianteError) {
            alert('Error al guardar los datos en la tabla de estudiantes.');
            return;
        }
    }

    const { error: ingresoErrorDiaUno } = await sb
        .from('ingreso_participantes_dia_uno')
        .insert([{ id_participante: participanteId, ingreso: false }]);

    if (ingresoErrorDiaUno) {
        alert('Error al guardar los datos en la tabla de ingreso para el día uno.');
        return;
    }

    const { error: ingresoErrorDiaDos } = await sb
        .from('ingreso_participantes_dia_dos')
        .insert([{ id_participante: participanteId, ingreso: false }]);

    if (ingresoErrorDiaDos) {
        alert('Error al guardar los datos en la tabla de ingreso para el día dos.');
        return;
    }

    try {
        const qrCanvasDiaUno = document.createElement('canvas');
        await QRCode.toCanvas(qrCanvasDiaUno, qrDataDiaUno, { scale: 3 });
        
        const qrCanvasDiaDos = document.createElement('canvas');
        await QRCode.toCanvas(qrCanvasDiaDos, qrDataDiaDos, { scale: 3 });
        
        // Registrar fontkit
        if (!window.fontkit) {
            console.error('Fontkit no se cargó correctamente.');
            return;
        }

        const { PDFDocument, rgb } = PDFLib;

        const pdfDoc = await PDFDocument.create();
        
        pdfDoc.registerFontkit(window.fontkit);
        
        // Cargar y embeber las fuentes ClashDisplay-Regular, ClashDisplay-Semibold y ClashDisplay-Medium
        const fontUrl = '../assets/fonts/ClashDisplay-Regular.otf';
        const semiboldFontUrl = '../assets/fonts/ClashDisplay-Semibold.otf';
        const mediumFontUrl = '../assets/fonts/ClashDisplay-Medium.otf';
        
        const [fontBytes, semiboldFontBytes, mediumFontBytes] = await Promise.all([
            fetch(fontUrl).then(res => res.arrayBuffer()),
            fetch(semiboldFontUrl).then(res => res.arrayBuffer()),
            fetch(mediumFontUrl).then(res => res.arrayBuffer())
        ]);
        
        const clashDisplayFont = await pdfDoc.embedFont(fontBytes);
        const clashDisplaySemiboldFont = await pdfDoc.embedFont(semiboldFontBytes);
        const clashDisplayMediumFont = await pdfDoc.embedFont(mediumFontBytes);

        
        // Función para dibujar el contenido común en ambas páginas
        const drawCommonContent = (page, day) => {
            const { width, height } = page.getSize();
            
            // Fondo blanco
            page.drawRectangle({
                x: 0,
                y: 0,
                width: width,
                height: height,
                color: rgb(1, 1, 1),
            });
            
            // Texto superior "CODEC"
            page.drawText('CODEC', {
                x: 150,
                y: height - 80,
                size: 50,
                font: clashDisplaySemiboldFont,
                color: rgb(0, 0, 0),
            });
            
            // Texto indicando el día debajo de "CODEC"
            page.drawText(`Día: ${day}`, {
                x: 60,
                y: height - 200,
                size: 25,
                font: clashDisplayMediumFont,
                color: rgb(0, 0, 0),
            });
            
            // Línea divisoria
            page.drawLine({
                start: { x: width / 2, y: height - 40 },
                end: { x: width / 2, y: 40 },
                thickness: 2,
                color: rgb(0, 0, 0),
            });
            
            // Datos del usuario alineados justo a la derecha de cada label
            const userInfo = [
                { label: 'Nombre:', value: `${nombre}` },
                { label: 'Apellido:', value: `${apellido}` },
                { label: 'Correo:', value: `${correo}` },
                { label: 'Teléfono:', value: `${telefono}` },
                { label: 'Tipo de Boleto:', value: `${ticketType}` },
                { label: 'Evento Rompe Hielos:', value: `${asistira}` },
            ];
            
            const labelX = 60; // Posición X para los labels
            
            userInfo.forEach((info, index) => {
                const yPosition = height - 240 - (index * 40);
                const textWidth = clashDisplayMediumFont.widthOfTextAtSize(info.label, 20); // Ancho del label
                const valueX = labelX + textWidth + 10; // Posición X para los valores justo a la derecha del label
                
                page.drawText(`${info.label}`, {
                    x: labelX,
                    y: yPosition,
                    size: 20,
                    font: clashDisplayMediumFont,
                    color: rgb(0, 0, 0),
                });
                
                page.drawText(`${info.value}`, {
                    x: valueX,
                    y: yPosition,
                    size: 20,
                    font: clashDisplayFont,
                    color: rgb(0, 0, 0),
                });
            });
        };
        
        // Página para el Día Uno
        const pageDiaUno = pdfDoc.addPage([1004, 650]);
        drawCommonContent(pageDiaUno, 'Uno');
        
        const qrImageDiaUno = await pdfDoc.embedPng(qrCanvasDiaUno.toDataURL('image/png'));
        const qrSize = 300;
        pageDiaUno.drawImage(qrImageDiaUno, {
            x: (pageDiaUno.getWidth() - qrSize) - 60,
            y: (pageDiaUno.getHeight() - qrSize) / 2,
            width: qrSize,
            height: qrSize,
        });
        
        // Página para el Día Dos
        const pageDiaDos = pdfDoc.addPage([1004, 650]);
        drawCommonContent(pageDiaDos, 'Dos');
        
        const qrImageDiaDos = await pdfDoc.embedPng(qrCanvasDiaDos.toDataURL('image/png'));
        pageDiaDos.drawImage(qrImageDiaDos, {
            x: (pageDiaDos.getWidth() - qrSize) - 60,
            y: (pageDiaDos.getHeight() - qrSize) / 2,
            width: qrSize,
            height: qrSize,
        });
        
        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });


        if (pdfBlob.size > 5000000) {
            alert('El PDF generado es demasiado grande para ser enviado por correo.');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = function() {
            const base64data = reader.result.split(',')[1];

            emailjs.send(config.serviceKey, config.templateKey, {
                to_name: nombre,
                from_name: 'Congreso Dental Chihuahuense (CODEC)',
                to_email: correo,
                message: 'Aquí está tu código QR en formato PDF.',
                file: base64data
            }).then(function(response) {
                console.log('Correo enviado exitosamente!');
            }, function(error) {
                console.log('Error al enviar el correo.');
            });
        };
        
        // Redirigir después de 5 segundos
        setTimeout(function () {
            cerrarPagos();
        }, 5000);
        switchSection("#pago-section", "#success-section");

    } catch (error) {
        console.log('Error al manejar el pago exitoso.' + error);
    }
}

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");
    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageContainer.textContent = "";
    }, 4000);
}


function cerrarPagos() {
    pagosDiv.classList.add('closing');
    setTimeout(() => {
        pagosDiv.classList.remove('active', 'closing');
        pagosDiv.style.visibility = 'hidden'; // Ocultar después de quitar las clases
        pagosDiv.style.opacity = '0'; // Transparente después de quitar las clases
        document.body.style.overflow = ''; // Habilitar scroll
    }, 1000); // Tiempo de la transición (0.5s)
}

function validateTicketSelection() {
    const ticketType = document.querySelector('input[name="ticket-type"]:checked');
    if (!ticketType) {
        showErrorPopper(document.querySelector('.ticket-selection'), 'Debe seleccionar un tipo de boleto');
        return false;
    }
    return true;
}

function validateRegistroForm() {
    let isValid = true;
    const inputs = document.querySelectorAll('#registroForm input[required]');
    inputs.forEach(input => {
        hideErrorPopper(input.popperInstance, input);
        if (!input.value.trim()) {
            isValid = false;
            input.popperInstance = showErrorPopper(input, 'Este campo es obligatorio');
        }
    });
    return isValid;
}

function hideErrorPopper(popperInstance, element) {
    if (popperInstance) {
        popperInstance.destroy();
    }
    const errorDiv = document.querySelector('.error-popover');
    if (errorDiv) {
        errorDiv.remove();
    }
    element.classList.remove('input-error');
}

function showErrorPopper(element, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-popover';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    const popperInstance = Popper.createPopper(element, errorDiv, {
        placement: 'bottom-start',
        modifiers: [{
            name: 'offset',
            options: {
                offset: [0, 8],
            },
        }],
    });

    element.classList.add('input-error');

    return popperInstance;
}




function setLoading(isLoading) {
    if (isLoading) {
        document.querySelector("#submit-payment").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit-payment").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}

function switchSection(from, to) {
    document.querySelector(from).classList.remove('active');
    document.querySelector(from).classList.add('hidden');
    document.querySelector(to).classList.add('active');
    document.querySelector(to).classList.remove('hidden');  
}