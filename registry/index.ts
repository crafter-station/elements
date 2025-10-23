import { type Registry, type RegistryItem } from 'shadcn/registry'
import { blocks } from './blocks'
import { examples } from './examples'

export const registry = {
  name: 'elements',
  homepage: 'https://tryelements.dev',
  items: [
    ...blocks,

    // Internal use only - filtered out from public registry
    ...examples,
  ],
} satisfies Registry

export default registry
