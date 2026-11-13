declare module '*.svg' {
  const image: {
    readonly src: string
    readonly height: number
    readonly width: number
    readonly blurWidth?: number
    readonly blurHeight?: number
  }

  export default image
}
