// @flow

export const KEY_CODES = {
  ESC: 27,
  UP: 38,
  DOWN: 40,
  ENTER: 13,
};

// This is self-made key shortcuts manager, used for caching key strokes
const Listeners = (function() {
  let index = 0;
  const listeners: {
    [number]: {| keyCode: Array<number>, fn: Function |},
  } = {};

  const addListener = (keyCode: Array<number> | number, fn: Function) => {
    if (typeof keyCode !== 'object') keyCode = [keyCode];

    listeners[index] = {
      keyCode,
      fn,
    };

    return index++;
  };

  const removeListener = (id: number) => {
    delete listeners[id];
    index--;
  };

  const removeAllListeners = () => document.removeEventListener('keydown', f);

  const f = (e: KeyboardEvent) => {
    const code = e.keyCode || e.which;
    for (let i = 0; i < index; i++) {
      const { keyCode, fn } = listeners[i];
      if (!keyCode.includes(code)) continue;
      // if there is registered callback, call it
      fn(e);
    }
  };

  document.addEventListener('keydown', f);

  return {
    add: addListener,
    remove: removeListener,
    removeAll: removeAllListeners,
  };
})();

export default Listeners;
