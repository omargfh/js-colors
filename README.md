# npm js-colors
## A utility library for working with colors in JavaScript.

![81% Coverage](https://img.shields.io/badge/coverage-81%25-yellowgreen.svg)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![v1.0.0](https://img.shields.io/badge/version-1.0.0-blue.svg)

## Installation
```bash
npm install js-colors
```
or
```bash
yarn add js-colors
```

## API
### Generate Color Client
```typescript
import { createColorInstance } from 'js-colors';
// You may pass in a color map to createColorInstance
const Color = createColorInstance({ myColor: '#ff00ff' });
// Sample usage
const color = Color.named('myColor');
console.log(color.hexString); // #FF00FF
```

### Creating Colors
#### `static Color.fromHex(hex: string): Color`
Creates a color from a hex string.
#### `static Color.fromRGB(r: number, g: number, b: number, a?: number): Color`
Creates a color from RGB values.
#### `static Color.fromHSL(h: number, s: number, l: number, a?: number): Color`
Creates a color from HSL values.
#### `static Color.random(): Color`
Creates a random color.
#### `static Color.seededRandom(seed: number): Color`
Creates a seeded random color.
#### `static Color.named(name: string): Color`
Creates a color from a named color. There is a set of named colors available by default, but you can add your own by passing in a color map to `createColorInstance`.
#### `static Color.resolve(color: Color | string): Color`
Resolves a color from a color or string. If a string is passed in, it will be parsed as a `hex`, `rgb`, `rgba`, `hsl`, or `hsla` color. If a color is passed in, it will be returned as is. If neither a string nor a color is passed in, an undefined behavior will occur.

### Getters
#### `Color.hex: string` (can set)
Gets the hex string of the color.
#### `Color.hexString: string`
Gets the hex string of the color. This will include alpha value if it is not 1.
#### `Color.hexStringNoPound`
Gets the hex string of the color without the pound sign.
#### `Color.hexStringNoAlpha: string`
Gets the hex string of the color without the alpha value. This is equivalent to `Color.hexString`.
#### `Color.rgb: { r: number, g: number, b: number }`
Gets the RGB values of the color.
#### `Color.rgba: { r: number, g: number, b: number, a: number }`
Gets the RGBA values of the color.
#### `Color.rgbString: string`
Gets the RGB string of the color in the form of `rgb(r, g, b)`.
#### `Color.rgbaString: string`
Gets the RGBA string of the color in the form of `rgba(r, g, b, a)`.
#### `Color.hsl: { h: number, s: number, l: number }`
Gets the HSL values of the color.
#### `Color.hsla: { h: number, s: number, l: number, a: number }`
Gets the HSLA values of the color.
#### `Color.hslString: string`
Gets the HSL string of the color in the form of `hsl(h, s%, l%)`.
#### `Color.hslaString: string`
Gets the HSLA string of the color in the form of `hsla(h, s%, l%, a)`.
#### `Color.kelvin: number`
Gets the Kelvin temperature of the color.
#### `Color.contrast: number`
Gets the contrast ratio of the color relative to some arbitrary reference.

### Operators
#### `Color.opacity(opacity: number): Color`
Sets the opacity of the color. The value may be in range 0-1 (float) or 0-100 (integer).
#### `Color.lighten(amount: number): Color`
Lightens the color by the given amount. The value may be in range 0-1 (float) or 0-100 (integer).
#### `Color.darken(amount: number): Color`
Darkens the color by the given amount. The value may be in range 0-1 (float) or 0-100 (integer).
#### `Color.saturate(amount: number): Color`
Saturates the color by the given amount. The value may be in range 0-1 (float) or 0-100 (integer).
#### `Color.desaturate(amount: number): Color`
Desaturates the color by the given amount. The value may be in range 0-1 (float) or 0-100 (integer).
#### `Color.rotate(amount: number): Color`
Rotates the color by the given amount. The value may be in range 0-360 (integer).
#### `Color.shiftRGB(r: number, g: number, b: number): Color`
Shifts the RGB values of the color by the given amount. The value may be in range 0-255 (integer).

### Blend Modes
> Not implemented yet

### Color Relationships
#### `Color.complement: Color`
Gets the complement of the color.
#### `Color.monochromatic: Color[]`
Gets the monochromatic colors of the color (10 values);
#### `Color.triadic: Color[]`
Gets the triadic colors of the color.
#### `Color.grayscale: Color`
Gets the grayscale color of the color.

### Complex Transformations
#### `Color.multiply(matrix: number[]): Color`
Generates a new colors based on a 3x3 matrix transformation. The formula is:
```
[ r' ]   [ a b c ]   [ r ]
[ g' ] = [ d e f ] * [ g ]
[ b' ]   [ g h i ]   [ b ]
```
The matrix is represented as an array of 9 numbers. The result is a new color with the same alpha value as the original color. All new values are clamped to the range 0-255 (integer).

#### `Color.clamp(n: number): number`
Clamps a color value to the range 0-255 (integer).

#### `Color.invert(value: number = 1): Color`
Inverts a Color. The value may be in range 0-1 (float).

#### `Color.linear(slope: number = 1, intercept: number = 0): Color`
Applies a linear transformation to a Color.

#### `Color.linearContrast(value: number = 1): Color`
Applies a linear contrast transformation to a Color.

#### `Color.linearBrightness(value: number = 1): Color`
Applies a linear brightness transformation to a Color.

#### `Color.sepia(value: number = 1): Color`
Applies a sepia transformation to a color;

### Other Methods
#### `static Color.checkAccessibile(foreground: Color, background: Color): boolean`
Checks if a foreground color is accessible on a background color. Returns true if the contrast ratio is greater than 4.5, false otherwise.