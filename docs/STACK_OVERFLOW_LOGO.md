# Stack Overflow logo

Install the component with `npx shadcn add @elements/stack-overflow-logo`.
The logo is listed automatically on `/docs/logos` from its registry metadata.

```tsx
import { StackOverflowLogo } from "@/components/logos/stack-overflow";

<StackOverflowLogo className="size-8" />
<StackOverflowLogo variant="wordmark" className="h-8 w-auto" />
<StackOverflowLogo variant="logo" className="h-8 w-auto" />
```

`variant` accepts `icon` (default), `wordmark`, and `logo` (symbol and wordmark).
`className` controls sizing and color. The artwork uses `currentColor`, so it
inherits the surrounding text color in light and dark themes.

The paths come from the current official Stack Overflow brand site's SVG
[logo](https://stackoverflow.design/brand/logo/), with the symbol and lettering
separated at their existing path boundary. No paths were redrawn. Keep the
original proportions and follow the official usage and clear-space guidelines.
Use the artwork to identify Stack Overflow and follow its official
[trademark guidance](https://policies.stackoverflow.co/company/trademark-guidance),
including avoiding any suggestion of endorsement.

For local registry verification, serve `public/r` and point the disposable app's
`components.json` registry at `http://localhost:18765/{name}.json`:

```json
{
  "registries": {
    "@elements": "http://localhost:18765/{name}.json"
  }
}
```

Then run the same install command in that app. This verifies the unpublished
entry without depending on a deployment to tryelements.dev.
