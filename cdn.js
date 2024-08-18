import Utils from "./Utilities/utils.js"

class t {
    constructor(t, e, i) {
        this.trigger = t, void 0 === i ? (this.options = {}, this._script = e) : (this.options = e, this._script = i), this.done = !1, this.stop = () => {}
    }
    get isEdgeActivated() {
        return this.trigger === t.TIMER_GREATER_THAN || this.trigger === t.LOUDNESS_GREATER_THAN
    }
    option(t, e) {
        const i = this.options[t];
        return "function" == typeof i ? i(e) : i
    }
    matches(t, e, i) {
        if (this.trigger !== t) return !1;
        for (const t in e)
            if (this.option(t, i) !== e[t]) return !1;
        return !0
    }
    start(t) {
        return this.stop(), this.done = !1, this._runningScript = this._script.call(t), new Promise((t => {
            this.stop = () => {
                this.done = !0, t()
            }
        }))
    }
    step() {
        this._runningScript && (this.done = !!this._runningScript.next().done, this.done && this.stop())
    }
    clone() {
        return new t(this.trigger, this.options, this._script)
    }
}
t.GREEN_FLAG = Symbol("GREEN_FLAG"), t.KEY_PRESSED = Symbol("KEY_PRESSED"), t.BROADCAST = Symbol("BROADCAST"), t.CLICKED = Symbol("CLICKED"), t.CLONE_START = Symbol("CLONE_START"), t.LOUDNESS_GREATER_THAN = Symbol("LOUDNESS_GREATER_THAN"), t.TIMER_GREATER_THAN = Symbol("TIMER_GREATER_THAN"), t.BACKDROP_CHANGED = Symbol("BACKDROP_CHANGED");
class e {
    static create() {
        const t = new Float32Array(9);
        return e.identity(t), t
    }
    static identity(t) {
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
    }
    static translate(t, e, i, s) {
        const n = e[0],
            r = e[1],
            o = e[2],
            a = e[3],
            h = e[4],
            c = e[5],
            l = e[6],
            u = e[7],
            d = e[8];
        return t[0] = n, t[1] = r, t[2] = o, t[3] = a, t[4] = h, t[5] = c, t[6] = i * n + s * a + l, t[7] = i * r + s * h + u, t[8] = i * o + s * c + d, t
    }
    static rotate(t, e, i) {
        const s = e[0],
            n = e[1],
            r = e[2],
            o = e[3],
            a = e[4],
            h = e[5],
            c = e[6],
            l = e[7],
            u = e[8],
            d = Math.sin(i),
            f = Math.cos(i);
        return t[0] = f * s + d * o, t[1] = f * n + d * a, t[2] = f * r + d * h, t[3] = f * o - d * s, t[4] = f * a - d * n, t[5] = f * h - d * r, t[6] = c, t[7] = l, t[8] = u, t
    }
    static scale(t, e, i, s) {
        return t[0] = i * e[0], t[1] = i * e[1], t[2] = i * e[2], t[3] = s * e[3], t[4] = s * e[4], t[5] = s * e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t
    }
    static transformPoint(t, e, i) {
        const s = i[0],
            n = i[1];
        return e[0] = t[0] * s + t[3] * n + t[6], e[1] = t[1] * s + t[4] * n + t[7], e
    }
}
class i {
    constructor() {
        return this.left = -1 / 0, this.right = 1 / 0, this.bottom = -1 / 0, this.top = 1 / 0, this
    }
    static fromBounds(t, e, s, n, r = new i) {
        return r.left = t, r.right = e, r.bottom = s, r.top = n, r
    }
    static fromMatrix(t, e = new i) {
        const s = t[0] / 2,
            n = t[3] / 2,
            r = Math.abs(s) + Math.abs(n),
            o = s + n + t[6],
            a = t[1] / 2,
            h = t[4] / 2,
            c = Math.abs(a) + Math.abs(h),
            l = a + h + t[7];
        return e.left = o - r, e.right = o + r, e.bottom = l - c, e.top = l + c, e
    }
    static copy(t, e) {
        return e.left = t.left, e.right = t.right, e.bottom = t.bottom, e.top = t.top, e
    }
    snapToInt() {
        return this.left = Math.floor(this.left), this.right = Math.ceil(this.right), this.bottom = Math.floor(this.bottom), this.top = Math.ceil(this.top), this
    }
    intersects(t) {
        return this.left <= t.right && t.left <= this.right && this.top >= t.bottom && t.top >= this.bottom
    }
    containsPoint(t, e) {
        return t >= this.left && t <= this.right && e >= this.bottom && e <= this.top
    }
    clamp(t, e, i, s) {
        return this.left = Math.min(Math.max(this.left, t), e), this.right = Math.max(Math.min(this.right, e), t), this.bottom = Math.min(Math.max(this.bottom, i), s), this.top = Math.max(Math.min(this.top, s), i), this
    }
    static union(t, e, s = new i) {
        return s.left = Math.min(t.left, e.left), s.right = Math.max(t.right, e.right), s.bottom = Math.min(t.bottom, e.bottom), s.top = Math.max(t.top, e.top), s
    }
    static intersection(t, e, s = new i) {
        return s.left = Math.max(t.left, e.left), s.right = Math.min(t.right, e.right), s.bottom = Math.max(t.bottom, e.bottom), s.top = Math.min(t.top, e.top), s
    }
    get width() {
        return this.right - this.left
    }
    get height() {
        return this.top - this.bottom
    }
}
const s = ["color", "fisheye", "whirl", "pixelate", "mosaic", "brightness", "ghost"],
    n = {
        color: 1,
        fisheye: 2,
        whirl: 4,
        pixelate: 8,
        mosaic: 16,
        brightness: 32,
        ghost: 64
    },
    r = (t, e, i) => {
        const {
            effects: s
        } = t._sprite, r = s._bitmask;
        if (i[0] = e[0], i[1] = e[1], 0 != (r & n.mosaic)) {
            const t = Math.max(1, Math.min(Math.floor(Math.abs(s.mosaic + 10) / 10 + .5), 512));
            i[0] = t * i[0] % 1, i[1] = t * i[1] % 1
        }
        if (0 != (r & n.pixelate)) {
            const e = t.getCurrentSkin(),
                n = e.width / (.1 * Math.abs(s.pixelate)),
                r = e.height / (.1 * Math.abs(s.pixelate));
            i[0] = (Math.floor(i[0] * n) + .5) / n, i[1] = (Math.floor(i[1] * r) + .5) / r
        }
        if (0 != (r & n.whirl)) {
            const t = .017453292519943295,
                e = i[0] - .5,
                n = i[1] - .5,
                r = Math.sqrt(e * e + n * n),
                o = Math.max(1 - 2 * r, 0),
                a = -s.whirl * t * o * o,
                h = Math.sin(a),
                c = Math.cos(a);
            i[0] = c * e + h * n + .5, i[1] = -h * e + c * n + .5
        }
        if (0 != (r & n.fisheye)) {
            const t = (i[0] - .5) / .5,
                e = (i[1] - .5) / .5,
                n = Math.sqrt(t * t + e * e) + .001,
                r = Math.max(0, (s.fisheye + 100) / 100),
                o = Math.pow(Math.min(n, 1), r) * Math.max(1, n),
                a = t / n,
                h = e / n;
            i[0] = .5 + o * a * .5, i[1] = .5 + o * h * .5
        }
        return i
    },
    o = (t, e, i) => Math.max(e, Math.min(i, t));

function a(t, e, i) {
    t /= 255, e /= 255, i /= 255;
    const s = Math.max(t, e, i),
        n = s - Math.min(t, e, i);
    let r = 0;
    0 === n || (s === t ? r = ((e - i) / n + 6) % 6 / 6 : s === e ? r = ((i - t) / n + 2) % 6 / 6 : s === i && (r = ((t - e) / n + 4) % 6 / 6));
    let o = 0;
    0 !== s && (o = n / s);
    return {
        h: 100 * r,
        s: 100 * o,
        v: 100 * s
    }
}

function h(t, e, i) {
    t = t / 100 * 360;
    const s = (i /= 100) * (e /= 100),
        n = s * (1 - Math.abs(t / 60 % 2 - 1)),
        r = i - s;
    let o = r,
        a = r,
        h = r;
    return t < 60 ? (o += s, a += n) : t < 120 ? (a += s, o += n) : t < 180 ? (a += s, h += n) : t < 240 ? (h += s, a += n) : t < 300 ? (h += s, o += n) : t < 360 && (o += s, h += n), {
        r: 255 * o,
        g: 255 * a,
        b: 255 * h
    }
}
class c {
    constructor(t = 0, e = 0, i = 0, s = 1) {
        this._h = 0, this._s = 0, this._v = 0, this._a = 1, this.h = t, this.s = e, this.v = i, this.a = s
    }
    static rgb(t, e, i, s = 1) {
        const {
            h: n,
            s: r,
            v: o
        } = a(t, e, i);
        return new c(n, r, o, s)
    }
    static hsv(t, e, i, s = 1) {
        return new c(t, e, i, s)
    }
    static num(t) {
        const e = (t = Number(t)) >> 24 & 255,
            i = t >> 16 & 255,
            s = t >> 8 & 255,
            n = 255 & t;
        return c.rgb(i, s, n, e > 0 ? e / 255 : 1)
    }
    get r() {
        return h(this.h, this.s, this.v).r
    }
    set r(t) {
        this._setRGB(t, this.g, this.b)
    }
    get g() {
        return h(this.h, this.s, this.v).g
    }
    set g(t) {
        this._setRGB(this.r, t, this.b)
    }
    get b() {
        return h(this.h, this.s, this.v).b
    }
    set b(t) {
        this._setRGB(this.r, this.g, t)
    }
    get a() {
        return this._a
    }
    set a(t) {
        this._a = o(t, 0, 1)
    }
    get h() {
        return this._h
    }
    set h(t) {
        this._h = (t % 100 + 100) % 100
    }
    get s() {
        return this._s
    }
    set s(t) {
        this._s = o(t, 0, 100)
    }
    get v() {
        return this._v
    }
    set v(t) {
        this._v = o(t, 0, 100)
    }
    _setRGB(t, e, i) {
        t = o(t, 0, 255), e = o(e, 0, 255), i = o(i, 0, 255);
        const {
            h: s,
            s: n,
            v: r
        } = a(t, e, i);
        this.h = s, this.s = n, this.v = r
    }
    toHexString(t = !1) {
        const e = t => {
            let e = (t = o(Math.round(t), 0, 255)).toString(16);
            return 1 === e.length && (e = "0" + e), e
        };
        let i = "#" + [this.r, this.g, this.b].map(e).join("");
        return (t || 1 !== this.a) && (i += e(255 * this.a)), i
    }
    toRGBString(t = !1) {
        const e = [this.r, this.g, this.b].map(Math.round);
        return t || 1 !== this.a ? `rgba(${e.join(", ")}, ${this.a})` : `rgb(${e.join(", ")})`
    }
    toRGBA() {
        const t = h(this._h, this._s, this._v);
        return [t.r, t.g, t.b, 255 * this._a]
    }
    toRGBANormalized() {
        const t = h(this._h, this._s, this._v);
        return [t.r / 255, t.g / 255, t.b / 255, this._a]
    }
    toString() {
        return this.toRGBString()
    }
}
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2019 Truman Kilen, Nathan Dinsmore, and Adroitwhiz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const l = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767],
    u = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8];

