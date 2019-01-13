// @flow

export const KEY_CODES = {
  ESC: 27,
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  ENTER: 13,
  TAB: 9
};

// This is self-made key shortcuts manager, used for caching key strokes
class Listener {
  index: number;

  listeners: {
    [number]: {| keyCode: Array<number>, fn: Function |}
  };

  refCount: number;

  f: Function;

  constructor() {
    this.index = 0;
    this.listeners = {};

    this.f = (e: KeyboardEvent) => {
      if (!e) return;

      const code = e.keyCode || e.which;
      for (let i = 0; i < this.index; i += 1) {
        const { keyCode, fn } = this.listeners[i];
        if (keyCode.includes(code)) {
          e.stopPropagation();
          e.preventDefault();
          fn(e);
        }
      }
    };
  }

  startListen = (ref: HTMLInputElement) => {
    if (!ref) return;

    ref.addEventListener("keydown", this.f);
  };

  stopListen = (ref: HTMLInputElement) => {
    if (!ref) return;

    ref.removeEventListener("keydown", this.f);
  };

  add = (keyCodes: Array<number> | number, fn: Function) => {
    let keyCode = keyCodes;

    if (typeof keyCode !== "object") keyCode = [keyCode];

    this.listeners[this.index] = {
      keyCode,
      fn
    };

    this.index += 1;

    return this.index;
  };

  remove = (id: number) => {
    delete this.listeners[id];
    this.index -= 1;
  };

  removeAll = () => {
    this.listeners = {};
    this.index = 0;
  };
}

export default new Listener();
