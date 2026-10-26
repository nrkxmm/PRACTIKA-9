// Регулярные выражения для проверки полей формы
const RULES = {
  // Фамилия Имя [Отчество]: слова с заглавной буквы, кириллица или латиница, допускается дефис
  fio: /^[А-ЯЁA-Z][а-яёa-z]+(?:-[А-ЯЁA-Z][а-яёa-z]+)?\s[А-ЯЁA-Z][а-яёa-z]+(?:\s[А-ЯЁA-Z][а-яёa-z]+)?$/,
  // Телефон: +996XXXXXXXXX, +7XXXXXXXXXX или 8XXXXXXXXXX (после удаления пробелов, скобок и дефисов)
  phone: /^(?:\+996\d{9}|\+7\d{10}|8\d{10})$/,
  // Почта: имя@домен.зона
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/
};
// Разрешённые символы в телефоне до очистки
const PHONE_CHARS = /^\+?[\d\s()-]+$/;

const MESSAGES = {
  fio: 'Введите фамилию и имя с заглавной буквы, например: Иванов Иван Иванович',
  phone: 'Формат: +996 555 123 456, +7 912 345 67 89 или 8 912 345 67 89',
  email: 'Введите почту в формате name@example.com'
};

function check(name, value) {
  value = value.trim();
  if (name === 'phone') {
    if (!PHONE_CHARS.test(value)) return false;
    value = value.replace(/[\s()-]/g, '');
  }
  return RULES[name].test(value);
}

function setState(input, ok) {
  const msg = input.parentElement.querySelector('.msg');
  input.classList.toggle('bad', !ok);
  input.classList.toggle('good', ok);
  msg.textContent = ok ? 'Верно' : MESSAGES[input.name];
  msg.className = 'msg ' + (ok ? 'ok' : 'err');
}

const form = document.getElementById('contactForm');
const inputs = form.querySelectorAll('input[name]');
inputs.forEach(function (input) {
  input.addEventListener('input', function () { setState(input, check(input.name, input.value)); });
  input.addEventListener('blur', function () { setState(input, check(input.name, input.value)); });
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  let allOk = true;
  inputs.forEach(function (input) {
    const ok = check(input.name, input.value);
    setState(input, ok);
    if (!ok) allOk = false;
  });
  const result = document.getElementById('result');
  if (allOk) {
    result.className = 'result success';
    result.textContent = 'Спасибо! Все данные введены верно.';
    form.reset();
    inputs.forEach(function (i) {
      i.classList.remove('good');
      i.parentElement.querySelector('.msg').textContent = '';
    });
  } else {
    result.className = 'result fail';
    result.textContent = 'Проверьте поля, отмеченные красным.';
  }
});
