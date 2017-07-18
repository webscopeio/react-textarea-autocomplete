// @flow

export const KEY_CODES = {
  ESC: 27,
  UP: 38,
  DOWN: 40,
  ENTER: 13,
};

// This is self-made key shortcuts manager, used for caching key strokes
class Listener {
  index: number;

  listeners: {
    [number]: {| keyCode: Array<number>, fn: Function |},
  };

  f: Function;

  constructor() {
    this.index = 0;
    this.listeners = {};

    this.f = (e: KeyboardEvent) => {
      const code = e.keyCode || e.which;
      for (let i = 0; i < this.index; i += 1) {
        const { keyCode, fn } = this.listeners[i];
        if (keyCode.includes(code)) fn(e);
      }
    };

    document.addEventListener('keydown', this.f);
  }

  add = (keyCodes: Array<number> | number, fn: Function) => {
    let keyCode = keyCodes;

    if (typeof keyCode !== 'object') keyCode = [keyCode];

    this.listeners[this.index] = {
      keyCode,
      fn,
    };

    return (this.index += 1);
  };

  remove = (id: number) => {
    delete this.listeners[id];
    this.index -= 1;
  };

  removeAll = () => document.removeEventListener('keydown', this.f);
}

export default new Listener();
