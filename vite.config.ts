import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import alias from '@rollup/plugin-alias';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
	plugins: [
		react(),
		alias({
			entries: [
				{
					find: '@',
					replacement: fileURLToPath(new URL('./src', import.meta.url)),
				},
			],
		}),
	],
});
