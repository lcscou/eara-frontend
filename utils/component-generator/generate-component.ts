#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const input = process.argv[2]
if (!input) {
  console.error('Erro: informe o nome do componente.')
  process.exit(1)
}

const parts = input.split('/')
const componentName = parts.pop()!
const subPath = parts.join('/')

const rootDir = process.cwd()
const componentsDir = path.join(rootDir, 'src', 'components', subPath, componentName)
const templatePath = path.join(__dirname, '__template_component.tsx')
const componentFile = path.join(componentsDir, `${componentName}.tsx`)
const cssFile = path.join(componentsDir, `${componentName}.module.css`)
const typesFile = path.join(rootDir, 'src', 'lib', 'types.ts')

if (fs.existsSync(componentsDir)) {
  console.error('O componente já existe.')
  process.exit(1)
}

fs.mkdirSync(componentsDir, { recursive: true })

let template = fs.readFileSync(templatePath, 'utf8')
template = template.replace(/COMPONENT/g, componentName)

const cssImport = `import styles from './${componentName}.module.css'\n`
const typeImport = `import { ${componentName}Props } from '@/lib/types'\n\n`
template = cssImport + typeImport + template
template = template.replace(
  `function ${componentName}()`,
  `function ${componentName}({ id }: ${componentName}Props)`
)

fs.writeFileSync(componentFile, template)
fs.writeFileSync(cssFile, '')

fs.mkdirSync(path.dirname(typesFile), { recursive: true })
if (!fs.existsSync(typesFile)) fs.writeFileSync(typesFile, '')

let typesContent = fs.readFileSync(typesFile, 'utf8')
if (!typesContent.includes(`interface ${componentName}Props`)) {
  if (typesContent.trim() !== '') typesContent += '\n\n'
  typesContent += `export interface ${componentName}Props {\n  id: string\n}`
  fs.writeFileSync(typesFile, typesContent)
}

console.log(`✅ Componente ${componentName} criado em src/components/${subPath ? subPath + '/' : ''}${componentName}`)
console.log(`✅ Interface ${componentName}Props adicionada em src/lib/types.ts`)
