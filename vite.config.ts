import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import reactNativeWeb from "vite-plugin-react-native-web";
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      // Add these new aliases
      'react-native-reanimated': 'react-native-reanimated/lib/module/web',
      'react-native/Libraries/Renderer/shims/ReactFabric': 'react-native-web/dist/vendor/react-native/Renderer/shims/ReactFabric',
      'react-native/Libraries/Renderer/shims/ReactNative': 'react-native-web/dist/vendor/react-native/Renderer/shims/ReactNative',
      'react-native/Libraries/ReactNative/ReactFabricPublicInstance/ReactFabricPublicInstance': 'react-native-web/dist/vendor/react-native/ReactFabricPublicInstance/ReactFabricPublicInstance',
    },
  },
  define: {
    'process.env': process.env,
  },
  optimizeDeps: {
    include: ['react-native-web'],
    esbuildOptions: {
      resolveExtensions: ['.web.js', '.js', '.ts', '.jsx', '.tsx'],
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});