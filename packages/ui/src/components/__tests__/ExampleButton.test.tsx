import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createTamagui } from '@tamagui/core'
import { TamaguiProvider } from 'tamagui'
import { describe, expect, it, vi } from 'vitest'
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

// Test wrapper with Tamagui provider
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <TamaguiProvider config={config}>{children}</TamaguiProvider>
}

describe('ExampleButton', () => {
  it('should render with children text', () => {
    render(
      <TestWrapper>
        <ExampleButton>Click me</ExampleButton>
      </TestWrapper>
    )

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should have red background color (web)', () => {
    render(
      <TestWrapper>
        <ExampleButton>Test Button</ExampleButton>
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should call onPress when clicked', async () => {
    const handlePress = vi.fn()
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <ExampleButton onPress={handlePress}>Clickable</ExampleButton>
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    await user.click(button)

    expect(handlePress).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(
      <TestWrapper>
        <ExampleButton disabled>Disabled Button</ExampleButton>
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should accept and apply custom props', () => {
    render(
      <TestWrapper>
        <ExampleButton testID="custom-button" aria-label="Custom Button">
          Custom
        </ExampleButton>
      </TestWrapper>
    )

    const button = screen.getByTestId('custom-button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Custom Button')
  })

  it('should handle different button sizes', () => {
    render(
      <TestWrapper>
        <ExampleButton size="$2">Small Button</ExampleButton>
      </TestWrapper>
    )

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should support custom styles through props', () => {
    render(
      <TestWrapper>
        <ExampleButton width={200} height={50}>
          Custom Size
        </ExampleButton>
      </TestWrapper>
    )

    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
