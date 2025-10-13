// Простой переключатель темы
document.addEventListener('DOMContentLoaded', function() {
    const themeCheckbox = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    
    // Восстанавливаем сохраненную тему
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            themeCheckbox.checked = true;
        }
    }
    
    // Обработчик изменения темы
    themeCheckbox.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
});