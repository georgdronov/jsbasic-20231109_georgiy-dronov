function createElement(htmlString) {
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  return template.content.firstChild;
}

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;

    this.render();
    this.addEventListeners();
  }

  render() {
    this.elem = createElement(`
      <div class="slider">
        <div class="slider__thumb">
          <span class="slider__value">${this.value}</span>
        </div>
        <div class="slider__progress"></div>
        <div class="slider__steps">${this.renderSteps()}</div>
      </div>
    `);
  }

  renderSteps() {
    return new Array(this.steps).fill('').map((_, index) => {
      const isStepActive = index === this.value;
      return `<span class="${isStepActive ? 'slider__step-active' : ''}"></span>`;
    }).join('');
  }

  addEventListeners() {
    this.elem.addEventListener('click', this.onClick);
  }

  onClick = (event) => {
    const sliderRect = this.elem.getBoundingClientRect();
    const clickPosition = event.clientX - sliderRect.left;
    const clickPercentage = clickPosition / sliderRect.width;
    const newValue = Math.round(clickPercentage * (this.steps - 1));

    if (newValue !== this.value) {
      this.setValue(newValue);
      this.generateChangeEvent(newValue);
    }
  }

  setValue(newValue) {
    this.value = newValue;

    const thumb = this.elem.querySelector('.slider__thumb');
    const progress = this.elem.querySelector('.slider__progress');

    const valuePercents = this.value / (this.steps - 1) * 100;
    thumb.style.left = `${valuePercents}%`;
    progress.style.width = `${valuePercents}%`;

    const valueElement = this.elem.querySelector('.slider__value');
    valueElement.textContent = this.value;

    this.updateStepActiveClass();
  }

  updateStepActiveClass() {
    const steps = this.elem.querySelectorAll('.slider__steps span');
    steps.forEach((step, index) => {
      step.classList.toggle('slider__step-active', index === this.value);
    });
  }

  generateChangeEvent(newValue) {
    const event = new CustomEvent('slider-change', {
      detail: newValue,
      bubbles: true,
    });

    this.elem.dispatchEvent(event);
  }
}