function d(t) {
    const e = new DataView(t).getUint16(20, !0);
    return function(t) {
        const e = new DataView(t);
        return 1380533830 === e.getUint32(0) && 1463899717 === e.getUint32(8)
    }(t) && 17 === e
}
class f {
    constructor(t, e) {
        this.name = t, this.url = e, this.audioBuffer = null, this.source = null, this.playbackRate = 1, this.downloadMyAudioBuffer()
    }
    get duration() {
        return this.audioBuffer ? this.audioBuffer.duration : 0
    }* start() {
        let t = !1,
            e = !0;
        if (this._markDone && this._markDone(), this.audioBuffer) this.playMyAudioBuffer(), t = !0;
        else {
            const i = this._doneDownloading;
            this._doneDownloading = s => {
                s ? e = !1 : (this.playMyAudioBuffer(), t = !0, delete this._doneDownloading), i && i(!0)
            }
        }
        for (; !t && e;) yield;
        return e
    }* playUntilDone() {
        let t = !0;
        const e = yield* this.start();
        if (this.audioBuffer && this.source && (this.source.addEventListener("ended", (() => {
                t = !1, delete this._markDone
            })), e))
            for (this._markDone = () => {
                    t = !1, delete this._markDone
                }; t;) yield
    }
    stop() {
        this._markDone && this._markDone(), this.source && (this.source.disconnect(), this.source = null)
    }
    downloadMyAudioBuffer() {
        return fetch(this.url).then((t => t.arrayBuffer())).then((t => d(t) ? function(t, e) {
            const i = new DataView(t);
            if (1380533830 !== i.getUint32(0) || 1463899717 !== i.getUint32(8)) return Promise.reject(new Error("Unrecognized audio format"));
            const s = {},
                n = i.byteLength - 8;
            let r = 12;
            for (; r < n;) s[String.fromCharCode(i.getUint8(r), i.getUint8(r + 1), i.getUint8(r + 2), i.getUint8(r + 3))] = r, r += 8 + i.getUint32(r + 4, !0);
            const o = s.fact,
                a = s.data;
            if ("number" != typeof o || "number" != typeof a) return Promise.reject(new Error("Invalid WAV"));
            const h = i.getUint16(20, !0),
                c = i.getUint32(24, !0);
            if (17 === h) {
                const t = (i.getUint16(38, !0) - 1) / 2 + 4,
                    s = i.getUint32(o + 8, !0),
                    n = e.createBuffer(1, s, c),
                    r = n.getChannelData(0);
                let h, d, f, g = 0,
                    _ = 0,
                    m = -1;
                const p = a + 8;
                let b = p,
                    E = 0;
                for (;;)
                    if ((b - p) % t == 0 && m < 0) {
                        if (b >= i.byteLength) break;
                        g = i.getInt16(b, !0), b += 2, _ = i.getUint8(b), b += 1, b++, _ > 88 && (_ = 88), r[E++] = g / 32767
                    } else {
                        if (m < 0) {
                            if (b >= i.byteLength) break;
                            m = i.getUint8(b), b += 1, d = 15 & m
                        } else d = m >> 4 & 15, m = -1;
                        h = l[_], f = 0, 4 & d && (f += h), 2 & d && (f += h >> 1), 1 & d && (f += h >> 2), f += h >> 3, _ += u[d], _ > 88 && (_ = 88), _ < 0 && (_ = 0), g += 8 & d ? -f : f, g > 32767 && (g = 32767), g < -32768 && (g = -32768), r[E++] = g / 32768
                    } return Promise.resolve(n)
            }
            return Promise.reject(new Error(`Unrecognized WAV format ${h}`))
        }(t, f.audioContext).catch((t => (console.warn(`Failed to load sound "${this.name}" - will not play:\n` + t.toString()), null))) : new Promise(((e, i) => {
            f.audioContext.decodeAudioData(t, e, i)
        })))).then((t => (this.audioBuffer = t, this._doneDownloading && this._doneDownloading(!1), t)))
    }
    playMyAudioBuffer() {
        this.audioBuffer && (this.source && this.source.disconnect(), this.source = f.audioContext.createBufferSource(), this.source.buffer = this.audioBuffer, this.source.playbackRate.value = this.playbackRate, this.target && this.source.connect(this.target), this.source.start(f.audioContext.currentTime))
    }
    connect(t) {
        t !== this.target && (this.target = t, this.source && (this.source.disconnect(), this.source.connect(this.target)))
    }
    setPlaybackRate(t) {
        this.playbackRate = t, this.source && (this.source.playbackRate.value = t)
    }
    isConnectedTo(t) {
        return this.target === t
    }
    static get audioContext() {
        if (!this._audioContext) {
            const t = window.AudioContext || window.webkitAudioContext;
            this._audioContext = new t
        }
        return this._audioContext
    }
}
const g = [{
    name: "pan",
    initial: 0,
    minimum: -100,
    maximum: 100,
    isPatch: !0,
    makeNodes() {
        const t = f.audioContext,
            e = t.createGain(),
            i = t.createGain(),
            s = t.createGain(),
            n = t.createChannelMerger(2),
            r = n;
        return e.connect(i), e.connect(s), i.connect(n, 0, 0), s.connect(n, 0, 1), {
            input: e,
            output: r,
            leftGain: i,
            rightGain: s,
            channelMerger: n
        }
    },
    set(t, {
        leftGain: e,
        rightGain: i
    }) {
        const s = (t + 100) / 200,
            n = Math.cos(s * Math.PI / 2),
            r = Math.sin(s * Math.PI / 2),
            {
                currentTime: o
            } = f.audioContext,
            {
                decayWait: a,
                decayDuration: h
            } = _;
        e.gain.setTargetAtTime(n, o + a, h), i.gain.setTargetAtTime(r, o + a, h)
    }
}, {
    name: "pitch",
    initial: 0,
    isPatch: !1,
    set(t, e) {
        const i = t / 10,
            s = Math.pow(2, i / 12);
        e.setPlaybackRate(s)
    }
}, {
    name: "volume",
    initial: 100,
    minimum: 0,
    maximum: 100,
    resetOnStart: !1,
    resetOnClone: !0,
    isPatch: !0,
    makeNodes() {
        const t = f.audioContext.createGain();
        return {
            input: t,
            output: t,
            node: t
        }
    },
    set(t, {
        node: e
    }) {
        e.gain.linearRampToValueAtTime(t / 100, f.audioContext.currentTime + _.decayDuration)
    }
}];
class _ {
    constructor(t) {
        const {
            getNonPatchSoundList: e
        } = t;
        this.inputNode = f.audioContext.createGain(), this.effectNodes = {}, this.resetToInitial(), this.getNonPatchSoundList = e
    }
    resetToInitial() {
        const t = _.getInitialEffectValues();
        if (this.effectValues)
            for (const [t, e] of Object.entries(_.getInitialEffectValues())) !1 !== _.getEffectDescriptor(t).resetOnStart && this.setEffectValue(t, e);
        else this.effectValues = t
    }
    updateAudioEffect(t) {
        const e = _.getEffectDescriptor(t);
        if (!e) return;
        const i = this.effectValues[t];
        if (e.isPatch) {
            let s = e;
            do {
                s = _.getNextEffectDescriptor(s.name)
            } while (s && !this.effectNodes[s.name]);
            let n, r, o = e;
            do {
                o = _.getPreviousEffectDescriptor(o.name)
            } while (o && !this.effectNodes[o.name]);
            s && (n = this.effectNodes[s.name]), o && (r = this.effectNodes[o.name]), r || (r = {
                output: this.inputNode
            }), !n && this.target && (n = {
                input: this.target
            });
            let a = this.effectNodes[e.name];
            if (a || i === e.initial || (a = e.makeNodes(), this.effectNodes[e.name] = a, r.output.disconnect(), r.output.connect(a.input), n && a.output.connect(n.input)), i === e.initial) {
                if (a) {
                    for (const t of new Set(Object.values(a))) t.disconnect();
                    n && r.output.connect(n.input), delete this.effectNodes[t]
                }
            } else e.set(i, a)
        } else
            for (const t of this.getNonPatchSoundList()) e.set(i, t)
    }
    connect(t) {
        this.target = t;
        let e, i = _.getLastEffectDescriptor();
        do {
            i = _.getPreviousEffectDescriptor(i.name)
        } while (i && !this.effectNodes[i.name]);
        e = i ? this.effectNodes[i.name] : {
            output: this.inputNode
        }, e.output.disconnect(), e.output.connect(t)
    }
    setEffectValue(t, e) {
        e = Number(e), t in this.effectValues && !isNaN(e) && e !== this.effectValues[t] && (this.effectValues[t] = e, this.clampEffectValue(t), this.updateAudioEffect(t))
    }
    changeEffectValue(t, e) {
        e = Number(e), t in this.effectValues && !isNaN(e) && 0 !== e && (this.effectValues[t] += e, this.clampEffectValue(t), this.updateAudioEffect(t))
    }
    clampEffectValue(t) {
        const e = _.getEffectDescriptor(t);
        let i = this.effectValues[t];
        "number" == typeof e.minimum && i < e.minimum ? i = e.minimum : "number" == typeof e.maximum && i > e.maximum && (i = e.maximum), this.effectValues[t] = i
    }
    getEffectValue(t) {
        return this.effectValues[t] || 0
    }
    clone(t) {
        const e = new _(Object.assign({
            getNonPatchSoundList: this.getNonPatchSoundList
        }, t));
        for (const [t, i] of Object.entries(this.effectValues)) {
            _.getEffectDescriptor(t).resetOnClone || e.setEffectValue(t, i)
        }
        return this.target && e.connect(this.target), e
    }
    applyToSound(t) {
        t.connect(this.inputNode);
        for (const [e, i] of Object.entries(this.effectValues)) {
            const s = _.getEffectDescriptor(e);
            s.isPatch || s.set(i, t)
        }
    }
    isTargetOf(t) {
        return t.isConnectedTo(this.inputNode)
    }
    static getInitialEffectValues() {
        const t = {};
        for (const {
                name: e,
                initial: i
            }
            of this.effectDescriptors) t[e] = i;
        return t
    }
    static getEffectDescriptor(t) {
        return this.effectDescriptors.find((e => e.name === t))
    }
    static getFirstEffectDescriptor() {
        return this.effectDescriptors[0]
    }
    static getLastEffectDescriptor() {
        return this.effectDescriptors[this.effectDescriptors.length - 1]
    }
    static getNextEffectDescriptor(t) {
        return this.effectDescriptors.slice(1).find(((e, i) => this.effectDescriptors[i].name === t))
    }
    static getPreviousEffectDescriptor(t) {
        return this.effectDescriptors.slice(0, -1).find(((e, i) => this.effectDescriptors[i + 1].name === t))
    }
}
_.decayDuration = .025, _.decayWait = .05, _.effectDescriptors = g;
class m {
    constructor(t) {
        this.effectChain = t;
        for (const {
                name: e
            }
            of _.effectDescriptors) Object.defineProperty(this, e, {
            get: () => t.getEffectValue(e),
            set: i => t.setEffectValue(e, i)
        })
    }
    clear() {
        this.effectChain.resetToInitial()
    }
}
class p {
    constructor(t, e, i = {
        x: 0,
        y: 0
    }
) {try {
    
    this.name = t;
    this.url = e;
    this.img = new Image();
    this.img.crossOrigin = "Anonymous";
    this.img.src = this.url;
    this.isBitmap = !this.url.match(/\.svg/);
    this.resolution = this.isBitmap ? 2 : 1;
    this.center = i;
} catch (error) {
    Utils.warn("warn", "Failed to load costume: " + t +  " " + (error.message || error));
}}

