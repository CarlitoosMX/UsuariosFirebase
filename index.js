const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require("body-parser");
const cors = require("cors");
const serviceAccount = require('./serviceAccountKey.json');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Inicializar la aplicación de administración de Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Ruta para listar usuarios
app.get('/', (req, res) => {
  admin
    .auth()
    .listUsers()
    .then((listUsersResult) => {
      const users = listUsersResult.users.map((userRecord) => ({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        // ...otros campos del usuario que desees incluir
      }));
      res.send(users);
    })
    .catch((error) => {
      console.log('Error listing users:', error);
      res.status(500).json({ error: 'Error listing users' });
    });
});

// Puerto en el que la API escuchará las solicitudes
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});