import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    root: 'frontend/src', // add this line!
    plugins: [
        laravel({
            input: ['styles/index.css', 'main.tsx'], // paths relative to root
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
