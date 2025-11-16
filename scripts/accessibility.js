// scripts/accessibility.js
// Улучшение доступности для всего сайта

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация улучшений доступности
    initAccessibility();
});

function initAccessibility() {
    // 1. Улучшение навигации с клавиатуры
    enhanceKeyboardNavigation();
    
    // 2. Улучшение семантики
    enhanceSemantics();
    
    // 3. Управление фокусом
    enhanceFocusManagement();
    
    // 4. ARIA атрибуты
    enhanceARIA();
    
    // 5. Валидация форм
    enhanceFormValidation();
}

function enhanceKeyboardNavigation() {
    // Добавляем обработчики для всех интерактивных элементов
    const interactiveElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    interactiveElements.forEach(element => {
        // Добавляем визуальный фокус для всех элементов
        element.addEventListener('focus', function() {
            this.style.outline = '3px solid #0066cc';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
        
        // Обработка Enter и Space для кнопок и ссылок
        if (element.tagName === 'BUTTON' || (element.tagName === 'A' && element.href)) {
            element.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    if (event.key === ' ') {
                        event.preventDefault(); // Предотвращаем прокрутку страницы
                    }
                    this.click();
                }
            });
        }
    });
}

function enhanceSemantics() {
    // Добавляем роли для семантических элементов
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
        main.setAttribute('role', 'main');
    }
    
    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation');
    }
    
    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
    }
    
    // Добавляем aria-label для иконок без текста
    const icons = document.querySelectorAll('.bi:not([aria-label]):not([aria-hidden])');
    icons.forEach(icon => {
        const context = getIconContext(icon);
        if (context) {
            icon.setAttribute('aria-label', context);
        } else {
            icon.setAttribute('aria-hidden', 'true');
        }
    });
}

function getIconContext(icon) {
    // Определяем контекст иконки на основе соседних элементов
    const parent = icon.parentElement;
    const text = parent.textContent.trim();
    
    if (text) {
        return null; // Есть текстовый контекст, скрываем иконку
    }
    
    // Определяем тип иконки по классам
    if (icon.classList.contains('bi-code-slash')) return 'Веб-разработка';
    if (icon.classList.contains('bi-envelope')) return 'Электронная почта';
    if (icon.classList.contains('bi-github')) return 'GitHub профиль';
    if (icon.classList.contains('bi-telephone')) return 'Телефон';
    if (icon.classList.contains('bi-geo-alt')) return 'Местоположение';
    if (icon.classList.contains('bi-clock')) return 'Время доступности';
    
    return null;
}

function enhanceFocusManagement() {
    // Ловим фокус внутри модальных окон (если есть)
    const modals = document.querySelectorAll('[role="dialog"], .modal');
    modals.forEach(modal => {
        if (modal.style.display !== 'none') {
            trapFocus(modal);
        }
    });
    
    // Управление фокусом при открытии/закрытии элементов
    document.addEventListener('keydown', function(event) {
        // Закрытие элементов по Escape
        if (event.key === 'Escape') {
            const expandedElements = document.querySelectorAll('[aria-expanded="true"]');
            expandedElements.forEach(element => {
                element.setAttribute('aria-expanded', 'false');
                // Возвращаем фокус на триггерный элемент если есть
                const trigger = document.querySelector('[aria-controls="' + element.id + '"]');
                if (trigger) {
                    trigger.focus();
                }
            });
        }
    });
}

function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

function enhanceARIA() {
    // Динамически обновляем ARIA атрибуты
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (!form.getAttribute('aria-labelledby') && !form.getAttribute('aria-label')) {
            const legend = form.querySelector('legend');
            const heading = form.querySelector('h1, h2, h3, h4, h5, h6');
            
            if (legend && !legend.id) {
                legend.id = 'legend-' + Math.random().toString(36).substr(2, 9);
            }
            
            if (legend && legend.id) {
                form.setAttribute('aria-labelledby', legend.id);
            } else if (heading && !heading.id) {
                heading.id = 'heading-' + Math.random().toString(36).substr(2, 9);
            }
            
            if (heading && heading.id) {
                form.setAttribute('aria-labelledby', heading.id);
            }
        }
    });
}

function enhanceFormValidation() {
    // Улучшенная валидация форм с ARIA
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Добавляем ARIA атрибуты для обязательных полей
            if (input.hasAttribute('required')) {
                input.setAttribute('aria-required', 'true');
            }
            
            // Обработка изменений для динамического обновления состояний
            input.addEventListener('input', function() {
                updateFieldStatus(this);
            });
            
            input.addEventListener('blur', function() {
                updateFieldStatus(this);
            });
        });
    });
}

function updateFieldStatus(field) {
    const isValid = field.validity.valid;
    const errorElement = document.getElementById(field.id + '-error');
    
    if (isValid) {
        field.setAttribute('aria-invalid', 'false');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    } else {
        field.setAttribute('aria-invalid', 'true');
        if (errorElement) {
            errorElement.style.display = 'block';
        }
    }
}

// Вспомогательная функция для объявления изменений скринридерам
function announceToScreenReader(message, priority = 'polite') {
    // Создаем или находим live region
    let liveRegion = document.getElementById('a11y-live-region');
    
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'a11y-live-region';
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'visually-hidden';
        document.body.appendChild(liveRegion);
    }
    
    // Обновляем сообщение
    liveRegion.textContent = message;
    
    // Очищаем через некоторое время
    setTimeout(() => {
        liveRegion.textContent = '';
    }, 3000);
}

// Экспортируем функции для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAccessibility,
        announceToScreenReader,
        trapFocus
    };
}