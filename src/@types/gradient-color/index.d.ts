declare module 'gradient-color' {
  export default function gradient(
    colorArray: string[],
    n: number,
  ): `rgb(${number}, ${number}, ${number})`[];
}
