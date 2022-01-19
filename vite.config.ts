import checker from 'vite-plugin-checker'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

import * as fs from 'fs'
import * as path from 'path'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relative: string) => path.resolve(appDirectory, relative)
const root = path.resolve(__dirname, resolveApp('src'))

const isProduction = process.env.ENVIRONMENT === 'production'
const isDevelopment = process.env.ENVIRONMENT === 'development'
const isAnalyze = process.env.ENVIRONMENT === 'analyze'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8095,
  },
  publicDir: 'static',
  plugins: [
    vue(),
    checker({
      typescript: true,
      eslint: {
        files: [`${root}/**/*.{js,vue,ts}`],
      },
    }),
    ...(
      isAnalyze
        ? [
          visualizer({
            open: true,
          }),
        ]
        : []
    ),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/_mixins.scss";
          @import "@/styles/_functions.scss";
        `,
      },
    },
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    dedupe: ['vue'],
    alias: {
      '@': `${root}/`,
      '@config': `${root}/config.ts`,
      '@static': `${root}/../static`,
    },
  },
})
