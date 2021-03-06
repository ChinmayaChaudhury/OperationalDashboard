! function() {
    function a(a, b) {
        var c = a[0] - b[0],
            d = a[1] - b[1];
        return c * c + d * d
    }

    function b(b, c) {
        for (var d, e = b[0], f = [e], g = 1, h = b.length; g < h; g++) d = b[g], a(d, e) > c && (f.push(d), e = d);
        return e !== d && f.push(d), f.length < 3 ? b : f
    }

    function c(a) {
        for (var c, d, e = 0, f = 0, g = b(a, 10), h = 0, i = g.length - 1; h < i; h++)(e = ca.len(ca.sub(g[h + 1], g[h]))) > f && (f = e, d = [g[h], g[h + 1]]);
        if (void 0 !== d) return c = ca.sub(d[1], d[0]), [c[0] / f, c[1] / f]
    }

    function d(a, b) {
        for (var c, d = [], f = 0, g = a.length - 1; f < g; f++) c = [a[f], a[f + 1]], void 0 !== e(c, b) && d.push({
            index: f,
            segment: c
        });
        return d
    }

    function e(a, b) {
        if (!(ca.equals(a[0], b[0]) || ca.equals(a[0], b[1]) || ca.equals(a[1], b[0]) || ca.equals(a[1], b[1]))) {
            var c = ca.sub(a[1], a[0]),
                d = ca.sub(b[1], b[0]),
                e = ca.dot(c, d);
            if (!(Math.abs(e) < 1e-10)) {
                var f = ca.sub(b[0], a[0]),
                    g = ca.dot(f, d) / e;
                if (!(g < 0 || g > 1)) {
                    var h = ca.dot(f, c) / e;
                    if (!(h < 0 || h > 1)) return ca.add(a[0], ca.scale(c, g))
                }
            }
        }
    }

    function f(a, b) {
        var c = b[0],
            d = b[1];
        if (c[0] !== d[0] || c[1] !== d[1]) {
            var e = (d[1] - c[1]) / (d[0] - c[0]),
                f = c[1] - e * c[0];
            if (0 === e) return Math.abs(f - a[1]);
            if (e === 1 / 0) return Math.abs(c[0] - a[0]);
            var g = -1 / e,
                h = a[1] - g * a[0],
                i = (h - f) / (e - g),
                j = e * i + f,
                k = a[0] - i,
                l = a[1] - j;
            return Math.sqrt(k * k + l * l)
        }
    }

    function g(a) {
        return ca.add(a[0], ca.scale(ca.sub(a[1], a[0]), .5))
    }

    function h(a, b, e, h, i, k, l) {
        h = 0;
        var m, n, o, p, q = e[0];
        if (void 0 !== b.roofRidgeDirection ? o = parseFloat(b.roofRidgeDirection) : void 0 !== b.roofDirection && (o = parseFloat(b.roofDirection)), isNaN(o) ? (n = c(q), b.roofOrientation && "across" === b.roofOrientation && (n = [-n[1], n[0]])) : (p = o * Math.PI / 180, n = [Math.sin(p), Math.cos(p)]), void 0 === n) return j(a, b, e, i, l);
        n = ca.scale(n, 1e3);
        var r = d(q, [ca.sub(i.center, n), ca.add(i.center, n)]);
        if (r.length < 2) return j(a, b, e, i, l);
        var s = r[0],
            t = r[1];
        if (s.index > t.index) {
            var u = s;
            s = t, t = u
        }
        if (s.center = g(s.segment), t.center = g(t.segment), 0 === h) {
            var v = [s.center, t.center],
                w = 0,
                x = [];
            for (m = 0; m < q.length; m++) x[m] = f(q[m], v), w = Math.max(w, x[m]);
            for (m = 0; m < q.length; m++) q[m][2] = (1 - x[m] / w) * i.roofHeight;
            s.center[2] = i.roofHeight, t.center[2] = i.roofHeight;
            var y = [s.center];
            y = y.concat(q.slice(s.index + 1, t.index + 1)), y.push(t.center, s.center), fa.polygon(a, [y], i.roofZ, l);
            var z = [t.center];
            for (z = z.concat(q.slice(t.index + 1, q.length - 1)), z = z.concat(q.slice(0, s.index + 1)), z.push(s.center, t.center), fa.polygon(a, [z], i.roofZ, l), q.splice(s.index + 1, 0, s.center), q.splice(t.index + 2, 0, t.center), m = 0; m < q.length - 1; m++) fa.quad(a, [q[m][0], q[m][1], i.roofZ + q[m][2]], [q[m][0], q[m][1], i.roofZ], [q[m + 1][0], q[m + 1][1], i.roofZ], [q[m + 1][0], q[m + 1][1], i.roofZ + q[m + 1][2]], k)
        }
    }

    function i(a, b, e, g, h, i) {
        var k, l, m, n, o = e[0];
        if (void 0 !== b.roofSlopeDirection ? (m = parseFloat(b.roofSlopeDirection), isNaN(m) || (n = m * Math.PI / 180, l = [Math.sin(n), Math.cos(n)])) : void 0 !== b.roofDirection ? (m = parseFloat(b.roofDirection), isNaN(m) || (n = m * Math.PI / 180, l = [Math.sin(n), Math.cos(n)])) : (l = c(o), l = [-l[1], l[0]], b.roofOrientation && "across" === b.roofOrientation && (l = [-l[1], l[0]])), void 0 === l) return j(a, b, e, g, i);
        l = ca.scale(l, 1e3);
        var p, q = d(o, [ca.sub(g.center, l), ca.add(g.center, l)]),
            r = 0,
            s = 0;
        for (k = 0; k < q.length; k++)(r = f(g.center, q[k].segment)) > s && (p = q[k].segment, s = r);
        if (void 0 === p) return j(a, b, e, g, i);
        s = 0;
        var t = [];
        for (k = 0; k < o.length; k++) t[k] = f(o[k], p), s = Math.max(s, t[k]);
        for (k = 0; k < o.length; k++) o[k][2] = (1 - t[k] / s) * g.roofHeight;
        for (fa.polygon(a, [o], g.roofZ, i), k = 0; k < o.length - 1; k++) fa.quad(a, [o[k][0], o[k][1], g.roofZ + o[k][2]], [o[k][0], o[k][1], g.roofZ], [o[k + 1][0], o[k + 1][1], g.roofZ], [o[k + 1][0], o[k + 1][1], g.roofZ + o[k + 1][2]], h)
    }

    function j(a, b, c, d, e) {
        "cylinder" === b.shape ? fa.circle(a, d.center, d.radius, d.roofZ, e) : fa.polygon(a, c, d.roofZ, e)
    }

    function k(a, b) {
        return [a[0] + b[0], a[1] + b[1]]
    }

    function l(a, b) {
        return [a[0] * b, a[1] * b]
    }

    function m(a, b) {
        return {
            x: a.clientX - b.x,
            y: a.clientY - b.y
        }
    }

    function n(a) {
        if (a.getBoundingClientRect) {
            var b = a.getBoundingClientRect();
            return {
                x: b.left,
                y: b.top
            }
        }
        for (var c = {
                x: 0,
                y: 0
            }; 1 === a.nodeType;) c.x += a.offsetLeft, c.y += a.offsetTop, a = a.parentNode;
        return c
    }

    function o(a) {
        a.preventDefault && a.preventDefault(), a.returnValue = !1
    }

    function p(a, b, c) {
        a.addEventListener(b, c, !1)
    }

    function q(a, b) {
        return a.replace(/\{(\w+)\}/g, function(a, c) {
            return b[c] || a
        })
    }

    function r(a, b) {
        if (!a) throw b
    }

    function s(a, b) {
        var c = [];
        for (var d in a) c.push([a[d][0], a[d][1], b]);
        return c
    }

    function t(a, b, c) {
        return Math.min(c, Math.max(a, b))
    }

    function u(a, b) {
        var c = a[0] - b[0],
            d = a[1] - b[1];
        return c * c + d * d
    }

    function r(a, b) {
        if (!a) throw b
    }

    function v(a, b, c) {
        var d = [a[0] < b[0] ? 1 : -1, a[1] < b[1] ? 1 : -1],
            e = c[0] + (a[0] < b[0] ? 1 : 0),
            f = c[1] + (a[1] < b[1] ? 1 : 0),
            g = (e - a[0]) / (b[0] - a[0]),
            h = (f - a[1]) / (b[1] - a[1]);
        return (g <= 0 || g > 1) && (h <= 0 || h > 1) ? [void 0, void 0] : g <= 0 || g > 1 ? [c[0], c[1] + d[1]] : h <= 0 || h > 1 ? [c[0] + d[0], c[1]] : g < h ? [c[0] + d[0], c[1]] : [c[0], c[1] + d[1]]
    }

    function w(a, b, c) {
        var d = [a, b, c];
        if (d.sort(function(a, b) {
                return a[1] < b[1]
            }), a = d[0], b = d[1], c = d[2], a[1] == b[1]) return x(a, b, c);
        if (b[1] == c[1]) return x(b, c, a);
        var e = (b[1] - a[1]) / (c[1] - a[1]),
            f = [a[0] + e * (c[0] - a[0]), b[1]];
        return x(f, b, a).concat(x(f, b, c))
    }

    function x(a, b, c) {
        var d = [];
        if (r(a[1] === b[1], "not a flat triangle"), r(c[1] !== a[1], "not a triangle"), r(a[0] !== b[0], "not a triangle"), a[0] > b[0]) {
            var e = a;
            a = b, b = e
        }
        var f = [c[0] << 0, c[1] << 0],
            g = f.slice(0);
        d.push(f.slice(0));
        for (var h, i, j = c[1] < a[1] ? 1 : -1, k = f[1], l = (a[1] << 0) + j, m = k; m * j < l * j; m += j) {
            do {
                d.push(f.slice(0)), h = f, f = v(c, a, f)
            } while (f[1] * j <= m * j);
            f = h;
            do {
                d.push(g.slice(0)), i = g, g = v(c, b, g)
            } while (g[1] * j <= m * j);
            g = i;
            for (var n = f[0]; n <= g[0]; n++) d.push([n, m])
        }
        return d
    }

    function y(a) {
        r(4 == a.length, "Error: Quadrilateral with more or less than four vertices");
        var b = w(a[0], a[1], a[2]),
            c = w(a[0], a[2], a[3]);
        return b.concat(c)
    }

    function z(a, b, c) {
        var d = T(a, b),
            e = T(b, c);
        return Y([d[1] * e[2] - d[2] * e[1], d[2] * e[0] - d[0] * e[2], d[0] * e[1] - d[1] * e[0]])
    }

    function A(a, b, c) {
        var d = ba.Matrix.invert(a),
            e = D(-1, -1, d),
            f = D(1, -1, d),
            g = D(1, 1, d),
            h = D(-1, 1, d);
        if (e && f) {
            var i, j, m, n, o;
            return h && g || (m = D(-1, -.9, d), i = R(Q(m, e)), o = P(i, c), h = k(e, l(i, b / o)), n = D(1, -.9, d), j = R(Q(n, f)), o = P(j, c), g = k(f, l(j, b / o))), P(c, Q(h, e)) > b && (i = R(Q(h, e)), o = P(i, c), h = k(e, l(i, b / o))), P(c, Q(g, f)) > b && (j = R(Q(g, f)), o = P(j, c), g = k(f, l(j, b / o))), [e, f, g, h]
        }
    }

    function B(a, b, c, d, e) {
        for (var f = C(b.data, a[0]), g = f[0], h = f[0], i = f[1], j = f[1], k = 0; k < a.length; k++) {
            var l = C(b.data, a[k]);
            g = Math.min(g, l[0]), h = Math.max(h, l[0]), i = Math.max(i, l[1]), j = Math.min(j, l[1])
        }
        return new ba.Matrix.Ortho(g, h, i, j, c, d)
    }

    function C(a, b) {
        var c = b[0] * a[0] + b[1] * a[4] + b[2] * a[8] + a[12],
            d = b[0] * a[1] + b[1] * a[5] + b[2] * a[9] + a[13],
            e = b[0] * a[2] + b[1] * a[6] + b[2] * a[10] + a[14],
            f = b[0] * a[3] + b[1] * a[7] + b[2] * a[11] + a[15];
        return [c / f, d / f, e / f]
    }

    function D(a, b, c) {
        var d = C(c, [a, b, 0]),
            e = C(c, [a, b, 1]),
            f = T(e, d);
        if (!(f[2] >= 0)) {
            var g = -d[2] / f[2],
                h = U(d, W(f, g));
            return [h[0], h[1]]
        }
    }

    function E(a, b, c, d) {
        var e = za * Math.cos(ia.position.latitude / 180 * Math.PI),
            f = M(a, c),
            g = N(b, c),
            h = new ba.Matrix;
        h.translate((f - ia.position.longitude) * e, -(g - ia.position.latitude) * za, 0);
        var i = H(ia.position.latitude, c),
            j = ba.Matrix.multiply(h, d),
            k = C(j, [0, 0, 0]),
            l = C(j, [i, 0, 0]),
            m = C(j, [0, i, 0]),
            n = C(j, [i, i, 0]),
            o = [k, l, m, n];
        for (var p in o) o[p][0] = (o[p][0] + 1) / 2 * ia.width, o[p][1] = (o[p][1] + 1) / 2 * ia.height;
        return G([k, l, n, m])
    }

    function F(a, b, c) {
        var d = O(Q(a, b)),
            e = O(Q(a, c)),
            f = O(Q(b, c)),
            g = .5 * (d + e + f);
        return Math.sqrt(g * (g - d) * (g - e) * (g - f))
    }

    function G(a) {
        return F(a[0], a[1], a[2]) + F(a[0], a[2], a[3])
    }

    function H(a, b) {
        return ya * Math.cos(a / 180 * Math.PI) / Math.pow(2, b)
    }

    function I(a) {
        var b = za * Math.cos(ia.position.latitude / 180 * Math.PI);
        return {
            longitude: ia.position.longitude + a[0] / b,
            latitude: ia.position.latitude - a[1] / za
        }
    }

    function J(a, b) {
        var c = I(a);
        return [K(c.longitude, b), L(c.latitude, b)]
    }

    function K(a, b) {
        return (a + 180) / 360 * Math.pow(2, b)
    }

    function L(a, b) {
        return (1 - Math.log(Math.tan(a * Math.PI / 180) + 1 / Math.cos(a * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, b)
    }

    function M(a, b) {
        return a / Math.pow(2, b) * 360 - 180
    }

    function N(a, b) {
        var c = Math.PI - 2 * Math.PI * a / Math.pow(2, b);
        return 180 / Math.PI * Math.atan(.5 * (Math.exp(c) - Math.exp(-c)))
    }

    function O(a) {
        return Math.sqrt(a[0] * a[0] + a[1] * a[1])
    }

    function P(a, b) {
        return a[0] * b[0] + a[1] * b[1]
    }

    function Q(a, b) {
        return [a[0] - b[0], a[1] - b[1]]
    }

    function k(a, b) {
        return [a[0] + b[0], a[1] + b[1]]
    }

    function l(a, b) {
        return [a[0] * b, a[1] * b]
    }

    function R(a) {
        var b = O(a);
        return [a[0] / b, a[1] / b]
    }

    function S(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    }

    function T(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
    }

    function U(a, b) {
        return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
    }

    function V(a, b) {
        return [a[0] + b, a[1] + b, a[2] + b]
    }

    function W(a, b) {
        return [a[0] * b, a[1] * b, a[2] * b]
    }

    function X(a) {
        return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
    }

    function Y(a) {
        var b = X(a);
        return [a[0] / b, a[1] / b, a[2] / b]
    }

    function Z(a, b) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
    }
    var $ = function() {
        function a(a, b, c) {
            return c < 0 && (c += 1), c > 1 && (c -= 1), c < 1 / 6 ? a + 6 * (b - a) * c : c < .5 ? b : c < 2 / 3 ? a + (b - a) * (2 / 3 - c) * 6 : a
        }

        function b(a, b) {
            if (void 0 !== a) return Math.min(b, Math.max(0, a || 0))
        }
        var c = {
                aliceblue: "#f0f8ff",
                antiquewhite: "#faebd7",
                aqua: "#00ffff",
                aquamarine: "#7fffd4",
                azure: "#f0ffff",
                beige: "#f5f5dc",
                bisque: "#ffe4c4",
                black: "#000000",
                blanchedalmond: "#ffebcd",
                blue: "#0000ff",
                blueviolet: "#8a2be2",
                brown: "#a52a2a",
                burlywood: "#deb887",
                cadetblue: "#5f9ea0",
                chartreuse: "#7fff00",
                chocolate: "#d2691e",
                coral: "#ff7f50",
                cornflowerblue: "#6495ed",
                cornsilk: "#fff8dc",
                crimson: "#dc143c",
                cyan: "#00ffff",
                darkblue: "#00008b",
                darkcyan: "#008b8b",
                darkgoldenrod: "#b8860b",
                darkgray: "#a9a9a9",
                darkgrey: "#a9a9a9",
                darkgreen: "#006400",
                darkkhaki: "#bdb76b",
                darkmagenta: "#8b008b",
                darkolivegreen: "#556b2f",
                darkorange: "#ff8c00",
                darkorchid: "#9932cc",
                darkred: "#8b0000",
                darksalmon: "#e9967a",
                darkseagreen: "#8fbc8f",
                darkslateblue: "#483d8b",
                darkslategray: "#2f4f4f",
                darkslategrey: "#2f4f4f",
                darkturquoise: "#00ced1",
                darkviolet: "#9400d3",
                deeppink: "#ff1493",
                deepskyblue: "#00bfff",
                dimgray: "#696969",
                dimgrey: "#696969",
                dodgerblue: "#1e90ff",
                firebrick: "#b22222",
                floralwhite: "#fffaf0",
                forestgreen: "#228b22",
                fuchsia: "#ff00ff",
                gainsboro: "#dcdcdc",
                ghostwhite: "#f8f8ff",
                gold: "#ffd700",
                goldenrod: "#daa520",
                gray: "#808080",
                grey: "#808080",
                green: "#008000",
                greenyellow: "#adff2f",
                honeydew: "#f0fff0",
                hotpink: "#ff69b4",
                indianred: "#cd5c5c",
                indigo: "#4b0082",
                ivory: "#fffff0",
                khaki: "#f0e68c",
                lavender: "#e6e6fa",
                lavenderblush: "#fff0f5",
                lawngreen: "#7cfc00",
                lemonchiffon: "#fffacd",
                lightblue: "#add8e6",
                lightcoral: "#f08080",
                lightcyan: "#e0ffff",
                lightgoldenrodyellow: "#fafad2",
                lightgray: "#d3d3d3",
                lightgrey: "#d3d3d3",
                lightgreen: "#90ee90",
                lightpink: "#ffb6c1",
                lightsalmon: "#ffa07a",
                lightseagreen: "#20b2aa",
                lightskyblue: "#87cefa",
                lightslategray: "#778899",
                lightslategrey: "#778899",
                lightsteelblue: "#b0c4de",
                lightyellow: "#ffffe0",
                lime: "#00ff00",
                limegreen: "#32cd32",
                linen: "#faf0e6",
                magenta: "#ff00ff",
                maroon: "#800000",
                mediumaquamarine: "#66cdaa",
                mediumblue: "#0000cd",
                mediumorchid: "#ba55d3",
                mediumpurple: "#9370db",
                mediumseagreen: "#3cb371",
                mediumslateblue: "#7b68ee",
                mediumspringgreen: "#00fa9a",
                mediumturquoise: "#48d1cc",
                mediumvioletred: "#c71585",
                midnightblue: "#191970",
                mintcream: "#f5fffa",
                mistyrose: "#ffe4e1",
                moccasin: "#ffe4b5",
                navajowhite: "#ffdead",
                navy: "#000080",
                oldlace: "#fdf5e6",
                olive: "#808000",
                olivedrab: "#6b8e23",
                orange: "#ffa500",
                orangered: "#ff4500",
                orchid: "#da70d6",
                palegoldenrod: "#eee8aa",
                palegreen: "#98fb98",
                paleturquoise: "#afeeee",
                palevioletred: "#db7093",
                papayawhip: "#ffefd5",
                peachpuff: "#ffdab9",
                peru: "#cd853f",
                pink: "#ffc0cb",
                plum: "#dda0dd",
                powderblue: "#b0e0e6",
                purple: "#800080",
                rebeccapurple: "#663399",
                red: "#ff0000",
                rosybrown: "#bc8f8f",
                royalblue: "#4169e1",
                saddlebrown: "#8b4513",
                salmon: "#fa8072",
                sandybrown: "#f4a460",
                seagreen: "#2e8b57",
                seashell: "#fff5ee",
                sienna: "#a0522d",
                silver: "#c0c0c0",
                skyblue: "#87ceeb",
                slateblue: "#6a5acd",
                slategray: "#708090",
                slategrey: "#708090",
                snow: "#fffafa",
                springgreen: "#00ff7f",
                steelblue: "#4682b4",
                tan: "#d2b48c",
                teal: "#008080",
                thistle: "#d8bfd8",
                tomato: "#ff6347",
                turquoise: "#40e0d0",
                violet: "#ee82ee",
                wheat: "#f5deb3",
                white: "#ffffff",
                whitesmoke: "#f5f5f5",
                yellow: "#ffff00",
                yellowgreen: "#9acd32"
            },
            d = function(a, c, d, e) {
                this.r = b(a, 1), this.g = b(c, 1), this.b = b(d, 1), this.a = b(e, 1) || 1
            };
        return d.parse = function(a) {
            if ("string" == typeof a) {
                a = a.toLowerCase(), a = c[a] || a;
                var b;
                if (b = a.match(/^#?(\w{2})(\w{2})(\w{2})$/)) return new d(parseInt(b[1], 16) / 255, parseInt(b[2], 16) / 255, parseInt(b[3], 16) / 255);
                if (b = a.match(/rgba?\((\d+)\D+(\d+)\D+(\d+)(\D+([\d.]+))?\)/)) return new d(parseFloat(b[1]) / 255, parseFloat(b[2]) / 255, parseFloat(b[3]) / 255, b[4] ? parseFloat(b[5]) : 1)
            }
            return new d
        }, d.fromHSL = function(b, c, e, f) {
            if (0 === c) return new d(e, e, e, f);
            var g = e < .5 ? e * (1 + c) : e + c - e * c,
                h = 2 * e - g;
            return b /= 360, new d(a(h, g, b + 1 / 3), a(h, g, b), a(h, g, b - 1 / 3), f)
        }, d.prototype = {
            toHSL: function() {
                if (void 0 !== this.r && void 0 !== this.g && void 0 !== this.b) {
                    var a, b, c = Math.max(this.r, this.g, this.b),
                        d = Math.min(this.r, this.g, this.b),
                        e = (c + d) / 2,
                        f = c - d;
                    if (f) {
                        switch (b = e > .5 ? f / (2 - c - d) : f / (c + d), c) {
                            case this.r:
                                a = (this.g - this.b) / f + (this.g < this.b ? 6 : 0);
                                break;
                            case this.g:
                                a = (this.b - this.r) / f + 2;
                                break;
                            case this.b:
                                a = (this.r - this.g) / f + 4
                        }
                        a *= 60
                    } else a = b = 0;
                    return {
                        h: a,
                        s: b,
                        l: e,
                        a: this.a
                    }
                }
            },
            toString: function() {
                if (void 0 !== this.r && void 0 !== this.g && void 0 !== this.b) return 1 === this.a ? "#" + ((1 << 24) + (Math.round(255 * this.r) << 16) + (Math.round(255 * this.g) << 8) + Math.round(255 * this.b)).toString(16).slice(1, 7) : "rgba(" + [Math.round(255 * this.r), Math.round(255 * this.g), Math.round(255 * this.b), this.a.toFixed(2)].join(",") + ")"
            },
            toArray: function() {
                if (void 0 !== this.r && void 0 !== this.g && void 0 !== this.b) return [this.r, this.g, this.b]
            },
            hue: function(a) {
                var b = this.toHSL();
                return d.fromHSL(b.h + a, b.s, b.l)
            },
            saturation: function(a) {
                var b = this.toHSL();
                return d.fromHSL(b.h, b.s * a, b.l)
            },
            lightness: function(a) {
                var b = this.toHSL();
                return d.fromHSL(b.h, b.s, b.l * a)
            },
            red: function(a) {
                return new d(this.r * a, this.g, this.b, this.a)
            },
            green: function(a) {
                return new d(this.r, this.g * a, this.b, this.a)
            },
            blue: function(a) {
                return new d(this.r, this.g, this.b * a, this.a)
            },
            alpha: function(a) {
                return new d(this.r, this.g, this.b, this.a * a)
            },
            copy: function() {
                return new d(this.r, this.g, this.b, this.a)
            }
        }, d
    }();
    "object" == typeof module && (module.exports = $);
    var _ = function() {
            "use strict";

            function a(a) {
                return a.valueOf() / r - .5 + s
            }

            function b(b) {
                return a(b) - t
            }

            function c(a, b) {
                return p(l(a) * m(u) - n(b) * l(u), m(a))
            }

            function d(a, b) {
                return o(l(b) * m(u) + m(b) * l(u) * l(a))
            }

            function e(a, b, c) {
                return p(l(a), m(a) * l(b) - n(c) * m(b))
            }

            function f(a, b, c) {
                return o(l(b) * l(c) + m(b) * m(c) * m(a))
            }

            function g(a, b) {
                return q * (280.16 + 360.9856235 * a) - b
            }

            function h(a) {
                return q * (357.5291 + .98560028 * a)
            }

            function i(a) {
                return a + q * (1.9148 * l(a) + .02 * l(2 * a) + 3e-4 * l(3 * a)) + 102.9372 * q + k
            }

            function j(a) {
                var b = h(a),
                    e = i(b);
                return {
                    dec: d(e, 0),
                    ra: c(e, 0)
                }
            }
            var k = Math.PI,
                l = Math.sin,
                m = Math.cos,
                n = Math.tan,
                o = Math.asin,
                p = Math.atan2,
                q = k / 180,
                r = 864e5,
                s = 2440588,
                t = 2451545,
                u = 23.4397 * q;
            return function(a, c, d) {
                var h = q * -d,
                    i = q * c,
                    k = b(a),
                    l = j(k),
                    m = g(k, h) - l.ra;
                return {
                    azimuth: e(m, i, l.dec),
                    altitude: f(m, i, l.dec)
                }
            }
        }(),
        aa = {
            picking: {
                vertex: "precision highp float;  //is default in vertex shaders anyway, using highp fixes #49\n#define halfPi 1.57079632679\nattribute vec4 aPosition;\nattribute vec3 aId;\nattribute vec4 aFilter;\nuniform mat4 uModelMatrix;\nuniform mat4 uMatrix;\nuniform float uFogRadius;\nuniform float uTime;\nvarying vec4 vColor;\nvoid main() {\n  float t = clamp((uTime-aFilter.r) / (aFilter.g-aFilter.r), 0.0, 1.0);\n  float f = aFilter.b + (aFilter.a-aFilter.b) * t;\n  if (f == 0.0) {\n    gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\n    vColor = vec4(0.0, 0.0, 0.0, 0.0);\n  } else {\n    vec4 pos = vec4(aPosition.x, aPosition.y, aPosition.z*f, aPosition.w);\n    gl_Position = uMatrix * pos;\n    vec4 mPosition = vec4(uModelMatrix * pos);\n    float distance = length(mPosition);\n    if (distance > uFogRadius) {\n      vColor = vec4(0.0, 0.0, 0.0, 0.0);\n    } else {\n      vColor = vec4(aId, 1.0);\n    }\n  }\n}\n",
                fragment: "#ifdef GL_ES\n  precision mediump float;\n#endif\nvarying vec4 vColor;\nvoid main() {\n  gl_FragColor = vColor;\n}\n"
            },
            buildings: {
                vertex: "precision highp float;  //is default in vertex shaders anyway, using highp fixes #49\n#define halfPi 1.57079632679\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nattribute vec3 aNormal;\nattribute vec3 aColor;\nattribute vec3 aId;\nattribute vec4 aFilter;\nattribute float aHeight;\nuniform mat4 uModelMatrix;\nuniform mat4 uMatrix;\nuniform mat3 uNormalTransform;\nuniform vec3 uLightDirection;\nuniform vec3 uLightColor;\nuniform vec3 uHighlightColor;\nuniform vec3 uHighlightId;\nuniform vec2 uViewDirOnMap;\nuniform vec2 uLowerEdgePoint;\nuniform float uTime;\nvarying vec3 vColor;\nvarying vec2 vTexCoord;\nvarying float verticalDistanceToLowerEdge;\nconst float gradientStrength = 0.4;\nvoid main() {\n  float t = clamp((uTime-aFilter.r) / (aFilter.g-aFilter.r), 0.0, 1.0);\n  float f = aFilter.b + (aFilter.a-aFilter.b) * t;\n  if (f == 0.0) {\n    gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\n    vColor = vec3(0.0, 0.0, 0.0);\n  } else {\n    vec4 pos = vec4(aPosition.x, aPosition.y, aPosition.z*f, aPosition.w);\n    gl_Position = uMatrix * pos;\n    //*** highlight object ******************************************************\n    vec3 color = aColor;\n    if (uHighlightId == aId) {\n      color = mix(aColor, uHighlightColor, 0.5);\n    }\n    //*** light intensity, defined by light direction on surface ****************\n    vec3 transformedNormal = aNormal * uNormalTransform;\n    float lightIntensity = max( dot(transformedNormal, uLightDirection), 0.0) / 1.5;\n    color = color + uLightColor * lightIntensity;\n    vTexCoord = aTexCoord;\n    //*** vertical shading ******************************************************\n    float verticalShading = clamp(gradientStrength - ((pos.z*gradientStrength) / aHeight), 0.0, gradientStrength);\n    //***************************************************************************\n    vColor = color-verticalShading;\n    vec4 worldPos = uModelMatrix * pos;\n    vec2 dirFromLowerEdge = worldPos.xy / worldPos.w - uLowerEdgePoint;\n    verticalDistanceToLowerEdge = dot(dirFromLowerEdge, uViewDirOnMap);\n  }\n}\n",
                fragment: "#ifdef GL_ES\n  precision mediump float;\n#endif\nvarying vec3 vColor;\nvarying vec2 vTexCoord;\nvarying float verticalDistanceToLowerEdge;\nuniform vec3 uFogColor;\nuniform float uFogDistance;\nuniform float uFogBlurDistance;\nuniform sampler2D uWallTexIndex;\nvoid main() {\n    \n  float fogIntensity = (verticalDistanceToLowerEdge - uFogDistance) / uFogBlurDistance;\n  fogIntensity = clamp(fogIntensity, 0.0, 1.0);\n  gl_FragColor = vec4( vColor* texture2D(uWallTexIndex, vTexCoord).rgb, 1.0-fogIntensity);\n}\n"
            },
            "buildings.shadows": {
                vertex: "precision highp float;  //is default in vertex shaders anyway, using highp fixes #49\n#define halfPi 1.57079632679\nattribute vec4 aPosition;\nattribute vec3 aNormal;\nattribute vec3 aColor;\nattribute vec2 aTexCoord;\nattribute vec3 aId;\nattribute vec4 aFilter;\nattribute float aHeight;\nuniform mat4 uModelMatrix;\nuniform mat4 uMatrix;\nuniform mat4 uSunMatrix;\nuniform mat3 uNormalTransform;\nuniform vec3 uHighlightColor;\nuniform vec3 uHighlightId;\nuniform vec2 uViewDirOnMap;\nuniform vec2 uLowerEdgePoint;\nuniform float uTime;\nvarying vec3 vColor;\nvarying vec2 vTexCoord;\nvarying vec3 vNormal;\nvarying vec3 vSunRelPosition;\nvarying float verticalDistanceToLowerEdge;\nfloat gradientStrength = 0.4;\nvoid main() {\n  float t = clamp((uTime-aFilter.r) / (aFilter.g-aFilter.r), 0.0, 1.0);\n  float f = aFilter.b + (aFilter.a-aFilter.b) * t;\n  if (f == 0.0) {\n    gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\n    vColor = vec3(0.0, 0.0, 0.0);\n  } else {\n    vec4 pos = vec4(aPosition.x, aPosition.y, aPosition.z*f, aPosition.w);\n    gl_Position = uMatrix * pos;\n    //*** highlight object ******************************************************\n    vec3 color = aColor;\n    if (uHighlightId == aId) {\n      color = mix(aColor, uHighlightColor, 0.5);\n    }\n    //*** light intensity, defined by light direction on surface ****************\n    vNormal = aNormal;\n    vTexCoord = aTexCoord;\n    //vec3 transformedNormal = aNormal * uNormalTransform;\n    //float lightIntensity = max( dot(aNormal, uLightDirection), 0.0) / 1.5;\n    //color = color + uLightColor * lightIntensity;\n    //*** vertical shading ******************************************************\n    float verticalShading = clamp(gradientStrength - ((pos.z*gradientStrength) / aHeight), 0.0, gradientStrength);\n    //***************************************************************************\n    vColor = color-verticalShading;\n    vec4 worldPos = uModelMatrix * pos;\n    vec2 dirFromLowerEdge = worldPos.xy / worldPos.w - uLowerEdgePoint;\n    verticalDistanceToLowerEdge = dot(dirFromLowerEdge, uViewDirOnMap);\n    \n    // *** shadow mapping ********\n    vec4 sunRelPosition = uSunMatrix * pos;\n    vSunRelPosition = (sunRelPosition.xyz / sunRelPosition.w + 1.0) / 2.0;\n  }\n}\n",
                fragment: "\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#endif\nvarying vec2 vTexCoord;\nvarying vec3 vColor;\nvarying vec3 vNormal;\nvarying vec3 vSunRelPosition;\nvarying float verticalDistanceToLowerEdge;\nuniform vec3 uFogColor;\nuniform vec2 uShadowTexDimensions;\nuniform sampler2D uShadowTexIndex;\nuniform sampler2D uWallTexIndex;\nuniform float uFogDistance;\nuniform float uFogBlurDistance;\nuniform float uShadowStrength;\nuniform vec3 uLightDirection;\nuniform vec3 uLightColor;\nfloat isSeenBySun(const vec2 sunViewNDC, const float depth, const float bias) {\n  if ( clamp( sunViewNDC, 0.0, 1.0) != sunViewNDC)  //not inside sun's viewport\n    return 1.0;\n  \n  float depthFromTexture = texture2D( uShadowTexIndex, sunViewNDC.xy).x;\n  \n  //compare depth values not in reciprocal but in linear depth\n  return step(1.0/depthFromTexture, 1.0/depth + bias);\n}\nvoid main() {\n  vec3 normal = normalize(vNormal); //may degenerate during per-pixel interpolation\n  float diffuse = dot(uLightDirection, normal);\n  diffuse = max(diffuse, 0.0);\n  // reduce shadow strength with:\n  // - lowering sun positions, to be consistent with the shadows on the basemap (there,\n  //   shadows are faded out with lowering sun positions to hide shadow artifacts caused\n  //   when sun direction and map surface are almost perpendicular\n  // - large angles between the sun direction and the surface normal, to hide shadow\n  //   artifacts that occur when surface normal and sun direction are almost perpendicular\n  float shadowStrength = pow( max( min(\n    dot(uLightDirection, vec3(0.0, 0.0, 1.0)),\n    dot(uLightDirection, normal)\n  ), 0.0), 1.5);\n  if (diffuse > 0.0 && shadowStrength > 0.0) {\n    // note: the diffuse term is also the cosine between the surface normal and the\n    // light direction\n    float bias = clamp(0.0007*tan(acos(diffuse)), 0.0, 0.01);\n    vec2 pos = fract( vSunRelPosition.xy * uShadowTexDimensions);\n    \n    vec2 tl = floor(vSunRelPosition.xy * uShadowTexDimensions) / uShadowTexDimensions;\n    float tlVal = isSeenBySun( tl,                           vSunRelPosition.z, bias);\n    float trVal = isSeenBySun( tl + vec2(1.0, 0.0) / uShadowTexDimensions, vSunRelPosition.z, bias);\n    float blVal = isSeenBySun( tl + vec2(0.0, 1.0) / uShadowTexDimensions, vSunRelPosition.z, bias);\n    float brVal = isSeenBySun( tl + vec2(1.0, 1.0) / uShadowTexDimensions, vSunRelPosition.z, bias);\n    float occludedBySun = mix( \n                            mix(tlVal, trVal, pos.x), \n                            mix(blVal, brVal, pos.x),\n                            pos.y);\n    diffuse *= 1.0 - (shadowStrength * (1.0 - occludedBySun));\n  }\n  vec3 color = vColor* texture2D( uWallTexIndex, vTexCoord.st).rgb +\n              (diffuse/1.5) * uLightColor;\n  float fogIntensity = (verticalDistanceToLowerEdge - uFogDistance) / uFogBlurDistance;\n  fogIntensity = clamp(fogIntensity, 0.0, 1.0);\n  //gl_FragColor = vec4( mix(color, uFogColor, fogIntensity), 1.0);\n  gl_FragColor = vec4( color, 1.0-fogIntensity);\n}\n"
            },
            flatColor: {
                vertex: "precision highp float;  //is default in vertex shaders anyway, using highp fixes #49\nattribute vec4 aPosition;\nuniform mat4 uMatrix;\nvoid main() {\n  gl_Position = uMatrix * aPosition;\n}\n",
                fragment: "#ifdef GL_ES\n  precision mediump float;\n#endif\nuniform vec4 uColor;\nvoid main() {\n  gl_FragColor = uColor;\n}\n"
            },
            skywall: {
                vertex: "precision highp float;  //is default in vertex shaders anyway, using highp fixes #49\n#define halfPi 1.57079632679\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nuniform mat4 uMatrix;\nuniform float uAbsoluteHeight;\nvarying vec2 vTexCoord;\nvarying float vRelativeHeight;\nconst float gradientHeight = 10.0;\nconst float gradientStrength = 1.0;\nvoid main() {\n  gl_Position = uMatrix * aPosition;\n  vTexCoord = aTexCoord;\n  vRelativeHeight = aPosition.z / uAbsoluteHeight;\n}\n",
                fragment: "#ifdef GL_ES\n  precision mediump float;\n#endif\nuniform sampler2D uTexIndex;\nuniform vec3 uFogColor;\nvarying vec2 vTexCoord;\nvarying float vRelativeHeight;\nvoid main() {\n  float blendFactor = min(100.0 * vRelativeHeight, 1.0);\n  vec4 texColor = texture2D(uTexIndex, vTexCoord);\n  gl_FragColor = mix( vec4(uFogColor, 1.0), texColor,  blendFactor);\n}\n"
            },
            basemap: {
                vertex: "precision highp float;  //is default in vertex shaders anyway, using highp fixes #49\n#define halfPi 1.57079632679\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjMatrix;\nuniform mat4 uMatrix;\nuniform vec2 uViewDirOnMap;\nuniform vec2 uLowerEdgePoint;\nvarying vec2 vTexCoord;\nvarying float verticalDistanceToLowerEdge;\nvoid main() {\n  gl_Position = uMatrix * aPosition;\n  vTexCoord = aTexCoord;\n  vec4 worldPos = uModelMatrix * aPosition;\n  vec2 dirFromLowerEdge = worldPos.xy / worldPos.w - uLowerEdgePoint;\n  verticalDistanceToLowerEdge = dot(dirFromLowerEdge, uViewDirOnMap);\n}\n",
                fragment: "#ifdef GL_ES\n  precision mediump float;\n#endif\nuniform sampler2D uTexIndex;\nuniform vec3 uFogColor;\nvarying vec2 vTexCoord;\nvarying float verticalDistanceToLowerEdge;\nuniform float uFogDistance;\nuniform float uFogBlurDistance;\nvoid main() {\n  float fogIntensity = (verticalDistanceToLowerEdge - uFogDistance) / uFogBlurDistance;\n  fogIntensity = clamp(fogIntensity, 0.0, 1.0);\n  gl_FragColor = vec4(texture2D(uTexIndex, vec2(vTexCoord.x, 1.0-vTexCoord.y)).rgb, 1.0-fogIntensity);\n}\n"
            },
            texture: {
                vertex: "precision highp float;  //is default in vertex shaders anyway, using highp fixes #49\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nuniform mat4 uMatrix;\nvarying vec2 vTexCoord;\nvoid main() {\n  gl_Position = uMatrix * aPosition;\n  vTexCoord = aTexCoord;\n}\n",
                fragment: "#ifdef GL_ES\n  precision mediump float;\n#endif\nuniform sampler2D uTexIndex;\nvarying vec2 vTexCoord;\nvoid main() {\n  gl_FragColor = vec4(texture2D(uTexIndex, vTexCoord.st).rgb, 1.0);\n}\n"
            },
            fogNormal: {
                vertex: "precision highp float;  //is default in vertex shaders anyway, using highp fixes #49\nattribute vec4 aPosition;\nattribute vec4 aFilter;\nattribute vec3 aNormal;\nuniform mat4 uMatrix;\nuniform mat4 uModelMatrix;\nuniform mat3 uNormalMatrix;\nuniform vec2 uViewDirOnMap;\nuniform vec2 uLowerEdgePoint;\nvarying float verticalDistanceToLowerEdge;\nvarying vec3 vNormal;\nuniform float uTime;\nvoid main() {\n  float t = clamp((uTime-aFilter.r) / (aFilter.g-aFilter.r), 0.0, 1.0);\n  float f = aFilter.b + (aFilter.a-aFilter.b) * t;\n  if (f == 0.0) {\n    gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\n    verticalDistanceToLowerEdge = 0.0;\n  } else {\n    vec4 pos = vec4(aPosition.x, aPosition.y, aPosition.z*f, aPosition.w);\n    gl_Position = uMatrix * pos;\n    vNormal = uNormalMatrix * aNormal;\n    vec4 worldPos = uModelMatrix * pos;\n    vec2 dirFromLowerEdge = worldPos.xy / worldPos.w - uLowerEdgePoint;\n    verticalDistanceToLowerEdge = dot(dirFromLowerEdge, uViewDirOnMap);\n  }\n}\n",
                fragment: "\n#ifdef GL_ES\n  precision mediump float;\n#endif\nuniform float uFogDistance;\nuniform float uFogBlurDistance;\nvarying float verticalDistanceToLowerEdge;\nvarying vec3 vNormal;\nvoid main() {\n  float fogIntensity = (verticalDistanceToLowerEdge - uFogDistance) / uFogBlurDistance;\n  gl_FragColor = vec4(normalize(vNormal) / 2.0 + 0.5, clamp(fogIntensity, 0.0, 1.0));\n}\n"
            },
            ambientFromDepth: {
                vertex: "precision highp float;  //is default in vertex shaders anyway, using highp fixes #49\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\nvoid main() {\n  gl_Position = aPosition;\n  vTexCoord = aTexCoord;\n}\n",
                fragment: "#ifdef GL_FRAGMENT_PRECISION_HIGH\n  // we need high precision for the depth values\n  precision highp float;\n#else\n  precision mediump float;\n#endif\nuniform sampler2D uDepthTexIndex;\nuniform sampler2D uFogTexIndex;\nuniform vec2 uInverseTexSize;   //in 1/pixels, e.g. 1/512 if the texture is 512px wide\nuniform float uEffectStrength;\nuniform float uNearPlane;\nuniform float uFarPlane;\nvarying vec2 vTexCoord;\n/* Retrieves the depth value 'offset' pixels away from 'pos' from texture 'uDepthTexIndex'. */\nfloat getDepth(vec2 pos, ivec2 offset)\n{\n  float z = texture2D(uDepthTexIndex, pos + float(offset) * uInverseTexSize).x;\n  return (2.0 * uNearPlane) / (uFarPlane + uNearPlane - z * (uFarPlane - uNearPlane)); // linearize depth\n}\n/* getOcclusionFactor() determines a heuristic factor (from [0..1]) for how \n * much the fragment at 'pos' with depth 'depthHere'is occluded by the \n * fragment that is (dx, dy) texels away from it.\n */\nfloat getOcclusionFactor(float depthHere, vec2 pos, ivec2 offset)\n{\n    float depthThere = getDepth(pos, offset);\n    /* if the fragment at (dx, dy) has no depth (i.e. there was nothing rendered there), \n     * then 'here' is not occluded (result 1.0) */\n    if (depthThere == 0.0)\n      return 1.0;\n    /* if the fragment at (dx, dy) is further away from the viewer than 'here', then\n     * 'here is not occluded' */\n    if (depthHere < depthThere )\n      return 1.0;\n      \n    float relDepthDiff = depthThere / depthHere;\n    float depthDiff = abs(depthThere - depthHere) * uFarPlane;\n    /* if the fragment at (dx, dy) is closer to the viewer than 'here', then it occludes\n     * 'here'. The occlusion is the higher the bigger the depth difference between the two\n     * locations is.\n     * However, if the depth difference is too high, we assume that 'there' lies in a\n     * completely different depth region of the scene than 'here' and thus cannot occlude\n     * 'here'. This last assumption gets rid of very dark artifacts around tall buildings.\n     */\n    return depthDiff < 50.0 ? mix(0.99, 1.0, 1.0 - clamp(depthDiff, 0.0, 1.0)) : 1.0;\n}\n/* This shader approximates the ambient occlusion in screen space (SSAO). \n * It is based on the assumption that a pixel will be occluded by neighboring \n * pixels iff. those have a depth value closer to the camera than the original\n * pixel itself (the function getOcclusionFactor() computes this occlusion \n * by a single other pixel).\n *\n * A naive approach would sample all pixels within a given distance. For an\n * interesting-looking effect, the sampling area needs to be at least 9 pixels \n * wide (-/+ 4), requiring 81 texture lookups per pixel for ambient occlusion.\n * This overburdens many GPUs.\n * To make the ambient occlusion computation faster, we do not consider all \n * texels in the sampling area, but only 16. This causes some sampling artifacts\n * that are later removed by blurring the ambient occlusion texture (this is \n * done in a separate shader).\n */\nvoid main() {\n  float depthHere = getDepth(vTexCoord, ivec2(0, 0));\n  float fogIntensity = texture2D(uFogTexIndex, vTexCoord).w;\n  if (depthHere == 0.0)\n  {\n\t//there was nothing rendered 'here' --\x3e it can't be occluded\n    gl_FragColor = vec4(1.0);\n    return;\n  }\n  float occlusionFactor = 1.0;\n  \n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2(-1,  0));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2(+1,  0));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2( 0, -1));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2( 0, +1));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2(-2, -2));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2(+2, +2));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2(+2, -2));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2(-2, +2));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2(-4,  0));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2(+4,  0));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2( 0, -4));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2( 0, +4));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2(-4, -4));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2(+4, +4));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2(+4, -4));\n  occlusionFactor *= getOcclusionFactor(depthHere, vTexCoord, ivec2(-4, +4));\n  occlusionFactor = pow(occlusionFactor, 4.0) + 55.0/255.0; // empirical bias determined to let SSAO have no effect on the map plane\n  occlusionFactor = 1.0 - ((1.0 - occlusionFactor) * uEffectStrength * (1.0-fogIntensity));\n  gl_FragColor = vec4(vec3(occlusionFactor), 1.0);\n}\n"
            },
            blur: {
                vertex: "precision highp float;  //is default in vertex shaders anyway, using highp fixes #49\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\nvoid main() {\n  gl_Position = aPosition;\n  vTexCoord = aTexCoord;\n}\n",
                fragment: "#ifdef GL_ES\n  precision mediump float;\n#endif\nuniform sampler2D uTexIndex;\nuniform vec2 uInverseTexSize;   //in 1/pixels, e.g. 1/512 if the texture is 512px wide\nvarying vec2 vTexCoord;\n/* Retrieves the texel color 'offset' pixels away from 'pos' from texture 'uTexIndex'. */\nvec4 getTexel(vec2 pos, vec2 offset)\n{\n  return texture2D(uTexIndex, pos + offset * uInverseTexSize);\n}\nvoid main() {\n  vec4 center = texture2D(uTexIndex, vTexCoord);\n  vec4 nonDiagonalNeighbors = getTexel(vTexCoord, vec2(-1.0,  0.0)) +\n                              getTexel(vTexCoord, vec2(+1.0,  0.0)) +\n                              getTexel(vTexCoord, vec2( 0.0, -1.0)) +\n                              getTexel(vTexCoord, vec2( 0.0, +1.0));\n  vec4 diagonalNeighbors =    getTexel(vTexCoord, vec2(-1.0, -1.0)) +\n                              getTexel(vTexCoord, vec2(+1.0, +1.0)) +\n                              getTexel(vTexCoord, vec2(-1.0, +1.0)) +\n                              getTexel(vTexCoord, vec2(+1.0, -1.0));\n  \n  //approximate Gaussian blur (mean 0.0, stdev 1.0)\n  gl_FragColor = 0.2/1.0 * center + \n                 0.5/4.0 * nonDiagonalNeighbors + \n                 0.3/4.0 * diagonalNeighbors;\n}\n"
            },
            "basemap.shadows": {
                vertex: "precision highp float;  //is default in vertex shaders anyway, using highp fixes #49\nattribute vec3 aPosition;\nattribute vec3 aNormal;\nuniform mat4 uModelMatrix;\nuniform mat4 uMatrix;\nuniform mat4 uSunMatrix;\nuniform vec2 uViewDirOnMap;\nuniform vec2 uLowerEdgePoint;\n//varying vec2 vTexCoord;\nvarying vec3 vSunRelPosition;\nvarying vec3 vNormal;\nvarying float verticalDistanceToLowerEdge;\nvoid main() {\n  vec4 pos = vec4(aPosition.xyz, 1.0);\n  gl_Position = uMatrix * pos;\n  vec4 sunRelPosition = uSunMatrix * pos;\n  vSunRelPosition = (sunRelPosition.xyz / sunRelPosition.w + 1.0) / 2.0;\n  vNormal = aNormal;\n  vec4 worldPos = uModelMatrix * pos;\n  vec2 dirFromLowerEdge = worldPos.xy / worldPos.w - uLowerEdgePoint;\n  verticalDistanceToLowerEdge = dot(dirFromLowerEdge, uViewDirOnMap);\n}\n",
                fragment: "\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#endif\n/* This shader computes the diffuse brightness of the map layer. It does *not* \n * render the map texture itself, but is instead intended to be blended on top\n * of an already rendered map.\n * Note: this shader is not (and does not attempt to) be physically correct.\n *       It is intented to be a blend between a useful illustration of cast\n *       shadows and a mitigation of shadow casting artifacts occuring at\n *       low angles on incidence.\n *       Map brightness is only affected by shadows, not by light direction.\n *       Shadows are darkest when light comes from straight above (and thus\n *       shadows can be computed reliably) and become less and less visible\n *       with the light source close to the horizont (where moirC) and offset\n *       artifacts would otherwise be visible).\n */\n//uniform sampler2D uTexIndex;\nuniform sampler2D uShadowTexIndex;\nuniform vec3 uFogColor;\nuniform vec3 uDirToSun;\nuniform vec2 uShadowTexDimensions;\nuniform float uShadowStrength;\nvarying vec2 vTexCoord;\nvarying vec3 vSunRelPosition;\nvarying vec3 vNormal;\nvarying float verticalDistanceToLowerEdge;\nuniform float uFogDistance;\nuniform float uFogBlurDistance;\nfloat isSeenBySun( const vec2 sunViewNDC, const float depth, const float bias) {\n  if ( clamp( sunViewNDC, 0.0, 1.0) != sunViewNDC)  //not inside sun's viewport\n    return 1.0;\n  \n  float depthFromTexture = texture2D( uShadowTexIndex, sunViewNDC.xy).x;\n  \n  //compare depth values not in reciprocal but in linear depth\n  return step(1.0/depthFromTexture, 1.0/depth + bias);\n}\nvoid main() {\n  //vec2 tl = floor(vSunRelPosition.xy * uShadowTexDimensions) / uShadowTexDimensions;\n  //gl_FragColor = vec4(vec3(texture2D( uShadowTexIndex, tl).x), 1.0);\n  //return;\n  float diffuse = dot(uDirToSun, normalize(vNormal));\n  diffuse = max(diffuse, 0.0);\n  \n  float shadowStrength = uShadowStrength * pow(diffuse, 1.5);\n  if (diffuse > 0.0) {\n    // note: the diffuse term is also the cosine between the surface normal and the\n    // light direction\n    float bias = clamp(0.0007*tan(acos(diffuse)), 0.0, 0.01);\n    \n    vec2 pos = fract( vSunRelPosition.xy * uShadowTexDimensions);\n    \n    vec2 tl = floor(vSunRelPosition.xy * uShadowTexDimensions) / uShadowTexDimensions;\n    float tlVal = isSeenBySun( tl,                           vSunRelPosition.z, bias);\n    float trVal = isSeenBySun( tl + vec2(1.0, 0.0) / uShadowTexDimensions, vSunRelPosition.z, bias);\n    float blVal = isSeenBySun( tl + vec2(0.0, 1.0) / uShadowTexDimensions, vSunRelPosition.z, bias);\n    float brVal = isSeenBySun( tl + vec2(1.0, 1.0) / uShadowTexDimensions, vSunRelPosition.z, bias);\n    diffuse = mix( mix(tlVal, trVal, pos.x), \n                   mix(blVal, brVal, pos.x),\n                   pos.y);\n  }\n  diffuse = mix(1.0, diffuse, shadowStrength);\n  \n  float fogIntensity = (verticalDistanceToLowerEdge - uFogDistance) / uFogBlurDistance;\n  fogIntensity = clamp(fogIntensity, 0.0, 1.0);\n  float darkness = (1.0 - diffuse);\n  darkness *=  (1.0 - fogIntensity);\n  gl_FragColor = vec4(vec3(1.0 - darkness), 1.0);\n}\n"
            },
            outlineMap: {
                vertex: "precision highp float;  //is default in vertex shaders anyway, using highp fixes #49\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nuniform mat4 uMatrix;\nvarying vec2 vTexCoord;\nvoid main() {\n  gl_Position = uMatrix * aPosition;\n  vTexCoord = aTexCoord;\n}\n",
                fragment: "#ifdef GL_FRAGMENT_PRECISION_HIGH\n  // we need high precision for the depth values\n  precision highp float;\n#else\n  precision mediump float;\n#endif\nuniform sampler2D uDepthTexIndex;\nuniform sampler2D uFogNormalTexIndex;\nuniform sampler2D uIdTexIndex;\nuniform vec2 uInverseTexSize;   //in 1/pixels, e.g. 1/512 if the texture is 512px wide\nuniform float uEffectStrength;\nuniform float uNearPlane;\nuniform float uFarPlane;\nvarying vec2 vTexCoord;\n/* Retrieves the depth value 'offset' pixels away from 'pos' from texture 'uDepthTexIndex'. */\nfloat getDepth(vec2 pos, vec2 offset)\n{\n  float z = texture2D(uDepthTexIndex, pos + offset * uInverseTexSize).x;\n  return (2.0 * uNearPlane) / (uFarPlane + uNearPlane - z * (uFarPlane - uNearPlane)); // linearize depth\n}\nvec3 getNormal(vec2 pos, vec2 offset)\n{\n  return normalize(texture2D(uFogNormalTexIndex, pos + offset * uInverseTexSize).xyz * 2.0 - 1.0);\n}\nvec3 getEncodedId(vec2 pos, vec2 offset)\n{\n  return texture2D(uIdTexIndex, pos + offset * uInverseTexSize).xyz;\n}\nvoid main() {\n  float fogIntensity = texture2D(uFogNormalTexIndex, vTexCoord).w;\n  vec3 normalHere =  getNormal(vTexCoord, vec2(0, 0));\n  vec3 normalRight = getNormal(vTexCoord, vec2(1, 0));\n  vec3 normalAbove = getNormal(vTexCoord, vec2(0,-1));\n  \n  float edgeStrengthFromNormal = \n    step( dot(normalHere, normalRight), 0.9) +\n    step( dot(normalHere, normalAbove), 0.9);\n  float depthHere =  getDepth(vTexCoord, vec2(0,  0));\n  float depthRight = getDepth(vTexCoord, vec2(1,  0));\n  float depthAbove = getDepth(vTexCoord, vec2(0, -1));\n  float depthDiffRight = abs(depthHere - depthRight) * 7500.0;\n  float depthDiffAbove = abs(depthHere - depthAbove) * 7500.0;\n  float edgeStrengthFromDepth = step(10.0, depthDiffRight) + \n                                step(10.0, depthDiffAbove);\n  \n  vec3 idHere = getEncodedId(vTexCoord, vec2(0,0));\n  vec3 idRight = getEncodedId(vTexCoord, vec2(1,0));\n  vec3 idAbove = getEncodedId(vTexCoord, vec2(0,-1));\n  float edgeStrengthFromId = (idHere != idRight || idHere != idAbove) ? 1.0 : 0.0;\n  \n  float edgeStrength = max( edgeStrengthFromId, max( edgeStrengthFromNormal, edgeStrengthFromDepth));\n  float occlusionFactor = 1.0 - (edgeStrength * uEffectStrength);\n  occlusionFactor = 1.0 - ((1.0- occlusionFactor) * (1.0-fogIntensity));\n  gl_FragColor = vec4(vec3(occlusionFactor), 1.0);\n}\n"
            }
        },
        ba = function() {
            var a = {};
            return a.getContext = function(a) {
                    var b = {
                        antialias: !ia.options.fastMode,
                        depth: !0,
                        premultipliedAlpha: !1
                    };
                    try {
                        ja = a.getContext("webgl", b)
                    } catch (c) {}
                    if (!ja) try {
                        ja = a.getContext("experimental-webgl", b)
                    } catch (c) {}
                    if (!ja) throw new Error("WebGL not supported");
                    return a.addEventListener("webglcontextlost", function(a) {
                        console.warn("context lost")
                    }), a.addEventListener("webglcontextrestored", function(a) {
                        console.warn("context restored")
                    }), ja.viewport(0, 0, ia.width, ia.height), ja.cullFace(ja.BACK), ja.enable(ja.CULL_FACE), ja.enable(ja.DEPTH_TEST), ja.clearColor(.5, .5, .5, 1), ia.options.fastMode || (ja.anisotropyExtension = ja.getExtension("EXT_texture_filter_anisotropic"), ja.anisotropyExtension && (ja.anisotropyExtension.maxAnisotropyLevel = ja.getParameter(ja.anisotropyExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT)), ja.depthTextureExtension = ja.getExtension("WEBGL_depth_texture")), ja
                }, a.start = function(a) {
                    return setInterval(function() {
                        requestAnimationFrame(a)
                    }, 17)
                }, a.stop = function(a) {
                    clearInterval(a)
                }, a.destroy = function() {
                    void 0 !== ja && (ja.canvas.parentNode.removeChild(ja.canvas), ja = void 0)
                }, a.util = {}, a.util.nextPowerOf2 = function(a) {
                    return a--, a |= a >> 1, a |= a >> 2, a |= a >> 4, a |= a >> 8, a |= a >> 16, ++a
                }, a.util.calcNormal = function(a, b, c, d, e, f, g, h, i) {
                    var j = a - d,
                        k = b - e,
                        l = c - f,
                        m = d - g,
                        n = e - h,
                        o = f - i,
                        p = k * o - l * n,
                        q = l * m - j * o,
                        r = j * n - k * m;
                    return this.calcUnit(p, q, r)
                }, a.util.calcUnit = function(a, b, c) {
                    var d = Math.sqrt(a * a + b * b + c * c);
                    return 0 === d && (d = 1e-5), [a / d, b / d, c / d]
                }, a.Buffer = function(a, b) {
                    this.id = ja.createBuffer(), this.itemSize = a, this.numItems = b.length / a, ja.bindBuffer(ja.ARRAY_BUFFER, this.id), ja.bufferData(ja.ARRAY_BUFFER, b, ja.STATIC_DRAW), b = null
                }, a.Buffer.prototype = {
                    enable: function() {
                        ja.bindBuffer(ja.ARRAY_BUFFER, this.id)
                    },
                    destroy: function() {
                        ja.deleteBuffer(this.id), this.id = null
                    }
                }, a.Framebuffer = function(a, b, c) {
                    if (c && !ja.depthTextureExtension) throw "Depth textures are not supported by your GPU";
                    this.useDepthTexture = !!c, this.setSize(a, b)
                }, a.Framebuffer.prototype = {
                    setSize: function(b, c) {
                        if (this.frameBuffer) {
                            if (b === this.width && c === this.height) return
                        } else this.frameBuffer = ja.createFramebuffer();
                        if (ja.bindFramebuffer(ja.FRAMEBUFFER, this.frameBuffer), this.width = b, this.height = c, this.depthRenderBuffer && (ja.deleteRenderbuffer(this.depthRenderBuffer), this.depthRenderBuffer = null), this.depthTexture && (this.depthTexture.destroy(), this.depthTexture = null), this.useDepthTexture ? (this.depthTexture = new a.texture.Image, this.depthTexture.enable(0), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_MIN_FILTER, ja.NEAREST), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_MAG_FILTER, ja.NEAREST), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_WRAP_S, ja.CLAMP_TO_EDGE), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_WRAP_T, ja.CLAMP_TO_EDGE), ja.texImage2D(ja.TEXTURE_2D, 0, ja.DEPTH_STENCIL, b, c, 0, ja.DEPTH_STENCIL, ja.depthTextureExtension.UNSIGNED_INT_24_8_WEBGL, null), ja.framebufferTexture2D(ja.FRAMEBUFFER, ja.DEPTH_STENCIL_ATTACHMENT, ja.TEXTURE_2D, this.depthTexture.id, 0)) : (this.depthRenderBuffer = ja.createRenderbuffer(), ja.bindRenderbuffer(ja.RENDERBUFFER, this.depthRenderBuffer), ja.renderbufferStorage(ja.RENDERBUFFER, ja.DEPTH_COMPONENT16, b, c), ja.framebufferRenderbuffer(ja.FRAMEBUFFER, ja.DEPTH_ATTACHMENT, ja.RENDERBUFFER, this.depthRenderBuffer)), this.renderTexture && this.renderTexture.destroy(), this.renderTexture = new a.texture.Data(b, c), ja.bindTexture(ja.TEXTURE_2D, this.renderTexture.id), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_WRAP_S, ja.CLAMP_TO_EDGE), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_WRAP_T, ja.CLAMP_TO_EDGE), ja.framebufferTexture2D(ja.FRAMEBUFFER, ja.COLOR_ATTACHMENT0, ja.TEXTURE_2D, this.renderTexture.id, 0), ja.checkFramebufferStatus(ja.FRAMEBUFFER) !== ja.FRAMEBUFFER_COMPLETE) throw new Error("This combination of framebuffer attachments does not work");
                        ja.bindRenderbuffer(ja.RENDERBUFFER, null), ja.bindFramebuffer(ja.FRAMEBUFFER, null)
                    },
                    enable: function() {
                        ja.bindFramebuffer(ja.FRAMEBUFFER, this.frameBuffer), this.useDepthTexture || ja.bindRenderbuffer(ja.RENDERBUFFER, this.depthRenderBuffer)
                    },
                    disable: function() {
                        ja.bindFramebuffer(ja.FRAMEBUFFER, null), this.useDepthTexture || ja.bindRenderbuffer(ja.RENDERBUFFER, null)
                    },
                    getPixel: function(a, b) {
                        var c = new Uint8Array(4);
                        if (!(a < 0 || b < 0 || a >= this.width || b >= this.height)) return ja.readPixels(a, b, 1, 1, ja.RGBA, ja.UNSIGNED_BYTE, c), c
                    },
                    getData: function() {
                        var a = new Uint8Array(this.width * this.height * 4);
                        return ja.readPixels(0, 0, this.width, this.height, ja.RGBA, ja.UNSIGNED_BYTE, a), a
                    },
                    destroy: function() {
                        this.renderTexture && this.renderTexture.destroy(), this.depthTexture && this.depthTexture.destroy()
                    }
                }, a.Shader = function(a) {
                    var b;
                    if (this.shaderName = a.shaderName, this.id = ja.createProgram(), this.attach(ja.VERTEX_SHADER, a.vertexShader), this.attach(ja.FRAGMENT_SHADER, a.fragmentShader), ja.linkProgram(this.id), !ja.getProgramParameter(this.id, ja.LINK_STATUS)) throw new Error(ja.getProgramParameter(this.id, ja.VALIDATE_STATUS) + "\n" + ja.getError());
                    for (this.attributeNames = a.attributes || [], this.uniformNames = a.uniforms || [], ja.useProgram(this.id), this.attributes = {}, b = 0; b < this.attributeNames.length; b++) this.locateAttribute(this.attributeNames[b]);
                    for (this.uniforms = {}, b = 0; b < this.uniformNames.length; b++) this.locateUniform(this.uniformNames[b])
                }, a.Shader.warned = {}, a.Shader.prototype = {
                    locateAttribute: function(a) {
                        var b = ja.getAttribLocation(this.id, a);
                        if (b < 0) return void console.warn('unable to locate attribute "%s" in shader "%s"', a, this.shaderName);
                        this.attributes[a] = b
                    },
                    locateUniform: function(a) {
                        var b = ja.getUniformLocation(this.id, a);
                        if (!b) return void console.warn('unable to locate uniform "%s" in shader "%s"', a, this.shaderName);
                        this.uniforms[a] = b
                    },
                    attach: function(a, b) {
                        var c = ja.createShader(a);
                        if (ja.shaderSource(c, b), ja.compileShader(c), !ja.getShaderParameter(c, ja.COMPILE_STATUS)) throw new Error(ja.getShaderInfoLog(c));
                        ja.attachShader(this.id, c)
                    },
                    enable: function() {
                        ja.useProgram(this.id);
                        for (var a in this.attributes) ja.enableVertexAttribArray(this.attributes[a]);
                        return this
                    },
                    disable: function() {
                        if (this.attributes)
                            for (var a in this.attributes) ja.disableVertexAttribArray(this.attributes[a])
                    },
                    bindBuffer: function(b, c) {
                        if (void 0 === this.attributes[c]) {
                            var d = this.shaderName + ":" + c;
                            return void(a.Shader.warned[d] || (console.warn('attempt to bind VBO to invalid attribute "%s" in shader "%s"', c, this.shaderName), a.Shader.warned[d] = !0))
                        }
                        b.enable(), ja.vertexAttribPointer(this.attributes[c], b.itemSize, ja.FLOAT, !1, 0, 0)
                    },
                    setUniform: function(b, c, d) {
                        if (void 0 === this.uniforms[b]) {
                            var e = this.shaderName + ":" + b;
                            return void(a.Shader.warned[e] || (console.warn('attempt to bind to invalid uniform "%s" in shader "%s"', b, this.shaderName), a.Shader.warned[e] = !0))
                        }
                        ja["uniform" + c](this.uniforms[b], d)
                    },
                    setUniforms: function(a) {
                        for (var b in a) this.setUniform(a[b][0], a[b][1], a[b][2])
                    },
                    setUniformMatrix: function(b, c, d) {
                        if (void 0 === this.uniforms[b]) {
                            var e = this.shaderName + ":" + b;
                            return void(a.Shader.warned[e] || (console.warn('attempt to bind to invalid uniform "%s" in shader "%s"', b, this.shaderName), a.Shader.warned[e] = !0))
                        }
                        ja["uniformMatrix" + c](this.uniforms[b], !1, d)
                    },
                    setUniformMatrices: function(a) {
                        for (var b in a) this.setUniformMatrix(a[b][0], a[b][1], a[b][2])
                    },
                    bindTexture: function(a, b, c) {
                        c.enable(b), this.setUniform(a, "1i", b)
                    },
                    destroy: function() {
                        this.disable(), this.id = null
                    }
                }, a.Matrix = function(a) {
                    this.data = new Float32Array(a || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
                }, a.Matrix.identity = function() {
                    return new a.Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
                }, a.Matrix.identity3 = function() {
                    return new a.Matrix([1, 0, 0, 0, 1, 0, 0, 0, 1])
                },
                function() {
                    function b(a) {
                        return a * Math.PI / 180
                    }

                    function c(a, b, c) {
                        var d = b[0],
                            e = b[1],
                            f = b[2],
                            g = b[3],
                            h = b[4],
                            i = b[5],
                            j = b[6],
                            k = b[7],
                            l = b[8],
                            m = b[9],
                            n = b[10],
                            o = b[11],
                            p = b[12],
                            q = b[13],
                            r = b[14],
                            s = b[15],
                            t = c[0],
                            u = c[1],
                            v = c[2],
                            w = c[3],
                            x = c[4],
                            y = c[5],
                            z = c[6],
                            A = c[7],
                            B = c[8],
                            C = c[9],
                            D = c[10],
                            E = c[11],
                            F = c[12],
                            G = c[13],
                            H = c[14],
                            I = c[15];
                        a[0] = d * t + e * x + f * B + g * F, a[1] = d * u + e * y + f * C + g * G, a[2] = d * v + e * z + f * D + g * H, a[3] = d * w + e * A + f * E + g * I, a[4] = h * t + i * x + j * B + k * F, a[5] = h * u + i * y + j * C + k * G, a[6] = h * v + i * z + j * D + k * H, a[7] = h * w + i * A + j * E + k * I, a[8] = l * t + m * x + n * B + o * F, a[9] = l * u + m * y + n * C + o * G, a[10] = l * v + m * z + n * D + o * H, a[11] = l * w + m * A + n * E + o * I, a[12] = p * t + q * x + r * B + s * F, a[13] = p * u + q * y + r * C + s * G, a[14] = p * v + q * z + r * D + s * H, a[15] = p * w + q * A + r * E + s * I
                    }
                    a.Matrix.prototype = {
                        multiply: function(a) {
                            return c(this.data, this.data, a.data), this
                        },
                        translate: function(a, b, d) {
                            return c(this.data, this.data, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, a, b, d, 1]), this
                        },
                        rotateX: function(a) {
                            var d = b(a),
                                e = Math.cos(d),
                                f = Math.sin(d);
                            return c(this.data, this.data, [1, 0, 0, 0, 0, e, f, 0, 0, -f, e, 0, 0, 0, 0, 1]), this
                        },
                        rotateY: function(a) {
                            var d = b(a),
                                e = Math.cos(d),
                                f = Math.sin(d);
                            return c(this.data, this.data, [e, 0, -f, 0, 0, 1, 0, 0, f, 0, e, 0, 0, 0, 0, 1]), this
                        },
                        rotateZ: function(a) {
                            var d = b(a),
                                e = Math.cos(d),
                                f = Math.sin(d);
                            return c(this.data, this.data, [e, -f, 0, 0, f, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), this
                        },
                        scale: function(a, b, d) {
                            return c(this.data, this.data, [a, 0, 0, 0, 0, b, 0, 0, 0, 0, d, 0, 0, 0, 0, 1]), this
                        }
                    }, a.Matrix.multiply = function(a, b) {
                        var d = new Float32Array(16);
                        return c(d, a.data, b.data), d
                    }, a.Matrix.Perspective = function(b, c, d, e) {
                        var f = 1 / Math.tan(b * (Math.PI / 180) / 2),
                            g = 1 / (d - e);
                        return new a.Matrix([f / c, 0, 0, 0, 0, f, 0, 0, 0, 0, (e + d) * g, -1, 0, 0, 2 * e * d * g, 0])
                    }, a.Matrix.Frustum = function(b, c, d, e, f, g) {
                        var h = 1 / (c - b),
                            i = 1 / (d - e),
                            j = 1 / (f - g);
                        return new a.Matrix([2 * f * h, 0, 0, 0, 0, 2 * f * i, 0, 0, (c + b) * h, (d + e) * i, (g + f) * j, -1, 0, 0, g * f * 2 * j, 0])
                    }, a.Matrix.OffCenterProjection = function(b, c, d, e, f, g) {
                        var h = Y(T(d, b)),
                            i = Y(T(c, b)),
                            j = z(b, c, d),
                            k = T(b, e),
                            l = T(c, e),
                            m = T(d, e),
                            n = -S(k, j),
                            o = S(h, k) * f / n,
                            p = S(h, m) * f / n,
                            q = S(i, k) * f / n,
                            r = S(i, l) * f / n;
                        return a.Matrix.Frustum(o, p, r, q, f, g)
                    }, a.Matrix.Ortho = function(b, c, d, e, f, g) {
                        return new a.Matrix([2 / (c - b), 0, 0, 0, 0, 2 / (d - e), 0, 0, 0, 0, -2 / (g - f), 0, -(c + b) / (c - b), -(d + e) / (d - e), -(g + f) / (g - f), 1])
                    }, a.Matrix.invert3 = function(a) {
                        var b = a[0],
                            c = a[1],
                            d = a[2],
                            e = a[4],
                            f = a[5],
                            g = a[6],
                            h = a[8],
                            i = a[9],
                            j = a[10],
                            k = j * f - g * i,
                            l = -j * e + g * h,
                            m = i * e - f * h,
                            n = b * k + c * l + d * m;
                        return n ? (n = 1 / n, [k * n, (-j * c + d * i) * n, (g * c - d * f) * n, l * n, (j * b - d * h) * n, (-g * b + d * e) * n, m * n, (-i * b + c * h) * n, (f * b - c * e) * n]) : null
                    }, a.Matrix.transpose3 = function(a) {
                        return new Float32Array([a[0], a[3], a[6], a[1], a[4], a[7], a[2], a[5], a[8]])
                    }, a.Matrix.transpose = function(a) {
                        return new Float32Array([a[0], a[4], a[8], a[12], a[1], a[5], a[9], a[13], a[2], a[6], a[10], a[14], a[3], a[7], a[11], a[15]])
                    }, a.Matrix.transform = function(a) {
                        var b = a[12],
                            c = a[13],
                            d = a[14],
                            e = a[15];
                        return {
                            x: (b / e + 1) / 2,
                            y: (c / e + 1) / 2,
                            z: (d / e + 1) / 2
                        }
                    }, a.Matrix.invert = function(a) {
                        var b = new Float32Array(16),
                            c = a[0],
                            d = a[1],
                            e = a[2],
                            f = a[3],
                            g = a[4],
                            h = a[5],
                            i = a[6],
                            j = a[7],
                            k = a[8],
                            l = a[9],
                            m = a[10],
                            n = a[11],
                            o = a[12],
                            p = a[13],
                            q = a[14],
                            r = a[15],
                            s = c * h - d * g,
                            t = c * i - e * g,
                            u = c * j - f * g,
                            v = d * i - e * h,
                            w = d * j - f * h,
                            x = e * j - f * i,
                            y = k * p - l * o,
                            z = k * q - m * o,
                            A = k * r - n * o,
                            B = l * q - m * p,
                            C = l * r - n * p,
                            D = m * r - n * q,
                            E = s * D - t * C + u * B + v * A - w * z + x * y;
                        if (E) return E = 1 / E, b[0] = (h * D - i * C + j * B) * E, b[1] = (e * C - d * D - f * B) * E, b[2] = (p * x - q * w + r * v) * E, b[3] = (m * w - l * x - n * v) * E, b[4] = (i * A - g * D - j * z) * E, b[5] = (c * D - e * A + f * z) * E, b[6] = (q * u - o * x - r * t) * E, b[7] = (k * x - m * u + n * t) * E, b[8] = (g * C - h * A + j * y) * E, b[9] = (d * A - c * C - f * y) * E, b[10] = (o * w - p * u + r * s) * E, b[11] = (l * u - k * w - n * s) * E, b[12] = (h * z - g * B - i * y) * E, b[13] = (c * B - d * z + e * y) * E, b[14] = (p * t - o * v - q * s) * E, b[15] = (k * v - l * t + m * s) * E, b
                    }
                }(), a.texture = {}, a.texture.Image = function() {
                    this.id = ja.createTexture(), ja.bindTexture(ja.TEXTURE_2D, this.id), ja.bindTexture(ja.TEXTURE_2D, null)
                }, a.texture.Image.prototype = {
                    clamp: function(a, b) {
                        if (a.width <= b && a.height <= b) return a;
                        var c = b,
                            d = b,
                            e = a.width / a.height;
                        e < 1 ? c = Math.round(d * e) : d = Math.round(c / e);
                        var f = wa.createElement("CANVAS");
                        return f.width = c, f.height = d, f.getContext("2d").drawImage(a, 0, 0, f.width, f.height), f
                    },
                    load: function(a, b) {
                        var c = new Image;
                        return c.crossOrigin = "*", c.onload = function() {
                            this.set(c), b && b(c)
                        }.bind(this), c.onerror = function() {
                            b && b()
                        }, c.src = a, this
                    },
                    color: function(a) {
                        return ja.bindTexture(ja.TEXTURE_2D, this.id), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_MIN_FILTER, ja.LINEAR), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_MAG_FILTER, ja.LINEAR), ja.texImage2D(ja.TEXTURE_2D, 0, ja.RGBA, 1, 1, 0, ja.RGBA, ja.UNSIGNED_BYTE, new Uint8Array([255 * a[0], 255 * a[1], 255 * a[2], 255 * (void 0 === a[3] ? 1 : a[3])])), ja.bindTexture(ja.TEXTURE_2D, null), this
                    },
                    set: function(a) {
                        if (this.id) return a = this.clamp(a, ja.getParameter(ja.MAX_TEXTURE_SIZE)), ja.bindTexture(ja.TEXTURE_2D, this.id), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_MIN_FILTER, ja.LINEAR_MIPMAP_NEAREST), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_MAG_FILTER, ja.LINEAR), ja.texImage2D(ja.TEXTURE_2D, 0, ja.RGBA, ja.RGBA, ja.UNSIGNED_BYTE, a), ja.generateMipmap(ja.TEXTURE_2D), ja.anisotropyExtension && ja.texParameterf(ja.TEXTURE_2D, ja.anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT, ja.anisotropyExtension.maxAnisotropyLevel), ja.bindTexture(ja.TEXTURE_2D, null), this
                    },
                    enable: function(a) {
                        if (this.id) return ja.activeTexture(ja.TEXTURE0 + (a || 0)), ja.bindTexture(ja.TEXTURE_2D, this.id), this
                    },
                    destroy: function() {
                        ja.bindTexture(ja.TEXTURE_2D, null), ja.deleteTexture(this.id), this.id = null
                    }
                }, a.texture.Data = function(a, b, c, d) {
                    this.id = ja.createTexture(), ja.bindTexture(ja.TEXTURE_2D, this.id), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_MIN_FILTER, ja.NEAREST), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_MAG_FILTER, ja.NEAREST);
                    var e = null;
                    if (c) {
                        var f = a * b * 4;
                        e = new Uint8Array(f), e.set(c.subarray(0, f))
                    }
                    ja.texImage2D(ja.TEXTURE_2D, 0, ja.RGBA, a, b, 0, ja.RGBA, ja.UNSIGNED_BYTE, e), ja.bindTexture(ja.TEXTURE_2D, null)
                }, a.texture.Data.prototype = {
                    enable: function(a) {
                        return ja.activeTexture(ja.TEXTURE0 + (a || 0)), ja.bindTexture(ja.TEXTURE_2D, this.id), this
                    },
                    destroy: function() {
                        ja.bindTexture(ja.TEXTURE_2D, null), ja.deleteTexture(this.id), this.id = null
                    }
                }, a
        }(),
        ca = {
            len: function(a) {
                return Math.sqrt(a[0] * a[0] + a[1] * a[1])
            },
            add: function(a, b) {
                return [a[0] + b[0], a[1] + b[1]]
            },
            sub: function(a, b) {
                return [a[0] - b[0], a[1] - b[1]]
            },
            dot: function(a, b) {
                return a[1] * b[0] - a[0] * b[1]
            },
            scale: function(a, b) {
                return [a[0] * b, a[1] * b]
            },
            equals: function(a, b) {
                return a[0] === b[0] && a[1] === b[1]
            }
        },
        da = {
            len: function(a) {
                return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
            },
            sub: function(a, b) {
                return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
            },
            unit: function(a) {
                var b = this.len(a);
                return [a[0] / b, a[1] / b, a[2] / b]
            },
            normal: function(a, b, c) {
                var d = this.sub(a, b),
                    e = this.sub(b, c);
                return this.unit([d[1] * e[2] - d[2] * e[1], d[2] * e[0] - d[0] * e[2], d[0] * e[1] - d[1] * e[0]])
            }
        },
        ea = function() {
            function a(a, c, e) {
                e = e || 2;
                var f = c && c.length,
                    g = f ? c[0] * e : a.length,
                    h = b(a, 0, g, e, !0),
                    j = [];
                if (!h) return j;
                var k, l, m, n, o, p, q;
                if (f && (h = i(a, c, h, e)), a.length > 80 * e) {
                    k = m = a[0], l = n = a[1];
                    for (var r = e; r < g; r += e) o = a[r], p = a[r + 1], o < k && (k = o), p < l && (l = p), o > m && (m = o), p > n && (n = p);
                    q = Math.max(m - k, n - l)
                }
                return d(h, j, e, k, l, q), j
            }

            function b(a, b, c, d, e) {
                var f, g;
                if (e === C(a, b, c, d) > 0)
                    for (f = b; f < c; f += d) g = z(f, a[f], a[f + 1], g);
                else
                    for (f = c - d; f >= b; f -= d) g = z(f, a[f], a[f + 1], g);
                return g && t(g, g.next) && (A(g), g = g.next), g
            }

            function c(a, b) {
                if (!a) return a;
                b || (b = a);
                var c, d = a;
                do {
                    if (c = !1, d.steiner || !t(d, d.next) && 0 !== s(d.prev, d, d.next)) d = d.next;
                    else {
                        if (A(d), (d = b = d.prev) === d.next) return null;
                        c = !0
                    }
                } while (c || d !== b);
                return b
            }

            function d(a, b, i, j, k, l, n) {
                if (a) {
                    !n && l && m(a, j, k, l);
                    for (var o, p, q = a; a.prev !== a.next;)
                        if (o = a.prev, p = a.next, l ? f(a, j, k, l) : e(a)) b.push(o.i / i), b.push(a.i / i), b.push(p.i / i), A(a), a = p.next, q = p.next;
                        else if ((a = p) === q) {
                        n ? 1 === n ? (a = g(a, b, i), d(a, b, i, j, k, l, 2)) : 2 === n && h(a, b, i, j, k, l) : d(c(a), b, i, j, k, l, 1);
                        break
                    }
                }
            }

            function e(a) {
                var b = a.prev,
                    c = a,
                    d = a.next;
                if (s(b, c, d) >= 0) return !1;
                for (var e = a.next.next; e !== a.prev;) {
                    if (q(b.x, b.y, c.x, c.y, d.x, d.y, e.x, e.y) && s(e.prev, e, e.next) >= 0) return !1;
                    e = e.next
                }
                return !0
            }

            function f(a, b, c, d) {
                var e = a.prev,
                    f = a,
                    g = a.next;
                if (s(e, f, g) >= 0) return !1;
                for (var h = e.x < f.x ? e.x < g.x ? e.x : g.x : f.x < g.x ? f.x : g.x, i = e.y < f.y ? e.y < g.y ? e.y : g.y : f.y < g.y ? f.y : g.y, j = e.x > f.x ? e.x > g.x ? e.x : g.x : f.x > g.x ? f.x : g.x, k = e.y > f.y ? e.y > g.y ? e.y : g.y : f.y > g.y ? f.y : g.y, l = o(h, i, b, c, d), m = o(j, k, b, c, d), n = a.nextZ; n && n.z <= m;) {
                    if (n !== a.prev && n !== a.next && q(e.x, e.y, f.x, f.y, g.x, g.y, n.x, n.y) && s(n.prev, n, n.next) >= 0) return !1;
                    n = n.nextZ
                }
                for (n = a.prevZ; n && n.z >= l;) {
                    if (n !== a.prev && n !== a.next && q(e.x, e.y, f.x, f.y, g.x, g.y, n.x, n.y) && s(n.prev, n, n.next) >= 0) return !1;
                    n = n.prevZ
                }
                return !0
            }

            function g(a, b, c) {
                var d = a;
                do {
                    var e = d.prev,
                        f = d.next.next;
                    !t(e, f) && u(e, d, d.next, f) && w(e, f) && w(f, e) && (b.push(e.i / c), b.push(d.i / c), b.push(f.i / c), A(d), A(d.next), d = a = f), d = d.next
                } while (d !== a);
                return d
            }

            function h(a, b, e, f, g, h) {
                var i = a;
                do {
                    for (var j = i.next.next; j !== i.prev;) {
                        if (i.i !== j.i && r(i, j)) {
                            var k = y(i, j);
                            return i = c(i, i.next), k = c(k, k.next), d(i, b, e, f, g, h), void d(k, b, e, f, g, h)
                        }
                        j = j.next
                    }
                    i = i.next
                } while (i !== a)
            }

            function i(a, d, e, f) {
                var g, h, i, l, m, n = [];
                for (g = 0, h = d.length; g < h; g++) i = d[g] * f, l = g < h - 1 ? d[g + 1] * f : a.length, m = b(a, i, l, f, !1), m === m.next && (m.steiner = !0), n.push(p(m));
                for (n.sort(j), g = 0; g < n.length; g++) k(n[g], e), e = c(e, e.next);
                return e
            }

            function j(a, b) {
                return a.x - b.x
            }

            function k(a, b) {
                if (b = l(a, b)) {
                    var d = y(b, a);
                    c(d, d.next)
                }
            }

            function l(a, b) {
                var c, d = b,
                    e = a.x,
                    f = a.y,
                    g = -1 / 0;
                do {
                    if (f <= d.y && f >= d.next.y) {
                        var h = d.x + (f - d.y) * (d.next.x - d.x) / (d.next.y - d.y);
                        if (h <= e && h > g) {
                            if (g = h, h === e) {
                                if (f === d.y) return d;
                                if (f === d.next.y) return d.next
                            }
                            c = d.x < d.next.x ? d : d.next
                        }
                    }
                    d = d.next
                } while (d !== b);
                if (!c) return null;
                if (e === g) return c.prev;
                var i, j = c,
                    k = c.x,
                    l = c.y,
                    m = 1 / 0;
                for (d = c.next; d !== j;) e >= d.x && d.x >= k && q(f < l ? e : g, f, k, l, f < l ? g : e, f, d.x, d.y) && ((i = Math.abs(f - d.y) / (e - d.x)) < m || i === m && d.x > c.x) && w(d, a) && (c = d, m = i), d = d.next;
                return c
            }

            function m(a, b, c, d) {
                var e = a;
                do {
                    null === e.z && (e.z = o(e.x, e.y, b, c, d)), e.prevZ = e.prev, e.nextZ = e.next, e = e.next
                } while (e !== a);
                e.prevZ.nextZ = null, e.prevZ = null, n(e)
            }

            function n(a) {
                var b, c, d, e, f, g, h, i, j = 1;
                do {
                    for (c = a, a = null, f = null, g = 0; c;) {
                        for (g++, d = c, h = 0, b = 0; b < j && (h++, d = d.nextZ); b++);
                        for (i = j; h > 0 || i > 0 && d;) 0 === h ? (e = d, d = d.nextZ, i--) : 0 !== i && d ? c.z <= d.z ? (e = c, c = c.nextZ, h--) : (e = d, d = d.nextZ, i--) : (e = c, c = c.nextZ, h--), f ? f.nextZ = e : a = e, e.prevZ = f, f = e;
                        c = d
                    }
                    f.nextZ = null, j *= 2
                } while (g > 1);
                return a
            }

            function o(a, b, c, d, e) {
                return a = 32767 * (a - c) / e, b = 32767 * (b - d) / e, a = 16711935 & (a | a << 8), a = 252645135 & (a | a << 4), a = 858993459 & (a | a << 2), a = 1431655765 & (a | a << 1), b = 16711935 & (b | b << 8), b = 252645135 & (b | b << 4), b = 858993459 & (b | b << 2), b = 1431655765 & (b | b << 1), a | b << 1
            }

            function p(a) {
                var b = a,
                    c = a;
                do {
                    b.x < c.x && (c = b), b = b.next
                } while (b !== a);
                return c
            }

            function q(a, b, c, d, e, f, g, h) {
                return (e - g) * (b - h) - (a - g) * (f - h) >= 0 && (a - g) * (d - h) - (c - g) * (b - h) >= 0 && (c - g) * (f - h) - (e - g) * (d - h) >= 0
            }

            function r(a, b) {
                return a.next.i !== b.i && a.prev.i !== b.i && !v(a, b) && w(a, b) && w(b, a) && x(a, b)
            }

            function s(a, b, c) {
                return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y)
            }

            function t(a, b) {
                return a.x === b.x && a.y === b.y
            }

            function u(a, b, c, d) {
                return !!(t(a, b) && t(c, d) || t(a, d) && t(c, b)) || s(a, b, c) > 0 != s(a, b, d) > 0 && s(c, d, a) > 0 != s(c, d, b) > 0
            }

            function v(a, b) {
                var c = a;
                do {
                    if (c.i !== a.i && c.next.i !== a.i && c.i !== b.i && c.next.i !== b.i && u(c, c.next, a, b)) return !0;
                    c = c.next
                } while (c !== a);
                return !1
            }

            function w(a, b) {
                return s(a.prev, a, a.next) < 0 ? s(a, b, a.next) >= 0 && s(a, a.prev, b) >= 0 : s(a, b, a.prev) < 0 || s(a, a.next, b) < 0
            }

            function x(a, b) {
                var c = a,
                    d = !1,
                    e = (a.x + b.x) / 2,
                    f = (a.y + b.y) / 2;
                do {
                    c.y > f != c.next.y > f && e < (c.next.x - c.x) * (f - c.y) / (c.next.y - c.y) + c.x && (d = !d), c = c.next
                } while (c !== a);
                return d
            }

            function y(a, b) {
                var c = new B(a.i, a.x, a.y),
                    d = new B(b.i, b.x, b.y),
                    e = a.next,
                    f = b.prev;
                return a.next = b, b.prev = a, c.next = e, e.prev = c, d.next = c, c.prev = d, f.next = d, d.prev = f, d
            }

            function z(a, b, c, d) {
                var e = new B(a, b, c);
                return d ? (e.next = d.next, e.prev = d, d.next.prev = e, d.next = e) : (e.prev = e, e.next = e), e
            }

            function A(a) {
                a.next.prev = a.prev, a.prev.next = a.next, a.prevZ && (a.prevZ.nextZ = a.nextZ), a.nextZ && (a.nextZ.prevZ = a.prevZ)
            }

            function B(a, b, c) {
                this.i = a, this.x = b, this.y = c, this.prev = null, this.next = null, this.z = null, this.prevZ = null, this.nextZ = null, this.steiner = !1
            }

            function C(a, b, c, d) {
                for (var e = 0, f = b, g = c - d; f < c; f += d) e += (a[g] - a[f]) * (a[f + 1] + a[g + 1]), g = f;
                return e
            }
            return a.deviation = function(a, b, c, d) {
                var e, f, g = b && b.length,
                    h = g ? b[0] * c : a.length,
                    i = Math.abs(C(a, 0, h, c));
                if (g)
                    for (e = 0, f = b.length; e < f; e++) {
                        var j = b[e] * c,
                            k = e < f - 1 ? b[e + 1] * c : a.length;
                        i -= Math.abs(C(a, j, k, c))
                    }
                var l = 0;
                for (e = 0, f = d.length; e < f; e += 3) {
                    var m = d[e] * c,
                        n = d[e + 1] * c,
                        o = d[e + 2] * c;
                    l += Math.abs((a[m] - a[o]) * (a[n + 1] - a[m + 1]) - (a[m] - a[n]) * (a[o + 1] - a[m + 1]))
                }
                return 0 === i && 0 === l ? 0 : Math.abs((l - i) / i)
            }, a.flatten = function(a) {
                for (var b = a[0][0].length, c = {
                        vertices: [],
                        holes: [],
                        dimensions: b
                    }, d = 0, e = 0; e < a.length; e++) {
                    for (var f = 0; f < a[e].length; f++)
                        for (var g = 0; g < b; g++) c.vertices.push(a[e][f][g]);
                    e > 0 && (d += a[e - 1].length, c.holes.push(d))
                }
                return c
            }, a
        }(),
        fa = {
            NUM_Y_SEGMENTS: 24,
            NUM_X_SEGMENTS: 32,
            quad: function(a, b, c, d, e, f) {
                this.triangle(a, b, c, d, f), this.triangle(a, d, e, b, f)
            },
            triangle: function(a, b, c, d, e) {
                var f = da.normal(b, c, d);
                [].push.apply(a.vertices, [].concat(b, d, c)), [].push.apply(a.normals, [].concat(f, f, f)), [].push.apply(a.colors, [].concat(e, e, e)), a.texCoords.push(0, 0, 0, 0, 0, 0)
            },
            circle: function(a, b, c, d, e) {
                d = d || 0;
                for (var f, g, h = 0; h < this.NUM_X_SEGMENTS; h++) f = h / this.NUM_X_SEGMENTS, g = (h + 1) / this.NUM_X_SEGMENTS, this.triangle(a, [b[0] + c * Math.sin(f * Math.PI * 2), b[1] + c * Math.cos(f * Math.PI * 2), d], [b[0], b[1], d], [b[0] + c * Math.sin(g * Math.PI * 2), b[1] + c * Math.cos(g * Math.PI * 2), d], e)
            },
            polygon: function(a, b, c, d) {
                c = c || 0;
                var e, f, g, h, i, j = [],
                    k = [],
                    l = 0;
                for (e = 0, f = b.length; e < f; e++) {
                    for (h = b[e], g = 0; g < h.length; g++) i = h[g], j.push(i[0], i[1], c + (i[2] || 0));
                    e && (l += b[e - 1].length, k.push(l))
                }
                var m, n, o, p = ea(j, k, 3);
                for (e = 0, f = p.length - 2; e < f; e += 3) m = 3 * p[e], n = 3 * p[e + 1], o = 3 * p[e + 2], this.triangle(a, [j[m], j[m + 1], j[m + 2]], [j[n], j[n + 1], j[n + 2]], [j[o], j[o + 1], j[o + 2]], d)
            },
            cube: function(a, b, c, d, e, f, g, h) {
                e = e || 0, f = f || 0, g = g || 0;
                var i = [e, f, g],
                    j = [e + b, f, g],
                    k = [e + b, f + c, g],
                    l = [e, f + c, g],
                    m = [e, f, g + d],
                    n = [e + b, f, g + d],
                    o = [e + b, f + c, g + d],
                    p = [e, f + c, g + d];
                this.quad(a, j, i, l, k, h), this.quad(a, m, n, o, p, h), this.quad(a, i, j, n, m, h), this.quad(a, j, k, o, n, h), this.quad(a, k, l, p, o, h), this.quad(a, l, i, m, p, h)
            },
            cylinder: function(a, b, c, d, e, f, g) {
                f = f || 0;
                for (var h, i, j, k, l, m, n = this.NUM_X_SEGMENTS, o = 2 * Math.PI, p = 0; p < n; p++) h = p / n * o, i = (p + 1) / n * o, j = Math.sin(h), k = Math.cos(h), l = Math.sin(i), m = Math.cos(i), this.triangle(a, [b[0] + c * j, b[1] + c * k, f], [b[0] + d * l, b[1] + d * m, f + e], [b[0] + c * l, b[1] + c * m, f], g), 0 !== d && this.triangle(a, [b[0] + d * j, b[1] + d * k, f + e], [b[0] + d * l, b[1] + d * m, f + e], [b[0] + c * j, b[1] + c * k, f], g)
            },
            dome: function(a, b, c, d, e, f) {
                e = e || 0;
                for (var g, h, i, j, k, l, m, n, o, p, q = this.NUM_Y_SEGMENTS / 2, r = Math.PI / 2, s = 0; s < q; s++) g = s / q * r - r, h = (s + 1) / q * r - r, i = Math.sin(g), j = Math.cos(g), k = Math.sin(h), l = Math.cos(h), m = j * c, n = l * c, o = (k - i) * d, p = e - k * d, this.cylinder(a, b, n, m, o, p, f)
            },
            sphere: function(a, b, c, d, e, f) {
                e = e || 0;
                var g = 0;
                return g += this.circle(a, b, c, e, f), g += this.cylinder(a, b, c, c, d, e, f), g += this.circle(a, b, c, e + d, f)
            },
            pyramid: function(a, b, c, d, e, f) {
                e = e || 0, b = b[0];
                for (var g = 0, h = b.length - 1; g < h; g++) this.triangle(a, [b[g][0], b[g][1], e], [b[g + 1][0], b[g + 1][1], e], [c[0], c[1], e + d], f)
            },
            extrusion: function(a, b, c, d, e, f) {
                d = d || 0;
                var g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v = f[2] * c,
                    w = f[3] * c;
                for (r = 0, s = b.length; r < s; r++)
                    for (g = b[r], t = 0, u = g.length - 1; t < u; t++) h = g[t], i = g[t + 1], j = ca.len(ca.sub(h, i)), k = [h[0], h[1], d], l = [i[0], i[1], d], m = [i[0], i[1], d + c], n = [h[0], h[1], d + c], o = da.normal(k, l, m), [].push.apply(a.vertices, [].concat(k, m, l, k, n, m)), [].push.apply(a.normals, [].concat(o, o, o, o, o, o)), [].push.apply(a.colors, [].concat(e, e, e, e, e, e)), p = f[0] * j << 0, q = f[1] * j << 0, a.texCoords.push(p, w, q, v, q, w, p, w, p, v, q, v)
            }
        },
        ga = function() {
            function a(a, c, d, f, g) {
                for (var h, i = [r * Math.cos(d[1] / 180 * Math.PI), r], k = e(c.geometry), l = 0, m = k.length; l < m; l++) h = b(k[l], d, i), j(a, c.properties, h, f, g)
            }

            function b(a, b, d) {
                return a.map(function(a, e) {
                    return 0 === e !== c(a) && a.reverse(), a.map(function(a) {
                        return [(a[0] - b[0]) * d[0], -(a[1] - b[1]) * d[1]]
                    })
                })
            }

            function c(a) {
                return 0 < a.reduce(function(a, b, c, d) {
                    return a + (c < d.length - 1 ? (d[c + 1][0] - b[0]) * (d[c + 1][1] + b[1]) : 0)
                }, 0)
            }

            function d(a) {
                for (var b = 1 / 0, c = 1 / 0, d = -1 / 0, e = -1 / 0, f = 0; f < a.length; f++) b = Math.min(b, a[f][0]), c = Math.min(c, a[f][1]), d = Math.max(d, a[f][0]), e = Math.max(e, a[f][1]);
                return {
                    minX: b,
                    minY: c,
                    maxX: d,
                    maxY: e
                }
            }

            function e(a) {
                switch (a.type) {
                    case "MultiPolygon":
                        return a.coordinates;
                    case "Polygon":
                        return [a.coordinates];
                    default:
                        return []
                }
            }

            function f(a) {
                return "string" != typeof a ? null : (a = a.toLowerCase(), "#" === a[0] ? a : o[p[a] || a] || null)
            }

            function g(a, b) {
                b = b || 0;
                var c, a = $.parse(a);
                return c = a ? a.toArray() : m, [c[0] + b, c[1] + b, c[2] + b]
            }

            function j(a, b, c, e, j) {
                var l = k(b, d(c[0])),
                    m = g(e || b.wallColor || b.color || f(b.material), j),
                    n = g(e || b.roofColor || f(b.roofMaterial), j);
                switch (b.shape) {
                    case "cone":
                        return void fa.cylinder(a, l.center, l.radius, 0, l.wallHeight, l.wallZ, m);
                    case "dome":
                        return void fa.dome(a, l.center, l.radius, l.wallHeight, l.wallZ, m);
                    case "pyramid":
                        return void fa.pyramid(a, c, l.center, l.wallHeight, l.wallZ, m);
                    case "sphere":
                        return void fa.sphere(a, l.center, l.radius, l.wallHeight, l.wallZ, m)
                }
                switch (b.roofShape) {
                    case "cone":
                        fa.cylinder(a, l.center, l.radius, 0, l.roofHeight, l.roofZ, n);
                        break;
                    case "dome":
                        fa.dome(a, l.center, l.radius, l.roofHeight, l.roofZ, n);
                        break;
                    case "pyramid":
                        "cylinder" === b.shape ? fa.cylinder(a, l.center, l.radius, 0, l.roofHeight, l.roofZ, n) : fa.pyramid(a, c, l.center, l.roofHeight, l.roofZ, n);
                        break;
                    case "skillion":
                        i(a, b, c, l, m, n);
                        break;
                    case "gabled":
                        h(a, b, c, 0, l, m, n);
                        break;
                    case "hipped":
                        h(a, b, c, 1 / 3, l, m, n);
                        break;
                    case "half-hipped":
                    case "gambrel":
                    case "mansard":
                        h(a, b, c, 0, l, m, n);
                        break;
                    case "onion":
                        for (var o, p, r = [{
                                rScale: 1,
                                hScale: 0
                            }, {
                                rScale: .8,
                                hScale: .15
                            }, {
                                rScale: 1,
                                hScale: .5
                            }, {
                                rScale: .8,
                                hScale: .7
                            }, {
                                rScale: .4,
                                hScale: .8
                            }, {
                                rScale: 0,
                                hScale: 1
                            }], s = 0, t = r.length - 1; s < t; s++) o = l.roofHeight * r[s].hScale, p = l.roofHeight * r[s + 1].hScale, fa.cylinder(a, l.center, l.radius * r[s].rScale, l.radius * r[s + 1].rScale, p - o, l.roofZ + o, n);
                        break;
                    default:
                        "cylinder" === b.shape ? fa.circle(a, l.center, l.radius, l.roofZ, n) : fa.polygon(a, c, l.roofZ, n)
                }
                switch (b.roofShape) {
                    case "none":
                        return;
                    case "cylinder":
                        return void fa.cylinder(a, l.center, l.radius, l.radius, l.wallHeight, l.wallZ, m);
                    default:
                        var u = .2,
                            v = .4;
                        "glass" !== b.material && (u = 0, v = 0, b.levels && (v = parseFloat(b.levels) - parseFloat(b.minLevel || 0) << 0)), fa.extrusion(a, c, l.wallHeight, l.wallZ, m, [0, q, u / l.wallHeight, v / l.wallHeight])
                }
            }

            function k(a, b) {
                var c = {};
                switch (c.center = [b.minX + (b.maxX - b.minX) / 2, b.minY + (b.maxY - b.minY) / 2], c.radius = (b.maxX - b.minX) / 2, c.roofHeight = a.roofHeight || (a.roofLevels ? a.roofLevels * n : 0), a.roofShape) {
                    case "cone":
                    case "pyramid":
                    case "dome":
                    case "onion":
                        c.roofHeight = c.roofHeight || 1 * c.radius;
                        break;
                    case "gabled":
                    case "hipped":
                    case "half-hipped":
                    case "skillion":
                    case "gambrel":
                    case "mansard":
                    case "round":
                        c.roofHeight = c.roofHeight || 1 * n;
                        break;
                    case "flat":
                        c.roofHeight = 0;
                        break;
                    default:
                        c.roofHeight = 0
                }
                var d;
                if (c.wallZ = a.minHeight || (a.minLevel ? a.minLevel * n : 0), void 0 !== a.height) d = a.height, c.roofHeight = Math.min(c.roofHeight, d), c.roofZ = d - c.roofHeight, c.wallHeight = d - c.roofHeight - c.wallZ;
                else if (void 0 !== a.levels) d = a.levels * n, c.roofZ = d, c.wallHeight = d - c.wallZ;
                else {
                    switch (a.shape) {
                        case "cone":
                        case "dome":
                        case "pyramid":
                            d = 2 * c.radius, c.roofHeight = 0;
                            break;
                        case "sphere":
                            d = 4 * c.radius, c.roofHeight = 0;
                            break;
                        default:
                            d = l
                    }
                    c.roofZ = d, c.wallHeight = d - c.wallZ
                }
                return c
            }
            var l = 10,
                m = $.parse("rgb(220, 210, 200)").toArray(),
                n = 3,
                o = {
                    brick: "#cc7755",
                    bronze: "#ffeecc",
                    canvas: "#fff8f0",
                    concrete: "#999999",
                    copper: "#a0e0d0",
                    glass: "#e8f8f8",
                    gold: "#ffcc00",
                    plants: "#009933",
                    metal: "#aaaaaa",
                    panel: "#fff8f0",
                    plaster: "#999999",
                    roof_tiles: "#f08060",
                    silver: "#cccccc",
                    slate: "#666666",
                    stone: "#996666",
                    tar_paper: "#333333",
                    wood: "#deb887"
                },
                p = {
                    asphalt: "tar_paper",
                    bitumen: "tar_paper",
                    block: "stone",
                    bricks: "brick",
                    glas: "glass",
                    glassfront: "glass",
                    grass: "plants",
                    masonry: "stone",
                    granite: "stone",
                    panels: "panel",
                    paving_stones: "stone",
                    plastered: "plaster",
                    rooftiles: "roof_tiles",
                    roofingfelt: "tar_paper",
                    sandstone: "stone",
                    sheet: "canvas",
                    sheets: "canvas",
                    shingle: "tar_paper",
                    shingles: "tar_paper",
                    slates: "slate",
                    steel: "metal",
                    tar: "tar_paper",
                    tent: "canvas",
                    thatch: "plants",
                    tile: "roof_tiles",
                    tiles: "roof_tiles"
                },
                q = .5,
                r = 6378137 * Math.PI / 180;
            return a
        }();
    if (void 0 === ha) {
        var ha = function(a, b) {
            b = b || {
                bubbles: !1,
                cancelable: !1,
                detail: void 0
            };
            var c = wa.createEvent("CustomEvent");
            return c.initCustomEvent(a, b.bubbles, b.cancelable, b.detail), c
        };
        ha.prototype = window.Event.prototype
    }
    var ia, ja, ka = function(a) {
        if (ia = this, ia.options = a || {}, ia.options.style) {
            var b = ia.options.style;
            (b.color || b.wallColor) && (sa = $.parse(b.color || b.wallColor).toArray())
        }
        ia.baseURL = ia.options.baseURL || ".", Ja.backgroundColor = $.parse(ia.options.backgroundColor || va).toArray(), Ja.fogColor = $.parse(ia.options.fogColor || ua).toArray(), ia.options.highlightColor && (ta = $.parse(ia.options.highlightColor).toArray()), Ja.Buildings.showBackfaces = ia.options.showBackfaces, Ja.effects = {};
        for (var c = ia.options.effects || [], d = 0; d < c.length; d++) Ja.effects[c[d]] = !0;
        ia.attribution = ia.options.attribution || ka.ATTRIBUTION, ia.minZoom = Math.max(parseFloat(ia.options.minZoom || pa), pa), ia.maxZoom = Math.min(parseFloat(ia.options.maxZoom || qa), qa), ia.maxZoom < ia.minZoom && (ia.minZoom = pa, ia.maxZoom = qa), ia.bounds = ia.options.bounds, ia.position = ia.options.position || {
            latitude: 52.52,
            longitude: 13.41
        }, ia.zoom = ia.options.zoom || ia.minZoom + (ia.maxZoom - ia.minZoom) / 2, ia.rotation = ia.options.rotation || 0, ia.tilt = ia.options.tilt || 0, ia.options.disabled && ia.setDisabled(!0)
    };
    ka.VERSION = "1.0.0", ka.ATTRIBUTION = '<a href="#/"></a>', ka.prototype = {
        appendTo: function(a, b, c) {
            "string" == typeof a && (a = wa.getElementById(a)), ia.container = wa.createElement("DIV"), ia.container.className = "osmb", 0 === a.offsetHeight && (a.style.height = "100%", console.warn("Map container height should be set. Now defaults to 100%.")), a.appendChild(ia.container), ia.width = void 0 !== b ? b : a.offsetWidth, ia.height = void 0 !== c ? c : a.offsetHeight;
            var d = wa.createElement("CANVAS");
            return d.className = "osmb-viewport", d.width = ia.width, d.height = ia.width, ia.container.appendChild(d), ja = ba.getContext(d), la.init(d), ia._getStateFromUrl(), ia.options.state && (ia._setStateToUrl(), ia.on("change", ia._setStateToUrl)), ia._attribution = wa.createElement("DIV"), ia._attribution.className = "osmb-attribution", ia.container.appendChild(ia._attribution), ia._updateAttribution(), ia.setDate(new Date), Ja.start(), ia
        },
        remove: function() {},
        on: function(a, b) {
            return ja.canvas.addEventListener(a, b), ia
        },
        off: function(a, b) {
            ja.canvas.removeEventListener(a, b)
        },
        emit: function(a, b) {
            if (void 0 !== ja) {
                var c = new ha(a, {
                    detail: b
                });
                ja.canvas.dispatchEvent(c)
            }
        },
        setStyle: function() {
            return ia
        },
        setDate: function(a) {
            return Ka.setDate("string" == typeof a ? new Date(a) : a), ia
        },
        project: function(a, b, c) {
            var d = za * Math.cos(ia.position.latitude / 180 * Math.PI),
                e = [(b - ia.position.longitude) * d, -(a - ia.position.latitude) * za, c * oa],
                f = C(Ja.viewProjMatrix.data, e);
            return f = W(U(f, [1, 1, 1]), .5), {
                x: f[0] * ia.width,
                y: (1 - f[1]) * ia.height,
                z: f[2]
            }
        },
        unproject: function(a, b) {
            var c = ba.Matrix.invert(Ja.viewProjMatrix.data),
                d = [a / ia.width, 1 - b / ia.height];
            d = k(l(d, 2), [-1, -1, -1]);
            var e = D(d[0], d[1], c);
            if (void 0 !== e) return metersPerDegreeLongitude = za * Math.cos(ia.position.latitude / 180 * Math.PI), {
                latitude: ia.position.latitude - e[1] / za,
                longitude: ia.position.longitude + e[0] / metersPerDegreeLongitude
            }
        },
        addOBJ: function(a, b, c) {
            return new Ia.OBJ(a, b, c)
        },
        addGeoJSON: function(a, b) {
            return new Ia.GeoJSON(a, b)
        },
        addGeoJSONTiles: function(a, b) {
            return b = b || {}, b.fixedZoom = b.fixedZoom || 15, ia.dataGrid = new Fa(a, Ha.Tile, b), ia.dataGrid
        },
        addMapTiles: function(a, b) {
            return ia.basemapGrid = new Fa(a, La.Tile, b), ia.basemapGrid
        },
        highlight: function(a, b) {
            return Ja.Buildings.highlightId = a ? Ja.Picking.idToColor(a) : null, Ja.Buildings.highlightColor = a && b ? $.parse(b).toArray() : ta, ia
        },
        show: function(a, b) {
            return Ga.remove("hidden", a, b), ia
        },
        hide: function(a, b) {
            return Ga.add("hidden", a, b), ia
        },
        getTarget: function(a, b, c) {
            return Ja.Picking.getTarget(a, b, c), ia
        },
        screenshot: function(a) {
            return Ja.screenshotCallback = a, ia
        },
        _updateAttribution: function() {
            var a = [];
            ia.attribution && a.push(ia.attribution), ia._attribution.innerHTML = a.join(" ?? ")
        },
        _getStateFromUrl: function() {
            var a = location.search,
                b = {};
            a && a.substring(1).replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(a, c, d) {
                c && (b[c] = d)
            }), ia.setPosition(void 0 !== b.lat && void 0 !== b.lon ? {
                latitude: b.lat,
                longitude: b.lon
            } : ia.position), ia.setZoom(void 0 !== b.zoom ? b.zoom : ia.zoom), ia.setRotation(void 0 !== b.rotation ? b.rotation : ia.rotation), ia.setTilt(void 0 !== b.tilt ? b.tilt : ia.tilt)
        },
        _setStateToUrl: function() {
            history.replaceState && !ia.stateDebounce && (ia.stateDebounce = setTimeout(function() {
                ia.stateDebounce = null;
                var a = [];
                a.push("lat=" + ia.position.latitude.toFixed(6)), a.push("lon=" + ia.position.longitude.toFixed(6)), a.push("zoom=" + ia.zoom.toFixed(1)), a.push("tilt=" + ia.tilt.toFixed(1)), a.push("rotation=" + ia.rotation.toFixed(1)), history.replaceState({}, "", "?" + a.join("&"))
            }, 1e3))
        },
        setDisabled: function(a) {
            return la.disabled = !!a, ia
        },
        isDisabled: function() {
            return !!la.disabled
        },
        getBounds: function() {
            var a = Ja.getViewQuad(),
                b = [];
            for (var c in a) b[c] = I(a[c]);
            return b
        },
        setZoom: function(a, b) {
            return a = parseFloat(a), a = Math.max(a, ia.minZoom), a = Math.min(a, ia.maxZoom), ia.zoom !== a && (ia.zoom = a, ia.emit("zoom", {
                zoom: a
            }), ia.emit("change")), ia
        },
        getZoom: function() {
            return ia.zoom
        },
        setPosition: function(a) {
            var b = parseFloat(a.latitude),
                c = parseFloat(a.longitude);
            if (!isNaN(b) && !isNaN(c)) return ia.position = {
                latitude: t(b, -90, 90),
                longitude: t(c, -180, 180)
            }, ia.emit("change"), ia
        },
        getPosition: function() {
            return ia.position
        },
        setSize: function(a) {
            return a.width === ia.width && a.height === ia.height || (ia.width = a.width, ia.height = a.height, ia.emit("resize", {
                width: ia.width,
                height: ia.height
            })), ia
        },
        getSize: function() {
            return {
                width: ia.width,
                height: ia.height
            }
        },
        setRotation: function(a) {
            return a = parseFloat(a) % 360, ia.rotation !== a && (ia.rotation = a, ia.emit("rotate", {
                rotation: a
            }), ia.emit("change")), ia
        },
        getRotation: function() {
            return ia.rotation
        },
        setTilt: function(a) {
            return a = t(parseFloat(a), 0, 45), ia.tilt !== a && (ia.tilt = a, ia.emit("tilt", {
                tilt: a
            }), ia.emit("change")), ia
        },
        getTilt: function() {
            return ia.tilt
        },
        destroy: function() {
            Ja.destroy(), ba.destroy(), Ha.Index.destroy(), ia.container.innerHTML = ""
        }
    }, "function" == typeof define ? define([], ka) : "object" == typeof module ? module.exports = ka : window.OSMBuildings = ka;
    var la = {};
    la.disabled = !1, la.init = function(a) {
        function b(a) {
            o(a), la.disabled || ia.setZoom(ia.zoom + 1, a);
            var b = m(a, n(a.target));
            ia.emit("doubleclick", {
                x: b.x,
                y: b.y,
                button: a.button
            })
        }

        function c(a) {
            if (o(a), !(a.button > 1)) {
                z = ia.zoom, A = ia.rotation, B = ia.tilt, u = n(a.target);
                var b = m(a, u);
                x = v = b.x, y = w = b.y, C = !0, ia.emit("pointerdown", {
                    x: b.x,
                    y: b.y,
                    button: a.button
                })
            }
        }

        function d(a) {
            var b;
            C ? (0 !== a.button || a.ctrlKey ? h(a, u) : g(a, u), b = m(a, u), v = b.x, w = b.y) : b = m(a, n(a.target)), ia.emit("pointermove", {
                x: b.x,
                y: b.y
            })
        }

        function e(a) {
            if (C) {
                var b = m(a, u);
                0 !== a.button || a.ctrlKey ? h(a, u) : (Math.abs(b.x - x) > 5 || Math.abs(b.y - y) > 5) && g(a, u), C = !1, ia.emit("pointerup", {
                    x: b.x,
                    y: b.y,
                    button: a.button
                })
            }
        }

        function f(a) {
            o(a);
            var b = 0;
            if (a.wheelDeltaY ? b = a.wheelDeltaY : a.wheelDelta ? b = a.wheelDelta : a.detail && (b = -a.detail), !la.disabled) {
                var c = .2 * (b > 0 ? 1 : b < 0 ? -1 : 0);
                ia.setZoom(ia.zoom + c, a)
            }
        }

        function g(a, b) {
            if (!la.disabled) {
                var c = .86 * Math.pow(2, -ia.zoom),
                    d = 1 / Math.cos(ia.position.latitude / 180 * Math.PI),
                    e = m(a, b),
                    f = e.x - v,
                    g = e.y - w,
                    h = ia.rotation * Math.PI / 180,
                    i = [Math.cos(h), Math.sin(h)],
                    j = [Math.cos(h - Math.PI / 2), Math.sin(h - Math.PI / 2)],
                    n = k(l(i, f), l(j, -g)),
                    o = {
                        longitude: ia.position.longitude - n[0] * c * d,
                        latitude: ia.position.latitude + n[1] * c
                    };
                ia.setPosition(o), ia.emit("move", o)
            }
        }

        function h(a, b) {
            if (!la.disabled) {
                var c = m(a, b);
                A += (c.x - v) * (360 / innerWidth), B -= (c.y - w) * (360 / innerHeight), ia.setRotation(A), ia.setTilt(B)
            }
        }

        function i(a) {
            var b = a.touches[0],
                c = a.touches[1],
                d = b.clientX - c.clientX,
                e = b.clientY - c.clientY,
                f = d * d + e * e;
            s({
                rotation: (Math.atan2(e, d) - E) * (180 / Math.PI) % 360,
                scale: Math.sqrt(f / D)
            })
        }

        function j(a) {
            if (C = !0, o(a), 2 === a.touches.length && !("ongesturechange" in window)) {
                var b = a.touches[0],
                    c = a.touches[1],
                    d = b.clientX - c.clientX,
                    e = b.clientY - c.clientY;
                D = d * d + e * e, E = Math.atan2(e, d), F = !0
            }
            z = ia.zoom, A = ia.rotation, B = ia.tilt, a.touches.length && (a = a.touches[0]), u = n(a.target);
            var f = m(a, u);
            x = v = f.x, y = w = f.y, ia.emit("pointerdown", {
                x: f.x,
                y: f.y,
                button: 0
            })
        }

        function q(a) {
            if (C) {
                var b = m(a.touches[0], u);
                a.touches.length > 1 ? (ia.setTilt(B + (w - b.y) * (360 / innerHeight)), B = ia.tilt, "ongesturechange" in window || i(a)) : (g(a.touches[0], u), ia.emit("pointermove", {
                    x: b.x,
                    y: b.y
                })), v = b.x, w = b.y
            }
        }

        function r(a) {
            if (C)
                if (F = !1, 0 === a.touches.length) C = !1, ia.emit("pointerup", {
                    x: v,
                    y: w,
                    button: 0
                });
                else if (1 === a.touches.length) {
                var b = m(a.touches[0], u);
                v = b.x, w = b.y
            }
        }

        function s(a) {
            C && (o(a), la.disabled || (ia.setZoom(z + (a.scale - 1)), ia.setRotation(A - a.rotation)), ia.emit("gesture", a))
        }
        "ontouchstart" in window ? (p(a, "touchstart", j), p(wa, "touchmove", q), p(wa, "touchend", r), p(wa, "gesturechange", s)) : (p(a, "mousedown", c), p(wa, "mousemove", d), p(wa, "mouseup", e), p(a, "dblclick", b), p(a, "mousewheel", f), p(a, "DOMMouseScroll", f));
        var t;
        p(window, "resize", function() {
            t || (t = setTimeout(function() {
                t = null, ia.setSize({
                    width: a.offsetWidth,
                    height: a.offsetHeight
                })
            }, 250))
        });
        var u, v = 0,
            w = 0,
            x = 0,
            y = 0,
            z = 0,
            A = 0,
            B = 0,
            C = !1,
            D = 0,
            E = 0,
            F = !1
    };
    var ma = {};
    ! function() {
        var a, b = 0;
        ma.setBusy = function() {
            b || (a ? (clearTimeout(a), a = null) : ia.emit("busy")), b++
        }, ma.setIdle = function() {
            b && (--b || (a = setTimeout(function() {
                a = null, ia.emit("idle")
            }, 33)))
        }, ma.isBusy = function() {
            return !!b
        }
    }();
    var na = 256,
        oa = 1,
        pa = 14.5,
        qa = 22,
        ra = 25,
        sa = $.parse("rgb(220, 210, 200)").toArray(),
        ta = $.parse("#f08000").toArray(),
        ua = "#e8e0d8",
        va = "#efe8e0",
        wa = window.document,
        xa = 6378137,
        ya = xa * Math.PI * 2,
        za = ya / 360,
        Aa = 2e3,
        Ba = 100,
        Ca = 2048,
        Da = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAQMAAACQp+OdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwCCAUQLpaUSQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAGUExURebm5v///zFES9kAAAAcSURBVCjPY/gPBQyUMh4wAAH/KAPCoFaoDnYGAAKtZsamTRFlAAAAAElFTkSuQmCC",
        Ea = {};
    ! function() {
        function a(a, b) {
            var c = new XMLHttpRequest;
            return c.onreadystatechange = function() {
                4 === c.readyState && (!c.status || c.status < 200 || c.status > 299 || b(c))
            }, c.open("GET", a), c.send(null), {
                abort: function() {
                    c.abort()
                }
            }
        }
        Ea.getText = function(b, c) {
            return a(b, function(a) {
                void 0 !== a.responseText && c(a.responseText)
            })
        }, Ea.getXML = function(b, c) {
            return a(b, function(a) {
                void 0 !== a.responseXML && c(a.responseXML)
            })
        }, Ea.getJSON = function(b, c) {
            return a(b, function(a) {
                if (a.responseText) {
                    var d;
                    try {
                        d = JSON.parse(a.responseText)
                    } catch (e) {
                        console.warn("Could not parse JSON from " + b + "\n" + e.message)
                    }
                    c(d)
                }
            })
        }, Ea.destroy = function() {}
    }();
    var Fa = function(a, b, c) {
        this.tiles = {}, this.buffer = 1, this.source = a, this.tileClass = b, c = c || {}, this.bounds = c.bounds, this.fixedZoom = c.fixedZoom, this.tileOptions = {
            color: c.color,
            fadeIn: c.fadeIn
        }, this.minZoom = Math.max(parseFloat(c.minZoom || pa), ia.minZoom), this.maxZoom = Math.min(parseFloat(c.maxZoom || qa), ia.maxZoom), this.maxZoom < this.minZoom && (this.minZoom = pa, this.maxZoom = qa), ia.on("change", this._onChange = function() {
            this.update(500)
        }.bind(this)), ia.on("resize", this._onResize = this.update.bind(this)), this.update()
    };
    Fa.prototype = {
        update: function(a) {
            if (!(ia.zoom < this.minZoom || ia.zoom > this.maxZoom)) return a ? void(this.debounce || (this.debounce = setTimeout(function() {
                this.debounce = null, this.loadTiles()
            }.bind(this), a))) : void this.loadTiles()
        },
        getURL: function(a, b, c) {
            var d = "abcd" [(a + b) % 4];
            return q(this.source, {
                s: d,
                x: a,
                y: b,
                z: c
            })
        },
        getClosestTiles: function(a, b) {
            a.sort(function(a, c) {
                return Math.pow(a[0] + .5 - b[0], 2) + Math.pow(a[1] + .5 - b[1], 2) > Math.pow(c[0] + .5 - b[0], 2) + Math.pow(c[1] + .5 - b[1], 2)
            });
            var c, d;
            return a.filter(function(a) {
                return (a[0] !== c || a[1] !== d) && (c = a[0], d = a[1], !0)
            })
        },
        mergeTiles: function(a, b, c) {
            var d, e = {},
                f = {},
                g = [];
            if (0 === b || b <= this.minZoom) {
                for (d in a) a[d][2] = b;
                return a
            }
            for (d in a) {
                var h = a[d],
                    i = (h[0] << 0) / 2,
                    j = (h[1] << 0) / 2;
                if (void 0 === e[[i, j]]) {
                    var k = E(i, j, b - 1, Ja.viewProjMatrix);
                    e[[i, j]] = k < c
                }
                e[[i, j]] || void 0 === f[[h[0], h[1]]] && (f[[h[0], h[1]]] = !0, g.push([h[0], h[1], b]))
            }
            var l = [];
            for (d in e)
                if (e[d]) {
                    var m = d.split(",");
                    l.push([parseInt(m[0]), parseInt(m[1]), b - 1])
                }
            return l.length > 0 && (l = this.mergeTiles(l, b - 1, c)), g.concat(l)
        },
        loadTiles: function() {
            var a, b, c, d, e, f = Math.round(this.fixedZoom || ia.zoom),
                g = [],
                h = Ja.getViewQuad(Ja.viewProjMatrix.data),
                i = [K(ia.position.longitude, f), L(ia.position.latitude, f)];
            for (e = 0; e < 4; e++) h[e] = J(h[e], f);
            var j = y(h);
            for (j = this.fixedZoom ? this.getClosestTiles(j, i) : this.mergeTiles(j, f, .5 * na * na), this.visibleTiles = {}, e = 0; e < j.length; e++) void 0 === j[e][2] && (j[e][2] = f), this.visibleTiles[j[e]] = !0;
            for (var k in this.visibleTiles) a = k.split(","), b = parseInt(a[0]), c = parseInt(a[1]), d = parseInt(a[2]), this.tiles[k] || (this.tiles[k] = new this.tileClass(b, c, d, this.tileOptions, this.tiles), g.push({
                tile: this.tiles[k],
                dist: u([b, c], i)
            }));
            for (this.purge(), g.sort(function(a, b) {
                    return a.dist - b.dist
                }), e = 0; e < g.length; e++) a = g[e].tile, a.load(this.getURL(a.x, a.y, a.zoom))
        },
        purge: function() {
            var a, b, c = Math.round(ia.zoom);
            for (var d in this.tiles) a = this.tiles[d], this.visibleTiles[d] || (this.fixedZoom ? (this.tiles[d].destroy(), delete this.tiles[d]) : a.zoom === c + 1 && (b = [a.x / 2 << 0, a.y / 2 << 0, c].join(","), this.visibleTiles[b]) || a.zoom === c - 1 && (this.visibleTiles[[2 * a.x, 2 * a.y, c].join(",")] || this.visibleTiles[[2 * a.x + 1, 2 * a.y, c].join(",")] || this.visibleTiles[[2 * a.x, 2 * a.y + 1, c].join(",")] || this.visibleTiles[[2 * a.x + 1, 2 * a.y + 1, c].join(",")]) || delete this.tiles[d])
        },
        destroy: function() {
            ia.off("change", this._onChange), ia.off("resize", this._onResize), clearTimeout(this.debounce);
            for (var a in this.tiles) this.tiles[a].destroy();
            this.tiles = [], this.visibleTiles = {}
        }
    };
    var Ga = {
            start: Date.now(),
            now: 0,
            items: [],
            add: function(a, b, c) {
                c = c || 0;
                var d = this.items;
                for (k = 0, l = d.length; k < l; k++)
                    if (d[k].type === a && d[k].selector === b) return;
                d.push({
                    type: a,
                    selector: b,
                    duration: c
                });
                for (var e, f, g, h, i = this.getTime(), j = i + c, k = 0, l = Ha.Index.items.length; k < l; k++)
                    if (e = Ha.Index.items[k], e.applyFilter) {
                        for (g = 0, h = e.items.length; g < h; g++) f = e.items[g], b(f.id, f.data) && (f.filter = [i, j, f.filter ? f.filter[3] : 1, 0]);
                        e.applyFilter()
                    }
            },
            remove: function(a, b, c) {
                c = c || 0;
                var d, e;
                this.items = this.items.filter(function(c) {
                    return c.type !== a || c.selector !== b
                });
                var f, g, h, i, j = this.getTime(),
                    k = j + c;
                for (d = 0, e = Ha.Index.items.length; d < e; d++)
                    if (f = Ha.Index.items[d], f.applyFilter) {
                        for (h = 0, i = f.items.length; h < i; h++) g = f.items[h], b(g.id, g.data) && (g.filter = [j, k, g.filter ? g.filter[3] : 0, 1]);
                        f.applyFilter()
                    }
            },
            apply: function(a) {
                var b, c, d, e, f = this.items;
                if (a.applyFilter) {
                    for (var g = 0, h = f.length; g < h; g++)
                        for (f[g].type, b = f[g].selector, d = 0, e = a.items.length; d < e; d++) c = a.items[d], b(c.id, c.data) && (c.filter = [0, 0, 0, 0]);
                    a.applyFilter()
                }
            },
            getTime: function() {
                return this.now
            },
            nextTick: function() {
                this.now = Date.now() - this.start
            },
            destroy: function() {
                this.items = []
            }
        },
        Ha = {
            Index: {
                items: [],
                add: function(a) {
                    this.items.push(a)
                },
                remove: function(a) {
                    this.items = this.items.filter(function(b) {
                        return b !== a
                    })
                },
                destroy: function() {
                    this.items = []
                }
            }
        };
    Ha.Tile = function(a, b, c, d) {
        this.x = a, this.y = b, this.zoom = c, this.key = [a, b, c].join(","), this.options = d
    }, Ha.Tile.prototype = {
        load: function(a) {
            this.mesh = new Ia.GeoJSON(a, this.options)
        },
        destroy: function() {
            this.mesh && this.mesh.destroy()
        }
    };
    var Ia = {};
    Ia.GeoJSON = function() {
        function a(a, b) {
            if (b = b || {}, this.forcedId = b.id, this.forcedColor = b.color, this.replace = !!b.replace, this.scale = b.scale || 1, this.rotation = b.rotation || 0, this.elevation = b.elevation || 0, this.shouldFadeIn = !("fadeIn" in b) || !!b.fadeIn, this.minZoom = Math.max(parseFloat(b.minZoom || pa), ia.minZoom), this.maxZoom = Math.min(parseFloat(b.maxZoom || qa), ia.maxZoom), this.maxZoom < this.minZoom && (this.minZoom = pa, this.maxZoom = qa), this.items = [], ma.setBusy(), "object" == typeof a) {
                var c = a;
                this.setData(c)
            } else this.request = Ea.getJSON(a, function(a) {
                this.request = null, this.setData(a)
            }.bind(this))
        }
        var b = 90;
        return a.prototype = {
            setData: function(a) {
                if (a && a.features.length) {
                    var c = {
                            vertices: [],
                            normals: [],
                            colors: [],
                            texCoords: []
                        },
                        d = [],
                        e = this.getOrigin(a.features[0].geometry),
                        f = 0,
                        g = a.features.length,
                        h = f + Math.min(g, b);
                    this.position = {
                        latitude: e[1],
                        longitude: e[0]
                    };
                    var i = function() {
                        for (var j, k, l, m, n, o, p = f; p < h; p++) {
                            j = a.features[p], ia.emit("loadfeature", j), k = j.properties, l = this.forcedId || k.relationId || j.id || k.id, m = c.vertices.length, ga(c, j, e, this.forcedColor), n = (c.vertices.length - m) / 3, o = Ja.Picking.idToColor(l);
                            for (var q = 0; q < n; q++)[].push.apply(d, o);
                            this.items.push({
                                id: l,
                                vertexCount: n,
                                height: k.height,
                                data: k.data
                            })
                        }
                        if (h === g) return this.vertexBuffer = new ba.Buffer(3, new Float32Array(c.vertices)), this.normalBuffer = new ba.Buffer(3, new Float32Array(c.normals)), this.colorBuffer = new ba.Buffer(3, new Float32Array(c.colors)), this.texCoordBuffer = new ba.Buffer(2, new Float32Array(c.texCoords)), this.idBuffer = new ba.Buffer(3, new Float32Array(d)), this._initItemBuffers(), Ga.apply(this), Ha.Index.add(this), this.isReady = !0, void ma.setIdle();
                        f = h, h = f + Math.min(g - f, b), this.relaxTimer = setTimeout(i, 75)
                    }.bind(this);
                    i()
                }
            },
            _initItemBuffers: function() {
                var a = Ga.getTime(),
                    b = a;
                this.shouldFadeIn && (a += 250, b += 750);
                var c = [],
                    d = [];
                this.items.map(function(e) {
                    e.filter = [a, b, 0, 1];
                    for (var f = 0; f < e.vertexCount; f++) c.push.apply(c, e.filter), d.push(e.height)
                }), this.filterBuffer = new ba.Buffer(4, new Float32Array(c)), this.heightBuffer = new ba.Buffer(1, new Float32Array(d))
            },
            applyFilter: function() {
                var a = [];
                this.items.map(function(b) {
                    for (var c = 0; c < b.vertexCount; c++) a.push.apply(a, b.filter)
                }), this.filterBuffer = new ba.Buffer(4, new Float32Array(a))
            },
            getMatrix: function() {
                var a = new ba.Matrix;
                this.elevation && a.translate(0, 0, this.elevation), a.scale(this.scale, this.scale, this.scale * oa), this.rotation && a.rotateZ(-this.rotation);
                var b = this.position.latitude - ia.position.latitude,
                    c = this.position.longitude - ia.position.longitude,
                    d = za * Math.cos(ia.position.latitude / 180 * Math.PI);
                return a.translate(c * d, -b * za, 0), a
            },
            getOrigin: function(a) {
                var b = a.coordinates;
                switch (a.type) {
                    case "Point":
                        return b;
                    case "MultiPoint":
                    case "LineString":
                        return b[0];
                    case "MultiLineString":
                    case "Polygon":
                        return b[0][0];
                    case "MultiPolygon":
                        return b[0][0][0]
                }
            },
            destroy: function() {
                this.isReady = !1, clearTimeout(this.relaxTimer), Ha.Index.remove(this), this.request && this.request.abort(), this.items = [], this.isReady && (this.vertexBuffer.destroy(), this.normalBuffer.destroy(), this.colorBuffer.destroy(), this.texCoordBuffer.destroy(), this.idBuffer.destroy(), this.heightBuffer.destroy())
            }
        }, a
    }(), Ia.MapPlane = function() {
        function a(a) {
            a = a || {}, this.id = a.id, this.radius = a.radius || 5e3, this.createGlGeometry(), this.minZoom = ia.minZoom, this.maxZoom = ia.maxZoom
        }
        return a.prototype = {
            createGlGeometry: function() {
                var a = 50,
                    b = 2 * this.radius / a;
                this.vertexBuffer = [], this.normalBuffer = [], this.filterBuffer = [];
                for (var c = [0, 0, 1], d = [].concat(c, c, c, c, c, c), e = [0, 1, 1, 1], f = [].concat(e, e, e, e, e, e), g = 0; g < a; g++)
                    for (var h = 0; h < a; h++) {
                        var i = -this.radius + g * b,
                            j = -this.radius + h * b;
                        this.vertexBuffer.push(i, j, 0, i + b, j + b, 0, i + b, j, 0, i, j, 0, i, j + b, 0, i + b, j + b, 0), this.vertexBuffer.push(i, j, 0, i + b, j, 0, i + b, j + b, 0, i, j, 0, i + b, j + b, 0, i, j + b, 0), [].push.apply(this.normalBuffer, d), [].push.apply(this.normalBuffer, d), [].push.apply(this.filterBuffer, f), [].push.apply(this.filterBuffer, f)
                    }
                this.vertexBuffer = new ba.Buffer(3, new Float32Array(this.vertexBuffer)), this.normalBuffer = new ba.Buffer(3, new Float32Array(this.normalBuffer)), this.filterBuffer = new ba.Buffer(4, new Float32Array(this.filterBuffer))
            },
            getMatrix: function() {
                return new ba.Matrix
            },
            destroy: function() {
                this.vertexBuffer.destroy(), this.normalBuffer.destroy(), this.colorBuffer.destroy(), this.idBuffer.destroy()
            }
        }, a
    }(), Ia.DebugQuad = function() {
        function a(a) {
            a = a || {}, this.id = a.id, this.v1 = this.v2 = this.v3 = this.v4 = [!1, !1, !1], this.updateGeometry([0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]), this.minZoom = ia.minZoom, this.maxZoom = ia.maxZoom
        }
        return a.prototype = {
            updateGeometry: function(a, b, c, d) {
                if (!(Z(a, this.v1) && Z(b, this.v2) && Z(c, this.v3) && Z(d, this.v4))) {
                    this.v1 = a, this.v2 = b, this.v3 = c, this.v4 = d, this.vertexBuffer && this.vertexBuffer.destroy();
                    var e = [].concat(a, b, c, a, c, d);
                    this.vertexBuffer = new ba.Buffer(3, new Float32Array(e)), this.normalBuffer && this.normalBuffer.destroy(), this.normalBuffer = new ba.Buffer(3, new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]));
                    var f = [1, .5, .25];
                    this.colorBuffer && this.colorBuffer.destroy(), this.colorBuffer = new ba.Buffer(3, new Float32Array([].concat(f, f, f, f, f, f))), this.texCoordBuffer = new ba.Buffer(2, new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])), this.idBuffer && this.idBuffer.destroy(), this.idBuffer = new ba.Buffer(3, new Float32Array([].concat(f, f, f, f, f, f))), this.heightBuffer && this.heightBuffer.destroy(), this.heightBuffer = new ba.Buffer(1, new Float32Array([].concat(0, 0)));
                    var g = [0, 1, 1, 1];
                    this.filterBuffer = new ba.Buffer(4, new Float32Array([].concat(g, g, g, g, g, g)))
                }
            },
            getMatrix: function() {
                return new ba.Matrix
            },
            destroy: function() {
                this.vertexBuffer.destroy(), this.normalBuffer.destroy(), this.colorBuffer.destroy(), this.texCoordBuffer.destroy(), this.idBuffer.destroy(), this.heightBuffer.destroy()
            }
        }, a
    }(), Ia.OBJ = function() {
        function a(a) {
            for (var c, d = a.split(/[\r\n]/g), e = {}, f = null, g = 0, h = d.length; g < h; g++) switch (c = d[g].trim().split(/\s+/), c[0]) {
                case "newmtl":
                    b(e, f), f = {
                        id: c[1],
                        color: {}
                    };
                    break;
                case "Kd":
                    f.color = [parseFloat(c[1]), parseFloat(c[2]), parseFloat(c[3])];
                    break;
                case "d":
                    f.color[3] = parseFloat(c[1])
            }
            return b(e, f), a = null, e
        }

        function b(a, b) {
            null !== b && (a[b.id] = b.color)
        }

        function c(a, b) {
            for (var c, e, f, g = [], h = a.split(/[\r\n]/g), i = [], j = [], k = 0, l = h.length; k < l; k++) switch (c = h[k].trim().split(/\s+/), c[0]) {
                case "g":
                case "o":
                    d(g, i, e, f, j), e = c[1], j = [];
                    break;
                case "usemtl":
                    d(g, i, e, f, j), b[c[1]] && (f = b[c[1]]), j = [];
                    break;
                case "v":
                    g.push([parseFloat(c[1]), parseFloat(c[2]), parseFloat(c[3])]);
                    break;
                case "f":
                    j.push([parseFloat(c[1]) - 1, parseFloat(c[2]) - 1, parseFloat(c[3]) - 1])
            }
            return d(g, i, e, f, j), a = null, i
        }

        function d(a, b, c, d, f) {
            if (f.length) {
                var g = e(a, f);
                b.push({
                    vertices: g.vertices,
                    normals: g.normals,
                    color: d,
                    texCoords: g.texCoords,
                    id: c,
                    height: g.height
                })
            }
        }

        function e(a, b) {
            for (var c, d, e, f, g = [], h = [], i = [], j = -1 / 0, k = 0, l = b.length; k < l; k++) c = a[b[k][0]], d = a[b[k][1]], e = a[b[k][2]], f = z(c, d, e), g.push(c[0], c[2], c[1], d[0], d[2], d[1], e[0], e[2], e[1]), h.push(f[0], f[1], f[2], f[0], f[1], f[2], f[0], f[1], f[2]), i.push(0, 0, 0, 0, 0, 0), j = Math.max(j, c[1], d[1], e[1]);
            return {
                vertices: g,
                normals: h,
                texCoords: i,
                height: j
            }
        }

        function f(b, c, d) {
            d = d || {}, this.forcedId = d.id, d.color && (this.forcedColor = $.parse(d.color).toArray()), this.replace = !!d.replace, this.scale = d.scale || 1, this.rotation = d.rotation || 0, this.elevation = d.elevation || 0, this.position = c, this.shouldFadeIn = !("fadeIn" in d) || !!d.fadeIn, this.minZoom = Math.max(parseFloat(d.minZoom || pa), ia.minZoom), this.maxZoom = Math.min(parseFloat(d.maxZoom || qa), ia.maxZoom), this.maxZoom < this.minZoom && (this.minZoom = pa, this.maxZoom = qa), this.data = {
                vertices: [],
                normals: [],
                colors: [],
                texCoords: [],
                ids: []
            }, ma.setBusy(), this.request = Ea.getText(b, function(c) {
                this.request = null;
                var d;
                (d = c.match(/^mtllib\s+(.*)$/m)) ? this.request = Ea.getText(b.replace(/[^\/]+$/, "") + d[1], function(b) {
                    this.request = null, this.onLoad(c, a(b))
                }.bind(this)): this.onLoad(c, null)
            }.bind(this))
        }
        return f.prototype = {
            onLoad: function(a, b) {
                this.items = [], this.addItems(c(a, b)), this.onReady()
            },
            addItems: function(a) {
                a.map(function(a) {
                    ia.emit("loadfeature", a), [].push.apply(this.data.vertices, a.vertices), [].push.apply(this.data.normals, a.normals), [].push.apply(this.data.texCoords, a.texCoords);
                    for (var b = this.forcedId || a.id, c = Ja.Picking.idToColor(b), d = (b / 2 % 2 ? -1 : 1) * (b % 2 ? .03 : .06), e = this.forcedColor || a.color || sa, f = 0; f < a.vertices.length - 2; f += 3)[].push.apply(this.data.colors, V(e, d)), [].push.apply(this.data.ids, c);
                    this.items.push({
                        id: b,
                        vertexCount: a.vertices.length / 3,
                        height: a.height,
                        data: a.data
                    })
                }.bind(this))
            },
            _initItemBuffers: function() {
                var a = Ga.getTime(),
                    b = a;
                this.shouldFadeIn && (a += 250, b += 750);
                var c = [],
                    d = [];
                this.items.map(function(e) {
                    e.filter = [a, b, 0, 1];
                    for (var f = 0; f < e.vertexCount; f++) c.push.apply(c, e.filter), d.push(e.height)
                }), this.filterBuffer = new ba.Buffer(4, new Float32Array(c)), this.heightBuffer = new ba.Buffer(1, new Float32Array(d))
            },
            applyFilter: function() {
                var a = [];
                this.items.map(function(b) {
                    for (var c = 0; c < b.vertexCount; c++) a.push.apply(a, b.filter)
                }), this.filterBuffer = new ba.Buffer(4, new Float32Array(a))
            },
            onReady: function() {
                this.vertexBuffer = new ba.Buffer(3, new Float32Array(this.data.vertices)), this.normalBuffer = new ba.Buffer(3, new Float32Array(this.data.normals)), this.colorBuffer = new ba.Buffer(3, new Float32Array(this.data.colors)), this.texCoordBuffer = new ba.Buffer(2, new Float32Array(this.data.texCoords)), this.idBuffer = new ba.Buffer(3, new Float32Array(this.data.ids)), this._initItemBuffers(), this.data = null, Ga.apply(this), Ha.Index.add(this), this.isReady = !0, ma.setIdle()
            },
            getMatrix: function() {
                var a = new ba.Matrix;
                this.elevation && a.translate(0, 0, this.elevation), a.scale(this.scale, this.scale, this.scale), this.rotation && a.rotateZ(-this.rotation);
                var b = za * Math.cos(ia.position.latitude / 180 * Math.PI),
                    c = this.position.latitude - ia.position.latitude,
                    d = this.position.longitude - ia.position.longitude;
                return a.translate(d * b, -c * za, 0), a
            },
            destroy: function() {
                Ha.Index.remove(this), this.request && this.request.abort(), this.items = [],
                    this.isReady && (this.vertexBuffer.destroy(), this.normalBuffer.destroy(), this.colorBuffer.destroy(), this.texCoordBuffer.destroy(), this.idBuffer.destroy(), this.heightBuffer.destroy())
            }
        }, f
    }();
    var Ja = {
        getViewQuad: function() {
            return A(this.viewProjMatrix.data, this.fogDistance + this.fogBlurDistance, this.viewDirOnMap)
        },
        start: function() {
            ja.depthTextureExtension || (console.log('[WARN] effects "shadows" and "outlines" disabled in OSMBuildings, because your GPU does not support WEBGL_depth_texture'), delete Ja.effects.shadows, delete Ja.effects.outlines), ia.on("change", this._onChange = this.onChange.bind(this)), ia.on("resize", this._onResize = this.onResize.bind(this)), this.onResize(), ja.cullFace(ja.BACK), ja.enable(ja.CULL_FACE), ja.enable(ja.DEPTH_TEST), Ja.Picking.init(), Ja.sky = new Ja.SkyWall, Ja.Buildings.init(), Ja.Basemap.init(), Ja.Overlay.init(), Ja.AmbientMap.init(), Ja.OutlineMap.init(), Ja.blurredAmbientMap = new Ja.Blur, Ja.blurredOutlineMap = new Ja.Blur, Ja.MapShadows.init(), (Ja.effects.shadows || Ja.effects.outlines) && (Ja.cameraGBuffer = new Ja.DepthFogNormalMap), Ja.effects.shadows && (Ja.sunGBuffer = new Ja.DepthFogNormalMap, Ja.sunGBuffer.framebufferSize = [Ca, Ca]), requestAnimationFrame(this.renderFrame.bind(this))
        },
        renderFrame: function() {
            if (void 0 !== ja && (Ga.nextTick(), requestAnimationFrame(this.renderFrame.bind(this)), this.onChange(), ja.clearColor(this.fogColor[0], this.fogColor[1], this.fogColor[2], 0), ja.clear(ja.COLOR_BUFFER_BIT | ja.DEPTH_BUFFER_BIT), !(ia.zoom < ia.minZoom || ia.zoom > ia.maxZoom))) {
                var a = this.getViewQuad();
                Ka.updateView(a), Ja.sky.updateGeometry(a);
                var b = [ia.width, ia.height];
                Ja.effects.shadows ? (Ja.cameraGBuffer.render(this.viewMatrix, this.projMatrix, b, !0), Ja.sunGBuffer.render(Ka.viewMatrix, Ka.projMatrix), Ja.AmbientMap.render(Ja.cameraGBuffer.getDepthTexture(), Ja.cameraGBuffer.getFogNormalTexture(), b, 2), Ja.blurredAmbientMap.render(Ja.AmbientMap.framebuffer.renderTexture, b), Ja.Buildings.render(Ja.sunGBuffer.framebuffer, .5), Ja.Basemap.render(), Ja.effects.outlines && (Ja.Picking.render(b), Ja.OutlineMap.render(Ja.cameraGBuffer.getDepthTexture(), Ja.cameraGBuffer.getFogNormalTexture(), Ja.Picking.framebuffer.renderTexture, b, 1), Ja.blurredOutlineMap.render(Ja.OutlineMap.framebuffer.renderTexture, b)), ja.enable(ja.BLEND), ja.blendFuncSeparate(ja.ZERO, ja.SRC_COLOR, ja.ZERO, ja.ONE), Ja.effects.outlines && Ja.Overlay.render(Ja.blurredOutlineMap.framebuffer.renderTexture, b), Ja.MapShadows.render(Ka, Ja.sunGBuffer.framebuffer, .5), Ja.Overlay.render(Ja.blurredAmbientMap.framebuffer.renderTexture, b), ja.blendFuncSeparate(ja.ONE_MINUS_DST_ALPHA, ja.DST_ALPHA, ja.ONE, ja.ONE), ja.disable(ja.DEPTH_TEST), Ja.sky.render(), ja.enable(ja.DEPTH_TEST), ja.disable(ja.BLEND)) : (Ja.Buildings.render(), Ja.Basemap.render(), Ja.effects.outlines && (Ja.cameraGBuffer.render(this.viewMatrix, this.projMatrix, b, !0), Ja.Picking.render(b), Ja.OutlineMap.render(Ja.cameraGBuffer.getDepthTexture(), Ja.cameraGBuffer.getFogNormalTexture(), Ja.Picking.framebuffer.renderTexture, b, 1), Ja.blurredOutlineMap.render(Ja.OutlineMap.framebuffer.renderTexture, b)), ja.enable(ja.BLEND), Ja.effects.outlines && (ja.blendFuncSeparate(ja.ZERO, ja.SRC_COLOR, ja.ZERO, ja.ONE), Ja.Overlay.render(Ja.blurredOutlineMap.framebuffer.renderTexture, b)), ja.blendFuncSeparate(ja.ONE_MINUS_DST_ALPHA, ja.DST_ALPHA, ja.ONE, ja.ONE), ja.disable(ja.DEPTH_TEST), Ja.sky.render(), ja.disable(ja.BLEND), ja.enable(ja.DEPTH_TEST)), this.screenshotCallback && (this.screenshotCallback(ja.canvas.toDataURL()), this.screenshotCallback = null)
            }
        },
        onChange: function() {
            var a = 1.3567 * Math.pow(2, ia.zoom - 17),
                b = ia.width,
                c = ia.height,
                d = 1024,
                e = 45;
            ja.viewport(0, 0, b, c), this.viewMatrix = (new ba.Matrix).rotateZ(ia.rotation).rotateX(ia.tilt).translate(0, 8 / a, 0).translate(0, 0, -1220 / a), this.viewDirOnMap = [Math.sin(ia.rotation / 180 * Math.PI), -Math.cos(ia.rotation / 180 * Math.PI)];
            var f = d / (2 * Math.tan(e / 2 / 180 * Math.PI)),
                g = 2 * Math.atan(c / 2 / f) / Math.PI * 180;
            if (this.projMatrix = (new ba.Matrix).translate(0, -c / (2 * a), 0).scale(1, -1, 1).multiply(new ba.Matrix.Perspective(g, b / c, 1, 7500)).translate(0, -1, 0), this.viewProjMatrix = new ba.Matrix(ba.Matrix.multiply(this.viewMatrix, this.projMatrix)), this.lowerLeftOnMap = D(-1, -1, ba.Matrix.invert(this.viewProjMatrix.data)), void 0 !== this.lowerLeftOnMap) {
                var h = O(this.lowerLeftOnMap);
                this.fogDistance = Math.max(3e3, h), this.fogBlurDistance = 500
            }
        },
        onResize: function() {
            ja.canvas.width = ia.width, ja.canvas.height = ia.height, this.onChange()
        },
        destroy: function() {
            ia.off("change", this._onChange), ia.off("resize", this._onResize), Ja.Picking.destroy(), Ja.sky.destroy(), Ja.Buildings.destroy(), Ja.Basemap.destroy(), Ja.cameraGBuffer && Ja.cameraGBuffer.destroy(), Ja.sunGBuffer && Ja.sunGBuffer.destroy(), Ja.AmbientMap.destroy(), Ja.blurredAmbientMap.destroy(), Ja.blurredOutlineMap.destroy()
        }
    };
    Ja.Picking = {
        idMapping: [null],
        viewportSize: 512,
        init: function() {
            this.shader = new ba.Shader({
                vertexShader: aa.picking.vertex,
                fragmentShader: aa.picking.fragment,
                shaderName: "picking shader",
                attributes: ["aPosition", "aId", "aFilter"],
                uniforms: ["uModelMatrix", "uMatrix", "uFogRadius", "uTime"]
            }), this.framebuffer = new ba.Framebuffer(this.viewportSize, this.viewportSize)
        },
        render: function(a) {
            var b = this.shader,
                c = this.framebuffer;
            c.setSize(a[0], a[1]), b.enable(), c.enable(), ja.viewport(0, 0, a[0], a[1]), ja.clearColor(0, 0, 0, 1), ja.clear(ja.COLOR_BUFFER_BIT | ja.DEPTH_BUFFER_BIT), b.setUniforms([
                ["uFogRadius", "1f", Ja.fogDistance],
                ["uTime", "1f", Ga.getTime()]
            ]);
            for (var d, e, f = Ha.Index.items, g = 0, h = f.length; g < h; g++) d = f[g], ia.zoom < d.minZoom || ia.zoom > d.maxZoom || (e = d.getMatrix()) && (b.setUniformMatrices([
                ["uModelMatrix", "4fv", e.data],
                ["uMatrix", "4fv", ba.Matrix.multiply(e, Ja.viewProjMatrix)]
            ]), b.bindBuffer(d.vertexBuffer, "aPosition"), b.bindBuffer(d.idBuffer, "aId"), b.bindBuffer(d.filterBuffer, "aFilter"), ja.drawArrays(ja.TRIANGLES, 0, d.vertexBuffer.numItems));
            this.shader.disable(), this.framebuffer.disable(), ja.viewport(0, 0, ia.width, ia.height)
        },
        getTarget: function(a, b, c) {
            requestAnimationFrame(function() {
                this.render([this.viewportSize, this.viewportSize]), a = a / ia.width * this.viewportSize << 0, b = b / ia.height * this.viewportSize << 0, this.framebuffer.enable();
                var d = this.framebuffer.getPixel(a, this.viewportSize - 1 - b);
                if (this.framebuffer.disable(), void 0 === d) return void c(void 0);
                var e = d[0] | d[1] << 8 | d[2] << 16;
                c(this.idMapping[e])
            }.bind(this))
        },
        idToColor: function(a) {
            var b = this.idMapping.indexOf(a);
            return -1 === b && (this.idMapping.push(a), b = this.idMapping.length - 1), [(255 & b) / 255, (b >> 8 & 255) / 255, (b >> 16 & 255) / 255]
        },
        destroy: function() {}
    };
    var Ka = {
        setDate: function(a) {
            // var b = _(a, ia.position.latitude, ia.position.longitude);
            // var b = _(a, -90.00, 0.00); // South Pole :) debb
            var b = _(a, 90.00, 0.00); // North Pole :) debb
            this.direction = [-Math.sin(b.azimuth) * Math.cos(b.altitude), Math.cos(b.azimuth) * Math.cos(b.altitude), Math.sin(b.altitude)];
            var c = b.azimuth / (Math.PI / 180),
                d = 90 - b.altitude / (Math.PI / 180);
            this.viewMatrix = (new ba.Matrix).rotateZ(c).rotateX(d).translate(0, 0, -5e3).scale(1, -1, 1)
        },
        updateView: function(a) {
            this.projMatrix = B(s(a, 0).concat(s(a, Ba)), this.viewMatrix, 1e3, 7500), this.viewProjMatrix = new ba.Matrix(ba.Matrix.multiply(this.viewMatrix, this.projMatrix))
        }
    };
    Ja.SkyWall = function() {
        this.v1 = this.v2 = this.v3 = this.v4 = [!1, !1, !1], this.updateGeometry([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]), this.shader = new ba.Shader({
            vertexShader: aa.skywall.vertex,
            fragmentShader: aa.skywall.fragment,
            shaderName: "sky wall shader",
            attributes: ["aPosition", "aTexCoord"],
            uniforms: ["uAbsoluteHeight", "uMatrix", "uTexIndex", "uFogColor"]
        }), this.floorShader = new ba.Shader({
            vertexShader: aa.flatColor.vertex,
            fragmentShader: aa.flatColor.fragment,
            attributes: ["aPosition"],
            uniforms: ["uColor", "uMatrix"]
        }), ma.setBusy();
        var a = ia.baseURL + "./../data/images/skydome.jpg";
        this.texture = (new ba.texture.Image).load(a, function(a) {
            ma.setIdle(), a && (this.isReady = !0)
        }.bind(this))
    }, Ja.SkyWall.prototype.updateGeometry = function(a) {
        var b = [a[3][0], a[3][1], 0],
            c = [a[2][0], a[2][1], 0],
            d = [a[2][0], a[2][1], Aa],
            e = [a[3][0], a[3][1], Aa];
        if (!(Z(b, this.v1) && Z(c, this.v2) && Z(d, this.v3) && Z(e, this.v4))) {
            this.v1 = b, this.v2 = c, this.v3 = d, this.v4 = e, this.vertexBuffer && this.vertexBuffer.destroy();
            var f = [].concat(b, c, d, b, d, e);
            this.vertexBuffer = new ba.Buffer(3, new Float32Array(f)), this.texCoordBuffer && this.texCoordBuffer.destroy();
            var g = ba.Matrix.invert(Ja.viewProjMatrix.data),
                h = D(0, -1, g),
                i = R(Q(b, h)),
                j = R(Q(c, h)),
                k = Math.atan2(i[1], i[0]) / (2 * Math.PI),
                l = Math.atan2(j[1], j[0]) / (2 * Math.PI);
            k > l && (l += 1);
            var m = k,
                n = l;
            this.texCoordBuffer = new ba.Buffer(2, new Float32Array([m, 1, n, 1, n, 0, m, 1, n, 0, m, 0])), b = [a[0][0], a[0][1], 1], c = [a[1][0], a[1][1], 1], d = [a[2][0], a[2][1], 1], e = [a[3][0], a[3][1], 1], this.floorVertexBuffer && this.floorVertexBuffer.destroy(), this.floorVertexBuffer = new ba.Buffer(3, new Float32Array([].concat(b, c, d, e)))
        }
    }, Ja.SkyWall.prototype.render = function() {
        if (this.isReady) {
            var a = Ja.fogColor,
                b = this.shader;
            b.enable(), b.setUniforms([
                ["uFogColor", "3fv", a],
                ["uAbsoluteHeight", "1f", 10 * Aa]
            ]), b.setUniformMatrix("uMatrix", "4fv", Ja.viewProjMatrix.data), b.bindBuffer(this.vertexBuffer, "aPosition"), b.bindBuffer(this.texCoordBuffer, "aTexCoord"), b.bindTexture("uTexIndex", 0, this.texture), ja.drawArrays(ja.TRIANGLES, 0, this.vertexBuffer.numItems), b.disable(), this.floorShader.enable(), this.floorShader.setUniform("uColor", "4fv", a.concat([1])), this.floorShader.setUniformMatrix("uMatrix", "4fv", Ja.viewProjMatrix.data), this.floorShader.bindBuffer(this.floorVertexBuffer, "aPosition"), ja.drawArrays(ja.TRIANGLE_FAN, 0, this.floorVertexBuffer.numItems), this.floorShader.disable()
        }
    }, Ja.SkyWall.prototype.destroy = function() {
        this.texture.destroy()
    }, Ja.Buildings = {
        init: function() {
            this.shader = Ja.effects.shadows ? new ba.Shader({
                vertexShader: aa["buildings.shadows"].vertex,
                fragmentShader: aa["buildings.shadows"].fragment,
                shaderName: "quality building shader",
                attributes: ["aPosition", "aTexCoord", "aColor", "aFilter", "aNormal", "aId", "aHeight"],
                uniforms: ["uFogDistance", "uFogBlurDistance", "uHighlightColor", "uHighlightId", "uLightColor", "uLightDirection", "uLowerEdgePoint", "uMatrix", "uModelMatrix", "uSunMatrix", "uShadowTexIndex", "uShadowTexDimensions", "uTime", "uViewDirOnMap", "uWallTexIndex"]
            }) : new ba.Shader({
                vertexShader: aa.buildings.vertex,
                fragmentShader: aa.buildings.fragment,
                shaderName: "building shader",
                attributes: ["aPosition", "aTexCoord", "aColor", "aFilter", "aNormal", "aId", "aHeight"],
                uniforms: ["uModelMatrix", "uViewDirOnMap", "uMatrix", "uNormalTransform", "uLightColor", "uLightDirection", "uLowerEdgePoint", "uFogDistance", "uFogBlurDistance", "uHighlightColor", "uHighlightId", "uTime", "uWallTexIndex"]
            }), this.wallTexture = new ba.texture.Image, this.wallTexture.color([1, 1, 1]), this.wallTexture.load(Da)
        },
        render: function(a) {
            var b = this.shader;
            b.enable(), this.showBackfaces && ja.disable(ja.CULL_FACE), b.setUniforms([
                ["uFogDistance", "1f", Ja.fogDistance],
                ["uFogBlurDistance", "1f", Ja.fogBlurDistance],
                ["uHighlightColor", "3fv", this.highlightColor || [0, 0, 0]],
                ["uHighlightId", "3fv", this.highlightId || [0, 0, 0]],
                ["uLightColor", "3fv", [.5, .5, .5]],
                ["uLightDirection", "3fv", Ka.direction],
                ["uLowerEdgePoint", "2fv", Ja.lowerLeftOnMap],
                ["uTime", "1f", Ga.getTime()],
                ["uViewDirOnMap", "2fv", Ja.viewDirOnMap]
            ]), Ja.effects.shadows || b.setUniformMatrix("uNormalTransform", "3fv", ba.Matrix.identity3().data), b.bindTexture("uWallTexIndex", 0, this.wallTexture), a && (b.setUniform("uShadowTexDimensions", "2fv", [a.width, a.height]), b.bindTexture("uShadowTexIndex", 1, a.depthTexture));
            for (var c, d, e = Ha.Index.items, f = 0, g = e.length; f < g; f++) c = e[f], ia.zoom < c.minZoom || ia.zoom > c.maxZoom || !(d = c.getMatrix()) || (b.setUniformMatrices([
                ["uModelMatrix", "4fv", d.data],
                ["uMatrix", "4fv", ba.Matrix.multiply(d, Ja.viewProjMatrix)]
            ]), Ja.effects.shadows && b.setUniformMatrix("uSunMatrix", "4fv", ba.Matrix.multiply(d, Ka.viewProjMatrix)), b.bindBuffer(c.vertexBuffer, "aPosition"), b.bindBuffer(c.texCoordBuffer, "aTexCoord"), b.bindBuffer(c.normalBuffer, "aNormal"), b.bindBuffer(c.colorBuffer, "aColor"), b.bindBuffer(c.idBuffer, "aId"), b.bindBuffer(c.filterBuffer, "aFilter"), b.bindBuffer(c.heightBuffer, "aHeight"), ja.drawArrays(ja.TRIANGLES, 0, c.vertexBuffer.numItems));
            this.showBackfaces && ja.enable(ja.CULL_FACE), b.disable()
        },
        destroy: function() {}
    }, Ja.MapShadows = {
        init: function() {
            this.shader = new ba.Shader({
                vertexShader: aa["basemap.shadows"].vertex,
                fragmentShader: aa["basemap.shadows"].fragment,
                shaderName: "map shadows shader",
                attributes: ["aPosition", "aNormal"],
                uniforms: ["uModelMatrix", "uViewDirOnMap", "uMatrix", "uDirToSun", "uLowerEdgePoint", "uFogDistance", "uFogBlurDistance", "uShadowTexDimensions", "uShadowStrength", "uShadowTexIndex", "uSunMatrix"]
            }), this.mapPlane = new Ia.MapPlane
        },
        render: function(a, b, c) {
            var d = this.shader;
            d.enable(), this.showBackfaces && ja.disable(ja.CULL_FACE), d.setUniforms([
                ["uDirToSun", "3fv", a.direction],
                ["uViewDirOnMap", "2fv", Ja.viewDirOnMap],
                ["uLowerEdgePoint", "2fv", Ja.lowerLeftOnMap],
                ["uFogDistance", "1f", Ja.fogDistance],
                ["uFogBlurDistance", "1f", Ja.fogBlurDistance],
                ["uShadowTexDimensions", "2fv", [b.width, b.height]],
                ["uShadowStrength", "1f", c]
            ]), d.bindTexture("uShadowTexIndex", 0, b.depthTexture);
            var e = this.mapPlane;
            if (!(ia.zoom < e.minZoom || ia.zoom > e.maxZoom)) {
                var f;
                (f = e.getMatrix()) && (d.setUniformMatrices([
                    ["uModelMatrix", "4fv", f.data],
                    ["uMatrix", "4fv", ba.Matrix.multiply(f, Ja.viewProjMatrix)],
                    ["uSunMatrix", "4fv", ba.Matrix.multiply(f, a.viewProjMatrix)]
                ]), d.bindBuffer(e.vertexBuffer, "aPosition"), d.bindBuffer(e.normalBuffer, "aNormal"), ja.drawArrays(ja.TRIANGLES, 0, e.vertexBuffer.numItems), this.showBackfaces && ja.enable(ja.CULL_FACE), d.disable())
            }
        },
        destroy: function() {}
    }, Ja.Basemap = {
        init: function() {
            this.shader = new ba.Shader({
                vertexShader: aa.basemap.vertex,
                fragmentShader: aa.basemap.fragment,
                shaderName: "basemap shader",
                attributes: ["aPosition", "aTexCoord"],
                uniforms: ["uModelMatrix", "uMatrix", "uTexIndex", "uFogDistance", "uFogBlurDistance", "uLowerEdgePoint", "uViewDirOnMap"]
            })
        },
        render: function() {
            var a = ia.basemapGrid;
            if (a && !(ia.zoom < a.minZoom || ia.zoom > a.maxZoom)) {
                var b, c = this.shader,
                    d = Math.round(ia.zoom);
                c.enable(), c.setUniforms([
                    ["uFogDistance", "1f", Ja.fogDistance],
                    ["uFogBlurDistance", "1f", Ja.fogBlurDistance],
                    ["uViewDirOnMap", "2fv", Ja.viewDirOnMap],
                    ["uLowerEdgePoint", "2fv", Ja.lowerLeftOnMap]
                ]);
                for (var e in a.visibleTiles)
                    if ((b = a.tiles[e]) && b.isReady) this.renderTile(b, c);
                    else {
                        var f = [b.x / 2 << 0, b.y / 2 << 0, d - 1].join(",");
                        if (a.tiles[f] && a.tiles[f].isReady) this.renderTile(a.tiles[f], c);
                        else
                            for (var g = [
                                    [2 * b.x, 2 * b.y, b.zoom + 1].join(","), [2 * b.x + 1, 2 * b.y, b.zoom + 1].join(","), [2 * b.x, 2 * b.y + 1, b.zoom + 1].join(","), [2 * b.x + 1, 2 * b.y + 1, b.zoom + 1].join(",")
                                ], h = 0; h < 4; h++) a.tiles[g[h]] && a.tiles[g[h]].isReady && this.renderTile(a.tiles[g[h]], c)
                    }
                c.disable()
            }
        },
        renderTile: function(a, b) {
            var c = za * Math.cos(ia.position.latitude / 180 * Math.PI),
                d = new ba.Matrix;
            d.translate((a.longitude - ia.position.longitude) * c, -(a.latitude - ia.position.latitude) * za, 0), ja.enable(ja.POLYGON_OFFSET_FILL), ja.polygonOffset(ra - a.zoom, ra - a.zoom), b.setUniforms([
                ["uViewDirOnMap", "2fv", Ja.viewDirOnMap],
                ["uLowerEdgePoint", "2fv", Ja.lowerLeftOnMap]
            ]), b.setUniformMatrices([
                ["uModelMatrix", "4fv", d.data],
                ["uMatrix", "4fv", ba.Matrix.multiply(d, Ja.viewProjMatrix)]
            ]), b.bindBuffer(a.vertexBuffer, "aPosition"), b.bindBuffer(a.texCoordBuffer, "aTexCoord"), b.bindTexture("uTexIndex", 0, a.texture), ja.drawArrays(ja.TRIANGLE_STRIP, 0, a.vertexBuffer.numItems), ja.disable(ja.POLYGON_OFFSET_FILL)
        },
        destroy: function() {}
    }, Ja.HudRect = {
        init: function() {
            var a = this.createGeometry();
            this.vertexBuffer = new ba.Buffer(3, new Float32Array(a.vertices)), this.texCoordBuffer = new ba.Buffer(2, new Float32Array(a.texCoords)), this.shader = new ba.Shader({
                vertexShader: aa.texture.vertex,
                fragmentShader: aa.texture.fragment,
                shaderName: "HUD rectangle shader",
                attributes: ["aPosition", "aTexCoord"],
                uniforms: ["uMatrix", "uTexIndex"]
            })
        },
        createGeometry: function() {
            var a = [],
                b = [];
            return a.push(0, 0, 1e-5, 1, 0, 1e-5, 1, 1, 1e-5), a.push(0, 0, 1e-5, 1, 1, 1e-5, 0, 1, 1e-5), b.push(.5, .5, 1, .5, 1, 1), b.push(.5, .5, 1, 1, .5, 1), {
                vertices: a,
                texCoords: b
            }
        },
        render: function(a) {
            var b = this.shader;
            b.enable(), ja.uniformMatrix4fv(b.uniforms.uMatrix, !1, ba.Matrix.identity().data), this.vertexBuffer.enable(), ja.vertexAttribPointer(b.attributes.aPosition, this.vertexBuffer.itemSize, ja.FLOAT, !1, 0, 0), this.texCoordBuffer.enable(), ja.vertexAttribPointer(b.attributes.aTexCoord, this.texCoordBuffer.itemSize, ja.FLOAT, !1, 0, 0), a.enable(0), ja.uniform1i(b.uniforms.uTexIndex, 0), ja.drawArrays(ja.TRIANGLES, 0, this.vertexBuffer.numItems), b.disable()
        },
        destroy: function() {}
    }, Ja.DepthFogNormalMap = function() {
        this.shader = new ba.Shader({
            vertexShader: aa.fogNormal.vertex,
            fragmentShader: aa.fogNormal.fragment,
            shaderName: "fog/normal shader",
            attributes: ["aPosition", "aFilter", "aNormal"],
            uniforms: ["uMatrix", "uModelMatrix", "uNormalMatrix", "uTime", "uFogDistance", "uFogBlurDistance", "uViewDirOnMap", "uLowerEdgePoint"]
        }), this.framebuffer = new ba.Framebuffer(128, 128, !0), this.mapPlane = new Ia.MapPlane
    }, Ja.DepthFogNormalMap.prototype.getDepthTexture = function() {
        return this.framebuffer.depthTexture
    }, Ja.DepthFogNormalMap.prototype.getFogNormalTexture = function() {
        return this.framebuffer.renderTexture
    }, Ja.DepthFogNormalMap.prototype.render = function(a, b, c, d) {
        var e = this.shader,
            f = this.framebuffer,
            g = new ba.Matrix(ba.Matrix.multiply(a, b));
        c = c || this.framebufferSize, f.setSize(c[0], c[1]), e.enable(), f.enable(), ja.viewport(0, 0, c[0], c[1]), ja.clearColor(0, 0, 0, 1), ja.clear(ja.COLOR_BUFFER_BIT | ja.DEPTH_BUFFER_BIT);
        var h, i;
        e.setUniform("uTime", "1f", Ga.getTime());
        for (var j = Ha.Index.items.concat([this.mapPlane]), k = 0; k < j.length; k++) h = j[k], ia.zoom < h.minZoom || ia.zoom > h.maxZoom || (i = h.getMatrix()) && (e.setUniforms([
            ["uViewDirOnMap", "2fv", Ja.viewDirOnMap],
            ["uLowerEdgePoint", "2fv", Ja.lowerLeftOnMap],
            ["uFogDistance", "1f", Ja.fogDistance],
            ["uFogBlurDistance", "1f", Ja.fogBlurDistance]
        ]), e.setUniformMatrices([
            ["uMatrix", "4fv", ba.Matrix.multiply(i, g)],
            ["uModelMatrix", "4fv", i.data],
            ["uNormalMatrix", "3fv", ba.Matrix.transpose3(ba.Matrix.invert3(ba.Matrix.multiply(i, a)))]
        ]), e.bindBuffer(h.vertexBuffer, "aPosition"), e.bindBuffer(h.normalBuffer, "aNormal"), e.bindBuffer(h.filterBuffer, "aFilter"), ja.drawArrays(ja.TRIANGLES, 0, h.vertexBuffer.numItems));
        e.disable(), f.disable(), ja.viewport(0, 0, ia.width, ia.height)
    }, Ja.DepthFogNormalMap.prototype.destroy = function() {}, Ja.AmbientMap = {
        init: function() {
            this.shader = new ba.Shader({
                vertexShader: aa.ambientFromDepth.vertex,
                fragmentShader: aa.ambientFromDepth.fragment,
                shaderName: "SSAO shader",
                attributes: ["aPosition", "aTexCoord"],
                uniforms: ["uInverseTexSize", "uNearPlane", "uFarPlane", "uDepthTexIndex", "uFogTexIndex", "uEffectStrength"]
            }), this.framebuffer = new ba.Framebuffer(128, 128), this.vertexBuffer = new ba.Buffer(3, new Float32Array([-1, -1, 1e-5, 1, -1, 1e-5, 1, 1, 1e-5, -1, -1, 1e-5, 1, 1, 1e-5, -1, 1, 1e-5])), this.texCoordBuffer = new ba.Buffer(2, new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]))
        },
        render: function(a, b, c, d) {
            var e = this.shader,
                f = this.framebuffer;
            void 0 === d && (d = 1), f.setSize(c[0], c[1]), ja.viewport(0, 0, c[0], c[1]), e.enable(), f.enable(), ja.clearColor(1, 0, 0, 1), ja.clear(ja.COLOR_BUFFER_BIT | ja.DEPTH_BUFFER_BIT), e.setUniforms([
                ["uInverseTexSize", "2fv", [1 / c[0], 1 / c[1]]],
                ["uEffectStrength", "1f", d],
                ["uNearPlane", "1f", 1],
                ["uFarPlane", "1f", 7500]
            ]), e.bindBuffer(this.vertexBuffer, "aPosition"), e.bindBuffer(this.texCoordBuffer, "aTexCoord"), e.bindTexture("uDepthTexIndex", 0, a), e.bindTexture("uFogTexIndex", 1, b), ja.drawArrays(ja.TRIANGLES, 0, this.vertexBuffer.numItems), e.disable(), f.disable(), ja.viewport(0, 0, ia.width, ia.height)
        },
        destroy: function() {}
    }, Ja.Overlay = {
        init: function() {
            var a = this.createGeometry();
            this.vertexBuffer = new ba.Buffer(3, new Float32Array(a.vertices)), this.texCoordBuffer = new ba.Buffer(2, new Float32Array(a.texCoords)), this.shader = new ba.Shader({
                vertexShader: aa.texture.vertex,
                fragmentShader: aa.texture.fragment,
                shaderName: "overlay texture shader",
                attributes: ["aPosition", "aTexCoord"],
                uniforms: ["uMatrix", "uTexIndex"]
            })
        },
        createGeometry: function() {
            var a = [],
                b = [];
            return a.push(-1, -1, 1e-5, 1, -1, 1e-5, 1, 1, 1e-5), a.push(-1, -1, 1e-5, 1, 1, 1e-5, -1, 1, 1e-5), b.push(0, 0, 1, 0, 1, 1), b.push(0, 0, 1, 1, 0, 1), {
                vertices: a,
                texCoords: b
            }
        },
        render: function(a, b) {
            var c = this.shader;
            c.enable(), ja.disable(ja.DEPTH_TEST), c.setUniformMatrix("uMatrix", "4fv", ba.Matrix.identity().data), c.bindBuffer(this.vertexBuffer, "aPosition"), c.bindBuffer(this.texCoordBuffer, "aTexCoord"), c.bindTexture("uTexIndex", 0, a), ja.drawArrays(ja.TRIANGLES, 0, this.vertexBuffer.numItems), ja.enable(ja.DEPTH_TEST), c.disable()
        },
        destroy: function() {}
    }, Ja.OutlineMap = {
        init: function() {
            this.shader = new ba.Shader({
                vertexShader: aa.outlineMap.vertex,
                fragmentShader: aa.outlineMap.fragment,
                shaderName: "outline map shader",
                attributes: ["aPosition", "aTexCoord"],
                uniforms: ["uMatrix", "uInverseTexSize", "uNearPlane", "uFarPlane", "uDepthTexIndex", "uFogNormalTexIndex", "uIdTexIndex", "uEffectStrength"]
            }), this.framebuffer = new ba.Framebuffer(128, 128), this.vertexBuffer = new ba.Buffer(3, new Float32Array([-1, -1, 1e-5, 1, -1, 1e-5, 1, 1, 1e-5, -1, -1, 1e-5, 1, 1, 1e-5, -1, 1, 1e-5])), this.texCoordBuffer = new ba.Buffer(2, new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]))
        },
        render: function(a, b, c, d, e) {
            var f = this.shader,
                g = this.framebuffer;
            void 0 === e && (e = 1), g.setSize(d[0], d[1]), ja.viewport(0, 0, d[0], d[1]), f.enable(), g.enable(), ja.clearColor(1, 0, 0, 1), ja.clear(ja.COLOR_BUFFER_BIT | ja.DEPTH_BUFFER_BIT), ja.uniformMatrix4fv(f.uniforms.uMatrix, !1, ba.Matrix.identity().data), f.setUniforms([
                ["uInverseTexSize", "2fv", [1 / d[0], 1 / d[1]]],
                ["uEffectStrength", "1f", e],
                ["uNearPlane", "1f", 1],
                ["uFarPlane", "1f", 7500]
            ]), f.bindBuffer(this.vertexBuffer, "aPosition"), f.bindBuffer(this.texCoordBuffer, "aTexCoord"), f.bindTexture("uDepthTexIndex", 0, a), f.bindTexture("uFogNormalTexIndex", 1, b), f.bindTexture("uIdTexIndex", 2, c), ja.drawArrays(ja.TRIANGLES, 0, this.vertexBuffer.numItems), f.disable(), g.disable(), ja.viewport(0, 0, ia.width, ia.height)
        },
        destroy: function() {}
    }, Ja.Blur = function() {
        this.shader = new ba.Shader({
            vertexShader: aa.blur.vertex,
            fragmentShader: aa.blur.fragment,
            shaderName: "blur shader",
            attributes: ["aPosition", "aTexCoord"],
            uniforms: ["uInverseTexSize", "uTexIndex"]
        }), this.framebuffer = new ba.Framebuffer(128, 128), this.vertexBuffer = new ba.Buffer(3, new Float32Array([-1, -1, 1e-5, 1, -1, 1e-5, 1, 1, 1e-5, -1, -1, 1e-5, 1, 1, 1e-5, -1, 1, 1e-5])), this.texCoordBuffer = new ba.Buffer(2, new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]))
    }, Ja.Blur.prototype.render = function(a, b) {
        var c = this.shader,
            d = this.framebuffer;
        d.setSize(b[0], b[1]), ja.viewport(0, 0, b[0], b[1]), c.enable(), d.enable(), ja.clearColor(1, 0, 0, 1), ja.clear(ja.COLOR_BUFFER_BIT | ja.DEPTH_BUFFER_BIT), c.setUniform("uInverseTexSize", "2fv", [1 / d.width, 1 / d.height]), c.bindBuffer(this.vertexBuffer, "aPosition"), c.bindBuffer(this.texCoordBuffer, "aTexCoord"), c.bindTexture("uTexIndex", 0, a), ja.drawArrays(ja.TRIANGLES, 0, this.vertexBuffer.numItems), c.disable(), d.disable(), ja.viewport(0, 0, ia.width, ia.height)
    }, Ja.Blur.prototype.destroy = function() {
        this.framebuffer && this.framebuffer.destroy()
    };
    var La = {};
    La.Tile = function(a, b, c) {
        this.x = a, this.y = b, this.latitude = N(b, c), this.longitude = M(a, c), this.zoom = c, this.key = [a, b, c].join(",");
        var d = H(this.latitude, c),
            e = [d, d, 0, d, 0, 0, 0, d, 0, 0, 0, 0],
            f = [1, 0, 1, 1, 0, 0, 0, 1];
        this.vertexBuffer = new ba.Buffer(3, new Float32Array(e)), this.texCoordBuffer = new ba.Buffer(2, new Float32Array(f))
    }, La.Tile.prototype = {
        load: function(a) {
            ma.setBusy(), this.texture = (new ba.texture.Image).load(a, function(a) {
                ma.setIdle(), a && (this.isReady = !0, ja.bindTexture(ja.TEXTURE_2D, this.texture.id), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_WRAP_S, ja.CLAMP_TO_EDGE), ja.texParameteri(ja.TEXTURE_2D, ja.TEXTURE_WRAP_T, ja.CLAMP_TO_EDGE))
            }.bind(this))
        },
        destroy: function() {
            this.vertexBuffer.destroy(), this.texCoordBuffer.destroy(), this.texture && this.texture.destroy()
        }
    }
}();
//# sourceMappingURL=OSMBuildings.js.map