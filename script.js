// ==========================================
// APLICACIÓN DE LISTA DE CONTACTOS
// CRUD con localStorage y Vanilla JavaScript
// ==========================================

// Elementos del DOM
const form = document.getElementById('contactForm');
const nombreInput = document.getElementById('nombre');
const apellidoInput = document.getElementById('apellido');
const telefonoInput = document.getElementById('telefono');
const ciudadInput = document.getElementById('ciudad');
const emailInput = document.getElementById('email');
const genderRadios = document.querySelectorAll('input[name="gender"]');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const cancelBtn = document.getElementById('cancelBtn');
const contactsList = document.getElementById('contactsList');
const searchInput = document.getElementById('searchInput');
const spinnerContainer = document.getElementById('spinnerContainer');
const contactCount = document.getElementById('contactCount');
const formTitle = document.getElementById('formTitle');

// Variables globales
let contacts = [];
let editingContactId = null;
const STORAGE_KEY = 'contactos_lista';

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    renderContacts();
    attachEventListeners();
});

// ==========================================
// GESTIÓN DE EVENTOS
// ==========================================

function attachEventListeners() {
    // Envío del formulario
    form.addEventListener('submit', handleFormSubmit);

    // Reset del formulario
    resetBtn.addEventListener('click', handleReset);

    // Cancelar edición
    cancelBtn.addEventListener('click', handleCancelEdit);

    // Búsqueda
    searchInput.addEventListener('input', handleSearch);

    // Validación en tiempo real
    nombreInput.addEventListener('blur', validateNombre);
    apellidoInput.addEventListener('blur', validateApellido);
    telefonoInput.addEventListener('blur', validateTelefono);
    ciudadInput.addEventListener('blur', validateCiudad);
    emailInput.addEventListener('blur', validateEmail);
}

// ==========================================
// FUNCIONES DE VALIDACIÓN
// ==========================================

function validateNombre() {
    const value = nombreInput.value.trim();
    const errorEl = document.getElementById('nombreError');

    if (!value) {
        showError(errorEl, 'El nombre es requerido');
        return false;
    }
    if (value.length < 2) {
        showError(errorEl, 'El nombre debe tener al menos 2 caracteres');
        return false;
    }
    if (!/^[a-záéíóúñ\s]+$/i.test(value)) {
        showError(errorEl, 'El nombre solo puede contener letras');
        return false;
    }
    hideError(errorEl);
    return true;
}

function validateApellido() {
    const value = apellidoInput.value.trim();
    const errorEl = document.getElementById('apellidoError');

    if (!value) {
        showError(errorEl, 'El apellido es requerido');
        return false;
    }
    if (value.length < 2) {
        showError(errorEl, 'El apellido debe tener al menos 2 caracteres');
        return false;
    }
    if (!/^[a-záéíóúñ\s]+$/i.test(value)) {
        showError(errorEl, 'El apellido solo puede contener letras');
        return false;
    }
    hideError(errorEl);
    return true;
}

function validateTelefono() {
    const value = telefonoInput.value.trim();
    const errorEl = document.getElementById('telefonoError');

    if (!value) {
        showError(errorEl, 'El teléfono es requerido');
        return false;
    }
    if (!/^[\d\s\+\-\(\)]+$/.test(value) || value.replace(/\D/g, '').length < 7) {
        showError(errorEl, 'Ingresa un teléfono válido (mín. 7 dígitos)');
        return false;
    }
    hideError(errorEl);
    return true;
}

function validateCiudad() {
    const value = ciudadInput.value.trim();
    const errorEl = document.getElementById('ciudadError');

    if (!value) {
        showError(errorEl, 'La ciudad es requerida');
        return false;
    }
    if (value.length < 2) {
        showError(errorEl, 'La ciudad debe tener al menos 2 caracteres');
        return false;
    }
    if (!/^[a-záéíóúñ\s]+$/i.test(value)) {
        showError(errorEl, 'La ciudad solo puede contener letras');
        return false;
    }
    hideError(errorEl);
    return true;
}

function validateEmail() {
    const value = emailInput.value.trim();
    const errorEl = document.getElementById('emailError');

    if (!value) {
        showError(errorEl, 'El email es requerido');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showError(errorEl, 'Ingresa un email válido');
        return false;
    }
    hideError(errorEl);
    return true;
}

