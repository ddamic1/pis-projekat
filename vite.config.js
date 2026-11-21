import { defineConfig } from 'vite';

const proxy = { '/geoserver': { target: 'http://localhost:8080', changeOrigin: true } };

export default defineConfig({ base: './', server: { proxy }, preview: { proxy } });
