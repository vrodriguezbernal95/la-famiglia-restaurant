// Función para abrir el widget de reserva de StickyWork
function abrirReserva() {
    // Buscar el botón flotante de StickyWork por su clase específica
    const floatingButton = document.querySelector('.stickywork-floating-btn');

    if (floatingButton) {
        floatingButton.click();
    } else {
        // Si aún no se ha cargado, esperar un poco y volver a intentar
        setTimeout(() => {
            const btn = document.querySelector('.stickywork-floating-btn');
            if (btn) {
                btn.click();
            }
        }, 500);
    }
}

// Función antigua (ya no se usa, pero la dejo por si acaso)
function hacerReserva() {
    abrirReserva();
}

// Función para enviar la reserva
function enviarReserva(event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const formData = new FormData(event.target);
    const nombre = event.target.querySelector('input[type="text"]').value;
    const email = event.target.querySelector('input[type="email"]').value;
    const telefono = event.target.querySelector('input[type="tel"]').value;
    const fecha = event.target.querySelector('input[type="date"]').value;
    const hora = event.target.querySelector('input[type="time"]').value;
    const personas = event.target.querySelector('input[type="number"]').value;

    // Mostrar mensaje de confirmación
    alert(`¡Gracias ${nombre}! Tu reserva ha sido solicitada.\n\n` +
          `Detalles:\n` +
          `📅 Fecha: ${formatearFecha(fecha)}\n` +
          `🕐 Hora: ${hora}\n` +
          `👥 Personas: ${personas}\n` +
          `📧 Email: ${email}\n` +
          `📱 Teléfono: ${telefono}\n\n` +
          `Te confirmaremos tu reserva por email o teléfono en breve.`);

    // Limpiar el formulario
    event.target.reset();
}

// Función para formatear la fecha
function formatearFecha(fecha) {
    const date = new Date(fecha + 'T00:00:00');
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', opciones);
}

// Efecto de scroll para el header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Animación de aparición para los elementos del menú
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar la animación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar las animaciones de los elementos del menú
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(item);
    });

    // Establecer fecha mínima en el formulario (hoy)
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Validación adicional del formulario
    const form = document.getElementById('reservaForm');
    if (form) {
        const timeInput = form.querySelector('input[type="time"]');
        const dateInputForm = form.querySelector('input[type="date"]');

        form.addEventListener('submit', (e) => {
            const selectedDate = new Date(dateInputForm.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                e.preventDefault();
                alert('Por favor, selecciona una fecha válida (hoy o posterior).');
                return;
            }

            // Validar horario del restaurante
            const time = timeInput.value;
            const [hours, minutes] = time.split(':').map(Number);
            const timeInMinutes = hours * 60 + minutes;

            const lunchStart = 13 * 60; // 13:00
            const lunchEnd = 16 * 60;   // 16:00
            const dinnerStart = 20 * 60; // 20:00
            const dinnerEnd = 23 * 60 + 30; // 23:30

            const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;

            if (isWeekend) {
                // Fin de semana: 13:00 - 23:30
                if (timeInMinutes < lunchStart || timeInMinutes > dinnerEnd) {
                    e.preventDefault();
                    alert('Para los fines de semana, nuestro horario es de 13:00 a 23:30.');
                    return;
                }
            } else {
                // Entre semana: 13:00-16:00 o 20:00-23:30
                if (!((timeInMinutes >= lunchStart && timeInMinutes <= lunchEnd) ||
                      (timeInMinutes >= dinnerStart && timeInMinutes <= dinnerEnd))) {
                    e.preventDefault();
                    alert('Para días de semana, nuestro horario es:\n' +
                          '• Almuerzo: 13:00 - 16:00\n' +
                          '• Cena: 20:00 - 23:30');
                    return;
                }
            }
        });
    }
});

// Smooth scroll para los enlaces del menú de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
