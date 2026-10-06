import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

// Hydration-safe "mounted" state and canvas refs are intentional in the theme/Topo code,
// so the React Compiler rules are warnings here. They must be overridden in the config
// object that registers the react-hooks plugin.
const relaxReactHooks = (cfg) =>
  cfg.plugins?.['react-hooks']
    ? {
        ...cfg,
        rules: {
          ...cfg.rules,
          'react-hooks/set-state-in-effect': 'warn',
          'react-hooks/refs': 'warn',
        },
      }
    : cfg

const eslintConfig = [
  ...nextCoreWebVitals.map(relaxReactHooks),
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    ignores: ['.next/', 'src/payload-types.ts', 'src/payload-generated-schema.ts', 'src/app/(payload)/admin/importMap.js'],
  },
]

export default eslintConfig
