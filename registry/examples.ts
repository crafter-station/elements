import type { RegistryItem } from 'shadcn/registry'

// Demo components for documentation previews
// These are filtered out from the public registry and used only for ComponentPreview
export const examples: RegistryItem[] = [
  // Clerk Components
  {
    name: 'clerk-sign-in-shadcn-demo',
    type: 'registry:example',
    registryDependencies: ['clerk-sign-in-shadcn'],
    files: [{ path: 'registry/default/examples/clerk-sign-in-shadcn-demo.tsx', type: 'registry:example' }],
  },
  {
    name: 'clerk-sign-up-shadcn-demo',
    type: 'registry:example',
    registryDependencies: ['clerk-sign-up-shadcn'],
    files: [{ path: 'registry/default/examples/clerk-sign-up-shadcn-demo.tsx', type: 'registry:example' }],
  },
  {
    name: 'clerk-sign-in-signals-demo',
    type: 'registry:example',
    registryDependencies: ['clerk-sign-in-signals'],
    files: [{ path: 'registry/default/examples/clerk-sign-in-signals-demo.tsx', type: 'registry:example' }],
  },
  {
    name: 'clerk-sign-up-signals-demo',
    type: 'registry:example',
    registryDependencies: ['clerk-sign-up-signals'],
    files: [{ path: 'registry/default/examples/clerk-sign-up-signals-demo.tsx', type: 'registry:example' }],
  },
  {
    name: 'clerk-waitlist-shadcn-demo',
    type: 'registry:example',
    registryDependencies: ['clerk-waitlist-shadcn'],
    files: [{ path: 'registry/default/examples/clerk-waitlist-shadcn-demo.tsx', type: 'registry:example' }],
  },
  // Theme Components
  {
    name: 'theme-switcher-demo',
    type: 'registry:example',
    registryDependencies: ['theme-switcher'],
    files: [{ path: 'registry/default/examples/theme-switcher-demo.tsx', type: 'registry:example' }],
  },
  {
    name: 'theme-switcher-button-demo',
    type: 'registry:example',
    registryDependencies: ['theme-switcher-button'],
    files: [{ path: 'registry/default/examples/theme-switcher-button-demo.tsx', type: 'registry:example' }],
  },
  {
    name: 'theme-switcher-dropdown-demo',
    type: 'registry:example',
    registryDependencies: ['theme-switcher-dropdown'],
    files: [{ path: 'registry/default/examples/theme-switcher-dropdown-demo.tsx', type: 'registry:example' }],
  },
  {
    name: 'theme-switcher-multi-button-demo',
    type: 'registry:example',
    registryDependencies: ['theme-switcher-multi-button'],
    files: [{ path: 'registry/default/examples/theme-switcher-multi-button-demo.tsx', type: 'registry:example' }],
  },
  {
    name: 'theme-switcher-switch-demo',
    type: 'registry:example',
    registryDependencies: ['theme-switcher-switch'],
    files: [{ path: 'registry/default/examples/theme-switcher-switch-demo.tsx', type: 'registry:example' }],
  },
  {
    name: 'theme-switcher-toggle-demo',
    type: 'registry:example',
    registryDependencies: ['theme-switcher-toggle'],
    files: [{ path: 'registry/default/examples/theme-switcher-toggle-demo.tsx', type: 'registry:example' }],
  },
  // Tinte Editor
  {
    name: 'tinte-editor-demo',
    type: 'registry:example',
    registryDependencies: ['tinte-editor'],
    files: [{ path: 'registry/default/examples/tinte-editor-demo.tsx', type: 'registry:example' }],
  },
  // Polar Sponsorship
  {
    name: 'polar-sponsorship-demo',
    type: 'registry:example',
    registryDependencies: ['polar-sponsorship'],
    files: [{ path: 'registry/default/examples/polar-sponsorship-demo.tsx', type: 'registry:example' }],
  },
  // UploadThing
  {
    name: 'uploadthing-button-demo',
    type: 'registry:example',
    registryDependencies: ['uploadthing-button'],
    files: [{ path: 'registry/default/examples/uploadthing-button-demo.tsx', type: 'registry:example' }],
  },
  {
    name: 'uploadthing-dropzone-demo',
    type: 'registry:example',
    registryDependencies: ['uploadthing-dropzone'],
    files: [{ path: 'registry/default/examples/uploadthing-dropzone-demo.tsx', type: 'registry:example' }],
  },
]
