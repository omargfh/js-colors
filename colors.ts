import { hslToHex, rgbToHSL } from "./hsl";
import { hexToRGB, rgbToHex } from "./rgb";
import { colorsHex as systemColors } from "./constants";

interface Colors {
    [key: string]: string;
}
export function createColorInstance(userColors: Colors) {
    const colorsHex = {
        ...systemColors,
        ...userColors
    }
    return class Color {
        hex = "#FFFFFF";
        alpha = 1;

        static fromHex(hex: string) {
            const color = new Color();
            hex = hex.replace("#", "");
            if (hex.length === 3) {
                color.hex = `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
            } else if (hex.length === 4) {
                color.hex = `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
                color.alpha = parseInt(hex[3], 16) / 15;
            }
            else if (hex.length === 5 || hex.length === 6) {
                color.hex = `#${hex}`.padEnd(7, "0");
            } else if (hex.length === 8) {
                color.hex = `#${hex.slice(0, 6)}`;
                color.alpha = parseInt(hex.slice(6, 8), 16) / 255;
            } else {
                throw new Error("Invalid hex color");
            }
            return color;
        }

        static fromHSL(h: number, s: number, l: number, a: number = 1) {
            const color = new Color();
            color.hex = hslToHex(h, s, l);
            color.alpha = a;
            return color;
        }

        static fromRGB(r: number, g: number, b: number, a: number = 1) {
            const color = new Color();
            color.hex = rgbToHex(r, g, b);
            color.alpha = a;
            return color;
        }

        static random() {
            console.warn("In React, this will lead to a color update on every render. Use seededRandom instead.")
            const color = new Color();
            color.hex = ("#" + Math.floor(Math.random() * 16777215).toString(16)).padEnd(7, "0");
            return color;
        }

        static seededRandom(seed: string) {
            const color = new Color();
            color.hex = ("#" + Math.floor(Math.abs(Math.sin(seed.charCodeAt(0)) * 16777215)).toString(16)).padEnd(7, "0");
            return color;
        }

        static resolve(input: string | Color) {
            try {
                if (typeof input === "string") {
                    input = input.trim();
                    if (input.startsWith("#")) {
                        return Color.fromHex(input);
                    } else if (input.startsWith("hsla")) {
                        const [h, s, l, a] = /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/.exec(input)?.slice(1).map((x) => parseFloat(x)) || [0, 0, 0, 0];
                        return Color.fromHSL(h, s, l, a);
                    } else if (input.startsWith("hsl")) {
                        const [h, s, l] = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/.exec(input)?.slice(1).map((x) => parseFloat(x)) || [0, 0, 0];
                        return Color.fromHSL(h, s, l);
                    } else if (input.startsWith("rgba")) {
                        const [r, g, b, a] = input.slice(5, -1).split(",").map((x) => parseFloat(x)) || [0, 0, 0, 0];
                        return Color.fromRGB(r, g, b, a);
                    } else if (input.startsWith("rgb")) {
                        const [r, g, b] = input.slice(4, -1).split(",").map((x) => parseFloat(x)) || [0, 0, 0];
                        return Color.fromRGB(r, g, b);
                    } else {
                        return Color.named(input);
                    }
                } else {
                    return input;
                }
            } catch {
                return Color.fromHex("#FFFFFF");
            }
        }
        static named(name: string) {
            // @ts-ignore
            if (colorsHex[name]) {
                // @ts-ignore
                return Color.fromHex(colorsHex[name]);
            }
            else {
                throw new Error(`Color ${name} does not exist.`);
            }
        }

        get hsl() {
            return rgbToHSL(this.rgb['r'], this.rgb['g'], this.rgb['b']);
        }

        get hslString() {
            return `hsl(${this.hsl.h}, ${this.hsl.s}%, ${this.hsl.l}%)`;
        }

        get rgb() {
            return hexToRGB(this.hex);
        }

        get rgbString() {
            return `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`;
        }

        get rgba() {
            return { ...this.rgb, a: this.alpha };
        }

        get rgbaString() {
            return `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${this.alpha})`;
        }

        get hsla() {
            return { ...this.hsl, a: this.alpha };
        }

        get hslaString() {
            return `hsla(${this.hsl.h * 255}, ${this.hsl.s * 100}%, ${this.hsl.l*100}%, ${this.alpha})`;
        }

        // Barret Sonntag
        clamp(number: number): number {
            return Math.max(Math.min(number, 255), 0);
        }

        multiply(matrix: number[]) {
            const {r, g, b} = this.rgb;
            const newR = this.clamp(r * matrix[0] + g * matrix[1] + b * matrix[2]);
            const newG = this.clamp(r * matrix[3] + g * matrix[4] + b * matrix[5]);
            const newB = this.clamp(r * matrix[6] + g * matrix[7] + b * matrix[8]);
            return Color.fromRGB(newR, newG, newB, this.alpha);
        }

        invert(value = 1) {
            const {r, g, b} = this.rgb;
            const newR = this.clamp((value + r / 255 * (1 - 2 * value)) * 255);
            const newG = this.clamp((value + g / 255 * (1 - 2 * value)) * 255);
            const newB = this.clamp((value + b / 255 * (1 - 2 * value)) * 255);
            return Color.fromRGB(newR, newG, newB, this.alpha);
        }

        linear(slope = 1, intercept = 0) {
            const {r, g, b} = this.rgb;
            const newR = this.clamp(r * slope + intercept * 255);
            const newG = this.clamp(g * slope + intercept * 255);
            const newB = this.clamp(b * slope + intercept * 255);
            return Color.fromRGB(newR, newG, newB, this.alpha);
        }

        linearContrast(value = 1) {
            return this.linear(value, -(0.5 * value) + 0.5);
        }

        linearBrightness(value = 1) {
            return this.linear(value, 0);
        }

        sepia(value = 1) {
            this.multiply([
                0.393 + 0.607 * (1 - value),
                0.769 - 0.769 * (1 - value),
                0.189 - 0.189 * (1 - value),
                0.349 - 0.349 * (1 - value),
                0.686 + 0.314 * (1 - value),
                0.168 - 0.168 * (1 - value),
                0.272 - 0.272 * (1 - value),
                0.534 - 0.534 * (1 - value),
                0.131 + 0.869 * (1 - value),
            ]);
        }
        // End, Barret Sonntag


        get contrast(): number {
            const { r, g, b } = this.rgb;
            const relativeLuminance = (c: number): number => {
                const sRGB = c / 255;
                const linearRGB = sRGB <= 0.03928 ? sRGB / 12.92 : ((sRGB + 0.055) / 1.055) ** 2.4;
                return linearRGB * 100;
            };

            const luminance = (0.2126 * relativeLuminance(r)) + (0.7152 * relativeLuminance(g)) + (0.0722 * relativeLuminance(b));
                return luminance;
        }

        get kelvin(): number {
            const { r, g, b } = this.rgb;
            const temp = (r + g + b) / 3;
            return Math.round(1000000 / temp);
        }

        get hexString() : string {
            return this.hex + (this.alpha < 1 ? Math.round(this.alpha * 255).toString(16) : "");
        }

        get hexStringNoAlpha() : string {
            return this.hex;
        }

        get hexStringNoPound() : string {
            return this.hex.slice(1);
        }

        opacity(percent: number) {
            let color = Color.fromHex(this.hexStringNoAlpha);
            color.alpha = percent / 100;
            return color;
        }

        darker(percent: number) {
            const { h, s, l } = this.hsl;
            return Color.fromHSL(h, s, Math.max(l - percent, 0), this.alpha);
        }

        lighter(percent: number) {
            const { h, s, l } = this.hsl;
            return Color.fromHSL(h, s, Math.min(l + percent, 100), this.alpha);
        }

        grayscale() {
            const { h, s } = this.hsl;
            return Color.fromHSL(h, 0, s, this.alpha);
        }

        // Turn all colors into a list of colors that are accessible
        // https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
        static checkAccessible(foregroundColor: Color, backgroundColor: Color) {
            const contrastRatio = (foregroundColor.contrast + 0.05) / (backgroundColor.contrast + 0.05);
            return contrastRatio >= 7;
        }

        rotate(degrees: number): Color {
            const { h, s, l } = this.hsl;
            return Color.fromHSL((h + degrees) % 360, s, l, this.alpha);
        }

        saturate(percent: number): Color {
            const { h, s, l } = this.hsl;
            return Color.fromHSL(h, Math.min(s + percent, 100), l, this.alpha);
        }

        desaturate(percent: number): Color {
            const { h, s, l } = this.hsl;
            return Color.fromHSL(h, Math.max(s - percent, 0), l, this.alpha);
        }

        shiftRGBValues(r: number, g: number, b: number): Color {
            const rgb = this.rgb;
            return Color.fromRGB(Math.min(Math.max(rgb.r + r, 0), 255), Math.min(Math.max(rgb.g + g, 0), 255), Math.min(Math.max(rgb.b + b, 0), 255), this.alpha);
        }

        complementary(): Color {
            const { h, s, l } = this.hsl;
            return Color.fromHSL((h + 180) % 360, s, l, this.alpha);
        }

        get monochromatic(): Color[] {
            const { h, s, l } = this.hsl;
            const colors: Color[] = [];
            for (let i = 0; i < 360; i += 30) {
                colors.push(Color.fromHSL(h, s, l + i, this.alpha));
            }
            return colors;
        }

        get triadic(): Color[] {
            const { h, s, l } = this.hsl;
            const colors: Color[] = [];
            for (let i = 0; i < 360; i += 120) {
                colors.push(Color.fromHSL(h, s, l + i, this.alpha));
            }
            return colors;
        }
    }
}
