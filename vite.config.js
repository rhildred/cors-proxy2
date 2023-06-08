import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: "./dist",
    lib: {
      name: "cors-proxy2",
      entry: [
        path.resolve(__dirname, 'src/lib/index.js')
      ],
      fileName: (format, entryName) => {
        return `js/${entryName}.${format}.js`;
      },
    }  
  }
})