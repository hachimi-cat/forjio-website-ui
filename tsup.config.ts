import { defineConfig } from 'tsup';

// Bundleless emit (one .js per source .tsx) keeps `"use client"`
// directives intact on the files that need them — critical for Next
// App Router consumers, which use the directive to mark the module
// boundary between Server and Client components. A bundled output
// would strip the directive AND mash client + server modules together.
//
// Externals: every peer + the next/font/local helper.
export default defineConfig({
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  bundle: false,
  splitting: false,
  treeshake: false,
  target: 'es2022',
  outDir: 'dist',
  // Use React 17+ automatic JSX runtime so consumers don't need to
  // import React in every file AND the bundleless output stays small
  // (no React.createElement boilerplate).
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  external: [
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'react',
    'react-dom',
    'next',
    'next/link',
    'next/navigation',
    'next/font/local',
    'lucide-react',
  ],
});