    get width() {
        return this.img.naturalWidth
    }
    get height() {
        return this.img.naturalHeight
    }
    
}
class b {
    constructor() {
        this._bitmask = 0, this._effectValues = {
            color: 0,
            fisheye: 0,
            whirl: 0,
            pixelate: 0,
            mosaic: 0,
            brightness: 0,
            ghost: 0
        };
        for (let t = 0; t < s.length; t++) {
            const e = s[t];
            Object.defineProperty(this, e, {
                get: () => this._effectValues[e],
                set: i => {
                    this._effectValues[e] = i, this._bitmask = 0 === i ? this._bitmask & ~(1 << t) : this._bitmask | 1 << t
                }
            })
        }
    }
    _clone() {
        const t = new b;
        for (const e of Object.keys(this._effectValues)) t[e] = this[e];
        return t
    }
    clear() {
        for (const t of Object.keys(this._effectValues)) this._effectValues[t] = 0;
        this._bitmask = 0
    }
}
class E {
    constructor(t, e = {}) {
        const {
            costumeNumber: i,
            layerOrder: s = 0
        } = t;
        this._costumeNumber = i, this._layerOrder = s, this.triggers = [], this.watchers = {}, this.costumes = [], this.sounds = [], this.effectChain = new _({
            getNonPatchSoundList: this.getSoundsPlayedByMe.bind(this)
        }), this.effectChain.connect(f.audioContext.destination), this.effects = new b, this.audioEffects = new m(this.effectChain), this._vars = e
    }
    getSoundsPlayedByMe() {
        return this.sounds.filter((t => this.effectChain.isTargetOf(t)))
    }
    get stage() {
        return this._project.stage
    }
    get sprites() {
        return this._project.sprites
    }
    get vars() {
        return this._vars
    }
    get costumeNumber() {
        return this._costumeNumber
    }
    set costumeNumber(t) {
        Number.isFinite(t) ? this._costumeNumber = this.wrapClamp(t, 1, this.costumes.length) : this._costumeNumber = 0
    }
    set costume(t) {
        if (t instanceof p) {
            const e = this.costumes.indexOf(t);
            e > -1 && (this.costumeNumber = e + 1)
        }
        if ("number" != typeof t) {
            if ("string" == typeof t) {
                const e = this.costumes.findIndex((e => e.name === t));
                if (e > -1) this.costumeNumber = e + 1;
                else switch (t) {
                    case "next costume":
                    case "next backdrop":
                        this.costumeNumber = this.costumeNumber + 1;
                        break;
                    case "previous costume":
                    case "previous backdrop":
                        this.costumeNumber = this.costumeNumber - 1;
                        break;
                    case "random costume":
                    case "random backdrop": {
                        const t = 1,
                            e = this.costumes.length,
                            i = this.costumeNumber,
                            s = e - t;
                        let n = t + Math.floor(Math.random() * s);
                        n >= i && n++, this.costumeNumber = n;
                        break
                    }
                    default:
                        Number.isNaN(Number(t)) || 0 === t.trim().length || (this.costumeNumber = Number(t))
                }
            }
        } else this.costumeNumber = t
    }
    get costume() {
        return this.costumes[this.costumeNumber - 1]
    }
    degToRad(t) {
        return t * Math.PI / 180
    }
    radToDeg(t) {
        return 180 * t / Math.PI
    }
    degToScratch(t) {
        return 90 - t
    }
    scratchToDeg(t) {
        return 90 - t
    }
    radToScratch(t) {
        return this.degToScratch(this.radToDeg(t))
    }
    scratchToRad(t) {
        return this.degToRad(this.scratchToDeg(t))
    }
    scratchTan(t) {
        switch (t %= 360) {
            case -270:
            case 90:
                return 1 / 0;
            case -90:
            case 270:
                return -1 / 0;
            default:
                return parseFloat(Math.tan(Math.PI * t / 180).toFixed(10))
        }
    }
    normalizeDeg(t) {
        return ((t + 180) % 360 + 360) % 360 - 180
    }
    wrapClamp(t, e, i) {
        const s = i - e + 1;
        return t - Math.floor((t - e) / s) * s
    }
    warp(t) {
        const e = t.bind(this);
        return (...t) => {
            const i = e(...t);
            for (; !i.next().done;);
        }
    }
    random(t, e) {
        const i = Math.min(t, e),
            s = Math.max(t, e);
        return i % 1 == 0 && s % 1 == 0 ? Math.floor(Math.random() * (s - i + 1)) + i : Math.random() * (s - i) + i
    }* wait(t) {
        const e = new Date;
        for (e.setMilliseconds(e.getMilliseconds() + 1e3 * t); new Date < e;) yield
    }
    get mouse() {
        return this._project.input.mouse
    }
    keyPressed(t) {
        return this._project.input.keyPressed(t)
    }
    get timer() {
        return this._project.timer
    }
    restartTimer() {
        this._project.restartTimer()
    }* startSound(t) {
        const e = this.getSound(t);
        e && (this.effectChain.applyToSound(e), yield* e.start())
    }* playSoundUntilDone(t) {
        const e = this.getSound(t);
        e && (e.connect(this.effectChain.inputNode), this.effectChain.applyToSound(e), yield* e.playUntilDone())
    }
    getSound(t) {
        return "number" == typeof t ? this.sounds[(t - 1) % this.sounds.length] : this.sounds.find((e => e.name === t))
    }
    stopAllSounds() {
        this._project.stopAllSounds()
    }
    stopAllOfMySounds() {
        for (const t of this.sounds) t.stop()
    }
    broadcast(e) {
        return this._project.fireTrigger(t.BROADCAST, {
            name: e
        })
    }* broadcastAndWait(t) {
        let e = !0;
        for (this.broadcast(t).then((() => {
                e = !1
            })); e;) yield
    }
    clearPen() {
        this._project.renderer.clearPen()
    }* askAndWait(t) {
        let e = !1;
        for (this._project.askAndWait(t).then((() => {
                e = !0
            })); !e;) yield
    }
    get answer() {
        return this._project.answer
    }
    get loudness() {
        return this._project.loudness
    }
    toNumber(t) {
        if ("number" == typeof t) return isNaN(t) ? 0 : t;
        const e = Number(t);
        return Number.isNaN(e) ? 0 : e
    }
    toBoolean(t) {
        return "boolean" == typeof t ? t : "string" == typeof t ? "" !== t && "0" !== t && "false" !== t.toLowerCase() : Boolean(t)
    }
    toString(t) {
        return String(t)
    }
    stringIncludes(t, e) {
        return t.toLowerCase().includes(e.toLowerCase())
    }
    arrayIncludes(t, e) {
        return t.some((t => 0 === this.compare(t, e)))
    }
    letterOf(t, e) {
        return e < 0 || e >= t.length ? "" : t[e]
    }
    itemOf(t, e) {
        return e < 0 || e >= t.length ? "" : t[e]
    }
    indexInArray(t, e) {
        return t.findIndex((t => 0 === this.compare(t, e)))
    }
    compare(t, e) {
        if (t === e) return 0;
        let i = Number(t),
            s = Number(e);
        if (i === 1 / 0 && s === 1 / 0 || i === -1 / 0 && s === -1 / 0) return 0;
        if (0 === i && (null === t || "string" == typeof t && 0 === t.trim().length) ? i = NaN : 0 === s && (null === e || "string" == typeof e && 0 === e.trim().length) && (s = NaN), !isNaN(i) && !isNaN(s)) return i - s;
        const n = String(t).toLowerCase(),
            r = String(e).toLowerCase();
        return n === r ? 0 : n < r ? -1 : 1
    }
}
class x extends E {
    constructor(t, e = {}) {
        super(t, e);
        const {
            x: i,
            y: s,
            direction: n,
            rotationStyle: r,
            costumeNumber: o,
            size: a,
            visible: h,
            penDown: l,
            penSize: u,
            penColor: d
        } = t;
        this._x = i, this._y = s, this._direction = n, this.rotationStyle = r || x.RotationStyle.ALL_AROUND, this._costumeNumber = o, this.size = a, this.visible = h, this.parent = null, this.clones = [], this._penDown = l || !1, this.penSize = u || 1, this._penColor = d || c.rgb(0, 0, 255), this._speechBubble = {
            text: "",
            style: "say",
            timeout: null
        }
    }* askAndWait(t) {
        this._speechBubble && this.say(""), yield* super.askAndWait(t)
    }
    createClone() {
        const e = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        e._project = this._project, e.triggers = this.triggers.map((t => t.clone())), e.costumes = this.costumes, e.sounds = this.sounds, e._vars = Object.assign({}, this._vars), e._speechBubble = {
            text: "",
            style: "say",
            timeout: null
        }, e.effects = this.effects._clone();
        let i = this;
        for (; i.parent;) i = i.parent;
        e.effectChain = i.effectChain.clone({
            getNonPatchSoundList: e.getSoundsPlayedByMe.bind(e)
        }), e.audioEffects = new m(e.effectChain), e.clones = [], e.parent = this, this.clones.push(e);
        const s = e.triggers.filter((i => i.matches(t.CLONE_START, {}, e)));
        this._project._startTriggers(s.map((t => ({
            trigger: t,
            target: e
        }))))
    }
    deleteThisClone() {
        null !== this.parent && (this.parent.clones = this.parent.clones.filter((t => t !== this)), this._project.runningTriggers = this._project.runningTriggers.filter((({
            target: t
        }) => t !== this)))
    }
    andClones() {
        return [this, ...this.clones.flatMap((t => t.andClones()))]
    }
    get direction() {
        return this._direction
    }
    set direction(t) {
        this._direction = this.normalizeDeg(t)
    }
    goto(t, e) {
        t === this.x && e === this.y || (this.penDown && this._project.renderer.penLine({
            x: this._x,
            y: this._y
        }, {
            x: t,
            y: e
        }, this._penColor, this.penSize), this._x = t, this._y = e)
    }
    get x() {
        return this._x
    }
    set x(t) {
        this.goto(t, this._y)
    }
    get y() {
        return this._y
    }
    set y(t) {
        this.goto(this._x, t)
    }
    move(t) {
        const e = this.scratchToRad(this.direction);
        this.goto(this._x + t * Math.cos(e), this._y + t * Math.sin(e))
    }* glide(t, e, i) {
        const s = (t, e, i) => t + (e - t) * i,
            n = new Date,
            r = this._x,
            o = this._y;
        let a;
        do {
            a = ((new Date).getTime() - n.getTime()) / (1e3 * t), this.goto(s(r, e, a), s(o, i, a)), yield
        } while (a < 1)
    }
    ifOnEdgeBounce() {
        const t = this.nearestEdge();
        if (!t) return;
        const e = this.scratchToRad(this.direction);
        let i = Math.cos(e),
            s = Math.sin(e);
        switch (t) {
            case x.Edge.LEFT:
                i = Math.max(.2, Math.abs(i));
                break;
            case x.Edge.RIGHT:
                i = -Math.max(.2, Math.abs(i));
                break;
            case x.Edge.TOP:
                s = -Math.max(.2, Math.abs(s));
                break;
            case x.Edge.BOTTOM:
                s = Math.max(.2, Math.abs(s))
        }
        this.direction = this.radToScratch(Math.atan2(s, i)), this.positionInFence()
    }
    positionInFence() {
        const t = this.stage.fence,
            e = this._project.renderer.getTightBoundingBox(this);
        let i = 0,
            s = 0;
        e.left < t.left && (i += t.left - e.left), e.right > t.right && (i += t.right - e.right), e.top > t.top && (s += t.top - e.top), e.bottom < t.bottom && (s += t.bottom - e.bottom), this.goto(this.x + i, this.y + s)
    }
    moveAhead(t = 1 / 0) {
        "number" == typeof t ? this._project.changeSpriteLayer(this, t) : this._project.changeSpriteLayer(this, 1, t)
    }
    moveBehind(t = 1 / 0) {
        "number" == typeof t ? this._project.changeSpriteLayer(this, -t) : this._project.changeSpriteLayer(this, -1, t)
    }
    get penDown() {
        return this._penDown
    }
    set penDown(t) {
        t && this._project.renderer.penLine({
            x: this.x,
            y: this.y
        }, {
            x: this.x,
            y: this.y
        }, this._penColor, this.penSize), this._penDown = t
    }
    get penColor() {
        return this._penColor
    }
    set penColor(t) {
        t instanceof c ? this._penColor = t : console.error(`${String(t)} is not a valid penColor. Try using the Color class!`)
    }
    stamp() {
        this._project.renderer.stamp(this)
    }
    touching(t, e = !1) {
        if ("string" == typeof t) switch (t) {
            case "mouse":
                return this._project.renderer.checkPointCollision(this, {
                    x: this.mouse.x,
                    y: this.mouse.y
                }, e);
            case "edge": {
                const t = this._project.renderer.getTightBoundingBox(this),
                    e = this.stage.width,
                    i = this.stage.height;
                return t.left < -e / 2 || t.right > e / 2 || t.top > i / 2 || t.bottom < -i / 2
            }
            default:
                return console.error(`Cannot find target "${t}" in "touching". Did you mean to pass a sprite class instead?`), !1
        } else if (t instanceof c) return this._project.renderer.checkColorCollision(this, t);
        return this._project.renderer.checkSpriteCollision(this, t, e)
    }
    colorTouching(t, e) {
        return "string" == typeof e ? (console.error(`Cannot find target "${e}" in "touchingColor". Did you mean to pass a sprite class instead?`), !1) : "string" == typeof t ? (console.error(`Cannot find color "${t}" in "touchingColor". Did you mean to pass a Color instance instead?`), !1) : e instanceof c ? this._project.renderer.checkColorCollision(this, e, t) : this._project.renderer.checkSpriteCollision(this, e, !1, t)
    }
    nearestEdge() {
        const t = this._project.renderer.getTightBoundingBox(this),
            {
                width: e,
                height: i
            } = this.stage,
            s = Math.max(0, e / 2 + t.left),
            n = Math.max(0, i / 2 - t.top),
            r = Math.max(0, e / 2 - t.right),
            o = Math.max(0, i / 2 + t.bottom);
        let a = null,
            h = 1 / 0;
        return s < h && (h = s, a = x.Edge.LEFT), n < h && (h = n, a = x.Edge.TOP), r < h && (h = r, a = x.Edge.RIGHT), o < h && (h = o, a = x.Edge.BOTTOM), h > 0 && (a = null), a
    }
    say(t) {
        this._speechBubble?.timeout && clearTimeout(this._speechBubble.timeout), this._speechBubble = {
            text: String(t),
            style: "say",
            timeout: null
        }
    }
    think(t) {
        this._speechBubble?.timeout && clearTimeout(this._speechBubble.timeout), this._speechBubble = {
            text: String(t),
            style: "think",
            timeout: null
        }
    }* sayAndWait(t, e) {
        this._speechBubble?.timeout && clearTimeout(this._speechBubble.timeout);
        const i = {
            text: t,
            style: "say",
            timeout: null
        };
        let s = !1;
        const n = window.setTimeout((() => {
            i.text = "", i.timeout = null, s = !0
        }), 1e3 * e);
        for (i.timeout = n, this._speechBubble = i; !s;) yield
    }* thinkAndWait(t, e) {
        this._speechBubble?.timeout && clearTimeout(this._speechBubble.timeout);
        const i = {
            text: t,
            style: "think",
            timeout: null
        };
        let s = !1;
        const n = window.setTimeout((() => {
            i.text = "", i.timeout = null, s = !0
        }), 1e3 * e);
        for (i.timeout = n, this._speechBubble = i; !s;) yield
    }
}
x.RotationStyle = Object.freeze({
    ALL_AROUND: Symbol("ALL_AROUND"),
    LEFT_RIGHT: Symbol("LEFT_RIGHT"),
    DONT_ROTATE: Symbol("DONT_ROTATE")
}), x.Edge = Object.freeze({
    BOTTOM: Symbol("BOTTOM"),
    LEFT: Symbol("LEFT"),
    RIGHT: Symbol("RIGHT"),
    TOP: Symbol("TOP")
});
class T extends E {
    constructor(t, e = {}) {
        super(t, e), Object.defineProperties(this, {
            width: {
                value: t.width || window.innerWidth, //480
                enumerable: !0
            },
            height: {
                value: t.height || window.innerHeight, //360
                enumerable: !0
            }
        }), this.fence = {
            left: -this.width / 2,
            right: this.width / 2,
            top: this.height / 2,
            bottom: -this.height / 2
        }, this.__counter = 0
    }
    fireBackdropChanged() {
        return this._project.fireTrigger(t.BACKDROP_CHANGED, {
            backdrop: this.costume.name
        })
    }
    get costumeNumber() {
        return super.costumeNumber
    }
    set costumeNumber(t) {
        super.costumeNumber = t, this.fireBackdropChanged()
    }
}
const w = (t, e, i) => (e[0] - t[0]) * (i[1] - t[1]) - (e[1] - t[1]) * (i[0] - t[0]);
class y {
    constructor(t) {
        this._sprite = t, this._unset = !0, this.update()
    }
    update() {
        this._sprite instanceof x && (this._lastX = this._sprite.x, this._lastY = this._sprite.y, this._lastRotation = this._sprite.direction, this._lastRotationStyle = this._sprite.rotationStyle, this._lastSize = this._sprite.size), this._lastCostume = this._sprite.costume, this._lastCostumeLoaded = this._sprite.costume.img.complete, this._unset = !1
    }
    get changed() {
        return this._sprite instanceof x && (this._lastX !== this._sprite.x || this._lastY !== this._sprite.y || this._lastRotation !== this._sprite.direction || this._lastRotationStyle !== this._sprite.rotationStyle || this._lastSize !== this._sprite.size) || this._lastCostume !== this._sprite.costume || this._lastCostumeLoaded !== this._sprite.costume.img.complete || this._unset
    }
}
class S {
    constructor(t, s) {
        this._renderer = t, this._sprite = s, this._matrix = e.create(), this._matrixDiff = new y(s), this._calculateSpriteMatrix(), this._convexHullImageData = null, this._convexHullMosaic = 0, this._convexHullPixelate = 0, this._convexHullWhirl = 0, this._convexHullFisheye = 0, this._convexHullPoints = null, this._aabb = new i, this._tightBoundingBox = new i, this._convexHullMatrixDiff = new y(s)
    }
    getCurrentSkin() {
        return this._renderer._getSkin(this._sprite.costume)
    }
    getAABB() {
        return i.fromMatrix(this.getMatrix(), this._aabb)
    }
    getTightBoundingBox() {
        if (!this._convexHullMatrixDiff.changed) return this._tightBoundingBox;
        const t = this.getMatrix(),
            s = this._calculateConvexHull();
        if (null === s || null === this._convexHullImageData) return this._sprite instanceof T ? i.fromBounds(this._sprite.width / -2, this._sprite.width / 2, this._sprite.height / -2, this._sprite.height / 2) : i.fromBounds(this._sprite.x, this._sprite.x, this._sprite.y, this._sprite.y, this._tightBoundingBox);
        let n = 1 / 0,
            r = -1 / 0,
            o = -1 / 0,
            a = 1 / 0;
        const h = [0, 0],
            c = t[0] / 2,
            l = t[3] / 2,
            u = (Math.abs(c) + Math.abs(l)) / this._convexHullImageData.width,
            d = t[1] / 2,
            f = t[4] / 2,
            g = (Math.abs(d) + Math.abs(f)) / this._convexHullImageData.height;
        for (let i = 0; i < s.length; i++) {
            const c = s[i];
            h[0] = c[0], h[1] = 1 - c[1], e.transformPoint(t, h, h), n = Math.min(n, h[0] - u), r = Math.max(r, h[0] + u), o = Math.max(o, h[1] + g), a = Math.min(a, h[1] - g)
        }
        return i.fromBounds(n, r, a, o, this._tightBoundingBox), this._convexHullMatrixDiff.update(), this._tightBoundingBox
    }
    _calculateConvexHull() {
        const t = this._sprite,
            e = this.getCurrentSkin().getImageData("size" in t ? t.size / 100 : 1);
        if (!e) return null;
        const {
            mosaic: i,
            pixelate: s,
            whirl: o,
            fisheye: a
        } = t.effects;
        if (this._convexHullImageData === e && this._convexHullMosaic === i && this._convexHullPixelate === s && this._convexHullWhirl === o && this._convexHullFisheye === a) return this._convexHullPoints;
        const h = t.effects._bitmask & (n.mosaic | n.pixelate | n.whirl | n.fisheye),
            c = [],
            l = [],
            {
                width: u,
                height: d,
                data: f
            } = e,
            g = [0, 0],
            _ = [0, 0];
        let m;
        for (let t = 0; t < d; t++) {
            g[1] = (t + .5) / d;
            let e = 0;
            for (; e < u; e++) {
                g[0] = (e + .5) / u;
                let i = e,
                    s = t;
                if (0 !== h && (r(this, g, _), i = Math.floor(_[0] * u), s = Math.floor(_[1] * d)), f[4 * (s * u + i) + 3] > 0) {
                    m = [g[0], g[1]];
                    break
                }
            }
            if (!(e >= u) && m) {
                for (; c.length >= 2 && !(w(c[c.length - 1], c[c.length - 2], m) > 0);) c.pop();
                for (c.push(m), e = u - 1; e >= 0; e--) {
                    g[0] = (e + .5) / u, r(this, g, _);
                    let i = e,
                        s = t;
                    if (0 !== h && (r(this, g, _), i = Math.floor(_[0] * u), s = Math.floor(_[1] * d)), f[4 * (s * u + i) + 3] > 0) {
                        m = [g[0], g[1]];
                        break
                    }
                }
                for (; l.length >= 2 && !(w(l[l.length - 1], l[l.length - 2], m) < 0);) l.pop();
                l.push(m)
            }
        }
        for (let t = l.length - 1; t >= 0; t--) c.push(l[t]);
        return this._convexHullPoints = c, this._convexHullMosaic = i, this._convexHullPixelate = s, this._convexHullWhirl = o, this._convexHullFisheye = a, this._convexHullImageData = e, this._convexHullPoints
    }
    _calculateSpriteMatrix() {
        const t = this._matrix;
        e.identity(t);
        const i = this._sprite;
        if (!(i instanceof T)) {
            switch (e.translate(t, t, i.x, i.y), i.rotationStyle) {
                case x.RotationStyle.ALL_AROUND:
                    e.rotate(t, t, i.scratchToRad(i.direction));
                    break;
                case x.RotationStyle.LEFT_RIGHT:
                    i.direction < 0 && e.scale(t, t, -1, 1)
            }
            const s = i.size / 100;
            e.scale(t, t, s, s)
        }
        const s = 1 / i.costume.resolution;
        e.translate(t, t, -i.costume.center.x * s, (i.costume.center.y - i.costume.height) * s), e.scale(t, t, i.costume.width * s, i.costume.height * s), this._matrixDiff.update()
    }
    getMatrix() {
        return this._matrixDiff.changed && this._calculateSpriteMatrix(), this._matrix
    }
}
class v {
    constructor(t) {
        this.renderer = t, this.gl = t.gl, this.width = 0, this.height = 0
    }
    _makeTexture(t, e) {
        const i = this.gl,
            s = i.createTexture();
        if (!s) throw new Error("Could not create texture");
        return i.bindTexture(i.TEXTURE_2D, s), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, e), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MAG_FILTER, e), t && i.texImage2D(i.TEXTURE_2D, 0, i.RGBA, i.RGBA, i.UNSIGNED_BYTE, t), s
    }
    _setSizeFromImage(t) {
        t.complete ? (this.width = t.naturalWidth, this.height = t.naturalHeight) : t.addEventListener("load", (() => {
            this.width = t.naturalWidth, this.height = t.naturalHeight
        }))
    }
}
class M extends v {
    constructor(t, e) {
        super(t), this._image = e, this._imageData = null, this._texture = null, this._setSizeFromImage(e)
    }
    getImageData() {
        if (!this._image.complete) return null;
        if (!this._imageData) {
            const t = document.createElement("canvas");
            t.width = this._image.naturalWidth || this._image.width, t.height = this._image.naturalHeight || this._image.height;
            const e = t.getContext("2d");
            if (!e) return null;
            e.drawImage(this._image, 0, 0), this._imageData = e.getImageData(0, 0, t.width, t.height)
        }
        return this._imageData
    }
    getTexture() {
        const t = this._image;
        return t.complete ? (null === this._texture && (this._texture = super._makeTexture(t, this.gl.NEAREST)), this._texture) : null
    }
    destroy() {
        null !== this._texture && this.gl.deleteTexture(this._texture)
    }
}
const C = {
        vertex: "\nprecision mediump float;\n\nattribute vec2 a_position;\nuniform mat3 u_transform;\nuniform vec2 u_stageSize;\n\nvarying vec2 v_texCoord;\n\nvoid main() {\n  v_texCoord = vec2(a_position.x, 1.0 - a_position.y);\n  gl_Position = vec4((u_transform * vec3(a_position, 1.0)) / vec3(u_stageSize * 0.5, 1.0), 1.0);\n}\n",
        fragment: "\nprecision mediump float;\n\nconst float epsilon = 1e-3;\n\nuniform sampler2D u_texture;\nvarying vec2 v_texCoord;\n\n#ifdef EFFECT_color\nuniform float u_color;\n#endif\n\n#ifdef EFFECT_fisheye\nuniform float u_fisheye;\n#endif\n\n#ifdef EFFECT_whirl\nuniform float u_whirl;\n#endif\n\n#ifdef EFFECT_pixelate\nuniform float u_pixelate;\nuniform vec2 u_skinSize;\n#endif\n\n#ifdef EFFECT_mosaic\nuniform float u_mosaic;\n#endif\n\n#ifdef EFFECT_brightness\nuniform float u_brightness;\n#endif\n\n#ifdef EFFECT_ghost\nuniform float u_ghost;\n#endif\n\n#if defined(EFFECT_whirl) || defined(EFFECT_fisheye) || defined(EFFECT_pixelate)\nconst vec2 CENTER = vec2(0.5, 0.5);\n#endif\n\n#ifdef DRAW_MODE_COLOR_MASK\nuniform vec4 u_colorMask;\n\n// TODO: Scratch 2.0 and Scratch 3.0's CPU path check if the top 6 bits match,\n// which a tolerance of 3/255 should be equivalent to,\n// but Scratch's GPU path has a tolerance of 2/255.\nconst vec3 COLOR_MASK_TOLERANCE = vec3(3.0 / 255.0);\n#endif\n\n#ifdef DRAW_MODE_SPRITE_ID\nuniform vec3 u_spriteId;\n#endif\n\n#ifdef EFFECT_color\n// Taken from http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl\nvec3 rgb2hsv(vec3 c)\n{\n  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n  vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);\n  vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);\n\n  float d = q.x - min(q.w, q.y);\n  float e = 1.0e-10;\n  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\n}\n\nvec3 hsv2rgb(vec3 c)\n{\n  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n#endif\n\nvoid main() {\n  vec2 coord = v_texCoord;\n\n  #ifdef EFFECT_mosaic\n  {\n    float mosaicFactor = clamp(floor(abs(u_mosaic + 10.0) / 10.0 + 0.5), 1.0, 512.0);\n    coord = fract(coord * mosaicFactor);\n  }\n  #endif\n\n  #ifdef EFFECT_pixelate\n    vec2 pixSize = u_skinSize / (abs(u_pixelate) * 0.1);\n    coord = (floor(coord * pixSize) + CENTER) / pixSize;\n  #endif\n\n  #ifdef EFFECT_whirl\n  {\n    const float PI_OVER_180 = 0.017453292519943295;\n    vec2 offset = coord - CENTER;\n    float whirlFactor = max(1.0 - (length(offset) * 2.0), 0.0);\n    float whirl = (-u_whirl * PI_OVER_180) * whirlFactor * whirlFactor;\n    float s = sin(whirl);\n    float c = cos(whirl);\n    mat2 rotationMatrix = mat2(c, -s, s, c);\n    coord = rotationMatrix * offset + CENTER;\n  }\n  #endif\n\n  #ifdef EFFECT_fisheye\n  {\n    vec2 vec = (coord - CENTER) / CENTER;\n    float len = length(vec) + epsilon;\n    float factor = max(0.0, (u_fisheye + 100.0) / 100.0);\n    float r = pow(min(len, 1.0), factor) * max(1.0, len);\n    vec2 unit = vec / len;\n    coord = CENTER + (r * unit * CENTER);\n  }\n  #endif\n\n  vec4 color = texture2D(u_texture, coord);\n\n  #if defined(EFFECT_color) || defined(EFFECT_brightness)\n  // Un-premultiply color values by alpha channel\n  vec3 unmul = color.rgb / color.a;\n\n  #ifdef EFFECT_color\n  {\n    vec3 hsv = rgb2hsv(unmul);\n    const float minLightness = 0.11 / 2.0;\n    const float minSaturation = 0.09;\n\n    hsv.z = max(minLightness, hsv.z);\n    hsv.y = max(minSaturation, hsv.y);\n\n    hsv.x = mod(hsv.x + (u_color / 200.0), 1.0);\n\n    unmul = hsv2rgb(hsv);\n  }\n  #endif\n\n  #ifdef EFFECT_brightness\n  {\n    unmul = clamp(unmul + clamp(u_brightness * 0.01, -1.0, 1.0), 0.0, 1.0);\n  }\n  #endif\n\n  color = vec4(unmul * color.a, color.a);\n\n  #endif // defined(defined(EFFECT_color) || defined(EFFECT_brightness))\n\n  #ifdef DRAW_MODE_COLOR_MASK\n  vec3 diff = abs(u_colorMask.rgb - color.rgb);\n  if (any(greaterThan(diff, COLOR_MASK_TOLERANCE))) {\n    discard;\n  }\n  #endif\n\n  #ifdef EFFECT_ghost\n  color *= (1.0 - clamp(u_ghost * 0.01, 0.0, 1.0));\n  #endif\n\n  #ifdef DRAW_MODE_SILHOUETTE\n  if (color.a == 0.0) {\n    discard;\n  }\n  #endif\n\n  #ifdef DRAW_MODE_SPRITE_ID\n  color = color.a > 0.0 ? vec4(u_spriteId, 1.0) : vec4(0.0, 0.0, 0.0, 0.0);\n  #endif\n\n  gl_FragColor = color;\n}\n"
    },
    D = {
        vertex: "\nprecision mediump float;\n\nattribute vec2 a_position;\n// The X and Y components of u_penPoints hold the first pen point. The Z and W components hold the difference between\n// the second pen point and the first. This is done because calculating the difference in the shader leads to floating-\n// point error when both points have large-ish coordinates.\nuniform vec4 u_penPoints;\nuniform vec2 u_penSkinSize;\nuniform float u_penSize;\nuniform float u_lineLength;\n\nvarying vec2 v_texCoord;\n\n// Add this to divisors to prevent division by 0, which results in NaNs propagating through calculations.\n// Smaller values can cause problems on some mobile devices.\nconst float epsilon = 1e-3;\n\nvoid main() {\n  // Calculate a rotated (\"tight\") bounding box around the two pen points.\n  // Yes, we're doing this 6 times (once per vertex), but on actual GPU hardware,\n  // it's still faster than doing it in JS combined with the cost of uniformMatrix4fv.\n\n  // Expand line bounds by sqrt(2) / 2 each side-- this ensures that all antialiased pixels\n  // fall within the quad, even at a 45-degree diagonal\n  vec2 position = a_position;\n  float expandedRadius = (u_penSize * 0.5) + 1.4142135623730951;\n\n  // The X coordinate increases along the length of the line. It's 0 at the center of the origin point\n  // and is in pixel-space (so at n pixels along the line, its value is n).\n  v_texCoord.x = mix(0.0, u_lineLength + (expandedRadius * 2.0), a_position.x) - expandedRadius;\n  // The Y coordinate is perpendicular to the line. It's also in pixel-space.\n  v_texCoord.y = ((a_position.y - 0.5) * expandedRadius) + 0.5;\n\n  position.x *= u_lineLength + (2.0 * expandedRadius);\n  position.y *= 2.0 * expandedRadius;\n\n  // 1. Center around first pen point\n  position -= expandedRadius;\n\n  // 2. Rotate quad to line angle\n  vec2 pointDiff = u_penPoints.zw;\n  // Ensure line has a nonzero length so it's rendered properly\n  // As long as either component is nonzero, the line length will be nonzero\n  // If the line is zero-length, give it a bit of horizontal length\n  pointDiff.x = (abs(pointDiff.x) < epsilon && abs(pointDiff.y) < epsilon) ? epsilon : pointDiff.x;\n  // The 'normalized' vector holds rotational values equivalent to sine/cosine\n  // We're applying the standard rotation matrix formula to the position to rotate the quad to the line angle\n  // pointDiff can hold large values so we must divide by u_lineLength instead of calling GLSL's normalize function:\n  // https://asawicki.info/news_1596_watch_out_for_reduced_precision_normalizelength_in_opengl_es\n  vec2 normalized = pointDiff / max(u_lineLength, epsilon);\n  position = mat2(normalized.x, normalized.y, -normalized.y, normalized.x) * position;\n\n  // 3. Translate quad\n  position += u_penPoints.xy;\n\n  // 4. Apply view transform\n  position *= 2.0 / u_penSkinSize;\n  gl_Position = vec4(position, 0, 1);\n}\n",
        fragment: '\nprecision mediump float;\n\nuniform sampler2D u_texture;\nuniform vec4 u_penPoints;\nuniform vec4 u_penColor;\nuniform float u_penSize;\nuniform float u_lineLength;\nvarying vec2 v_texCoord;\n\nvoid main() {\n  // Maaaaagic antialiased-line-with-round-caps shader.\n\n\t// "along-the-lineness". This increases parallel to the line.\n\t// It goes from negative before the start point, to 0.5 through the start to the end, then ramps up again\n\t// past the end point.\n\tfloat d = ((v_texCoord.x - clamp(v_texCoord.x, 0.0, u_lineLength)) * 0.5) + 0.5;\n\n\t// Distance from (0.5, 0.5) to (d, the perpendicular coordinate). When we\'re in the middle of the line,\n\t// d will be 0.5, so the distance will be 0 at points close to the line and will grow at points further from it.\n\t// For the "caps", d will ramp down/up, giving us rounding.\n\t// See https://www.youtube.com/watch?v=PMltMdi1Wzg for a rough outline of the technique used to round the lines.\n\tfloat line = distance(vec2(0.5), vec2(d, v_texCoord.y)) * 2.0;\n\t// Expand out the line by its thickness.\n\tline -= ((u_penSize - 1.0) * 0.5);\n\t// Because "distance to the center of the line" decreases the closer we get to the line, but we want more opacity\n\t// the closer we are to the line, invert it.\n\tgl_FragColor = u_penColor * clamp(1.0 - line, 0.0, 1.0);\n}\n'
    };
