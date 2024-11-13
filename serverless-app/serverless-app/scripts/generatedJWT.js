// token_generator.js
const jwt = require("jsonwebtoken");

// Clave secreta, debe coincidir con la clave usada en Lambda Authorizer
const secret = "$2a$10$uV4aOv7cC5nVZ6r2bgv7HedH9P2e1N.BJr9FJ6rBS6/VpQwFHxfy2";

// Datos del usuario (payload)
const payload = {
    sub: "user123", // Puedes cambiar este ID de usuario o agregar otros datos relevantes
    name: "Test User", // Este campo es opcional
    role: "admin"      // Otro campo opcional, para indicar el rol o permisos del usuario
};

// Opciones del token (opcional)
const options = {
    expiresIn: "1h" // Expira en 1 hora; ajusta según sea necesario
};

// Generar el token
const token = jwt.sign(payload, secret, options);

console.log("Generated JWT Token:", token);
