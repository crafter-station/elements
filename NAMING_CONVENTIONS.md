# Naming Conventions for Elements Registry

## Registry Item Naming Standards

### Structure
```
{service/category}-{component}-{variant}
```

### Rules
1. **Use hyphens** (`-`) not underscores (`_`) or camelCase
2. **Lowercase only** 
3. **Consistent order:** service → component → variant
4. **Be specific** but not verbose

### Examples

#### ✅ Good Names
```json
// Service-based components
"clerk-sign-in"           // Native Clerk component
"clerk-sign-in-custom"    // Custom ShadCN version
"auth0-sign-up"
"firebase-auth"

// Category-based components  
"theme-switcher-button"
"theme-switcher-dropdown"
"theme-switcher-toggle"

// Logo components
"apple-logo"
"github-logo"
"openai-logo"

// Component suites
"clerk-auth-suite"
"logos-collection"
"polar-sponsorship-suite"
```

#### ❌ Bad Names
```json
"clerkSignIn"           // camelCase
"clerk_sign_in"         // underscores
"sign-in-clerk"         // wrong order
"clerk-sign-in-shadcn"  // unclear variant name
"SignInComponent"       // PascalCase
```

### Variant Naming Guidelines

| Variant | Use Case | Example |
|---------|----------|---------|
| `-custom` | ShadCN/custom components | `clerk-sign-in-custom` |
| `-native` | Platform native components | `clerk-sign-in-native` |
| `-basic` | Simple/minimal versions | `theme-switcher-basic` |
| `-advanced` | Feature-rich versions | `dashboard-advanced` |
| `-suite` | Component collections | `auth-suite` |
| `-collection` | Related item bundles | `logos-collection` |

### Component Key Mapping

Your component keys should match registry names when possible:

```typescript
// ✅ Preferred: Exact match
const components = {
  "clerk-sign-in": <ClerkSignIn />,
  "clerk-sign-in-custom": <ClerkSignInCustom />,
}

// ✅ Acceptable: Service prefix in registry only
const components = {
  "sign-in": <ClerkSignIn />, // matches "clerk-sign-in" in registry
  "sign-in-custom": <ClerkSignInCustom />, // matches "clerk-sign-in-custom"
}
```

### Matching Logic

The system uses flexible matching:
1. **Exact match** (highest priority)
2. **Suffix match** (`"sign-in"` matches `"clerk-sign-in"`)
3. **Prefix match** (`"clerk-sign-in"` matches `"sign-in"`)
4. **Common parts** (at least 2 matching parts)

This allows for flexibility while maintaining consistency.

## Benefits

- **Predictable:** Easy to guess component names
- **Scalable:** Works with any number of services/categories
- **Flexible:** Matching logic handles minor inconsistencies
- **Organized:** Groups related components together
- **Future-proof:** Easy to add new variants and services