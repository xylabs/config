declare module '*.png'
declare module '*.jpg'
declare module '*.gif'
declare module '*.webp'

declare module '*.svg' {
  const src: string
  export default src
}
