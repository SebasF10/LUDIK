// roles_menu.js
// Controla la visibilidad de los botones del menú según el rol del usuario
(function () {
    'use strict';

    function normalizeText(t) {
        return (t || '').toString().trim().toLowerCase();
    }

    function containsAny(text, arr) {
        return arr.some(k => text.includes(k));
    }

    function aplicarVisibilidadBotonesPorRol() {
        const rolRaw = (localStorage.getItem('rol') || '').toLowerCase();
        const rol = rolRaw.replace(/\s+/g, '_');

        // --- Botones que SIEMPRE deben mostrarse ---
        const siempreVisibles = [
            'volver a interfaz',
            'perfil',
            'estudiantes',
            'comunicate',
            'ayuda',
            'manual',
            'cerrar sesión',
            'cerrar sesion'
        ];

        // --- Definición de reglas por rol ---
        const reglas = {
            admin: { tipo: 'allow_all' },
            docente_apoyo: {
                tipo: 'disallow',
                palabras: ['crear cuentas']
            },
            directivo: {
                tipo: 'disallow',
                palabras: [
                    'crear cuentas',
                    'registrar un nuevo estudiante',
                    'registrar un piar',
                    'valoración pedagógica',
                    'valoracion pedagogica'
                ]
            },
            docente: {
                tipo: 'disallow',
                palabras: [
                    'crear cuentas',
                    'registrar un nuevo estudiante',
                    'registrar un piar'
                ]
            },
            padre: {
                tipo: 'disallow',
                palabras: [
                    'crear cuentas',
                    'actividades',
                    'ia',
                    'registrar un nuevo estudiante',
                    'registrar un piar',
                    'valoración pedagógica',
                    'valoracion pedagogica',
                    'documentos'
                ]
            },
            madre: {
                tipo: 'disallow',
                palabras: [
                    'crear cuentas',
                    'actividades',
                    'ia',
                    'registrar un nuevo estudiante',
                    'registrar un piar',
                    'valoración pedagógica',
                    'valoracion pedagogica',
                    'documentos'
                ]
            },
            acudiente: {
                tipo: 'disallow',
                palabras: [
                    'crear cuentas',
                    'actividades',
                    'ia',
                    'registrar un nuevo estudiante',
                    'registrar un piar',
                    'valoración pedagógica',
                    'valoracion pedagogica',
                    'documentos'
                ]
            }
        };

        const regla = reglas[rol] || { tipo: 'allow_all' };

        // --- Buscar botones del menú ---
        const botones = Array.from(document.querySelectorAll('.menu-button, .menu-buttons a, .menu-buttons button'));
        botones.forEach(boton => {
            const txt = normalizeText(
                boton.textContent ||
                boton.innerText ||
                boton.getAttribute('aria-label') ||
                boton.getAttribute('title') ||
                ''
            );

            let mostrar = true;

            // Siempre visibles
            if (containsAny(txt, siempreVisibles)) {
                mostrar = true;
            }
            // Reglas normales
            else if (regla.tipo === 'allow_all') {
                mostrar = true;
            } else if (regla.tipo === 'disallow') {
                mostrar = !containsAny(txt, regla.palabras);
            }

            boton.style.display = mostrar ? '' : 'none';
        });

        // --- Tarjetas de acciones rápidas (si existen) ---
        const actionCards = Array.from(document.querySelectorAll('#accionesRapidas .action-card'));
        actionCards.forEach(card => {
            const txt = normalizeText(card.textContent || '');
            let mostrar = true;

            if (containsAny(txt, siempreVisibles)) {
                mostrar = true;
            } else if (regla.tipo === 'allow_all') {
                mostrar = true;
            } else if (regla.tipo === 'disallow') {
                mostrar = !containsAny(txt, regla.palabras);
            }

            card.style.display = mostrar ? '' : 'none';
        });
    }

    // Ejecutar automáticamente cuando el DOM está listo
    document.addEventListener('DOMContentLoaded', function () {
        aplicarVisibilidadBotonesPorRol();

        // Si el menú cambia dinámicamente, vuelve a aplicar las reglas
        const menuButtons = document.querySelector('.menu-buttons');
        if (menuButtons) {
            const observer = new MutationObserver(() => aplicarVisibilidadBotonesPorRol());
            observer.observe(menuButtons, { childList: true, subtree: true });
        }
    });

    // Exponer la función por si se necesita invocar manualmente
    window.aplicarVisibilidadBotonesPorRol = aplicarVisibilidadBotonesPorRol;
})();
