# /figma-layout

Convert Figma designs to pixel-perfect Next.js components with TypeScript and Tailwind CSS.

## Usage

```
/figma-layout [figma-url or node-id] [component-name] [--shadcn]
```

## Examples

```
/figma-layout https://figma.com/design/abc123/MyDesign?node-id=1-2 LoginScreen
/figma-layout 123:456 HeroSection --shadcn
/figma-layout Dashboard --shadcn  # Uses shadcn/ui components where applicable
/figma-layout  # Uses currently selected node in Figma
```

## Flags

- `--shadcn` - Use shadcn/ui components and popular React libraries for better functionality while maintaining 99% visual accuracy

## What This Command Does

1. **Extracts Design Data (Code-First Approach)**
   - Analyzes structure with `get_metadata` to understand layers
   - Extracts implementation with `get_code` (primary data source)
   - Gets design tokens via `get_variable_defs`
   - Downloads assets to `/public/images/` (NOT `/app/public/`)
   - ⚠️ Avoids large screenshots (>5MB limit in Claude Code)

2. **Intelligent Component Detection (with --shadcn flag)**
   - Analyzes components and maps to appropriate libraries:
     - Buttons, Inputs, Selects → shadcn/ui components
     - Charts (donut, bar, line) → Recharts
     - Complex forms → React Hook Form + Zod
     - Data tables with sorting/filtering → TanStack Table
     - Animations and transitions → Framer Motion
   - Falls back to custom implementation when no suitable library exists

3. **Creates Next.js App Router Components**
   - Generates Server Components by default (Client Components only when needed)
   - Uses TypeScript interfaces for type safety
   - Implements with Tailwind CSS utilities or library components
   - Ensures 98%+ visual accuracy with exact Figma values
   - Creates custom variants for shadcn components to match Figma exactly

4. **Delivers Production-Ready Code**
   - Follows Next.js 15 App Router best practices
   - Uses next/link for navigation, next/image for optimization
   - Mobile-first responsive design
   - ARIA attributes for accessibility
   - Proper file structure in `/app/components/`
   - Installs necessary dependencies automatically

## Output

The command will create:
- React component file(s) in `/app/components/`
- All necessary sub-components
- Type definitions
- Tailwind custom configurations if needed
- Google Fonts setup in `app/layout.tsx` matching Figma design

## Requirements

- Figma desktop app must be running with the design open
- Next.js project with TypeScript and Tailwind CSS configured
- MCP Figma server connected

## Important Limitations

⚠️ **Screenshot Size**: Claude Code cannot process images >5MB
- The command uses `get_code` and `get_metadata` as primary data sources
- Large designs are broken down into smaller components automatically
- Screenshots are only used for small reference elements

## Supported Libraries (with --shadcn)

- **shadcn/ui** - Base UI components (buttons, inputs, tables, etc.)
- **Recharts** - Data visualization and charts
- **React Hook Form + Zod** - Form management and validation
- **TanStack Table** - Advanced data tables
- **Framer Motion** - Animations and transitions
- **Lucide React** - Icon library (included with shadcn)
- **date-fns** - Date formatting utilities

## Agent Implementation

