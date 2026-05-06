import type { CodegenConfig } from '@graphql-codegen/cli'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
  overwrite: true,
  documents: ['src/**/*.{graphql,ts,tsx}', '!src/graphql/generated/**'],
  generates: {
    './src/graphql/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        extractAllFieldsToTypes: true,
        flattenGeneratedTypesIncludeFragments: true,
      },
    },
  },
}

export default config
