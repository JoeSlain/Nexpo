import { render } from '@testing-library/react'
import { createTamagui } from '@tamagui/core'
import { TamaguiProvider } from 'tamagui'
import { describe, expect, it } from 'vitest'
import { ExampleButton } from '../ExampleButton'

// Create a minimal Tamagui config for testing
const config = createTamagui({
  themes: {
    light: {
      background: '#fff',
      color: '#000',
    },
  },
  tokens: {
    color: {},
    space: {},
    size: {},
    radius: {},
    zIndex: {},
  },
})

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <TamaguiProvider config={config}>{children}</TamaguiProvider>
}

describe('ExampleButton Snapshots', () => {
  it('should match snapshot with default props', () => {
    const { container } = render(
      <TestWrapper>
        <ExampleButton>Default Button</ExampleButton>
      </TestWrapper>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot when disabled', () => {
    const { container } = render(
      <TestWrapper>
        <ExampleButton disabled>Disabled Button</ExampleButton>
      </TestWrapper>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot with custom size', () => {
    const { container } = render(
      <TestWrapper>
        <ExampleButton size="$5">Large Button</ExampleButton>
      </TestWrapper>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot with custom width and height', () => {
    const { container } = render(
      <TestWrapper>
        <ExampleButton width={300} height={60}>
          Custom Size Button
        </ExampleButton>
      </TestWrapper>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot with long text', () => {
    const { container } = render(
      <TestWrapper>
        <ExampleButton>
          This is a button with a very long text that might wrap to multiple lines
        </ExampleButton>
      </TestWrapper>
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
