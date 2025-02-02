import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from "vite-plugin-dts";
import solid from 'vite-plugin-solid';


export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.tsx'),
            formats: ['es'],
        },
        target: 'node20',
        rollupOptions: {
            external: [
                'solid-js',
                'solid-styled-components',
                'rete',
                'rete-render-utils',
                'rete-area-plugin'
            ], // Add any external dependencies here
        },
    },
    plugins: [
        solid(),
        dts()
    ]
})
