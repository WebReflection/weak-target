import { create, drop } from 'gc-hook';

const checkTarget = wt => wt.target;

export default class WeakTarget {
  #target = null;
  #destruct = true;
  constructor(target) {
    this.#target = new WeakRef(create(this, checkTarget, { return: target }));
  }
  get target() {
    const target = this.#target?.deref();
    if (!target && this.#destruct) {
      this.#target = null;
      this.#destruct = false;
      drop(this);
      this.destructor?.();
    }
    return target;
  }
}
