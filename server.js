import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '.');

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Lista_Contactos'
};

let db;

async function connectDB() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Conectado a MariaDB');
  } catch (error) {
    console.error('Error conectando a la DB:', error);
    process.exit(1);
  }
}

// Rutas de la API
app.get('/api/contacts', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM contacts');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo contactos' });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const { nombre, apellido, telefono, ciudad, email, genero } = req.body;
    const [result] = await db.execute(
      'INSERT INTO contacts (nombre, apellido, telefono, ciudad, email, genero, fechaCreacion) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [nombre, apellido, telefono, ciudad, email, genero]
    );
    const newContact = {
      id: result.insertId,
      nombre,
      apellido,
      telefono,
      ciudad,
      email,
      genero,
      fechaCreacion: new Date().toLocaleString('es-ES')
    };
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creando contacto:', error);
    res.status(500).json({ error: 'Error creando contacto' });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, ciudad, email, genero } = req.body;
    const [result] = await db.execute(
      'UPDATE contacts SET nombre = ?, apellido = ?, telefono = ?, ciudad = ?, email = ?, genero = ?, fechaActualizacion = NOW() WHERE id = ?',
      [nombre, apellido, telefono, ciudad, email, genero, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    res.json({ id: Number(id), nombre, apellido, telefono, ciudad, email, genero, fechaActualizacion: new Date().toLocaleString('es-ES') });
  } catch (error) {
    console.error('Error actualizando contacto:', error);
    res.status(500).json({ error: 'Error actualizando contacto' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM contacts WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error eliminando contacto' });
  }
});

// Servir archivos estáticos
app.use(express.static(publicDir));

// Iniciar servidor
connectDB().then(() => {
  app.listen(3000, '127.0.0.1', () => {
    console.log('Servidor Express con API y DB escuchando en http://127.0.0.1:3000');
  });
});
