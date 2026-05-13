import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '.');
const dataFile = path.join(__dirname, 'contacts.json');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

async function readContactsFile() {
  try {
    const content = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeContactsFile(contacts) {
  await fs.writeFile(dataFile, JSON.stringify(contacts, null, 2), 'utf-8');
}

async function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  try {
    const requestPath = req.url.split('?')[0];

    if (requestPath.startsWith('/api/contacts')) {
      const contacts = await readContactsFile();
      const idMatch = requestPath.match(/^\/api\/contacts\/(\d+)$/);

      if (req.method === 'GET' && requestPath === '/api/contacts') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(contacts));
        return;
      }

      if (req.method === 'POST' && requestPath === '/api/contacts') {
        const body = await parseJsonBody(req);
        const newContact = {
          id: Date.now(),
          ...body,
          fechaCreacion: new Date().toLocaleString('es-ES')
        };
        contacts.push(newContact);
        await writeContactsFile(contacts);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newContact));
        return;
      }

      if (req.method === 'PUT' && idMatch) {
        const id = Number(idMatch[1]);
        const body = await parseJsonBody(req);
        const index = contacts.findIndex(contact => contact.id === id);

        if (index === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Contacto no encontrado' }));
          return;
        }

        contacts[index] = {
          ...contacts[index],
          ...body,
          fechaActualizacion: new Date().toLocaleString('es-ES')
        };
        await writeContactsFile(contacts);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(contacts[index]));
        return;
      }

      if (req.method === 'DELETE' && idMatch) {
        const id = Number(idMatch[1]);
        const index = contacts.findIndex(contact => contact.id === id);

        if (index === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Contacto no encontrado' }));
          return;
        }

        contacts.splice(index, 1);
        await writeContactsFile(contacts);
        res.writeHead(204);
        res.end();
        return;
      }

      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Método no permitido' }));
      return;
    }

    let filePath = requestPath;
    if (filePath === '/' || filePath === '') {
      filePath = '/index.html';
    }

    const resolvedPath = path.join(publicDir, decodeURIComponent(filePath));
    if (!resolvedPath.startsWith(publicDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }

    const fileContents = await fs.readFile(resolvedPath);
    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fileContents);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } else {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error');
    }
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Servidor Node con API escuchando en http://127.0.0.1:3000');
});
