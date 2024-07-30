# weak-target

A base class to weakly target any reference.

Inspired by [this post](https://frontendmasters.com/blog/patterns-for-memory-efficient-dom-manipulation/) so that the example code would be instead:

```js
import WeakTarget from 'weak-target';

class Counter extends WeakTarget {
  constructor(target) {
    super(target);
    this.timer = 0;
    this.count = 0;
    this.start();
  }

  // if present, invoked when `target` is garbage collected
  destructor() {
    console.log('Garabage Collector ran and element is GONE – clean up interval');
    this.stop();
  }

  start() {
    if (this.timer) return;
    this.count = 0;
    const tick = () => {
      const { target } = this;
      // always check if the target exists because WeakRef could be freed
      // before the FinalizationRegistry callback gets a chance to run
      if (target) {
        console.log('Element is still in memory, updating count.');
        target.textContent = `Counter: ${++this.count}`;
      }
    };
    tick();
    this.timer = setInterval(tick, 1000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = 0;
    }
  }
}
```

That's it, the class orchestrate with ease the ability to retrieve a `target` reference that might has gone.

If there is a `destructor` method attached, this will get invoked whenever that happens, either by accessing `target` explicitly, in case the FinalizationRegistry hasn't called the callback yet, or implicitly, when such callback gets executed.

The `destructor` is not meant to be invoked directly and it will be invoked only *once*, like it is for the `constructor`.
