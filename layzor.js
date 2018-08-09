const pageSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// run on resize.
const setSizes = () => {
  pageSize.width = window.innerWidth;
  pageSize.height = window.innerHeight;
};

class Effect {
  constructor (element) {
    this.element = element;
    this.effectLength = 1000;
  }

  getElement () {
    return this.element;
  }
  run () {
    alert('Override this!');
  }
  setTransformation (modifier, element = this.element) {
    if (!Array.isArray(element)) {
      element.style.transform = modifier;
    } else {
      element.forEach((elem) => elem.style.transform = modifier);
    }
  }

  static random (min, max) { 
    return Math.floor(Math.random() * (max - min) ) + min;
  }
  static transformXY (x, y) { 
    return `translate(${x}px, ${y}px)`;
  }
  static scaler (a) { 
    return `scale(${a})`;
  }
  static rotator (deg) { 
    return `rotate(${deg}deg)`;
  }
  static addRotation (addIt) {
    if (!addIt) {
      return '';
    }
  
    return ` ${Effect.rotator(Effect.random(0, 30) - 15)}`;
  }
}

class SearchLight extends Effect {
  constructor (element) {
    super(element);
    this.offset = element.clientWidth;
  }

  run () {
    const x = Effect.random(0, pageSize.width - this.offset);
    const y = Effect.random(0, pageSize.height - this.offset);
  
    this.setTransformation(Effect.transformXY(x, y));
  }
}

class Square extends Effect {
  constructor (element) {
    super(element);
    this.maxScale = Math.round(pageSize.height / element.clientHeight * 10) / 10;
  }

  run () {
    const scale = Effect.scaler(Effect.random(1, this.maxScale * 10) / 10);

    this.setTransformation(scale);
  }
}

class Scanline extends Effect {
  constructor ({ vertical, horizontal }) {
    super([vertical, horizontal]);
    this.vertical = vertical;
    this.horizontal = horizontal;

    this.scanlineHeight = vertical.clientWidth;
  }

  move (slElem, vertical = true, rotate = false) {
    const size = vertical ? pageSize.width : pageSize.height;
    const newPosition = Effect.random(0, size - this.scanlineHeight);
  
    const transformLine = vertical ? Effect.transformXY(newPosition, 0) : Effect.transformXY(0, newPosition);
  
    this.setTransformation(transformLine + Effect.addRotation(rotate), slElem);
  };

  getElement (type) {
    if (type === 'vertical') {
      return this.vertical;
    }
    if (type === 'horizontal') {
      return this.horizontal;
    }

    return this.element;
  } 
  
  run (type = 'combi') {
    switch (type) {
      case 'combi': 
        this.move(this.vertical, true, true);
        this.move(this.horizontal, false, true);
        break;
      case 'vertical': 
      this.move(this.vertical);
        break;
      case 'horizontal': 
      this.move(this.horizontal, false);
        break;
      default: 
        // It has a default...
        break;
    }
  }
}

class Flash {
  constructor () {
    this.flashLength = 64;
  }

  bodyColour (colour) {
    document.body.style.backgroundColor = colour;
  }
  flashOnce () {
    this.bodyColour('white');
    setTimeout(() => this.bodyColour('black'), this.flashLength);
  }
  flashSeries (times = 3) {
    for (let i = 0; i < times; i++) {
      const multiplier = i + 1;
      const timeoutMs = (this.flashLength * 2) * multiplier + Effect.random(this.flashLength, this.flashLength * 2);

      setTimeout(this.flashOnce.bind(this), timeoutMs);
    }
  }
  start () {
    const flashes = Effect.random(2, 5);
    const flashInMs = Effect.random(5000, 10000);

    console.debug('It will flash', flashes, 'times in', flashInMs, 'ms');

    setTimeout(() => {
      this.flashSeries(flashes);
      this.start();
    }, flashInMs);
  }
}

class EffectMachine {
  constructor (effects = []) {
    this.effectsArray = effects;
    this.hideClass = 'hide';
  }

  hideShow (elems, action = 'remove') {
    if (!Array.isArray(elems)) {
      elems.classList[action](this.hideClass);
    } else {
      elems.forEach((elem) => elem.classList[action](this.hideClass));
    }
  }

  runEffect ({ effect, type }, rounds, round = 0) {
    if (round === rounds) {
      this.hideShow(effect.getElement(), 'add');
      this.start(Effect.random(3, 6));
      return;
    }
  
    effect.run(type);
    setTimeout(() => this.runEffect({ effect, type }, rounds, round + 1), effect.effectLength)
  }

  start (rounds = 5) {
    const randomEffect = this.effectsArray[Effect.random(0, this.effectsArray.length)];
    
    // Show the newly chosen effect..
    this.hideShow(randomEffect.effect.getElement(randomEffect.type));

    // Run it.
    this.runEffect(randomEffect, rounds);
  };
}

const searchLight = new SearchLight(document.querySelector('.search-light'));
const scaleSquare = new Square(document.querySelector('.square'));
const scanline = new Scanline({
  vertical: document.querySelector('.vertical'),
  horizontal: document.querySelector('.horizontal')
});

const randomFlasher = new Flash();
const effectsMachine = new EffectMachine([{
  effect: searchLight,
  type: null,
}, {
  effect: scaleSquare,
  type: null,
}, {
  effect: scanline,
  type: 'vertical',
}, {
  effect: scanline,
  type: 'horizontal',
}, {
  effect: scanline,
  type: 'combi',
}]);

effectsMachine.start();

// Only enable flashing if desired.
if (window.location.hash === '#strobe') {
  randomFlasher.start();
}

window.addEventListener('resize', setSizes);