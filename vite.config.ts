import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { qrcode } from 'vite-plugin-qrcode';

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
  plugins: [react({}), qrcode()], 
  server: {
    port: parseInt(env.VITE_PORT),
    host: '0.0.0.0',
  }
});
}
