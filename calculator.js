var Calculator = /** @class */ (function () {
    function Calculator() {
        this.displayElement = document.getElementById('display');
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.initializeEventListeners();
        this.updateDisplay();
    }
    Calculator.prototype.initializeEventListeners = function () {
        var _this = this;
        var _a, _b, _c, _d;
        // Number buttons
        var numberButtons = document.querySelectorAll('[data-number]');
        numberButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var number = button.dataset.number;
                _this.appendNumber(number);
                _this.addPressEffect(button);
            });
        });
        // Operator buttons
        var operatorButtons = document.querySelectorAll('[data-operator]');
        operatorButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var operator = button.dataset.operator;
                _this.chooseOperation(operator);
                _this.addPressEffect(button);
            });
        });
        // Action buttons
        (_a = document.querySelector('[data-action="clear"]')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
            _this.clear();
            _this.addPressEffect(document.querySelector('[data-action="clear"]'));
        });
        (_b = document.querySelector('[data-action="delete"]')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
            _this.delete();
            _this.addPressEffect(document.querySelector('[data-action="delete"]'));
        });
        (_c = document.querySelector('[data-action="percent"]')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
            _this.percentage();
            _this.addPressEffect(document.querySelector('[data-action="percent"]'));
        });
        (_d = document.querySelector('[data-action="equals"]')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () {
            _this.compute();
            _this.addPressEffect(document.querySelector('[data-action="equals"]'));
        });
        // Keyboard support
        document.addEventListener('keydown', function (e) { return _this.handleKeyboard(e); });
    };
    Calculator.prototype.addPressEffect = function (element) {
        element.classList.add('pressed');
        setTimeout(function () {
            element.classList.remove('pressed');
        }, 300);
    };
    Calculator.prototype.appendNumber = function (number) {
        if (number === '.' && this.currentOperand.includes('.'))
            return;
        if (this.shouldResetDisplay) {
            this.currentOperand = '';
            this.shouldResetDisplay = false;
        }
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        }
        else {
            this.currentOperand += number;
        }
        this.updateDisplay(true);
    };
    Calculator.prototype.chooseOperation = function (operator) {
        if (this.currentOperand === '')
            return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.shouldResetDisplay = true;
        this.updatePreviousOperand();
    };
    Calculator.prototype.compute = function () {
        var computation;
        var prev = parseFloat(this.previousOperand);
        var current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current))
            return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.showError();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = this.formatNumber(computation);
        this.operation = null;
        this.previousOperand = '';
        this.shouldResetDisplay = true;
        this.updateDisplay(true);
        this.updatePreviousOperand();
    };
    Calculator.prototype.formatNumber = function (number) {
        // Handle very large or very small numbers
        if (Math.abs(number) > 999999999 || (Math.abs(number) < 0.000001 && number !== 0)) {
            return number.toExponential(6);
        }
        // Round to prevent floating point errors
        var rounded = Math.round(number * 100000000) / 100000000;
        var stringNumber = rounded.toString();
        // Limit decimal places if too long
        if (stringNumber.includes('.') && stringNumber.length > 12) {
            return rounded.toFixed(6).replace(/\.?0+$/, '');
        }
        return stringNumber;
    };
    Calculator.prototype.clear = function () {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.updateDisplay(true);
        this.updatePreviousOperand();
    };
    Calculator.prototype.delete = function () {
        if (this.shouldResetDisplay)
            return;
        this.currentOperand = this.currentOperand.slice(0, -1);
        if (this.currentOperand === '' || this.currentOperand === '-') {
            this.currentOperand = '0';
        }
        this.updateDisplay(true);
    };
    Calculator.prototype.percentage = function () {
        var current = parseFloat(this.currentOperand);
        if (isNaN(current))
            return;
        this.currentOperand = (current / 100).toString();
        this.updateDisplay(true);
    };
    Calculator.prototype.updateDisplay = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = false; }
        this.displayElement.textContent = this.currentOperand;
        if (animate) {
            this.displayElement.classList.add('update');
            setTimeout(function () {
                _this.displayElement.classList.remove('update');
            }, 300);
        }
    };
    Calculator.prototype.updatePreviousOperand = function () {
        if (this.operation != null && this.previousOperand !== '') {
            var operatorSymbol = this.getOperatorSymbol(this.operation);
            this.previousOperandElement.textContent = "".concat(this.previousOperand, " ").concat(operatorSymbol);
        }
        else {
            this.previousOperandElement.textContent = '';
        }
    };
    Calculator.prototype.getOperatorSymbol = function (operator) {
        switch (operator) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            default: return operator;
        }
    };
    Calculator.prototype.showError = function () {
        var _this = this;
        this.currentOperand = 'Error';
        this.displayElement.classList.add('error');
        setTimeout(function () {
            _this.displayElement.classList.remove('error');
            _this.clear();
        }, 1500);
    };
    Calculator.prototype.handleKeyboard = function (e) {
        if (e.key >= '0' && e.key <= '9') {
            this.appendNumber(e.key);
        }
        else if (e.key === '.') {
            this.appendNumber('.');
        }
        else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            this.chooseOperation(e.key);
        }
        else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.compute();
        }
        else if (e.key === 'Escape') {
            this.clear();
        }
        else if (e.key === 'Backspace') {
            this.delete();
        }
        else if (e.key === '%') {
            this.percentage();
        }
    };
    return Calculator;
}());
// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new Calculator();
});
