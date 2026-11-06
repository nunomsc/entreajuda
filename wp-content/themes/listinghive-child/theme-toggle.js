(() => {
    const root = document.documentElement;
    const button = document.getElementById('ej-theme-toggle');

    if (!button) return;

    function applyTheme(theme) {
        const dark = theme === 'dark';

        root.dataset.ejTheme = dark ? 'dark' : 'light';

        button.textContent = dark ? 'Modo claro' : 'Modo escuro';
        button.setAttribute('aria-pressed', String(dark));
        button.setAttribute(
            'aria-label',
            dark ? 'Ativar modo claro' : 'Ativar modo escuro'
        );
    }

    applyTheme(root.dataset.ejTheme);
    button.hidden = false;

    button.addEventListener('click', () => {
        const theme = root.dataset.ejTheme === 'dark' ? 'light' : 'dark';

        applyTheme(theme);

        try {
            localStorage.setItem('entreajuda-theme', theme);
        } catch {
            // O botão continua a funcionar sem armazenamento.
        }
    });
})();