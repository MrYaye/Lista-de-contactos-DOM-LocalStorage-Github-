# Lista de Contactos - API con Express y Base de Datos

Proyecto de tarea: crear una API REST con **Express** y **MariaDB/MySQL** para una aplicación de gestión de contactos.

## Descripción

Esta aplicación permite:
- agregar contactos
- listar contactos
- editar contactos
- eliminar contactos

Todo mediante una API en **Express** conectada a una base de datos **MySQL/MariaDB**, y una interfaz en el cliente que consume dicha API.

## Tecnologías utilizadas

- Node.js
- Express
- MySQL / MariaDB
- mysql2
- CORS
- JavaScript Vanilla
- HTML y CSS

## Estructura del proyecto

```
Lista-Contactos/
├── contacts.json          # Datos de ejemplo (si aplica)
├── index.html             # Interfaz cliente
├── index.js               # Lógica del cliente y consumo de API
├── package.json           # Dependencias y scripts del proyecto
├── README.md              # Documentación del proyecto
├── server.js              # API Express y conexión a la base de datos
├── style.css              # Estilos de la aplicación
└── img/                   # Recursos de imagen
```

## Configuración de la base de datos

La base de datos debe llamarse `Lista_Contactos` y la tabla `contacts` debe tener esta estructura:

```sql
CREATE TABLE `contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fechaCreacion` datetime DEFAULT NULL,
  `fechaActualizacion` datetime DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `ciudad` varchar(255) DEFAULT NULL,
  `genero` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Instalación

1. Clona o copia el proyecto en tu equipo.
2. Instala dependencias:

```bash
npm install
```

3. Asegúrate de tener MySQL o MariaDB instalado y ejecutándose.
4. Crea la base de datos `Lista_Contactos` y la tabla `contacts` usando el DDL anterior.
5. Si tu usuario o contraseña de la base de datos son distintos, ajusta `dbConfig` en `server.js`.

## Uso

1. Inicia el servidor:

```bash
npm start
```

2. Abre tu navegador en:

```text
http://127.0.0.1:3000
```

3. La aplicación cargará la interfaz y mostrará los contactos almacenados en la base de datos.

## Endpoints disponibles

- `GET /api/contacts` — obtener todos los contactos
- `POST /api/contacts` — crear un nuevo contacto
- `PUT /api/contacts/:id` — actualizar un contacto existente
- `DELETE /api/contacts/:id` — eliminar un contacto

### Ejemplo de payload para crear un contacto

```json
{
  "nombre": "Ana",
  "apellido": "García",
  "telefono": "+34 600 123 456",
  "ciudad": "Madrid",
  "email": "ana.garcia@example.com",
  "genero": "femenino"
}
```

## Validaciones en el cliente

- Nombre y apellido: requeridos, solo letras y espacios
- Teléfono: requerido, mínimo 7 dígitos válidos
- Ciudad: requerida, solo letras
- Email: requerido y formato válido
- Género: selección obligatoria

## Flujo de trabajo

1. El cliente envía solicitudes `fetch` a la API de Express.
2. El servidor valida y ejecuta consultas `INSERT`, `UPDATE`, `DELETE` y `SELECT`.
3. La base de datos almacena los contactos.
4. El cliente actualiza la lista en pantalla.

## Notas importantes

- No abrir `index.html` con `file://` cuando uses la API.
- Usa siempre `http://127.0.0.1:3000` para evitar problemas de CORS y rutas.
- Si modificas la configuración de la base de datos, actualiza `server.js`.

## Autor

- Proyecto preparado para la tarea de Lista de Contactos con API y base de datos.
