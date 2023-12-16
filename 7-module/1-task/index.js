import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.render();
    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="ribbon"></div>');
    const innerElem = createElement('<nav class="ribbon__inner"></nav>');

    this.categories.forEach(category => {
      const link = createElement(`<a href="#" class="ribbon__item" data-id="${category.id}">${category.name}</a>`);
      innerElem.appendChild(link);
    });

    this.elem.appendChild(innerElem);

    // Добавляем кнопки прокрутки
    this.elem.insertAdjacentHTML('beforeend', `
      <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
      <button class="ribbon__arrow ribbon__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
    `);
  }

  addEventListeners() {
    const ribbonInner = this.elem.querySelector('.ribbon__inner');
    const arrowLeft = this.elem.querySelector('.ribbon__arrow_left');
    const arrowRight = this.elem.querySelector('.ribbon__arrow_right');

    arrowLeft.addEventListener('click', () => this.scrollMenu('left'));
    arrowRight.addEventListener('click', () => this.scrollMenu('right'));

    ribbonInner.addEventListener('scroll', () => this.toggleArrowsVisibility());
    this.elem.addEventListener('click', (event) => this.onCategoryClick(event));
  }

  scrollMenu(direction) {
    const ribbonInner = this.elem.querySelector('.ribbon__inner');
    const step = 350;
    const scrollStep = direction === 'left' ? -step : step;

    ribbonInner.scrollBy(scrollStep, 0);
  }

  toggleArrowsVisibility() {
    const ribbonInner = this.elem.querySelector('.ribbon__inner');
    const arrowLeft = this.elem.querySelector('.ribbon__arrow_left');
    const arrowRight = this.elem.querySelector('.ribbon__arrow_right');

    const scrollLeft = ribbonInner.scrollLeft;
    const scrollRight = ribbonInner.scrollWidth - ribbonInner.scrollLeft - ribbonInner.clientWidth;

    arrowLeft.classList.toggle('ribbon__arrow_visible', scrollLeft > 0);
    arrowRight.classList.toggle('ribbon__arrow_visible', scrollRight > 1);
  }

  onCategoryClick(event) {
    if (event.target.classList.contains('ribbon__item')) {
      event.preventDefault();

      const activeLink = this.elem.querySelector('.ribbon__item_active');
      if (activeLink) {
        activeLink.classList.remove('ribbon__item_active');
      }

      const selectedLink = event.target;
      selectedLink.classList.add('ribbon__item_active');

      const categoryId = selectedLink.dataset.id;
      this.elem.dispatchEvent(new CustomEvent('ribbon-select', {
        detail: categoryId,
        bubbles: true,
      }));
    }
  }
}
