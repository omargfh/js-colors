import test from 'ava';
import { createColorInstance } from '../colors.js';
const Color = createColorInstance();
const ColorWithMagicColor = createColorInstance({ magicColor: '#ff00ff' });
test('Color with User Color', t => {
    const color = ColorWithMagicColor.named('magicColor');
    t.is(color.hex, '#ff00ff');
    t.throws(() => Color.named('magicColor'), { instanceOf: Error });
});
test('Get hex, hsl, rgb, hsla, rgba', t => {
    const color = Color.named('red');
    t.is(color.hex, '#FF0000');
    t.is(color.hslString, 'hsl(0, 100%, 50%)');
    t.is(color.rgbString, 'rgb(255, 0, 0)');
    t.is(color.hslaString, 'hsla(0, 100%, 50%, 1)');
    t.is(color.rgbaString, 'rgba(255, 0, 0, 1)');
    t.is(color.hexStringNoAlpha, '#FF0000');
    t.is(color.hexString, '#FF0000');
    color.alpha = 0.5;
    t.is(color.hexString, '#FF000080');
    t.is(color.hexStringNoAlpha, '#FF0000');
    t.is(color.hslaString, 'hsla(0, 100%, 50%, 0.5)');
    t.is(color.rgbaString, 'rgba(255, 0, 0, 0.5)');
});
test('Resolve', t => {
    t.is(Color.resolve('red').hex, '#FF0000');
    t.is(Color.resolve('illegal').hex, '#FFFFFF');
    t.is(Color.resolve(Color.named('red')).hex, '#FF0000');
    t.is(Color.resolve('#FF0000').hex, '#FF0000');
    t.is(Color.resolve('#FF000080').hexString, '#FF000080');
});
test('From RGB, HSL, HEX', t => {
    t.is(Color.fromHex('#FFFF').hex, '#FFFFFF');
    t.is(Color.fromHex('#FFFF00').hex, '#FFFF00');
    t.is(Color.fromHex('#FF0').hex, '#FFFF00');
    t.is(Color.fromRGB(255, 255, 255).hex, '#FFFFFF');
    t.is(Color.fromRGB(255, 255, 0).hex, '#FFFF00');
    t.is(Color.fromRGB(255, 0, 0).hex, '#FF0000');
    t.is(Color.fromHSL(0, 100, 50).hex, '#FF0000');
    t.is(Color.fromHSL(60, 100, 50).hex, '#FFFF00');
    t.is(Color.fromHSL(120, 100, 50).hex, '#00FF00');
    t.is(Color.fromHSL(180, 100, 50).hex, '#00FFFF');
});
test('Colors are consistent after conversions', t => {
    const sample = ["#EF8099", "#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF", "#000000", "#FFFFFF"];
    for (const hex of sample) {
        const color = Color.fromHex(hex);
        t.is(color.hex, hex);
        t.is(color.hexString, hex);
        t.is(color.hexStringNoAlpha, hex);
        t.is(Color.fromRGB(color.rgb.r, color.rgb.g, color.rgb.b).hex, hex);
        // t.is(Color.fromHSL(color.hsl.h, color.hsl.s, color.hsl.l).hex, hex);
    }
});
test('Opacity, contrast, darker, lighter, grayscale', t => {
    const color = Color.named('red');
    t.is(color.hex, '#FF0000');
    t.is(color.opacity(.5).hexString, '#FF000080');
    t.is(color.contrast, 21.26);
    t.is(color.darker(.5).hexString, Color.fromHSL(color.hsl.h, color.hsl.s, color.hsl.l * 0.5).hexString);
    t.is(color.darker(50).hexString, Color.fromHSL(color.hsl.h, color.hsl.s, color.hsl.l * 0.5).hexString);
    t.is(color.lighter(.1).hexString, '#FF1A1A');
    t.is(color.grayscale().hexString, '#FFFFFF');
});
test('Check Accessible, rotate, saturate, desaturate, shiftRGB', t => {
    const color = Color.fromHex("#FE09F0");
    t.is(color.hex, '#FE09F0');
    t.is(Color.checkAccessible(color, Color.fromHex('#FFFFFF')), false);
    t.is(Color.checkAccessible(Color.fromHex('#FFFFFF'), color), false);
    t.is(color.rotate(180).hexString, '#0bfe18'.toUpperCase());
    t.is(color.saturate(1).hexString, '#ff0af3'.toUpperCase());
    t.is(color.desaturate(.49).hexString, '#c247bc'.toUpperCase());
    t.is(color.desaturate(49).hexString, '#c247bc'.toUpperCase());
    t.is(color.shiftRGB(0, 40, 0).hexString, '#FE31F0'.toUpperCase());
});
test('Complementary, Monochrome, Triadic', t => {
    const color = Color.fromHex("#FE09F0");
    t.is(color.hex, '#FE09F0');
    t.is(color.complementary().hexString, '#0bfe18'.toUpperCase());
    const monos = [
        "#000000",
        "#330030",
        "#650160",
        "#980191",
        "#CB01C1",
        "#FE01F1",
        "#FE34F4",
        "#FE67F7",
        "#FE9AF9",
        "#FFCCFC"
    ];
    color.monochromatic.map((c, i) => t.is(c.hexString, monos[i].toUpperCase()));
    const tris = ["#FE0BF2", "#F2FE0B", "#0BF2FE"];
    color.triadic.map((c, i) => t.is(c.hexString, tris[i].toUpperCase()));
});
