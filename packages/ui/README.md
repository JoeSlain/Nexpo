# UI Package

A reusable UI component library built on top of Tamagui for cross-platform (React Native & Next.js) applications.

## Usage

Import components from the `ui` package:

```tsx
import { Button, Card, Text } from 'ui'

function MyComponent() {
  return (
    <Card>
      <Text>Hello World</Text>
      <Button>Click Me</Button>
    </Card>
  )
}
```

## Components

### Button

A cross-platform button component based on Tamagui.

```tsx
import { Button } from 'ui'

<Button>Click me</Button>
<Button variant="outlined">Outlined</Button>
<Button size="large">Large</Button>
```

### Card

A cross-platform card container component.

```tsx
import { Card } from 'ui'

<Card>
  <Text>Card content</Text>
</Card>
```

### Text

A cross-platform text component.

```tsx
import { Text } from 'ui'

<Text>Hello World</Text>
<Text size="large">Large text</Text>
```

## Adding New Components

1. Create a new component file in `src/components/`
2. Export it from `src/components/index.ts`
3. It will be automatically available from the main `ui` package export

Example:

```tsx
// src/components/Input.tsx
import { Input as TamaguiInput, InputProps } from 'tamagui'

export type { InputProps }

export function Input(props: InputProps) {
  return <TamaguiInput {...props} />
}
```

Then add to `src/components/index.ts`:

```tsx
export { Input } from './Input'
export type { InputProps } from './Input'
```

