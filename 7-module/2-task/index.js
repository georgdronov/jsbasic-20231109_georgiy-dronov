import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.elem = createElement(`
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>
            <h3 class="modal__title"></h3>
          </div>
          <div class="modal__body"></div>
        </div>
      </div>
    `);

    this.body = this.elem.querySelector('.modal__body');
  }

  addEventListeners() {
    this.elem.querySelector('.modal__close').addEventListener('click', () => this.close());
    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
  }

  open() {
    document.body.appendChild(this.elem);
    document.body.classList.add('is-modal-open');
  }

  setTitle(title) {
    this.elem.querySelector('.modal__title').textContent = title;
  }

  setBody(node) {
    this.body.innerHTML = '';
    this.body.appendChild(node);
  }

  close() {
    document.body.removeChild(this.elem);
    document.body.classList.remove('is-modal-open');
    document.removeEventListener('keydown', (event) => this.handleKeyDown(event));
  }

  handleKeyDown(event) {
    if (event.code === 'Escape') {
      this.close();
    }
  }
}
