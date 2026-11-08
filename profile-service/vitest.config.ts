// profile-service/vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./test/setup.ts'],
        include: ['test/**/*.test.ts'],
        deps: {
            inline: ['class-validator', 'class-transformer', 'supertest']
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    esbuild: {
        target: 'es2020'
    }
});