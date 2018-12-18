// @flow

export const KEY_CODES = {
  ESC: 27,
  UP: 38,
  DOWN: 40,
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
    this.refCount = 0;

    this.f = (e: KeyboardEvent) => {
      const code = e.keyCode || e.which;
      for (let i = 0; i < this.index; i += 1) {
        const { keyCode, fn } = this.listeners[i];
        if (keyCode.includes(code)) fn(e);
      }
    };
  }

  startListen = () => {
    if (!this.refCount) {
      // prevent multiple listeners in case of multiple TextareaAutocomplete components on page
      document.addEventListener("keydown", this.f);
    }
    this.refCount++;
  };

  stopListen = () => {
    this.refCount--;
    if (!this.refCount) {
      // prevent disable listening in case of multiple TextareaAutocomplete components on page
      document.removeEventListener("keydown", this.f);
    }
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
