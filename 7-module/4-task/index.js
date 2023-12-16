import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;

    this.render();
  }

  render() {
    this.elem = createElement(`
      <div class="slider">
        <div class="slider__thumb" style="left: 0;"></div>
        <div class="slider__progress" style="width: 0;"></div>
        <div class="slider__value">${this.value}</div>
        <div class="slider__steps">
          ${'<span></span>'.repeat(this.steps)}
        </div>
      </div>
    `);

    this.thumb = this.elem.querySelector('.slider__thumb');
    this.progress = this.elem.querySelector('.slider__progress');

    this.thumb.ondragstart = () => false;

    this.thumb.addEventListener('pointerdown', this.onThumbPointerDown);
    document.addEventListener('pointermove', this.onThumbPointerMove);
    document.addEventListener('pointerup', this.onThumbPointerUp);

    this.update();
  }

  onThumbPointerDown = (event) => {
    event.preventDefault();

    this.elem.classList.add('slider_dragging');

    this.thumb.style.pointerEvents = 'none';

    this.sliderRect = this.elem.getBoundingClientRect();
    this.shiftX = event.clientX - this.sliderRect.left;

    this.thumb.style.left = this.shiftX / this.sliderRect.width * 100 + '%';

    this.elem.dispatchEvent(new CustomEvent('slider-change', {
      detail: this.value,
      bubbles: true
    }));
  }

  onThumbPointerMove = (event) => {
    if (!this.elem.classList.contains('slider_dragging')) {
      return;
    }

    let left = (event.clientX - this.sliderRect.left) / this.sliderRect.width;

    if (left < 0) left = 0;
    if (left > 1) left = 1;

    this.thumb.style.left = left * 100 + '%';
    this.progress.style.width = left * 100 + '%';

    let segments = this.steps - 1;
    let approximateValue = left * segments;
    this.value = Math.round(approximateValue);

    this.elem.querySelector('.slider__value').innerHTML = this.value;

    let steps = this.elem.querySelectorAll('.slider__steps span');
    steps.forEach((step, index) => {
      index === this.value ? step.classList.add('slider__step-active') : step.classList.remove('slider__step-active');
    });
  }

  onThumbPointerUp = () => {
    this.elem.classList.remove('slider_dragging');
    this.elem.dispatchEvent(new CustomEvent('slider-change', {
      detail: this.value,
      bubbles: true
    }));

    this.thumb.style.pointerEvents = '';
  }

  update() {
    let leftPercents = (this.value / (this.steps - 1)) * 100;
    this.thumb.style.left = `${leftPercents}%`;
    this.progress.style.width = `${leftPercents}%`;

    this.elem.querySelector('.slider__value').innerHTML = this.value;

    let steps = this.elem.querySelectorAll('.slider__steps span');
    steps.forEach((step, index) => {
      index === this.value ? step.classList.add('slider__step-active') : step.classList.remove('slider__step-active');
    });
  }
}
