
(function (window) {

  'use strict';

  let _dpr, _canvas, _context;
  let _effect, _textManager;

  document.addEventListener('DOMContentLoaded', initialize);

  class Filter {

    drawTile(context, width, height) {

      let cloneCanavs = document.createElement('canvas');
      let cloneContext = cloneCanavs.getContext('2d');
      cloneCanavs.width = width;
      cloneCanavs.height = height;

      const imageData = context.getImageData(0, 0, width, height);
      cloneContext.putImageData(imageData, 0, 0);

      const tileWidth = Math.ceil(width / 3);
      const ratio = tileWidth / width;
      const tileHeight = Math.ceil(height * ratio);

      for (let i = 0; i < 3; i++) {
        for (let l = 0; l < 3; l++) {

          const x = tileWidth * i;
          const y = tileHeight * l;
          context.drawImage(cloneCanavs, 0, 0, width, height, x, y, tileWidth, tileHeight);

        }

      }

    }

    grayScale(context, width, height) {

      let imageData = context.getImageData(0, 0, width, height);
      let data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {

        const color = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = color;

      }

      context.putImageData(imageData, 0, 0);

    }

    extendColor(context, width, height) {

      const data = context.getImageData(0, 0, width, height).data;
      const extendLine = Math.round(Math.random() * height);
      const startIndex = 4 * width * extendLine;

      for (let i = 0; i < width; i++) {

        const index = startIndex + i * 4;

        let r = data[index];
        let g = data[index + 1];
        let b = data[index + 2];
        let a = data[index + 3];
        if (a == 0) r = g = b = 255;

        context.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        context.fillRect(i, 0, 1, height);

      }

    }

    glitchSlip(context, width, height, waveDistance) {

      const startHeight = height * Math.random();
      const endHeight = startHeight + 30 + Math.random() * 40;
      for (let h = startHeight; h < endHeight; h++) {

        if (Math.random() < .1) h++;
        let imageData = context.getImageData(0, h, width, 1);
        context.putImageData(imageData, Math.random() * waveDistance - waveDistance * .5, h);

      }

    }}



  class Effect {

    constructor() {

      this.draw = null;
      this.filter = new Filter();

      this.setProcessing();
      this.setLife();

    }

    setLife() {

      this.life = getRangeNumber(0, 100);
      this.dying = getRangeNumber(2, 15);

    }

    setProcessing() {

      const processing = [this.filter.drawTile, this.filter.extendColor, this.filter.grayScale];
      this.draw = processing[Math.floor(Math.random() * processing.length)];

    }

    counter(context, width, height) {

      this.life--;

      this.filter.glitchSlip(context, width, height, 20);

      if (this.life <= 0) this.draw(context, width, height);

      if (this.life <= -this.dying) {

        this.setProcessing();
        this.setLife();

      }

    }}



  class Text {

    constructor(x, y, text, color, width, height) {

      this.x = x;
      this.y = y;
      this.position = y;
      this.text = text;
      this.color = color;

      this.width = width;
      this.height = height;

      this.life = getRangeNumber(0, 50);

    }

    update(y) {

      this.life--;

      this.y = this.position + y;

      if (this.life <= 0) {
        this.y += getRangeNumber(-10, 10);

      }

      if (this.life <= -10) {

        this.life = getRangeNumber(0, 50);

      }

    }

    draw(context) {

      context.fillStyle = this.color;
      context.fillText(this.text, this.x, this.y);

    }}



  class TextManager {

    constructor() {

      this.y = 0;
      this.height = 0;
      this.margin = 5;
      this.objectList = [];
      this.colorList = ['#ff007f', '#ff00ff', '#7f00ff', '#0000ff', '#007fff', '#00ffff'];

    }

    addText(context, text, fontsize) {

      context.font = fontsize + 'px "Press Start 2P", cursive,sans-serif';
      context.textBaseline = 'top';

      const color = this.colorList[Math.floor(Math.random() * this.colorList.length)];
      const textWidth = context.measureText(text).width;
      const textHeight = this.getOffsetHeight(text, context.font);

      const y = this.height + textHeight + this.margin;
      this.height = y;

      const object = new Text(0, y, text, color, textWidth, textHeight);
      this.objectList.push(object);

    }

    getOffsetHeight(text, font) {

      let span = document.createElement('span');
      span.appendChild(document.createTextNode(text));
      let parent = document.createElement('p');
      parent.id = 'textMetrics';
      parent.appendChild(span);
      document.body.insertBefore(parent, document.body.firstChild);

      span.style.cssText = 'font: ' + font + '; white-space: nowrap; display: inline;';
      let height = span.offsetHeight;
      parent.parentNode.removeChild(parent);
      return height;

    }

    update(context, height) {

      this.y -= 5;

      const length = this.objectList.length;
      for (let i = 0; i < length; i++) {

        let object = this.objectList[i];
        object.update(this.y);

      }

      if (this.y <= -this.height) this.y = height;

      return this;

    }

    draw(context) {

      for (let object of this.objectList) {

        object.draw(context);

      }

    }}



  function initialize() {

    _dpr = window.devicePixelRatio || 1;
    _canvas = document.getElementById('canvas');
    _context = _canvas.getContext('2d');

    _effect = new Effect();

    loadCode(function (data) {

      window.addEventListener('resize', onResize, false);

      setCanvasSize();
      setup(data);
      window.requestAnimationFrame(render);

    });

  }

  function setCanvasSize() {

    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;

  }

  function loadCode(callback) {

    let myXml = new XMLHttpRequest();

    myXml.onload = callback;
    myXml.open('GET', 'https://code.jquery.com/jquery-3.4.1.js', true);
    myXml.send(null);

  }

  function onResize() {

    setCanvasSize();
    setup();

  }

  function setup(data) {

    let fontsize = window.innerWidth * .01;
    let response = data.target.response;
    let textList = response.split(/\n/);

    _textManager = new TextManager();

    for (let i = 0; i < textList.length; i++) {

      let text = textList[i];
      _textManager.addText(_context, text, fontsize);

    }

  }

  function render(timestamp) {

    let width = _canvas.width;
    let height = _canvas.height;

    _context.clearRect(0, 0, width, height);

    _context.fillStyle = '#000';
    _context.fillRect(0, 0, width, height);

    _textManager.update(_context, height).draw(_context);

    _effect.counter(_context, width, height);

    window.requestAnimationFrame(render);

  }

  function getRangeNumber(min, max) {

    return Math.random() * (max - min) + min;

  }


})(window);