import { defineConfig } from 'vite';
import { resolve, extname } from 'node:path';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import autoprefixer from 'autoprefixer';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fileInclude from 'vite-file-include';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const srcDir = resolve(__dirname, 'src');

const htmlInputs = Object.fromEntries(
    readdirSync(srcDir)
        .filter((file) => file.endsWith('.html'))
        .map((file) => [file.replace(extname(file), ''), resolve(srcDir, file)]),
);

export default defineConfig({
    root: srcDir,
    publicDir: resolve(__dirname, 'public'),
    base: './',
    plugins: [
        fileInclude({
            baseDir: srcDir,
            context: {
                siteName: 'Arena',
            },
            customFunctions: {
                currentYear: () => new Date().getFullYear(),
            },
        }),
        viteStaticCopy({
            targets: [
                {
                    src: 'images/**/*',
                    dest: 'images',
                },
            ],
        }),
    ],
    css: {
        postcss: {
            plugins: [
                autoprefixer({
                    overrideBrowserslist: ['last 3 versions', 'not dead', 'not ie <= 11'],
                    grid: true,
                }),
            ],
        },
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
        devSourcemap: true,
    },
    server: {
        port: 3000,
        open: '/index.html',
    },
    preview: {
        port: 3000,
    },
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        assetsDir: 'assets',
        cssMinify: true,
        sourcemap: false,
        rollupOptions: {
            input: htmlInputs,
            output: {
                entryFileNames: 'assets/js/[name]-[hash].js',
                chunkFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: ({ name }) => {
                    if (!name) {
                        return 'assets/[name]-[hash][extname]';
                    }

                    if (/\.css$/i.test(name)) {
                        return 'assets/css/[name]-[hash][extname]';
                    }

                    if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) {
                        return 'assets/fonts/[name]-[hash][extname]';
                    }

                    if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(name)) {
                        return 'assets/images/[name]-[hash][extname]';
                    }

                    return 'assets/[name]-[hash][extname]';
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': srcDir,
            '@img': resolve(srcDir, 'images'),
        },
    },
});
