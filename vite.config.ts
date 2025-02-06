import type { UserConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import { dependencies } from './package.json'
import { useThree } from './src/Core/Resolver'

export default defineConfig(async ({ mode }) => {
  const config: UserConfig = {
    plugins: [
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: true,
        resolvers: [useThree()],
      }),
    ],
    resolve: {
      alias: {
        '@Core': fileURLToPath(new URL('./src/Core', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
  if (mode === 'development') {
    config.server = {
      port: 3000,
    }
  }
  else {
    config.optimizeDeps = {
      exclude: ['three'],
    }
    config.esbuild = {
      pure: ['console.log'],
      drop: ['debugger'],
    }
    config.build = {
      rollupOptions: {
        external: ['three'],
        output: {
          manualChunks(id) {
            if (id.includes('node_modules') && id.endsWith('.ts')) {
              return 'app'
            }
          },
        },
      },
    }
    config.plugins?.push({
      name: 'async add three',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          const titleIndex = html.indexOf('</title>')
          if (titleIndex === -1) {
            console.warn('页面中没有<title>标签')
            return html
          }
          const version = dependencies.three.replace('^', '')
          const three = `
          <script type="importmap">
            {
              "imports": {
                "three": "https://unpkg.com/three@${version}/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@${version}//examples/jsm/"
              }
            }
          </script>
          `
          return html.slice(0, titleIndex) + three + html.slice(titleIndex)
        },
      },
    })
  }
  return {
    ...config,
  }
})