```typescript
async function handleFigmaLayout(args: string) {
  const parts = args.split(' ');
  const useShadcn = parts.includes('--shadcn');
  const cleanParts = parts.filter(p => p !== '--shadcn');
  const [figmaRef, componentName] = cleanParts;
  const nodeId = extractNodeId(figmaRef); // Extract node ID from URL if provided

  // Launch the specialized Figma to Next.js agent
  return {
    agent: 'figma-to-nextjs',
    task: {
      description: 'Convert Figma to Next.js',
      prompt: `
        Convert the Figma design to a pixel-perfect Next.js App Router component.

        Figma Reference: ${nodeId || figmaRef || 'current selection'}
        Component Name: ${componentName || 'Component'}
        Asset Directory: /public/images/${componentName?.toLowerCase() || 'assets'}/
        Use Modern Libraries: ${useShadcn ? 'YES (shadcn/ui, Recharts, React Hook Form, TanStack Table, Framer Motion)' : 'NO'}

        Requirements:
        1. Extract design data using Figma MCP tools (CODE-FIRST STRATEGY):
           - FIRST: Use mcp__figma-dev-mode-mcp-server__get_metadata to map structure
           - SECOND: Use mcp__figma-dev-mode-mcp-server__get_code for UI implementation
           - THIRD: Use mcp__figma-dev-mode-mcp-server__get_variable_defs for design tokens
           - FONTS: Analyze font families in get_variable_defs output (e.g., "Inter", "Roboto")
           - ASSETS: Set dirForAssetWrites to absolute path /Users/.../public/images/[name]
           - AVOID: mcp__figma-dev-mode-mcp-server__get_screenshot (only for small elements <500px)
           - For large designs: Navigate to child layers and process incrementally

        2. Component Analysis & Library Selection:
           ${useShadcn ? `
           IMPORTANT: Analyze each component and use appropriate libraries:

           a) Component Detection & Mapping:
              - Buttons with hover/click → shadcn/ui Button with custom variants
              - Text/password inputs → shadcn/ui Input with exact Figma styling
              - Dropdowns/selects → shadcn/ui Select
              - Tables with headers/rows → shadcn/ui Table or TanStack Table for complex cases
              - Badges/pills → shadcn/ui Badge
              - Checkboxes → shadcn/ui Checkbox
              - Radio buttons → shadcn/ui RadioGroup
              - Tabs → shadcn/ui Tabs
              - Dialogs/modals → shadcn/ui Dialog
              - Charts (pie/donut/bar/line) → Recharts with exact Figma colors
              - Forms with validation → React Hook Form + Zod schema
              - Animations/transitions → Framer Motion
              - Icons → Lucide React (find closest match)

           b) Custom Variants for Exact Figma Match:
              - Create custom CVA variants for shadcn components
              - Use exact colors from Figma (e.g., bg-[#3347be] not bg-primary)
              - Preserve exact sizes (e.g., h-[44px] not h-11)
              - Maintain exact border radius, shadows, spacing

           c) Library Documentation:
              - Use mcp__context7__resolve-library-id and mcp__context7__get-library-docs
              - Fetch docs for: shadcn/ui, recharts, react-hook-form, @tanstack/react-table, framer-motion
              - Follow library best practices from documentation

           d) Installation Commands:
              - Generate npx shadcn@latest add [component] commands
              - List npm install commands for other libraries
              - Update imports and dependencies
           ` : ''}

           - Setup Google Fonts & Create Next.js component
           - Import required Google Fonts in app/layout.tsx using next/font/google
           - Configure font weights from Figma (e.g., 400, 500, 600, 700)
           - Apply font className to HTML or specific components
           - Default to Server Component (no 'use client')
           - Add 'use client' only if useState/useEffect/onClick needed
           - Use TypeScript interfaces for props
           - Follow Next.js naming conventions

        3. Implement with exact Figma values:
           ${useShadcn ? `
           When using libraries:
           - Override default library styles with Figma-exact values
           - Create figma-theme.css with CSS variables from design tokens
           - Extend tailwind.config.ts with exact Figma values
           - For shadcn components, use className to override defaults
           - For Recharts, use exact colors and sizes from Figma
           - Preserve visual hierarchy and spacing exactly
           ` : ''}
           - Use Tailwind utilities for styling
           - Add custom values to tailwind.config.ts if needed
           - Preserve exact spacing, colors, typography
           - Maintain all visual effects (shadows, gradients, etc.)
           - ICONS: Check actual display size in design (not SVG viewBox)
           - SVG COLORS: Replace dynamic fills like var(--fill-0) with actual colors from design

        4. Ensure production quality:
           - Use next/link for links, next/image for images
           - Add ARIA labels for accessibility
           - Implement responsive design (mobile-first)
           - Extract reusable sub-components

        Save the component to: /app/components/${componentName || 'Component'}.tsx
        Save any sub-components to: /app/components/${componentName || 'Component'}/
        ${useShadcn ? `Save shadcn components to: /components/ui/
        Create /lib/utils.ts if it doesn't exist with cn() helper` : ''}

        FONTS SETUP:
        - Check font families from get_variable_defs (e.g., "Inter: Semi Bold, size: 28, weight: 600")
        - Import needed Google Fonts in app/layout.tsx: import { Inter } from 'next/font/google'
        - Configure with all used weights: Inter({ weight: ['400', '500', '600', '700'], subsets: ['latin'] })
        - Apply font variable to body className: ${inter.variable}
      `
    }
  };
}

function extractNodeId(url?: string): string | undefined {
  if (!url) return undefined;
  const match = url.match(/node-id=([0-9-:]+)/);
  return match ? match[1].replace('-', ':') : undefined;
}

// Component mapping for --shadcn flag
const componentMapping = {
  'button': { shadcn: 'button', install: 'npx shadcn@latest add button' },
  'input': { shadcn: 'input', install: 'npx shadcn@latest add input' },
  'select': { shadcn: 'select', install: 'npx shadcn@latest add select' },
  'table': { shadcn: 'table', install: 'npx shadcn@latest add table',
             advanced: '@tanstack/react-table' },
  'badge': { shadcn: 'badge', install: 'npx shadcn@latest add badge' },
  'checkbox': { shadcn: 'checkbox', install: 'npx shadcn@latest add checkbox' },
  'tabs': { shadcn: 'tabs', install: 'npx shadcn@latest add tabs' },
  'form': { libraries: ['react-hook-form', 'zod'],
            install: 'npm install react-hook-form zod' },
  'chart': { library: 'recharts', install: 'npm install recharts' },
  'animation': { library: 'framer-motion', install: 'npm install framer-motion' }
};
```