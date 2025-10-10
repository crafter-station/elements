# Using ComponentPreviewItem in MDX

## Recommended: ComponentPreviewItem (Individual Use)

`ComponentPreviewItem` is the recommended way to add component previews in MDX. Use it to display **one component at a time** directly under each section heading.

### Basic Usage

In your MDX file (e.g., `content/providers/clerk.mdx`):

```mdx
### Clerk Sign In

A fully-featured sign-in component with support for email and password authentication.

<ComponentPreviewItem
  componentKey="clerk-sign-in"
  installUrl="@elements/clerk-sign-in"
  category="Authentication"
  name="Clerk"
>
  <YourSignInComponent />
</ComponentPreviewItem>

### Clerk Sign Up

User registration component with custom field validation.

<ComponentPreviewItem
  componentKey="clerk-sign-up"
  installUrl="@elements/clerk-sign-up"
  category="Authentication"
  name="Clerk"
>
  <YourSignUpComponent />
</ComponentPreviewItem>
```

### Props

- `componentKey` (required): Identifier for the component (used in analytics and display)
- `children` (required): The React component to preview
- `installUrl` (optional): Installation command URL (e.g., "@elements/clerk-sign-in")
- `category` (optional): Category for analytics (default: "Component")
- `name` (optional): Provider/page name for analytics (default: "Preview")
- `relevantRegistryItems` (optional): Array of registry items to search
- `className` (optional): Additional CSS classes

### With Layout Options

You can pass an object with layout options instead of a direct component:

```mdx
<ComponentPreviewItem
  componentKey="custom-form"
  installUrl="@elements/custom-form"
  category="Forms"
  name="Custom"
>
  {{
    component: <CustomForm />,
    className: "bg-gradient-to-br from-blue-50 to-purple-50",
    installUrl: "@elements/custom-form" // Overrides prop installUrl
  }}
</ComponentPreviewItem>
```

---

## Alternative: ComponentPreview (Bulk Use)

`ComponentPreview` is available if you need to show multiple components together. However, **ComponentPreviewItem is recommended** for better MDX readability.

### Basic Usage

```mdx
### Clerk Sign In

A fully-featured sign-in component with support for email, social auth, and more.

<ComponentPreview
  components={{
    "clerk-sign-in": <YourComponentHere />
  }}
  componentInstallUrls={{
    "clerk-sign-in": "@elements/clerk-sign-in"
  }}
  category="Authentication"
  name="Clerk"
/>
```

## Props

- `components`: Object with component keys and React nodes
- `componentInstallUrls`: Object mapping component keys to install URLs
- `category`: Category name for analytics
- `name`: Provider name for analytics
- `relevantRegistryItems`: (Optional) Array of registry items to match against
- `className`: (Optional) Additional CSS classes

## Features

Each preview includes:
- ✅ Component selection checkbox
- ✅ "Show Tree" button to view file structure
- ✅ "Open in v0" button (if registry item exists)
- ✅ Individual install command
- ✅ Floating dock for bulk install when multiple components selected

## Advanced Usage

### With Layout Options

```mdx
<ComponentPreview
  components={{
    "component-1": {
      component: <Component1 />,
      className: "bg-gradient-to-br from-blue-50 to-purple-50",
      installUrl: "@elements/component-1"
    },
    "component-2": <Component2 />
  }}
  componentInstallUrls={{
    "component-2": "@elements/component-2"
  }}
  category="UI"
  name="Components"
/>
```

### Multiple Components

```mdx
<ComponentPreview
  components={{
    "sign-in": <SignInForm />,
    "sign-up": <SignUpForm />,
    "forgot-password": <ForgotPasswordForm />
  }}
  componentInstallUrls={{
    "sign-in": "@elements/clerk-sign-in",
    "sign-up": "@elements/clerk-sign-up",
    "forgot-password": "@elements/clerk-forgot-password"
  }}
  category="Authentication"
  name="Clerk"
/>
```

## Component Naming

- Component keys will be displayed with spaces replacing hyphens
- Example: `"clerk-sign-in"` → "Clerk Sign In"

## Analytics

The component automatically tracks:
- Component selection/deselection
- Tree viewer toggles
- Package manager changes
- Install command copies
- v0 button clicks

All analytics are sent to Vercel Analytics with relevant context.
