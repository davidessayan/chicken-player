import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/js/index.js'),
            name: 'ChickenPlayer',
            fileName: (format) => `chicken-player.${format}.js`,
            formats: ['es', 'umd'],
        },
        rollupOptions: {
            output: {
                // Génère un seul CSS, si tu utilises du SCSS ou CSS dans ton JS
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name == 'style.css') return 'chicken-player.css';
                    return assetInfo.name;
                },
            },
            // Optionnel : externaliser les libs si tu veux
            external: [],
        }
    }
});
