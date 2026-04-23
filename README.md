# Lista de Contactos - Práctica CRUD con JavaScript Vanilla

Una aplicación web moderna para gestionar contactos con operaciones CRUD completas, validación de formularios, almacenamiento local y una interfaz intuitiva.

## Características Principales

### CRUD Completo
- **CREATE (Crear)**: Agregar nuevos contactos con validación
- **READ (Leer)**: Mostrar lista de contactos con búsqueda en tiempo real
- **UPDATE (Actualizar)**: Editar contactos existentes
- **DELETE (Eliminar)**: Eliminar contactos con confirmación

### Validación de Formulario
- Nombre y apellido: solo letras, mínimo 2 caracteres
- Teléfono: mínimo 7 dígitos válidos
- Ciudad: solo letras, mínimo 2 caracteres
- Email: validación de formato de correo electrónico
- Género: selección obligatoria
- Mensajes de error personalizados en tiempo real

### Iconos de Género
- **Masculino**: Color azul con icono de Marte
- **Femenino**: Color rojo con icono de Venus
- **Otro**: Color púrpura con icono transgénero

### Spinner de Carga
- Simula el envío de datos a una base de datos
- Delay de 1.5 segundos al crear/actualizar
- Delay de 1 segundo al eliminar
- Interfaz intuitiva con animación de carga

### LocalStorage
- Los contactos se guardan automáticamente en el navegador
- Los datos persisten después de cerrar la página
- Clave de almacenamiento: `contactos_lista`

### Búsqueda en Tiempo Real
- Buscar por nombre, apellido o ciudad
- Sin necesidad de presionar botón de búsqueda
- Resultados instantáneos mientras escribes

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsivo con Grid y Flexbox
- **JavaScript Vanilla**: Sin dependencias externas
- **LocalStorage API**: Persistencia de datos
- **Font Awesome 6.4.0**: Iconos profesionales

## Estructura de Archivos

```
Lista-Contactos/
│
├── index.html          # Estructura HTML de la aplicación
├── style.css           # Estilos CSS (responsive)
├── script.js           # Lógica JavaScript (CRUD + validación)
└── README.md           # Este archivo
```

## Cómo Usar

1. **Abre el archivo `index.html`** en tu navegador web
2. **Completa el formulario** con los datos del contacto:
   - Nombre
   - Apellido
   - Teléfono
   - Ciudad
   - Email
   - Género
3. **Haz clic en "Agregar Contacto"**
4. El contacto aparecerá en la lista con su icono de género

### Operaciones Disponibles

#### Agregar Contacto
1. Completa todos los campos del formulario
2. Haz clic en el botón "Agregar Contacto"
3. Espera el spinner de carga
4. El contacto se agregará a la lista

#### Buscar Contacto
- Usa el campo de búsqueda para filtrar por nombre, apellido o ciudad
- La búsqueda es en tiempo real

#### Editar Contacto
1. Haz clic en el botón "Editar" de cualquier contacto
2. El formulario se llenará con los datos del contacto
3. Modifica los campos que desees
4. Haz clic en "Actualizar Contacto"

#### Eliminar Contacto
1. Haz clic en el botón "Eliminar" de cualquier contacto
2. Confirma la eliminación en el diálogo
3. El contacto será eliminado de la lista

#### Limpiar Formulario
- Haz clic en el botón "Limpiar" para resetear todos los campos

## Conceptos de Programación Practicados

### Manejo del DOM
```javascript
- querySelector() / querySelectorAll()
- addEventListener()
- classList manipulation
- innerHTML y textContent
```

### Validación de Formularios
```javascript
- Expresiones regulares (RegExp)
- Validación en tiempo real
- Mensajes de error dinámicos
- preventDefault()
```

### LocalStorage
```javascript
- JSON.stringify() / JSON.parse()
- localStorage.setItem()
- localStorage.getItem()
```

### CRUD Operations
```javascript
- Crear objetos con timestamp (Date.now())
- Filtrar arrays con filter()
- Encontrar elementos con find()
- Map para renderizar HTML
```

### Manejo de Eventos
```javascript
- submit
- input
- blur
- click
- change (radio buttons)
```

## Ejemplos de Validación

### Nombre/Apellido
- Solo acepta letras y espacios
- Mínimo 2 caracteres
- Máximo 50 caracteres

### Teléfono
- Acepta dígitos, espacios, +, -, ()
- Mínimo 7 dígitos válidos
- Ejemplo: +34 123 456 789

### Email
- Valida formato estándar
- Requiere @ y dominio
- Ejemplo: usuario@ejemplo.com

### Género
- Campo obligatorio
- Tres opciones: Masculino, Femenino, Otro
- Se muestra con icono representativo

## Estructura de Datos de un Contacto

```javascript
{
    id: 1234567890,                           // Timestamp único
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "+34 123 456 789",
    ciudad: "Madrid",
    email: "juan@ejemplo.com",
    genero: "masculino",                      // masculino | femenino | otro
    fechaCreacion: "20/4/2026 15:30:45",
    fechaActualizacion: "20/4/2026 16:45:20"  // Solo si fue editado
}
```

## Características de Diseño

### Colores
- Gradiente Morado: Encabezado y fondo
- Azul Primario (#3498db): Acciones principales
- Rojo (#e74c3c): Acciones peligrosas (eliminar)
- Verde (#2ecc71): Confirmación
- Naranja (#f39c12): Edición

### Responsive Design
- Funciona en desktop, tablet y móvil
- Grid de tarjetas adaptable
- Formulario fluido

### Animaciones
- Tarjetas: deslizamiento suave al crear
- Botones: efecto hover con elevación
- Spinner: rotación continua

## Datos Locales

Los contactos se almacenan en el navegador usando `localStorage`:
- Los datos persisten entre sesiones
- Solo se pueden ver en el mismo navegador
- Para eliminar: limpiar caché del navegador o usar DevTools
