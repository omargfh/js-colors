import test from 'ava';
import * as RGB from '../rgb.js';
test('Hex to RGB', t => {
    var { r, g, b } = RGB.hexToRGB('#FF0000');
    t.is(r, 255);
    t.is(g, 0);
    t.is(b, 0);
    var { r, g, b } = RGB.hexToRGB('#0000FF');
    t.is(r, 0);
    t.is(g, 0);
    t.is(b, 255);
    // invalid hex
    var { r, g, b } = RGB.hexToRGB('~FF000');
    t.is(r, 255);
    t.is(g, 255);
    t.is(b, 255);
});
