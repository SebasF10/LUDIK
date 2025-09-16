// Comunicacion.js
class ComunicacionDocentes {
    constructor() {
        this.docentesContainer = document.getElementById('docentesContainer');
        this.searchInput = document.getElementById('searchInput');
        this.showAllBtn = document.getElementById('showAllBtn');
        this.searchBtn = document.getElementById('searchBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.loadingElement = document.getElementById('loading');
        this.errorElement = document.getElementById('error');
        this.resultsCount = document.getElementById('resultsCount');

        this.currentDocentes = [];

        this.initEventListeners();
        this.loadAllDocentes();
    }

    initEventListeners() {
        // Botón mostrar todos
        this.showAllBtn.addEventListener('click', () => {
            this.loadAllDocentes();
        });

        // Botón buscar
        this.searchBtn.addEventListener('click', () => {
            this.searchDocentes();
        });

        // Botón limpiar
        this.clearBtn.addEventListener('click', () => {
            this.clearSearch();
        });

        // Enter en el campo de búsqueda
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchDocentes();
            }
        });

        // Búsqueda en tiempo real (opcional)
        this.searchInput.addEventListener('input', () => {
            const searchTerm = this.searchInput.value.trim();
            if (searchTerm.length === 0) {
                this.loadAllDocentes();
            }
        });
    }

    showLoading(show = true) {
        this.loadingElement.style.display = show ? 'block' : 'none';
        this.docentesContainer.style.display = show ? 'none' : 'grid';
    }

    showError(message) {
        this.errorElement.textContent = message;
        this.errorElement.style.display = 'block';
        setTimeout(() => {
            this.errorElement.style.display = 'none';
        }, 5000);
    }

    updateResultsCount(count) {
        this.resultsCount.textContent = count;
    }

    async loadAllDocentes() {
        try {
            this.showLoading(true);
            this.errorElement.style.display = 'none';

            const response = await fetch('php/Comunicacion.php?showAll=true');
            const data = await response.json();

            if (data.success) {
                this.currentDocentes = data.data;
                this.renderDocentes(this.currentDocentes);
                this.updateResultsCount(data.total);
                this.searchInput.value = '';
            } else {
                this.showError(data.error || 'Error al cargar los docentes');
            }
        } catch (error) {
            this.showError('Error de conexión: ' + error.message);
            console.error('Error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async searchDocentes() {
        const searchTerm = this.searchInput.value.trim();

        if (searchTerm.length < 2) {
            this.showError('Por favor, ingrese al menos 2 caracteres para buscar');
            return;
        }

        try {
            this.showLoading(true);
            this.errorElement.style.display = 'none';

            // CORREGIR LA RUTA DEL FETCH:
            const response = await fetch(`php/Comunicacion.php?search=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();

            if (data.success) {
                this.currentDocentes = data.data;
                this.renderDocentes(this.currentDocentes);
                this.updateResultsCount(data.total);

                if (data.total === 0) {
                    this.renderNoResults(searchTerm);
                }
            } else {
                this.showError(data.error || 'Error al buscar docentes');
            }
        } catch (error) {
            this.showError('Error de conexión: ' + error.message);
            console.error('Error:', error);
        } finally {
            this.showLoading(false);
        }
    }
    
    clearSearch() {
        this.searchInput.value = '';
        this.loadAllDocentes();
    }

    renderDocentes(docentes) {
        if (docentes.length === 0) {
            this.renderNoResults();
            return;
        }

        const html = docentes.map(docente => {
            const materiasHtml = docente.materias.length > 0
                ? docente.materias.map(materia =>
                    `<span class="materia-tag">${this.escapeHtml(materia)}</span>`
                ).join('')
                : '<span style="color: #999; font-style: italic;">Sin materias asignadas</span>';

            const gruposText = docente.grupos.length > 0
                ? docente.grupos.join(', ')
                : 'Sin grupos asignados';

            const directorBadge = docente.es_director
                ? '<span class="director-badge">Director de Grupo</span>'
                : '';

            return `
                <div class="docente-card">
                    <div class="docente-header">
                        <div class="docente-nombre">
                            ${this.escapeHtml(docente.nombre)}
                            ${directorBadge}
                        </div>
                        <a href="mailto:${this.escapeHtml(docente.email)}" class="docente-email">
                            📧 ${this.escapeHtml(docente.email)}
                        </a>
                    </div>
                    
                    <div class="materias-section">
                        <h4>📚 Materias que imparte:</h4>
                        <div class="materias-list">
                            ${materiasHtml}
                        </div>
                    </div>
                    
                    <div class="grupos-section">
                        <h4>👥 Grupos:</h4>
                        <div class="grupos-list">
                            ${this.escapeHtml(gruposText)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.docentesContainer.innerHTML = html;
    }

    renderNoResults(searchTerm = '') {
        const message = searchTerm
            ? `No se encontraron docentes que coincidan con "${searchTerm}"`
            : 'No se encontraron docentes';

        const suggestion = searchTerm
            ? 'Intenta con un nombre diferente o usa el botón "Ver Todos los Docentes"'
            : 'Verifica la conexión a la base de datos';

        this.docentesContainer.innerHTML = `
            <div class="no-results">
                <h3>${message}</h3>
                <p>${suggestion}</p>
            </div>
        `;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ComunicacionDocentes();
});