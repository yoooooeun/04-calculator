class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  // 초기화 (C 버튼)
  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.updateDisplay();
  }

  // 한 글자 삭제 (DEL 버튼)
  delete() {
    if (this.currentOperand === '0') return;
    if (this.currentOperand.length === 1) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
    this.updateDisplay();
  }

  // 숫자 추가
  appendNumber(number) {
    // 소수점 중복 입력 방지
    if (number === '.' && this.currentOperand.includes('.')) return;
    
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
    this.updateDisplay();
  }

  // 연산자 선택
  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
    this.updateDisplay();
  }

  // 계산 수행
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
      case '*':
        computation = prev * current;
        break;
      case '÷':
      case '/':
        if (current === 0) {
          alert('0으로 나눌 수 없습니다.');
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    // 결과값을 소수점 정리 및 문자열 변환
    this.currentOperand = Math.round(computation * 1e10) / 1e10;
    this.operation = undefined;
    this.previousOperand = '';
    this.updateDisplay();
  }

  // 화면 업데이트
  updateDisplay() {
    this.currentOperandTextElement.innerText = this.currentOperand;
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}

// DOM 요소 취득 및 이벤트 리스너 연결
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// 버튼 클릭 이벤트 처리
document.querySelectorAll('[data-number]').forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.dataset.number);
  });
});

document.querySelectorAll('[data-operator]').forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.dataset.operator);
  });
});

document.getElementById('equals-btn').addEventListener('click', () => {
  calculator.compute();
});

document.getElementById('clear-btn').addEventListener('click', () => {
  calculator.clear();
});

document.querySelector('[data-action="delete"]').addEventListener('click', () => {
  calculator.delete();
});

// 키보드 입력 지원
window.addEventListener('keydown', e => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    calculator.appendNumber(e.key);
  }
  if (e.key === '+' || e.key === '-') {
    calculator.chooseOperation(e.key);
  }
  if (e.key === '*') {
    calculator.chooseOperation('×');
  }
  if (e.key === '/') {
    e.preventDefault(); // 웹브라우저 '찾기' 단축키 방지
    calculator.chooseOperation('÷');
  }
  if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculator.compute();
  }
  if (e.key === 'Backspace') {
    calculator.delete();
  }
  if (e.key === 'Escape') {
    calculator.clear();
  }
});