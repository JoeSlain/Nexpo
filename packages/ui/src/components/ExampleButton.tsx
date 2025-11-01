import { type ButtonProps, Button as TamaguiButton } from 'tamagui'

export type { ButtonProps }

export function ExampleButton({ children, ...props }: ButtonProps) {
  return (
    <TamaguiButton backgroundColor="red" {...props}>
      {children}
    </TamaguiButton>
  )
}
