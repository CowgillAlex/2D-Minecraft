import { Json } from '../util/index.js';
import { binarySearch, lerp } from './Util.js';
export var MinMaxNumberFunction;
(function (MinMaxNumberFunction) {
    function is(obj) {
        return typeof obj === 'object' && obj !== null && 'minValue' in obj && 'maxValue' in obj;
    }
    MinMaxNumberFunction.is = is;
})(MinMaxNumberFunction || (MinMaxNumberFunction = {}));
export var CubicSpline;
(function (CubicSpline) {
    function fromJson(obj, extractor) {
        if (typeof obj === 'number') {
            return new Constant(obj);
        }
        const root = Json.readObject(obj) ?? {};
        const spline = new MultiPoint(extractor(root.coordinate));
        const points = Json.readArray(root.points, e => Json.readObject(e) ?? {}) ?? [];
        if (points.length === 0) {
            return new Constant(0);
        }
        for (const point of points) {
            const location = Json.readNumber(point.location) ?? 0;
            const value = fromJson(point.value, extractor);
            const derivative = Json.readNumber(point.derivative) ?? 0;
            spline.addPoint(location, value, derivative);
        }
        return spline;
    }
    CubicSpline.fromJson = fromJson;
    class Constant {
        value;
        constructor(value) {
            this.value = value;
        }
        compute() {
            return this.value;
        }
        min() {
            return this.value;
        }
        max() {
            return this.value;
        }
        mapAll() {
            return this;
        }
        calculateMinMax() { }
    }
    CubicSpline.Constant = Constant;
    class MultiPoint {
        coordinate;
        locations;
        values;
        derivatives;
        calculatedMin = Number.NEGATIVE_INFINITY;
        calculatedMax = Number.POSITIVE_INFINITY;
        constructor(coordinate, locations = [], values = [], derivatives = []) {
            this.coordinate = coordinate;
            this.locations = locations;
            this.values = values;
            this.derivatives = derivatives;
        }
        compute(c) {
            const coordinate = this.coordinate.compute(c);
            const i = binarySearch(0, this.locations.length, n => coordinate < this.locations[n]) - 1;
            const n = this.locations.length - 1;
            if (i < 0) {
                return this.values[0].compute(c) + this.derivatives[0] * (coordinate - this.locations[0]); //TODO: us linear extend for this 
            }
            if (i === n) {
                return this.values[n].compute(c) + this.derivatives[n] * (coordinate - this.locations[n]); //TODO: us linear extend for this 
            }
            const loc0 = this.locations[i];
            const loc1 = this.locations[i + 1];
            const der0 = this.derivatives[i];
            const der1 = this.derivatives[i + 1];
            const f = (coordinate - loc0) / (loc1 - loc0);
            const val0 = this.values[i].compute(c);
            const val1 = this.values[i + 1].compute(c);
            const f8 = der0 * (loc1 - loc0) - (val1 - val0);
            const f9 = -der1 * (loc1 - loc0) + (val1 - val0);
            const f10 = lerp(f, val0, val1) + f * (1.0 - f) * lerp(f, f8, f9);
            return f10;
        }
        min() {
            return this.calculatedMin;
        }
        max() {
            return this.calculatedMax;
        }
        mapAll(visitor) {
            return new MultiPoint(visitor(this.coordinate), this.locations, this.values.map(v => v.mapAll(visitor)), this.derivatives);
        }
        addPoint(location, value, derivative = 0) {
            this.locations.push(location);
            this.values.push(typeof value === 'number'
                ? new CubicSpline.Constant(value)
                : value);
            this.derivatives.push(derivative);
            return this;
        }
        calculateMinMax() {
            if (!MinMaxNumberFunction.is(this.coordinate)) {
                return;
            }
            const lastIdx = this.locations.length - 1;
            var splineMin = Number.POSITIVE_INFINITY;
            var splineMax = Number.NEGATIVE_INFINITY;
            const coordinateMin = this.coordinate.minValue();
            const coordinateMax = this.coordinate.maxValue();
            for (const innerSpline of this.values) {
                innerSpline.calculateMinMax();
            }
            if (coordinateMin < this.locations[0]) {
                const minExtend = MultiPoint.linearExtend(coordinateMin, this.locations, (this.values[0]).min(), this.derivatives, 0);
                const maxExtend = MultiPoint.linearExtend(coordinateMin, this.locations, (this.values[0]).max(), this.derivatives, 0);
                splineMin = Math.min(splineMin, Math.min(minExtend, maxExtend));
                splineMax = Math.max(splineMax, Math.max(minExtend, maxExtend));
            }
            if (coordinateMax > this.locations[lastIdx]) {
                const minExtend = MultiPoint.linearExtend(coordinateMax, this.locations, (this.values[lastIdx]).min(), this.derivatives, lastIdx);
                const maxExtend = MultiPoint.linearExtend(coordinateMax, this.locations, (this.values[lastIdx]).max(), this.derivatives, lastIdx);
                splineMin = Math.min(splineMin, Math.min(minExtend, maxExtend));
                splineMax = Math.max(splineMax, Math.max(minExtend, maxExtend));
            }
            for (const innerSpline of this.values) {
                splineMin = Math.min(splineMin, innerSpline.min());
                splineMax = Math.max(splineMax, innerSpline.max());
            }
            for (var i = 0; i < lastIdx; ++i) {
                const locationLeft = this.locations[i];
                const locationRight = this.locations[i + 1];
                const locationDelta = locationRight - locationLeft;
                const splineLeft = this.values[i];
                const splineRight = this.values[i + 1];
                const minLeft = splineLeft.min();
                const maxLeft = splineLeft.max();
                const minRight = splineRight.min();
                const maxRight = splineRight.max();
                const derivativeLeft = this.derivatives[i];
                const derivativeRight = this.derivatives[i + 1];
                if (derivativeLeft !== 0.0 || derivativeRight !== 0.0) {
                    const maxValueDeltaLeft = derivativeLeft * locationDelta;
                    const maxValueDeltaRight = derivativeRight * locationDelta;
                    const minValue = Math.min(minLeft, minRight);
                    const maxValue = Math.max(maxLeft, maxRight);
                    const minDeltaLeft = maxValueDeltaLeft - maxRight + minLeft;
                    const maxDeltaLeft = maxValueDeltaLeft - minRight + maxLeft;
                    const minDeltaRight = -maxValueDeltaRight + minRight - maxLeft;
                    const maxDeltaRight = -maxValueDeltaRight + maxRight - minLeft;
                    const minDelta = Math.min(minDeltaLeft, minDeltaRight);
                    const maxDelta = Math.max(maxDeltaLeft, maxDeltaRight);
                    splineMin = Math.min(splineMin, minValue + 0.25 * minDelta);
                    splineMax = Math.max(splineMax, maxValue + 0.25 * maxDelta);
                }
            }
            this.calculatedMin = splineMin;
            this.calculatedMax = splineMax;
        }
        static linearExtend(location, locations, value, derivatives, useIndex) {
            const derivative = derivatives[useIndex];
            return derivative == 0.0 ? value : value + derivative * (location - locations[useIndex]);
        }
    }
    CubicSpline.MultiPoint = MultiPoint;
})(CubicSpline || (CubicSpline = {}));
//# sourceMappingURL=CubicSpline.js.map