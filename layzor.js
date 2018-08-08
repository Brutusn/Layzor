const searchLight = document.querySelector('.search-light');
const searchLightOffset = searchLight.clientWidth;

const pageSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min) ) + min;
};

const setSizes = () => {
  pageSize.width = window.innerWidth;
  pageSize.height = window.innerHeight;
};

const transformXY = (x, y) => `translate(${x}px, ${y}px)`;

const moveSearchLight = () => {
  const x = random(0, pageSize.width - searchLightOffset);
  const y = random(0, pageSize.height - searchLightOffset);

  console.log(x, y, searchLight, transformXY(x, y), searchLightOffset, pageSize.width);

  searchLight.style.transform = transformXY(x, y);
};

setInterval(moveSearchLight, 1000);












window.addEventListener('resize', setSizes);