function validateGender() {
    const selected = document.querySelector('input[name="gender"]:checked');
    const errorEl = document.getElementById('genderError');

    if (!selected) {
        showError(errorEl, 'Selecciona un género');
        return false;
    }
    hideError(errorEl);
    return true;
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

function hideError(element) {
    element.textContent = '';
    element.classList.remove('show');
}

function validateAllFields() {
    return (
        validateNombre() &&
        validateApellido() &&
        validateTelefono() &&
        validateCiudad() &&
        validateEmail() &&
        validateGender()
    );
}

// ==========================================
// MANEJADORES DE FORMULARIO
// ==========================================

function handleFormSubmit(e) {
    e.preventDefault();

    // Validar todos los campos
    if (!validateAllFields()) {
        return;
    }

    // Mostrar spinner
    showSpinner();

    // Simular delay de carga (como si fuera a una BD)
    setTimeout(() => {
        const contactData = {
            nombre: nombreInput.value.trim(),
            apellido: apellidoInput.value.trim(),
            telefono: telefonoInput.value.trim(),
            ciudad: ciudadInput.value.trim(),
            email: emailInput.value.trim(),
            genero: document.querySelector('input[name="gender"]:checked').value
        };

        if (editingContactId) {
            // Actualizar contacto
            updateContact(editingContactId, contactData);
        } else {
            // Crear nuevo contacto
            createContact(contactData);
        }

        // Limpiar formulario
        form.reset();
        editingContactId = null;
        updateFormUI();

        // Ocultar spinner
        hideSpinner();

        // Renderizar contactos
        renderContacts();
    }, 1500);
}

function handleReset(e) {
    e.preventDefault();
    form.reset();
    editingContactId = null;
    updateFormUI();
    document.querySelectorAll('.error-message').forEach(el => hideError(el));
}

function handleCancelEdit(e) {
    e.preventDefault();
    editingContactId = null;
    handleReset(e);
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = contacts.filter(contact =>
        contact.nombre.toLowerCase().includes(searchTerm) ||
        contact.apellido.toLowerCase().includes(searchTerm) ||
        contact.ciudad.toLowerCase().includes(searchTerm)
    );
    renderContacts(filtered);
}

// ==========================================
// OPERACIONES CRUD
// ==========================================

function createContact(data) {
    const id = Date.now();
    const contact = {
        id,
        ...data,
        fechaCreacion: new Date().toLocaleString('es-ES')
    };
    contacts.push(contact);
    saveContacts();
}

function readContact(id) {
    return contacts.find(contact => contact.id === id);
}

function updateContact(id, data) {
    const contact = readContact(id);
    if (contact) {
        Object.assign(contact, data);
        contact.fechaActualizacion = new Date().toLocaleString('es-ES');
        saveContacts();
    }
}

function deleteContact(id) {
    contacts = contacts.filter(contact => contact.id !== id);
    saveContacts();
}

// ==========================================
// GESTIÓN DE LOCALSTORAGE
// ==========================================

function saveContacts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    updateContactCount();
}

function loadContacts() {
    const saved = localStorage.getItem(STORAGE_KEY);
    contacts = saved ? JSON.parse(saved) : [];
    updateContactCount();
}

// ==========================================
// RENDERIZADO
// ==========================================

function renderContacts(contactsToRender = contacts) {
    if (contactsToRender.length === 0) {
        contactsList.innerHTML = '<p class="empty-message">No hay contactos aún. ¡Agrega uno ahora!</p>';
        return;
    }

    contactsList.innerHTML = contactsToRender
        .map(contact => createContactCard(contact))
        .join('');

    attachDeleteHandlers();
    attachEditHandlers();
}

function createContactCard(contact) {
    const genderIcons = {
        masculino: '<i class="fas fa-mars"></i>',
        femenino: '<i class="fas fa-venus"></i>',
        otro: '<i class="fas fa-transgender"></i>'
    };

    return `
        <div class="contact-card">
            <div class="contact-header">
                <div class="gender-icon ${contact.genero}">
                    ${genderIcons[contact.genero]}
                </div>
                <div class="contact-name">
                    <h3>${contact.nombre} ${contact.apellido}</h3>
                    <a href="mailto:${contact.email}" class="contact-email">${contact.email}</a>
                </div>
            </div>
            <div class="contact-info">
                <p>
                    <i class="fas fa-phone"></i>
                    <strong>${contact.telefono}</strong>
                </p>
                <p>
                    <i class="fas fa-map-marker-alt"></i>
                    <strong>${contact.ciudad}</strong>
                </p>
                <p style="font-size: 0.8em; color: #999;">
                    <i class="fas fa-calendar"></i>
                    ${contact.fechaCreacion}
                </p>
            </div>
            <div class="contact-actions">
                <button class="btn-small btn-edit" data-id="${contact.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-small btn-delete" data-id="${contact.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `;
}

// ==========================================
// MANEJO DE EDICIÓN Y ELIMINACIÓN
// ==========================================

function attachEditHandlers() {
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const contact = readContact(id);

            if (contact) {
                nombreInput.value = contact.nombre;
                apellidoInput.value = contact.apellido;
                telefonoInput.value = contact.telefono;
                ciudadInput.value = contact.ciudad;
                emailInput.value = contact.email;
                document.querySelector(`input[name="gender"][value="${contact.genero}"]`).checked = true;

                editingContactId = id;
                updateFormUI();

                // Scroll al formulario
                form.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function attachDeleteHandlers() {
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const contact = readContact(id);

            if (confirm(`¿Estás seguro de que deseas eliminar a ${contact.nombre} ${contact.apellido}?`)) {
                showSpinner();
                setTimeout(() => {
                    deleteContact(id);
                    hideSpinner();
                    renderContacts();
                }, 1000);
            }
        });
    });
}

// ==========================================
// UTILIDADES
// ==========================================

function updateFormUI() {
    if (editingContactId) {
        formTitle.textContent = 'Editar Contacto';
        submitBtn.textContent = 'Actualizar Contacto';
        cancelBtn.style.display = 'block';
    } else {
        formTitle.textContent = 'Agregar Nuevo Contacto';
        submitBtn.textContent = 'Agregar Contacto';
        cancelBtn.style.display = 'none';
    }
}

function updateContactCount() {
    contactCount.textContent = contacts.length;
}

function showSpinner() {
    spinnerContainer.style.display = 'flex';
}

function hideSpinner() {
    spinnerContainer.style.display = 'none';
}