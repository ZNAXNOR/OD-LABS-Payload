declare module '*.svg' {
  const image:
    | string
    | {
        readonly src: string
        readonly height: number
        readonly width: number
        readonly blurWidth?: number
        readonly blurHeight?: number
      }

  export default image
}
