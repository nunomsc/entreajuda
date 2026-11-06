<?php

defined('ABSPATH') || exit;

/* Carregar os estilos e o comportamento do tema filho. */
add_action('wp_enqueue_scripts', function () {
    $dir = get_stylesheet_directory();
    $uri = get_stylesheet_directory_uri();

    wp_enqueue_style(
        'parent-style',
        get_template_directory_uri() . '/style.css'
    );

    wp_enqueue_style(
        'entreajuda-child',
        $uri . '/style.css',
        ['parent-style'],
        filemtime($dir . '/style.css')
    );

    wp_enqueue_script(
        'entreajuda-theme',
        $uri . '/theme-toggle.js',
        [],
        filemtime($dir . '/theme-toggle.js'),
        true
    );
}, 100);

/* Aplicar a preferência antes de desenhar a página. */
add_action('wp_head', function () {
    ?>
    <script>
    (() => {
        let theme = 'light';

        try {
            theme = localStorage.getItem('entreajuda-theme') === 'dark'
                ? 'dark'
                : 'light';
        } catch {}

        document.documentElement.dataset.ejTheme = theme;
    })();
    </script>
    <?php
}, 0);

/* Botão disponível nas páginas públicas. */
add_action('wp_footer', function () {
    ?>
    <button
        id="ej-theme-toggle"
        class="ej-theme-toggle"
        type="button"
        aria-label="Ativar modo escuro"
        aria-pressed="false"
        hidden
    >
        Modo escuro
    </button>
    <?php
});