class R {
    constructor(t, e) {
        this.gl = t, this.program = e, this.uniforms = {}, this.attribs = {};
        const i = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
        for (let s = 0; s < i; s++) {
            const {
                name: i
            } = t.getActiveUniform(e, s);
            this.uniforms[i] = t.getUniformLocation(e, i)
        }
        const s = t.getProgramParameter(e, t.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < s; i++) {
            const {
                name: s
            } = t.getActiveAttrib(e, i);
            this.attribs[s] = t.getAttribLocation(e, s)
        }
    }
}
class A {
    constructor(t) {
        this.renderer = t, this.gl = t.gl, this._shaderCache = {};
        for (const t of Object.keys(A.DrawModes)) this._shaderCache[t] = new Map
    }
    _createShader(t, e) {
        const i = this.gl,
            s = i.createShader(e);
        if (!s) throw new Error("Could not create shader.");
        if (i.shaderSource(s, t), i.compileShader(s), !i.getShaderParameter(s, i.COMPILE_STATUS)) {
            const t = i.getShaderInfoLog(s) ?? "";
            throw new Error("Could not compile WebGL program. \n" + t)
        }
        return s
    }
    getShader(t, e = 0) {
        const i = this.gl,
            r = this._shaderCache[t],
            o = r.get(e);
        if (o) return o;
        let a;
        if (t === A.DrawModes.PEN_LINE) a = D;
        else a = C;
        let h = `#define DRAW_MODE_${t}\n`;
        for (let t = 0; t < s.length; t++) {
            const i = s[t];
            0 != (e & n[i]) && (h += `#define EFFECT_${i}\n`)
        }
        const c = this._createShader(h + a.vertex, i.VERTEX_SHADER),
            l = this._createShader(h + a.fragment, i.FRAGMENT_SHADER),
            u = i.createProgram();
        if (!u) throw new Error("Could not create program");
        if (i.attachShader(u, c), i.attachShader(u, l), i.linkProgram(u), !i.getProgramParameter(u, i.LINK_STATUS)) {
            const t = i.getProgramInfoLog(u) ?? "";
            throw new Error("Could not compile WebGL program. \n" + t)
        }
        const d = new R(i, u);
        return r.set(e, d), d
    }
}
A.DrawModes = {
    DEFAULT: "DEFAULT",
    SILHOUETTE: "SILHOUETTE",
    COLOR_MASK: "COLOR_MASK",
    SPRITE_ID: "SPRITE_ID",
    PEN_LINE: "PEN_LINE"
};
class L extends v {
    constructor(t, e, i) {
        super(t), this.width = e, this.height = i;
        const s = t._createFramebufferInfo(e, i, this.gl.NEAREST);
        this._framebufferInfo = s, this._lastPenState = {
            size: 0,
            color: [0, 0, 0, 0]
        }, this.clear()
    }
    destroy() {
        const t = this.gl;
        t.deleteTexture(this._framebufferInfo.texture), t.deleteFramebuffer(this._framebufferInfo.framebuffer)
    }
    getTexture() {
        return this._framebufferInfo.texture
    }
    getImageData() {
        return null
    }
    penLine(t, e, i, s) {
        const n = this.renderer;
        n._setFramebuffer(this._framebufferInfo);
        const r = n._shaderManager.getShader(A.DrawModes.PEN_LINE),
            o = this.gl,
            a = n._setShader(r);
        a && o.uniform2f(r.uniforms.u_penSkinSize, this.width, this.height);
        const h = i.toRGBANormalized(),
            c = this._lastPenState.color;
        (a || h[0] !== c[0] || h[1] !== c[1] || h[2] !== c[2] || h[3] !== c[3]) && (this._lastPenState.color = h, o.uniform4f(r.uniforms.u_penColor, h[0] * h[3], h[1] * h[3], h[2] * h[3], h[3])), (a || this._lastPenState.size !== s) && (this._lastPenState.size = s, o.uniform1f(r.uniforms.u_penSize, s));
        const l = e.x - t.x,
            u = e.y - t.y,
            d = 1 === s || 3 === s ? .5 : 0;
        o.uniform4f(r.uniforms.u_penPoints, t.x + d, t.y + d, l, u);
        const f = Math.sqrt(l * l + u * u);
        o.uniform1f(r.uniforms.u_lineLength, f), o.drawArrays(o.TRIANGLES, 0, 6)
    }
    clear() {
        this.renderer._setFramebuffer(this._framebufferInfo);
        const t = this.gl;
        t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT)
    }
}
const B = 170,
    N = 4,
    F = 12,
    I = 12;
