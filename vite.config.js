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
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name == 'style.css') return 'chicken-player.css';
                    return assetInfo.name;
                },
            },
            external: [],
        }
    },
    publicDir: 'src/assets'
});
