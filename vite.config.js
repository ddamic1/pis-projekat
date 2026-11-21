import { defineConfig } from 'vite';

const target = process.env.GEOSERVER_URL ?? 'http://localhost:8080';
const proxy = { '/geoserver': { target, changeOrigin: true } };

export default defineConfig({ base: './', server: { proxy }, preview: { proxy } });