class P extends v {
    constructor(t, e) {
        super(t), this._canvas = document.createElement("canvas");
        const i = this._canvas.getContext("2d");
        if (null === i) throw new Error("Could not get canvas context");
        this._ctx = i, this._texture = this._makeTexture(null, this.gl.LINEAR), this._bubble = e, this._flipped = !1, this._rendered = !1, this._renderedScale = 0, this.width = 0, this.height = 0, this.offsetX = -N / 2, this.offsetY = this.offsetX + I
    }
    _restyleCanvas() {
        const t = this._ctx;
        t.font = "16px sans-serif", t.textBaseline = "hanging"
    }
    get flipped() {
        return this._flipped
    }
    set flipped(t) {
        this._flipped = t, this._rendered = !1
    }
    _renderBubble(t, e) {
        const i = this._canvas,
            s = this._ctx;
        this._restyleCanvas();
        const {
            text: n,
            style: r
        } = t, o = s.measureText(n).width, a = B, h = F, c = Math.ceil(Math.min(o, a) + 2 * h), l = 10 + 2 * h;
        this.width = c + N, this.height = l + I + N, i.width = this.width * e, i.height = this.height * e, this._restyleCanvas();
        const u = N / 2,
            d = u;
        s.setTransform(e, 0, 0, e, 0, 0), s.fillStyle = "#fff", s.strokeStyle = "#ccc", s.lineWidth = N, s.save(), this._flipped && (s.scale(-1, 1), s.translate(-this.width, 0)), ((t, e, i, n, r, o) => {
            r > i / 2 && (r = i / 2), r > n / 2 && (r = n / 2), r < 0 || (s.beginPath(), s.moveTo(t + r, e), s.arcTo(t + i, e, t + i, e + n, r), s.arcTo(t + i, e + n, t + r, e + n, r), "say" === o ? (s.lineTo(Math.min(t + 3 * r, t + i - r), e + n), s.lineTo(t + r / 2, e + n + r), s.lineTo(t + r, e + n)) : s.ellipse(t + 2.25 * r, e + n, 3 * r / 4, r / 2, 0, 0, Math.PI), s.arcTo(t, e + n, t, e, r), s.arcTo(t, e, t + i, e, r), s.closePath(), s.stroke(), s.fill(), "think" === o && (s.beginPath(), s.ellipse(t + r, e + n + 3 * r / 4, r / 3, r / 3, 0, 0, 2 * Math.PI), s.stroke(), s.fill()))
        })(u, d, c, l, I, r), s.restore(), s.fillStyle = "#444", s.fillText(n, u + h, d + h, a), this._rendered = !0, this._renderedScale = e
    }
    getTexture(t) {
        if (!this._rendered || this._renderedScale !== t) {
            this._renderBubble(this._bubble, t);
            const e = this.gl;
            e.bindTexture(e.TEXTURE_2D, this._texture), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, this._canvas)
        }
        return this._texture
    }
    getImageData(t) {
        return this.getTexture(t), this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height)
    }
    destroy() {
        this.gl.deleteTexture(this._texture)
    }
}
class k extends v {
    constructor(t, e) {
        super(t), this._image = e, this._canvas = document.createElement("canvas");
        const i = this._canvas.getContext("2d");
        if (!i) throw new Error("Could not get canvas context");
        this._ctx = i, this._imageDataMipLevel = 0, this._imageData = null, this._maxTextureSize = t.gl.getParameter(t.gl.MAX_TEXTURE_SIZE), this._setSizeFromImage(e), this._mipmaps = new Map
    }
    static mipLevelForScale(t) {
        return Math.max(Math.ceil(Math.log2(t)) + 4, 0)
    }
    getImageData(t) {
        if (!this._image.complete) return null;
        const e = k.mipLevelForScale(t);
        if (!this._imageData || this._imageDataMipLevel !== e) {
            const t = this._drawSvgToCanvas(e);
            if (null === t) return null;
            const {
                canvas: i
            } = t;
            this._imageData = t.getImageData(0, 0, i.width, i.height), this._imageDataMipLevel = e
        }
        return this._imageData
    }
    _drawSvgToCanvas(t) {
        const e = 2 ** (t - 4),
            i = this._image;
        let s = i.naturalWidth * e,
            n = i.naturalHeight * e;
        if (s = Math.round(Math.min(s, this._maxTextureSize)), n = Math.round(Math.min(n, this._maxTextureSize)), 0 === s || 0 === n) return null;
        const r = this._ctx,
            {
                canvas: o
            } = r;
        return o.width = s, o.height = n, r.drawImage(i, 0, 0, s, n), r
    }
    _createMipmap(t) {
        const e = this._drawSvgToCanvas(t);
        this._mipmaps.set(t, null === e ? null : this._makeTexture(e.canvas, this.gl.LINEAR))
    }
    getTexture(t) {
        if (!this._image.complete) return null;
        const e = k.mipLevelForScale(t);
        return this._mipmaps.has(e) || this._createMipmap(e), this._mipmaps.get(e) ?? null
    }
    destroy() {
        for (const t of this._mipmaps.values()) this.gl.deleteTexture(t)
    }
}
const O = new i;
class U {
    constructor(t, e) {
        this.renderTarget = null;
        const i = t.stage.width,
            s = t.stage.height;
        this.project = t, this.stage = U.createStage(i, s);
        const n = this.stage.getContext("webgl", {
            antialias: !1
        });
        if (null === n) throw new Error("Could not initialize WebGL context");
        this.gl = n, e ? this.setRenderTarget(e) : this.renderTarget = null, this._shaderManager = new A(this), this._drawables = new WeakMap, this._skins = new WeakMap, this._currentShader = null, this._currentFramebuffer = null, this._screenSpaceScale = 1, n.enable(n.BLEND), n.blendFunc(n.ONE, n.ONE_MINUS_SRC_ALPHA), n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
        const r = n.createBuffer();
        n.bindBuffer(n.ARRAY_BUFFER, r), n.bufferData(n.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0]), n.STATIC_DRAW), n.activeTexture(n.TEXTURE0), this._penSkin = new L(this, i, s), this._collisionBuffer = this._createFramebufferInfo(i, s, n.NEAREST, !0)
    }
    _getSkin(t) {
        const e = this._skins.get(t);
        if (e) return e;
        let i;
        return i = t instanceof p ? t.isBitmap ? new M(this, t.img) : new k(this, t.img) : new P(this, t), this._skins.set(t, i), i
    }
    _getDrawable(t) {
        const e = this._drawables.get(t);
        if (e) return e;
        const i = new S(this, t);
        return this._drawables.set(t, i), i
    }
    _createFramebufferInfo(t, e, i, s = !1) {
        const n = this.gl,
            r = n.createTexture();
        if (null === r) throw new Error("Could not create texture");
        n.bindTexture(n.TEXTURE_2D, r), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, i), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, i), n.texImage2D(n.TEXTURE_2D, 0, n.RGBA, t, e, 0, n.RGBA, n.UNSIGNED_BYTE, null);
        const o = n.createFramebuffer();
        if (!o) throw new Error("Could not create framebuffer");
        const a = {
            texture: r,
            width: t,
            height: e,
            framebuffer: o
        };
        if (this._setFramebuffer(a), n.framebufferTexture2D(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.TEXTURE_2D, r, 0), s) {
            const i = n.createRenderbuffer();
            n.bindRenderbuffer(n.RENDERBUFFER, i), n.renderbufferStorage(n.RENDERBUFFER, n.DEPTH_STENCIL, t, e), n.framebufferRenderbuffer(n.FRAMEBUFFER, n.DEPTH_STENCIL_ATTACHMENT, n.RENDERBUFFER, i)
        }
        return a
    }
    _setShader(t) {
        if (t === this._currentShader) return !1;
        const e = this.gl;
        e.useProgram(t.program);
        const i = t.attribs.a_position;
        return e.enableVertexAttribArray(i), e.vertexAttribPointer(i, 2, e.FLOAT, !1, 0, 0), this._currentShader = t, this._updateStageSize(), !0
    }
    _setFramebuffer(t) {
        t !== this._currentFramebuffer && (this._currentFramebuffer = t, null === t ? (this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null), this._updateStageSize()) : (this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, t.framebuffer), this.gl.viewport(0, 0, t.width, t.height)))
    }
    setRenderTarget(t) {
        "string" == typeof t && (t = document.querySelector(t)), this.renderTarget = t, t && (t.classList.add("leopard__project"), t.style.width = `${this.project.stage.width}px`, t.style.height = `${this.project.stage.height}px`, t.append(this.stage))
    }
    _renderLayers(t, i = {}, s) {
        const n = {
                drawMode: A.DrawModes.DEFAULT,
                ...i
            },
            r = t instanceof Set,
            o = e => !(r && !t.has(e) || s && !s(e));
        if (o(this.project.stage) && this.renderSprite(this.project.stage, n), o(this._penSkin)) {
            const t = e.create();
            e.scale(t, t, this._penSkin.width, -this._penSkin.height), e.translate(t, t, -.5, -.5), this._renderSkin(this._penSkin, n.drawMode, t, 1)
        }
        for (const t of this.project.spritesAndClones) o(t) && !1 !== t.visible && this.renderSprite(t, n)
    }
    _updateStageSize() {
        this._currentShader && this.gl.uniform2f(this._currentShader.uniforms.u_stageSize, this.project.stage.width, this.project.stage.height), null === this._currentFramebuffer && this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight)
    }
    _resize() {
        const t = this.stage.getBoundingClientRect(),
            e = window.devicePixelRatio,
            i = Math.round(t.width * e),
            s = Math.round(t.height * e);
        this.stage.width === i && this.stage.height === s || (this.stage.width = i, this.stage.height = s, this._screenSpaceScale = Math.max(i / this.project.stage.width, s / this.project.stage.height), this._updateStageSize())
    }
    update() {
        this._resize(), this._setFramebuffer(null);
        const t = this.gl;
        t.clearColor(1, 1, 1, 1), t.clear(t.COLOR_BUFFER_BIT), this._renderLayers()
    }
    static createStage(t, e) {
        const i = document.createElement("canvas");
        return i.width = t, i.height = e, i.style.width = i.style.height = "100%", i.style.imageRendering = "pixelated", i.style.imageRendering = "crisp-edges", i.style.imageRendering = "-webkit-optimize-contrast", i
    }
    _calculateSpeechBubbleMatrix(t, i) {
        const s = this.getBoundingBox(t);
        let n;
        i.width + s.right > this.project.stage.width / 2 ? (n = s.left - i.width, i.flipped = !0) : (n = s.right, i.flipped = !1), n = Math.round(n - i.offsetX);
        const r = Math.round(s.top - i.offsetY),
            o = e.create();
        return e.translate(o, o, n, r), e.scale(o, o, i.width, i.height), o
    }
    _renderSkin(t, e, i, n, r, o, a, h) {
        const c = this.gl,
            l = t.getTexture(n * this._screenSpaceScale);
        if (!l) return;
        let u = r ? r._bitmask : 0;
        "number" == typeof o && (u &= o);
        const d = this._shaderManager.getShader(e, u);
        if (this._setShader(d), c.uniformMatrix3fv(d.uniforms.u_transform, !1, i), 0 !== u && r) {
            for (const t of s) {
                const e = r[t];
                0 !== e && c.uniform1f(d.uniforms[`u_${t}`], e)
            }
            0 !== r.pixelate && c.uniform2f(d.uniforms.u_skinSize, t.width ?? 0, t.height ?? 0)
        }
        var f;
        c.bindTexture(c.TEXTURE_2D, l), c.uniform1i(d.uniforms.u_texture, 0), Array.isArray(a) && this.gl.uniform4fv(d.uniforms.u_colorMask, a), e === A.DrawModes.SPRITE_ID && "number" == typeof h && this.gl.uniform3fv(d.uniforms.u_spriteId, [((f = h) + 1 >> 16 & 255) / 255, (f + 1 >> 8 & 255) / 255, (f + 1 & 255) / 255]), this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    }
    renderSprite(t, e) {
        const i = "size" in t ? t.size / 100 : 1;
        if (this._renderSkin(this._getSkin(t.costume), e.drawMode, this._getDrawable(t).getMatrix(), i, t.effects, e.effectMask, e.colorMask, e.spriteColorId ? e.spriteColorId(t) : void 0), !1 !== e.renderSpeechBubbles && "_speechBubble" in t && t._speechBubble && "" !== t._speechBubble.text && t instanceof x) {
            const i = this._getSkin(t._speechBubble);
            this._renderSkin(i, e.drawMode, this._calculateSpeechBubbleMatrix(t, i), 1)
        }
    }
    getTightBoundingBox(t) {
        return this._getDrawable(t).getTightBoundingBox()
    }
    getBoundingBox(t) {
        return i.fromMatrix(this._getDrawable(t).getMatrix())
    }
    _stencilSprite(t, e) {
        const i = this.gl;
        i.clearColor(0, 0, 0, 0), i.clear(i.COLOR_BUFFER_BIT | i.STENCIL_BUFFER_BIT), i.enable(i.STENCIL_TEST), i.stencilFunc(i.ALWAYS, 1, 1), i.stencilOp(i.KEEP, i.KEEP, i.REPLACE), i.colorMask(!1, !1, !1, !1);
        const s = {
            drawMode: A.DrawModes.SILHOUETTE,
            renderSpeechBubbles: !1,
            effectMask: ~n.ghost
        };
        e && (s.colorMask = e.toRGBANormalized(), s.drawMode = A.DrawModes.COLOR_MASK), this._renderLayers(new Set([t]), s), i.stencilFunc(i.EQUAL, 1, 1), i.stencilOp(i.KEEP, i.KEEP, i.KEEP), i.colorMask(!0, !0, !0, !0)
    }
    checkSpriteCollision(t, e, s, r) {
        if ("visible" in t && !t.visible) return !1;
        e instanceof Set || (e = e instanceof Array ? new Set(e) : new Set([e]));
        const o = i.copy(this.getBoundingBox(t), O).snapToInt(),
            a = i.fromBounds(1 / 0, -1 / 0, 1 / 0, -1 / 0);
        for (const t of e) i.union(a, this.getBoundingBox(t), a);
        if (a.snapToInt(), !o.intersects(a)) return !1;
        if (s) return !0;
        const h = this._collisionBuffer.width / 2,
            c = this._collisionBuffer.height / 2,
            l = i.intersection(o, a).clamp(-h, h, -c, c);
        if (0 === l.width || 0 === l.height) return !1;
        this._setFramebuffer(this._collisionBuffer), this._stencilSprite(t, r), this._renderLayers(e, {
            drawMode: A.DrawModes.SILHOUETTE,
            effectMask: ~n.ghost
        });
        const u = this.gl;
        u.disable(u.STENCIL_TEST);
        const d = new Uint8Array(l.width * l.height * 4);
        u.readPixels(l.left + h, l.bottom + c, l.width, l.height, u.RGBA, u.UNSIGNED_BYTE, d);
        for (let t = 0; t < d.length; t += 4)
            if (0 !== d[t + 3]) return !0;
        return !1
    }
    checkColorCollision(t, e, s) {
        const n = i.copy(this.getBoundingBox(t), O).snapToInt(),
            r = this._collisionBuffer.width / 2,
            o = this._collisionBuffer.height / 2;
        if (n.clamp(-r, r, -o, o), 0 === n.width || 0 === n.height) return !1;
        this._setFramebuffer(this._collisionBuffer);
        const a = this.gl;
        a.clearColor(0, 0, 0, 0), a.clear(a.COLOR_BUFFER_BIT | a.STENCIL_BUFFER_BIT), this._setFramebuffer(this._collisionBuffer), this._stencilSprite(t, s), this._renderLayers(void 0, void 0, (e => e !== t)), a.disable(a.STENCIL_TEST);
        const h = new Uint8Array(n.width * n.height * 4);
        a.readPixels(n.left + r, n.bottom + o, n.width, n.height, a.RGBA, a.UNSIGNED_BYTE, h);
        const c = e.toRGBA();
        for (let t = 0; t < h.length; t += 4)
            if (0 !== h[t + 3] && 0 == (248 & (h[t] ^ c[0])) && 0 == (248 & (h[t + 1] ^ c[1])) && 0 == (240 & (h[t + 2] ^ c[2]))) return !0;
        return !1
    }
    pick(t, e) {
        this._setFramebuffer(this._collisionBuffer);
        const i = this.gl;
        i.clearColor(0, 0, 0, 0), i.clear(i.COLOR_BUFFER_BIT);
        const s = new Map;
        for (let e = 0; e < t.length; e++) s.set(t[e], e);
        this._renderLayers(new Set(t), {
            effectMask: ~n.ghost,
            drawMode: A.DrawModes.SPRITE_ID,
            spriteColorId: t => s.get(t)
        });
        const r = new Uint8Array(4),
            o = this._collisionBuffer.width / 2,
            a = this._collisionBuffer.height / 2;
        i.readPixels(e.x + o, e.y + a, 1, 1, i.RGBA, i.UNSIGNED_BYTE, r);
        const h = (([t, e, i]) => (t << 16 | e << 8 | i) - 1)(r);
        return -1 === h ? null : t[h]
    }
    checkPointCollision(t, e, i) {
        if ("visible" in t && !t.visible) return !1;
        if (!this.getBoundingBox(t).containsPoint(e.x, e.y)) return !1;
        if (i) return !0;
        this._setFramebuffer(this._collisionBuffer);
        const s = this.gl;
        s.clearColor(0, 0, 0, 0), s.clear(s.COLOR_BUFFER_BIT), this._renderLayers(new Set([t]), {
            effectMask: ~n.ghost
        });
        const r = new Uint8Array(4),
            o = this._collisionBuffer.width / 2,
            a = this._collisionBuffer.height / 2;
        return s.readPixels(e.x + o, e.y + a, 1, 1, s.RGBA, s.UNSIGNED_BYTE, r), 0 !== r[3]
    }
    penLine(t, e, i, s) {
        this._penSkin.penLine(t, e, i, s)
    }
    clearPen() {
        this._penSkin.clear()
    }
    stamp(t) {
        this._setFramebuffer(this._penSkin._framebufferInfo), this._renderLayers(new Set([t]), {
            renderSpeechBubbles: !1
        })
    }
    displayAskBox(t) {
        if (!this.renderTarget) return Promise.resolve("");
        const e = document.createElement("form");
        e.classList.add("leopard__askBox");
        const i = document.createElement("span");
        i.classList.add("leopard__askText"), i.innerText = t, e.append(i);
        const s = document.createElement("input");
        s.type = "text", s.classList.add("leopard__askInput"), e.append(s);
        const n = document.createElement("button");
        return n.classList.add("leopard__askButton"), n.innerText = "Answer", e.append(n), this.renderTarget.append(e), s.focus(), new Promise((t => {
            e.addEventListener("submit", (i => {
                i.preventDefault(), e.remove(), t(s.value)
            }))
        }))
    }
}
class z {
    constructor(t, e, i) {
        this._stage = t, this._canvas = e, this._canvas.tabIndex < 0 && (this._canvas.tabIndex = 0), this.mouse = {
            x: 0,
            y: 0,
            down: !1
        }, this._canvas.addEventListener("mousemove", this._mouseMove.bind(this)), this._canvas.addEventListener("mousedown", this._mouseDown.bind(this)), this._canvas.addEventListener("mouseup", this._mouseUp.bind(this)), this._canvas.addEventListener("keyup", this._keyup.bind(this)), this._canvas.addEventListener("keydown", this._keydown.bind(this)), this.keys = [], this._onKeyDown = i
    }
    _mouseMove(t) {
        const e = this._canvas.getBoundingClientRect(),
            i = this._stage.width / e.width,
            s = this._stage.height / e.height,
            n = (t.clientX - e.left) * i,
            r = (t.clientY - e.top) * s;
        this.mouse = {
            ...this.mouse,
            x: n - this._stage.width / 2,
            y: -r + this._stage.height / 2
        }
    }
    _mouseDown() {
        this.mouse = {
            ...this.mouse,
            down: !0
        }
    }
    _mouseUp() {
        this.mouse = {
            ...this.mouse,
            down: !1
        }
    }
    _keyup(t) {
        const e = this._getKeyName(t);
        this.keys = this.keys.filter((t => t !== e))
    }
    _keydown(t) {
        t.preventDefault();
        const e = this._getKeyName(t); - 1 === this.keys.indexOf(e) && this.keys.push(e), this._onKeyDown(e)
    }
    _getKeyName(t) {
        return "ArrowUp" === t.key ? "up arrow" : "ArrowDown" === t.key ? "down arrow" : "ArrowLeft" === t.key ? "left arrow" : "ArrowRight" === t.key ? "right arrow" : " " === t.key ? "space" : "Digit" === t.code.substring(0, 5) ? t.code[5] : t.key.toLowerCase()
    }
    keyPressed(t) {
        return "any" === t ? this.keys.length > 0 : this.keys.indexOf(t) > -1
    }
    focus() {
        this._canvas.focus()
    }
}
const G = ["NotAllowedError", "NotFoundError"];
class j {
    constructor() {
        this.connectionState = 0
    }
    get audioContext() {
        return f.audioContext
    }
    async connect() {
        if (0 === this.connectionState) {
            this.connectionState = 1;
            try {
                const t = await navigator.mediaDevices.getUserMedia({
                    audio: !0
                });
                await f.audioContext.resume(), this.audioStream = t;
                const e = this.audioContext.createMediaStreamSource(t);
                this.analyser = this.audioContext.createAnalyser(), e.connect(this.analyser), this.micDataArray = new Float32Array(this.analyser.fftSize), this.connectionState = 2
            } catch (t) {
                if (this.connectionState = 3, !G.includes(t.name)) throw t;
                console.warn("Mic is not available.")
            }
        }
    }
    get loudness() {
        if (2 !== this.connectionState || !this.audioStream?.active || !this.analyser || !this.micDataArray) return -1;
        this.analyser.getFloatTimeDomainData(this.micDataArray);
        let t = 0;
        for (let e = 0; e < this.micDataArray.length; e++) t += Math.pow(this.micDataArray[e], 2);
        let e = Math.sqrt(t / this.micDataArray.length);
        return this._lastValue && (e = Math.max(e, .6 * this._lastValue)), this._lastValue = e, e *= 1.63, e = Math.sqrt(e), e = Math.round(100 * e), e = Math.min(e, 100), e
    }
    getLoudness() {
        return this.connect(), this.loudness
    }
}
class H {
    constructor(e, i = {}, {
        frameRate: s = 30
    } = {}) {
        this.stage = e, this.sprites = i, Object.freeze(i);
        for (const t of this.spritesAndClones) t._project = this;
        this.stage._project = this, this.renderer = new U(this, null), this.input = new z(this.stage, this.renderer.stage, (e => {
            this.fireTrigger(t.KEY_PRESSED, {
                key: e
            })
        })), this.loudnessHandler = new j, this._cachedLoudness = null, this.runningTriggers = [], this._prevStepTriggerPredicates = new WeakMap, this.restartTimer(), this.answer = null, setInterval((() => {
            this.step()
        }), 1e3 / s), this._renderLoop()
    }
    attach(e) {
        this.renderer.setRenderTarget(e), this.renderer.stage.addEventListener("click", (() => {
            "suspended" === f.audioContext.state && f.audioContext.resume();
            let e = this.renderer.pick(this.spritesAndClones, {
                x: this.input.mouse.x,
                y: this.input.mouse.y
            });
            e || (e = this.stage);
            const i = [];
            for (const s of e.triggers) s.matches(t.CLICKED, {}, e) && i.push({
                trigger: s,
                target: e
            });
            this._startTriggers(i)
        }))
    }
    greenFlag() {
        "suspended" === f.audioContext.state && f.audioContext.resume(), this.fireTrigger(t.GREEN_FLAG), this.input.focus()
    }
    _matchingTriggers(t) {
        const e = [],
            i = this.spritesAndStage;
        for (const s of i) {
            const i = s.triggers.filter((e => t(e, s)));
            for (const t of i) e.push({
                trigger: t,
                target: s
            })
        }
        return e
    }
    _stepEdgeActivatedTriggers() {
        const e = this._matchingTriggers((t => t.isEdgeActivated)),
            i = [];
        for (const s of e) {
            const {
                trigger: e,
                target: n
            } = s;
            let r;
            switch (e.trigger) {
                case t.TIMER_GREATER_THAN:
                    r = this.timer > e.option("VALUE", n);
                    break;
                case t.LOUDNESS_GREATER_THAN:
                    r = this.loudness > e.option("VALUE", n);
                    break;
                default:
                    throw new Error(`Unimplemented trigger ${String(e.trigger)}`)
            }
            const o = !!this._prevStepTriggerPredicates.get(e);
            this._prevStepTriggerPredicates.set(e, r), !o && r && i.push(s)
        }
        this._startTriggers(i)
    }
    step() {
        this._cachedLoudness = null, this._stepEdgeActivatedTriggers();
        const t = this.runningTriggers;
        for (let e = 0; e < t.length; e++) t[e].trigger.step();
        this.runningTriggers = this.runningTriggers.filter((({
            trigger: t
        }) => !t.done))
    }
    render() {
        if (this.renderer.update(), this.renderer.renderTarget)
            for (const t of [...Object.values(this.sprites), this.stage])
                for (const e of Object.values(t.watchers)) e.updateDOM(this.renderer.renderTarget)
    }
    _renderLoop() {
        requestAnimationFrame(this._renderLoop.bind(this)), this.render()
    }
    fireTrigger(e, i) {
        if (e === t.GREEN_FLAG) {
            this.restartTimer(), this.stopAllSounds(), this.runningTriggers = [];
            for (const t in this.sprites) {
                this.sprites[t].clones = []
            }
            for (const t of this.spritesAndStage) t.effects.clear(), t.audioEffects.clear()
        }
        const s = this._matchingTriggers(((t, s) => t.matches(e, i, s)));
        return this._startTriggers(s)
    }
    async _startTriggers(t) {
        for (const e of t) this.runningTriggers.find((t => e.trigger === t.trigger && e.target === t.target)) || this.runningTriggers.push(e);
        await Promise.all(t.map((({
            trigger: t,
            target: e
        }) => t.start(e))))
    }
    get spritesAndClones() {
        return Object.values(this.sprites).flatMap((t => t.andClones())).sort(((t, e) => t._layerOrder - e._layerOrder))
    }
    get spritesAndStage() {
        return [...this.spritesAndClones, this.stage]
    }
    changeSpriteLayer(t, e, i = t) {
        const s = this.spritesAndClones,
            n = s.indexOf(t);
        let r = s.indexOf(i) + e;
        r < 0 && (r = 0), r > s.length - 1 && (r = s.length - 1), s.splice(n, 1), s.splice(r, 0, t), s.forEach(((t, e) => {
            t._layerOrder = e + 1
        }))
    }
    stopAllSounds() {
        for (const t of this.spritesAndStage) t.stopAllOfMySounds()
    }
    get timer() {
        return ((new Date).getTime() - this.timerStart.getTime()) / 1e3
    }
    restartTimer() {
        this.timerStart = new Date
    }
    async askAndWait(t) {
        this.answer = await this.renderer.displayAskBox(t)
    }
    get loudness() {
        return null === this._cachedLoudness && (this._cachedLoudness = this.loudnessHandler.getLoudness()), this._cachedLoudness
    }
}
class V {
    constructor({
        value: t = (() => ""),
        setValue: e = (() => {}),
        label: i,
        style: s = "normal",
        visible: n = !0,
        color: r = c.rgb(255, 140, 26),
        step: o = 1,
        min: a = 0,
        max: h = 100,
        x: l = -240,
        y: u = 180,
        width: d,
        height: f
    }) {
        this.initializeDOM(), this.value = t, this.setValue = e, this._previousValue = Symbol("NO_PREVIOUS_VALUE"), this.label = i, this.style = s, this.visible = n, this.color = r, this.step = o, this.min = a, this.max = h, this.x = l, this.y = u, this.width = d, this.height = f
    }
    initializeDOM() {
        const t = document.createElement("div");
        t.classList.add("leopard__watcher");
        const e = document.createElement("div");
        e.classList.add("leopard__watcherLabel"), t.append(e);
        const i = document.createElement("div");
        i.classList.add("leopard__watcherValue"), t.append(i);
        const s = document.createElement("input");
        s.type = "range", s.classList.add("leopard__watcherSlider"), s.addEventListener("input", (() => {
            this.setValue(Number(s.value))
        })), t.append(s), this._dom = {
            node: t,
            label: e,
            value: i,
            slider: s
        }
    }
    updateDOM(t) {
        if (t && !t.contains(this._dom.node) && t.append(this._dom.node), !this.visible) return;
        const e = this.value(),
            i = Array.isArray(e);
        if (this._dom.node.classList.toggle("leopard__watcher--list", i), i) {
            if (!Array.isArray(this._previousValue) || JSON.stringify(e.map(String)) !== JSON.stringify(this._previousValue.map(String))) {
                this._dom.value.innerHTML = "";
                for (const [t, i] of e.entries()) {
                    const e = document.createElement("div");
                    e.classList.add("leopard__watcherListItem");
                    const s = document.createElement("div");
                    s.classList.add("leopard__watcherListItemIndex"), s.innerText = String(t);
                    const n = document.createElement("div");
                    n.classList.add("leopard__watcherListItemContent"), n.innerText = String(i), e.append(s), e.append(n), this._dom.value.append(e)
                }
            }
        } else e !== this._previousValue && (this._dom.value.innerText = String(e));
        this._previousValue = i ? [...e] : e, "slider" === this._style && (this._dom.slider.value = String(e));
        const s = .299 * this.color.r + .587 * this.color.g + .114 * this.color.b > 162 ? "#000" : "#fff";
        this._dom.value.style.setProperty("--watcher-color", this.color.toString()), this._dom.value.style.setProperty("--watcher-text-color", s)
    }
    get visible() {
        return this._visible
    }
    set visible(t) {
        this._visible = t, this._dom.node.style.visibility = t ? "visible" : "hidden"
    }
    get x() {
        return this._x
    }
    set x(t) {
        this._x = t, this._dom.node.style.left = t - 240 + "px"
    }
    get y() {
        return this._y
    }
    set y(t) {
        this._y = t, this._dom.node.style.top = 180 - t + "px"
    }
    get width() {
        return this._width
    }
    set width(t) {
        this._width = t, t ? this._dom.node.style.width = `${t}px` : this._dom.node.style.removeProperty("width")
    }
    get height() {
        return this._height
    }
    set height(t) {
        this._height = t, t ? this._dom.node.style.height = `${t}px` : this._dom.node.style.removeProperty("height")
    }
    get style() {
        return this._style
    }
    set style(t) {
        this._style = t, this._dom.node.classList.toggle("leopard__watcher--normal", "normal" === t), this._dom.node.classList.toggle("leopard__watcher--large", "large" === t), this._dom.node.classList.toggle("leopard__watcher--slider", "slider" === t)
    }
    get min() {
        return this._min
    }
    set min(t) {
        this._min = t, this._dom.slider.min = String(t)
    }
    get max() {
        return this._max
    }
    set max(t) {
        this._max = t, this._dom.slider.max = String(t)
    }
    get step() {
        return this._step
    }
    set step(t) {
        this._step = t, this._dom.slider.step = String(t)
    }
    get label() {
        return this._label
    }
    set label(t) {
        this._label = t, this._dom.label.innerText = t
    }
}
export {
    c as Color, p as Costume, H as Project, f as Sound, x as Sprite, T as Stage, t as Trigger, V as Watcher
};
//# sourceMappingURL=cdn.js.map