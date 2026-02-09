import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
                                plugins: [react()],
                                resolve: {
                                    alias: {
                                        '@': path.resolve(__dirname, './src'),
                                        '@components': path.resolve(__dirname, './src/components'),
                                        '@features': path.resolve(__dirname, './src/features'),
                                        '@services': path.resolve(__dirname, './src/services'),
                                        '@utils': path.resolve(__dirname, './src/utils'),
                                        '@hooks': path.resolve(__dirname, './src/hooks'),
                                        '@theme': path.resolve(__dirname, './src/theme'),
                                        '@assets': path.resolve(__dirname, './src/assets'),
                                        '@constants': path.resolve(__dirname, './src/constants'),
                                    },
                                },
                                server: {
                                    port: 5173,
                                    proxy: {
                                        '/api': {
                                            target: 'http://localhost:8080',
                                            changeOrigin: true,
                                        },
                                    },
                                },
                            })