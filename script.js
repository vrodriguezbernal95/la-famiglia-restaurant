// Variables globales
let hamburger, navWrapper, overlay;

// Menú Hamburguesa y botones de reserva
document.addEventListener('DOMContentLoaded', () => {
    hamburger = document.getElementById('hamburger');
    navWrapper = document.querySelector('.nav-wrapper');
    overlay = document.getElementById('overlay');

    // Agregar event listeners a todos los botones de reserva
    const botonesReserva = document.querySelectorAll('.btn-reserva, .btn-reserva-about, .btn-reserva-formulario');
    botonesReserva.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            abrirReserva();
        });
    });

    // Toggle del menú
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navWrapper.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = navWrapper.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navWrapper.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Cerrar menú al hacer clic en el overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navWrapper.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }
});

// Función para abrir el widget de reserva de StickyWork
function abrirReserva() {
    console.log('🔵 Intentando abrir reserva...');

    // Cerrar el menú hamburguesa si está abierto
    if (hamburger && navWrapper) {
        hamburger.classList.remove('active');
        navWrapper.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Opción 1: Intentar usar la API de StickyWork directamente
    if (window.StickyWork && typeof window.StickyWork.open === 'function') {
        console.log('✅ Usando API de StickyWork.open()');
        window.StickyWork.open();
        return;
    }

    if (window.StickyWork && typeof window.StickyWork.show === 'function') {
        console.log('✅ Usando API de StickyWork.show()');
        window.StickyWork.show();
        return;
    }

    if (window.StickyWork && typeof window.StickyWork.openWidget === 'function') {
        console.log('✅ Usando API de StickyWork.openWidget()');
        window.StickyWork.openWidget();
        return;
    }

    // Opción 2: Buscar y hacer clic en el botón flotante
    console.log('⚠️ API no encontrada, buscando botón flotante...');

    // Esperar un poco si el widget aún no se ha cargado
    setTimeout(() => {
        const selectors = [
            '.stickywork-floating-btn',
            '.stickywork-button',
            '[class*="stickywork"][class*="btn"]',
            '[class*="stickywork"][class*="float"]',
            'button[class*="stickywork"]',
            'div[class*="stickywork"][class*="button"]',
            'iframe[src*="stickywork"]'
        ];

        // Buscar el botón flotante
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);

            if (elements.length > 0) {
                // Hacer click en el primer elemento visible
                const visibleElement = Array.from(elements).find(el => {
                    const style = window.getComputedStyle(el);
                    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                });

                if (visibleElement) {
                    console.log('✅ Haciendo click en:', visibleElement);

                    // Si es un iframe, intentar acceder al contenido
                    if (visibleElement.tagName === 'IFRAME') {
                        console.log('⚠️ Elemento es un iframe, no se puede hacer click directamente');
                        console.log('💡 Por favor, usa el botón flotante visible en la página');
                    } else {
                        visibleElement.click();
                    }
                    return;
                }
            }
        }

        // Si no se encuentra nada, mostrar mensaje de ayuda
        console.log('❌ No se encontró el widget de StickyWork');
        console.log('💡 Por favor, usa el botón "Reservar Mesa" flotante en la esquina inferior derecha');

        // Mostrar alerta al usuario
        alert('Por favor, usa el botón "Reservar Mesa" flotante que aparece en la esquina inferior derecha de la página.');
    }, 100);
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
        // NO interferir con elementos dentro del widget de StickyWork
        if (this.closest('[class*="stickywork"]') || this.closest('[id*="stickywork"]')) {
            return;
        }

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
