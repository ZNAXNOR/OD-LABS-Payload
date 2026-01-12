---
trigger: glob
globs: Describes shared component patterns and UI conventions. Use to align generated components with existing project standards.
---

# Custom Components in Payload CMS

Custom Components allow you to fully customize the Admin Panel by swapping in your own React components. You can replace nearly every part of the interface or add entirely new functionality.

## Component Types

There are four main types of Custom Components:

1. **Root Components** - Affect the Admin Panel globally (logo, nav, header)
2. **Collection Components** - Specific to collection views
3. **Global Components** - Specific to global document views
4. **Field Components** - Custom field UI and cells

## Defining Custom Components

### Component Paths

Components are defined using file paths (not direct imports) to keep the config lightweight and Node.js compatible.

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  admin: {
    components: {
      logout: {
        Button: '/src/components/Logout#MyComponent', // Named export
      },
      Nav: '/src/components/Nav', // Default export
    },
  },
})
```

**Component Path Rules:**

1. Paths are relative to project root (or `config.admin.importMap.baseDir`)
2. For **named exports**: append `#ExportName` or use `exportName` property
3. For **default exports**: no suffix needed
4. File extensions can be omitted

### Component Config Object

Instead of a string path, you can pass a config object:

```typescript
{
  logout: {
    Button: {
      path: '/src/components/Logout',
      exportName: 'MyComponent',
      clientProps: { customProp: 'value' },
      serverProps: { asyncData: someData },
    },
  },
}
```

**Config Properties:**

| Property      | Description                                           |
| ------------- | ----------------------------------------------------- |
| `path`        | File path to component (named exports via `#`)        |
| `exportName`  | Named export (alternative to `#` in path)             |
| `clientProps` | Props for Client Components (must be serializable)    |
| `serverProps` | Props for Server Components (can be non-serializable) |

### Setting Base Directory

```typescript
import path from 'path'
import { fileURLToPath } from 'node:url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, 'src'), // Set base directory
    },
    components: {
      Nav: '/components/Nav', // Now relative to src/
    },
  },
})
```

## Server vs Client Components

**All components are React Server Components by default.**

### Server Components (Default)

Can use Local API directly, perform async operations, and access full Payload instance.

```tsx
import React from 'react'
import type { Payload } from 'payload'

async function MyServerComponent({ payload }: { payload: Payload }) {
  const page = await payload.findByID({
    collection: 'pages',
    id: '123',
  })

  return <p>{page.title}</p>
}

export default MyServerComponent
```

### Client Components

Use the `'use client'` directive for interactivity, hooks, state, etc.

```tsx
'use client'
import React, { useState } from 'react'

export function MyClientComponent() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
}
```

**Important:** Client Components cannot receive non-serializable props (functions, class instances, etc.). Payload automatically strips these when passing to client components.

## Default Props

All Custom Components receive these props by default:

| Prop      | Description                              | Type      |
| --------- | ---------------------------------------- | --------- |
| `payload` | Payload instance (Local API access)      | `Payload` |
| `i18n`    | Internationalization object              | `I18n`    |
| `locale`  | Current locale (if localization enabled) | `string`  |

**Server Component Example:**

```tsx
async function MyComponent({ payload, i18n, locale }) {
  const data = await payload.find({
    collection: 'posts',
    locale,
  })

  return <div>{data.docs.length} posts</div>
}
```

**Client Component Example:**

```tsx
'use client'
import { usePayload, useLocale, useTranslation } from '@payloadcms/ui'

export function MyComponent() {
  // Access via hooks in client components
  const { getLocal, getByID } = usePayload()
  const locale = useLocale()
  const { t, i18n } = useTranslation()

  return <div>{t('myKey')}</div>
}
```

## Custom Props

Pass additional props using `clientProps` or `serverProps`:

```typescript
{
  logout: {
    Button: {
      path: '/components/Logout',
      clientProps: {
        buttonText: 'Sign Out',
        onLogout: () => console.log('Logged out'),
      },
    },
  },
}
```

Receive in component:

```tsx
'use client'
export function Logout({ buttonText, onLogout }) {
  return <button onClick={onLogout}>{buttonText}</button>
}
```

## Root Components

Root Components affect the entire Admin Panel.

### Available Root Components

| Component         | Description                      | Config Path                        |
| ----------------- | -------------------------------- | ---------------------------------- |
| `Nav`             | Entire navigation sidebar        | `admin.components.Nav`             |
| `graphics.Icon`   | Small icon (used in nav)         | `admin.components.graphics.Icon`   |
| `graphics.Logo`   | Full logo (used on login)        | `admin.components.graphics.Logo`   |
| `logout.Button`   | Logout button                    | `admin.components.logout.Button`   |
| `actions`         | Header actions (array)           | `admin.components.actions`         |
| `header`          | Above header (array)             | `admin.components.header`          |
| `beforeDashboard` | Before dashboard content (array) | `admin.components.beforeDashboard` |
| `afterDashboard`  | After dashboard content (array)  | `admin.components.afterDashboard`  |
| `beforeLogin`     | Before login form (array)        | `admin.components.beforeLogin`     |
| `afterLogin`      | After login form (array)         | `admin.components.afterLogin`      |
| `beforeNavLinks`  | Before nav links (array)         | `admin.components.beforeNavLinks`  |
| `afterNavLinks`   | After nav links (array)          | `admin.components.afterNavLinks`   |
| `settingsMenu`    | Settings menu items (array)      | `admin.components.settingsMenu`    |
| `providers`       | Custom React Context providers   | `admin.components.providers`       |
| `views`           | Custom views (dashboard, etc.)   | `admin.components.views`           |

### Example: Custom Logo

```typescript
export default buildConfig({
  admin: {
    components: {
      graphics: {
        Logo: '/components/Logo',
        Icon: '/components/Icon',
      },
    },
  },
})
```

```tsx
// components/Logo.tsx
export default function Logo() {
  return <img src="/logo.png" alt="My Brand" width={200} />
}
```

### Example: Header Actions

```typescript
export default buildConfig({
  admin: {
    components: {
      actions: ['/components/ClearCacheButton', '/components/PreviewButton'],
    },
  },
})
```

```tsx
// components/ClearCacheButton.tsx
'use client'
export default function ClearCacheButton() {
  return (
    <button
      onClick={async () => {
        await fetch('/api/clear-cache', { method: 'POST' })
        alert('Cache cleared!')
      }}
    >
      Clear Cache
    </button>
  )
}
```

## Collection Components

Collection Components are specific to a collection's views.

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    components: {
      // Edit view components
      edit: {
        PreviewButton: '/components/PostPreview',
        SaveButton: '/components/CustomSave',
        SaveDraftButton: '/components/CustomSaveDraft',
        PublishButton: '/components/CustomPublish',
      },

      // List view components
      list: {
        Header: '/components/PostsListHeader',
        beforeList: ['/components/ListFilters'],
        afterList: ['/components/ListFooter'],
      },
    },
  },
  fields: [
    // ...
  ],
}
```

## Global Components

Similar to Collection Components but for Global documents.

```typescript
import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  admin: {
    components: {
      edit: {
        PreviewButton: '/components/SettingsPreview',
        SaveButton: '/components/SettingsSave',
      },
    },
  },
  fields: [
    // ...
  ],
}
```