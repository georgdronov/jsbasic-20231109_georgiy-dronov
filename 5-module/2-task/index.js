function toggleText() {
  const button = document.querySelector('.toggle-text-button')
  const text = document.querySelector('#text')

  button.addEventListener('click', function () {
    return text.hidden = !text.hidden;
  });
}
