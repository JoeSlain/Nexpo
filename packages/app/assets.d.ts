// Type declarations for image assets
// On web (Next.js): returns StaticImageData object with src property
// On native: returns number (require id)
type LocalImageSource =
  | {
      src: string
      width: number
      height: number
      blurDataURL?: string
      blurWidth?: number
      blurHeight?: number
    }
  | number

declare module '*.png' {
  const content: LocalImageSource
  export default content
}

declare module '*.jpg' {
  const content: LocalImageSource
  export default content
}

declare module '*.jpeg' {
  const content: LocalImageSource
  export default content
}

declare module '*.svg' {
  const content: LocalImageSource
  export default content
}

declare module '*.webp' {
  const content: LocalImageSource
  export default content
}

declare module '*.gif' {
  const content: LocalImageSource
  export default content
}
