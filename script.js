const result = document.querySelector('#result');
const expression = document.querySelector('#expression');
let current = '0';
let stored = null;
let operator = null;
let replaceCurrent = false;

function render() {
  result.textContent = current;
  expression.textContent = stored !== null && operator ? `${format(stored)} ${operator}` : '\u00a0';
}

function format(value) {
  return String(value).replace('.', ',');
}

function inputDigit(digit) {
  if (replaceCurrent || current === 'Erro') { current = digit; replaceCurrent = false; }
  else if (current === '0') current = digit;
  else if (current.replace('-', '').replace(',', '').length < 14) current += digit;
  render();
}

function calculate() {
  if (stored === null || !operator) return;
  const a = stored;
  const b = Number(current.replace(',', '.'));
  let value;
  if (operator === '+') value = a + b;
  if (operator === '−') value = a - b;
  if (operator === '×') value = a * b;
  if (operator === '÷') value = b === 0 ? NaN : a / b;
  expression.textContent = `${format(a)} ${operator} ${current} =`;
  current = Number.isFinite(value) ? String(Number(value.toPrecision(12))).replace('.', ',') : 'Erro';
  stored = null;
  operator = null;
  replaceCurrent = true;
  result.textContent = current;
}

function chooseOperator(next) {
  const value = Number(current.replace(',', '.'));
  if (stored !== null && operator && !replaceCurrent) calculate();
  stored = Number(current.replace(',', '.'));
  operator = next;
  replaceCurrent = true;
  render();
}

function action(name) {
  if (name === 'clear') { current = '0'; stored = null; operator = null; replaceCurrent = false; }
  if (name === 'decimal' && !replaceCurrent && current !== 'Erro' && !current.includes(',')) current += ',';
  if (name === 'decimal' && replaceCurrent) { current = '0,'; replaceCurrent = false; }
  if (name === 'sign' && current !== '0' && current !== 'Erro') current = current.startsWith('-') ? current.slice(1) : `-${current}`;
  if (name === 'percent' && current !== 'Erro') current = String(Number((Number(current.replace(',', '.')) / 100).toPrecision(12))).replace('.', ',');
  if (name === 'backspace' && !replaceCurrent && current !== 'Erro') { current = current.length <= 1 || (current.length === 2 && current.startsWith('-')) ? '0' : current.slice(0, -1); }
  if (name === 'equals') { calculate(); return; }
  render();
}

document.querySelector('.keys').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.digit) inputDigit(button.dataset.digit);
  else if (button.dataset.operator) chooseOperator(button.dataset.operator);
  else if (button.dataset.action) action(button.dataset.action);
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) inputDigit(event.key);
  else if (event.key === '.' || event.key === ',') action('decimal');
  else if (event.key === '+') chooseOperator('+');
  else if (event.key === '-') chooseOperator('−');
  else if (event.key === '*') chooseOperator('×');
  else if (event.key === '/') { event.preventDefault(); chooseOperator('÷'); }
  else if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); action('equals'); }
  else if (event.key === 'Escape') action('clear');
  else if (event.key === 'Backspace') action('backspace');
});
