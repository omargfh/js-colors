import test from 'ava';
import * as HSL from '../hsl.js';
test('Hex to HSL, RGB To HSL', t => {
    var { h, s, l } = HSL.hexToHSL('#FF00FF');
    t.is(h, 300);
    t.is(s, 100);
    t.is(l, 50);
    var { h, s, l } = HSL.hexToHSL('#0bfe18');
    t.is(h, 123);
    t.is(s, 99);
    t.is(l, 52);
});
test('HSL To HEX', t => {
    var h = HSL.hslToHex(300, 100, 50);
    t.is(h, '#FF00FF');
    var h = HSL.hslToHex(123, 99, 52);
    t.is(h, '#0BFE18');
});
