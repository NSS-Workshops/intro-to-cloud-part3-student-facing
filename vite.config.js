/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

import { normalizePath } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ mode }) => {
  // Load env variables based on mode for server access
  // Using empty string as prefix to load all env vars, including those without VITE_ prefix
  const env = loadEnv(mode, process.cwd(), '');

  // Read config.js to get courseName and doAuth
  let courseName = 'Course Name'; // fallback
  let courseUrl = 'course-name'; // fallback
  let doAuth = false; // fallback
  
  try {
    const configPath = path.resolve(process.cwd(), 'src/config.js');
    const configContent = fs.readFileSync(configPath, 'utf-8');
    
    const courseNameMatch = configContent.match(/courseName:\s*["']([^"']+)["']/);
    if (courseNameMatch) {
      courseName = courseNameMatch[1];
      // Transform courseName to URL-friendly format
      courseUrl = courseName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    const doAuthMatch = configContent.match(/doAuth:\s*(true|false)/);
    if (doAuthMatch) {
      doAuth = doAuthMatch[1] === 'true';
    }
  } catch (error) {
    console.warn('Could not read config.js, using fallback values');
  }

  console.log('OAuth env variables loaded:', {
    lmsDomain: env.VITE_LEARNING_PLATFORM_API ? 'Present' : 'Missing',
  });

  // Determine base path for deployment
  // If BASE_URL is provided (e.g., by GitHub Actions), use it. Otherwise, use courseUrl.
  // This is crucial for PR previews where assets are hosted under a /pr-XX/ path.
  const deployBasePath = env.BASE_URL ? `/${env.BASE_URL}/` : `/${courseUrl}/`;


  // Custom plugin to replace placeholders in HTML
  const htmlReplacementPlugin = {
    name: 'html-replacement',
    transformIndexHtml(html) {
      return html
        .replace(/%COURSE_NAME%/g, courseName)
        .replace(/%COURSE_URL%/g, courseUrl);
    }
  };

  return {
    base: deployBasePath,
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        }
      }),
      htmlReplacementPlugin,
      viteStaticCopy({
        targets: [
          {
            // copy all images from each chapter folder
            // eslint-disable-next-line no-undef
            src: normalizePath(path.resolve(__dirname, 'src/chapters/**/*.{png,jpg,jpeg,svg,gif,webp,avif}')),
            dest: 'assets',
            flatten: false,
            errorOnMissing: false
          }
        ]
      })
    ],
    // Make env variables available to client-side code (only if authentication is enabled)
    ...(doAuth && {
      define: {
        'process.env.VITE_OAUTH_CLIENT_ID': JSON.stringify(env.VITE_OAUTH_CLIENT_ID),
        'process.env.VITE_PROXY_DOMAIN': JSON.stringify(env.VITE_PROXY_DOMAIN),
        'process.env.VITE_LEARNING_PLATFORM_API': JSON.stringify(env.VITE_LEARNING_PLATFORM_API),
      },
    }),
    // Environment Variables:
    // Vite automatically loads env files in the following order:
    // 1. .env                # loaded in all cases
    // 2. .env.local         # loaded in all cases, ignored by git
    // 3. .env.[mode]        # only loaded in specified mode
    // 4. .env.[mode].local  # only loaded in specified mode, ignored by git
    //
    // Only variables prefixed with VITE_ are exposed to your code
    // via import.meta.env.VITE_*
    //
    // Example:
    // VITE_OAUTH_CLIENT_ID in .env.local becomes available as
    // import.meta.env.VITE_OAUTH_CLIENT_ID in your code
  }
})
