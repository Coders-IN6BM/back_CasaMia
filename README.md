# back_CasaMia

Proyecto backend para la plataforma de gestión de hoteles **CasaMia**, desarrollado con Node.js y Express.

## 🚀 Tecnologías usadas

- Node.js
- Express
- MongoDB (con Mongoose)
- JSON Web Tokens (JWT)
- Argon2 (para hashing de contraseñas)


## ⚙️ Configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Coders-IN6BM/back_CasaMia.git
   cd back_CasaMia
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` con la siguiente estructura:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/casamia
   SECRET_KEY=your_secret_key
   ```

4. Inicia el servidor:
   ```bash
   npm start
   ```

## 📌 Notas

- Este backend forma parte del proyecto **CasaMia**.
- Cada módulo (auth, hotel, reservation, etc.) sigue una arquitectura modular para facilitar el mantenimiento.

---

Desarrollado por el equipo de **Coders-IN6BM** 🛠️
