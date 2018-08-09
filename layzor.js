const pageSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const searchLight = document.querySelector('.search-light');
const searchLightOffset = searchLight.clientWidth;

const square = document.querySelector('.square');
const maxScale = Math.round(pageSize.height / square.clientHeight * 10) / 10;

const verticalScanline = document.querySelector('.vertical');
const horizontalScanline = document.querySelector('.horizontal');
const scanlineHeight = verticalScanline.clientWidth;

const random = (min, max) => Math.floor(Math.random() * (max - min) ) + min;
const transformXY = (x, y) => `translate(${x}px, ${y}px)`;
const scaler = (a) => `scale(${a})`;
const rotator = (deg) => `rotate(${deg}deg)`;

const setSizes = () => {
  pageSize.width = window.innerWidth;
  pageSize.height = window.innerHeight;
};

const addRotation = (addIt) => {
  if (!addIt) {
    return '';
  }

  return ` ${rotator(random(0, 30) - 15)}`;
}

const moveSearchLight = () => {
  const x = random(0, pageSize.width - searchLightOffset);
  const y = random(0, pageSize.height - searchLightOffset);

  searchLight.style.transform = transformXY(x, y);
};

const scaleSquare = () => {
  const scale = scaler(random(1, maxScale * 10) / 10);

  square.style.transform = scale;
};

const moveScanline = (slElem, vertical = true, rotate = false) => {
  const size = vertical ? pageSize.width : pageSize.height;
  const newPosition = random(0, size - scanlineHeight);

  const transformLine = vertical ? transformXY(newPosition, 0) : transformXY(0, newPosition);

  slElem.style.transform = transformLine + addRotation(rotate);
};

const moveScanlineVertical = () => moveScanline(verticalScanline);
const moveScanlineHorizontal = () => moveScanline(horizontalScanline, false);
const moveScanlineCombi = () => {
  moveScanline(verticalScanline, true, true);
  moveScanline(horizontalScanline, false, true);
};

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
      const timeoutMs = (this.flashLength * 2) * multiplier + random(this.flashLength, this.flashLength * 2);

      setTimeout(this.flashOnce, timeoutMs);
    }
  }
  start () {
    const flashes = random(2, 5);
    const flashInMs = random(5000, 10000);

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

  runEffect (effect, rounds, round = 0) {
    if (round === rounds) {
      this.hideShow(effect.elem, 'add');
      this.start(random(3, 6));
      return;
    }
  
    effect.fn();
    setTimeout(() => this.runEffect(effect, rounds, round + 1), effect.lengthInMs)
  }

  start (rounds = 5) {
    const randomEffect = this.effectsArray[random(0, this.effectsArray.length)];
    
    // Show the newly chosen effect..
    this.hideShow(randomEffect.elem);

    // Run it.
    this.runEffect(randomEffect, rounds);
  };
}

const randomFlasher = new Flash();
const effectsMachine = new EffectMachine([{
  fn: moveSearchLight,
  elem: searchLight,
  lengthInMs: 1000
}, {
  fn: scaleSquare,
  elem: square,
  lengthInMs: 1000
}, {
  fn: moveScanlineVertical,
  elem: verticalScanline,
  lengthInMs: 1000
}, {
  fn: moveScanlineHorizontal,
  elem: horizontalScanline,
  lengthInMs: 1000
}, {
  fn: moveScanlineCombi,
  elem: [verticalScanline, horizontalScanline],
  lengthInMs: 1000
}]);

effectsMachine.start();

// Only enable flashing if desired.
if (window.location.hash === '#strobe') {
  randomFlasher.start();
}

window.addEventListener('resize', setSizes);