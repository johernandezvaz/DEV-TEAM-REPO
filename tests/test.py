from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import random
import time

# Función para generar datos aleatorios
def generar_datos_aleatorios():
    nombres = ["Pedro", "Juan", "Luis", "Maria", "Ana", "Lucia"]
    apellidos = ["Lopez", "Perez", "Martinez", "Garcia", "Sanchez"]
    nombre = random.choice(nombres)
    apellido = random.choice(apellidos)
    correo = f"{nombre.lower()}.{apellido.lower()}@example.com"
    telefono = f"+52 {random.randint(100, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}"
    asistencia = random.choice(["si", "no"])
    return nombre, apellido, correo, telefono, asistencia

# Configurar WebDriver
driver = webdriver.Chrome()

# URL del formulario
url = "https://www.codecuu.com/#tickets"
driver.get(url)

# Esperar a que el formulario esté presente
wait = WebDriverWait(driver, 10)
wait.until(EC.presence_of_element_located((By.ID, "registroForm")))

# Llenar y enviar el formulario 600 veces
for _ in range(600):
    nombre, apellido, correo, telefono, asistencia = generar_datos_aleatorios()

    # Esperar a que los campos sean interactuables y llenarlos
    wait.until(EC.element_to_be_clickable((By.ID, "nombre"))).send_keys(nombre)
    wait.until(EC.element_to_be_clickable((By.ID, "apellido"))).send_keys(apellido)
    wait.until(EC.element_to_be_clickable((By.ID, "email"))).send_keys(correo)
    wait.until(EC.element_to_be_clickable((By.ID, "phone"))).send_keys(telefono)
    
    if asistencia == "si":
        wait.until(EC.element_to_be_clickable((By.XPATH, "//input[@name='asistencia_rompehielos' and @value='si']"))).click()
    else:
        wait.until(EC.element_to_be_clickable((By.XPATH, "//input[@name='asistencia_rompehielos' and @value='no']"))).click()

    # Esperar a que el botón de enviar sea interactuable y hacer clic en él
    wait.until(EC.element_to_be_clickable((By.ID, "submit"))).click()

    # Esperar a que la página se recargue antes de continuar
    time.sleep(2)
    driver.refresh()
    wait.until(EC.presence_of_element_located((By.ID, "registroForm")))

# Cerrar el navegador
driver.quit()
