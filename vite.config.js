/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

import { normalizePath } from 'vite'
import { glob } from 'glob'
import { fileURLToPath } from 'url'
import { dirname } from 'path' 
import { viteStaticCopy } from 'vite-plugin-static-copy'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(({ mode }) => {
  // Load env variables based on mode for server access
  // Using empty string as prefix to load all env vars, including those without VITE_ prefix
  // Read config.js to get courseName and doAuth
  const env = loadEnv(mode, process.cwd(), '');

  let courseName = env.VITE_COURSE_NAME || 'Default Name';
  let doAuth = env.VITE_REQUIRES_GITHUB_AUTHENTICATION === 'true';
  let baseUrl = env.BASE_URL || courseName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  // Custom plugin to replace placeholders in HTML
  const htmlReplacementPlugin = {
    name: 'html-replacement',
    transformIndexHtml(html) {
      return html
        .replace(/%COURSE_NAME%/g, courseName)
        .replace(/%COURSE_URL%/g, baseUrl);
    }
  };

  // Check if any image files exist before adding the smart copy plugin
  const imagePattern = path.resolve(__dirname, 'src/sections/**/*.{png,jpg,jpeg,svg,gif,webp,avif,mp3,mp4,pdf,m4a}');
  const imageFiles = glob.sync(normalizePath(imagePattern));
  const hasImages = imageFiles.length > 0;

  const plugins = [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    }),
    htmlReplacementPlugin
  ];

  // Seems like an infinite loop when npm run dev, commented out
  // Only add smart copy plugin if images exist
  if (hasImages) {
    plugins.push(
      viteStaticCopy({
        targets: [
          {
            // copy all images from each chapter folder
            src: normalizePath(imagePattern),
            dest: 'assets',
            flatten: false
          }
        ]
      })
    );
  }

  return {
    base: `/${baseUrl}/`,
    plugins,
    // Make env variables available to client-side code (only if authentication is enabled)
    ...(doAuth && {
      define: {
        'process.env.VITE_OAUTH_CLIENT_ID': JSON.stringify(env.VITE_OAUTH_CLIENT_ID),
        'process.env.VITE_PROXY_DOMAIN': JSON.stringify(env.VITE_PROXY_DOMAIN),
        'process.env.VITE_LEARNING_PLATFORM_API': JSON.stringify(env.VITE_LEARNING_PLATFORM_API),
      },
    }),
  }
})
