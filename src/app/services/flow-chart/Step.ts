// @ts-nocheck
export function Step(context: any, t: any): any {
    this._context = context;
    this._t = t;
}

Step.prototype = {
    areaStart() {
        this._line = 0;
    },
    areaEnd() {
        this._line = NaN;
    },
    lineStart() {
        this._x = this._y = NaN;
        this._point = 0;
    },
    lineEnd() {
        if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
      },
      point(x: any, y: any) {
        x = +x, y = +y;
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; // falls through
          default: {
            if (this._t <= 0) {
              this._context.lineTo(this._x, y);
              this._context.lineTo(x, y);
            } else {
              var x1 = this._x * (1 - this._t) + x * this._t;
              this._context.lineTo(x1, this._y);
              this._context.lineTo(x1, y);
            }
            break;
          }
        }
        this._x = x, this._y = y;
      }
    };

export const stepSquare = function (context) {
    return new Step(context, 0.5);
};

export const stepRoundBefore = function (context) {
    return new Step(context, 0);
};

export const stepRoundAfter = function (context) {
    return new Step(context, 1);
};