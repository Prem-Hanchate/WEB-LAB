class Calculator {
    private displayElement: HTMLElement;
    private previousOperandElement: HTMLElement;
    private currentOperand: string;
    private previousOperand: string;
    private operation: string | null;
    private shouldResetDisplay: boolean;

    constructor() {
        this.displayElement = document.getElementById('display')!;
        this.previousOperandElement = document.getElementById('previous-operand')!;
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.initializeEventListeners();
        this.updateDisplay();
    }

    private initializeEventListeners(): void {
        // Number buttons
        const numberButtons = document.querySelectorAll('[data-number]');
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                const number = (button as HTMLElement).dataset.number!;
                this.appendNumber(number);
                this.addPressEffect(button as HTMLElement);
            });
        });

        // Operator buttons
        const operatorButtons = document.querySelectorAll('[data-operator]');
        operatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                const operator = (button as HTMLElement).dataset.operator!;
                this.chooseOperation(operator);
                this.addPressEffect(button as HTMLElement);
            });
        });

        // Action buttons
        document.querySelector('[data-action="clear"]')?.addEventListener('click', () => {
            this.clear();
            this.addPressEffect(document.querySelector('[data-action="clear"]') as HTMLElement);
        });

        document.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
            this.delete();
            this.addPressEffect(document.querySelector('[data-action="delete"]') as HTMLElement);
        });

        document.querySelector('[data-action="percent"]')?.addEventListener('click', () => {
            this.percentage();
            this.addPressEffect(document.querySelector('[data-action="percent"]') as HTMLElement);
        });

        document.querySelector('[data-action="equals"]')?.addEventListener('click', () => {
            this.compute();
            this.addPressEffect(document.querySelector('[data-action="equals"]') as HTMLElement);
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    private addPressEffect(element: HTMLElement): void {
        element.classList.add('pressed');
        setTimeout(() => {
            element.classList.remove('pressed');
        }, 300);
    }

    private appendNumber(number: string): void {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.shouldResetDisplay) {
            this.currentOperand = '';
            this.shouldResetDisplay = false;
        }
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay(true);
    }

    private chooseOperation(operator: string): void {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.shouldResetDisplay = true;
        this.updatePreviousOperand();
    }

    private compute(): void {
        let computation: number;
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
    }

    private formatNumber(number: number): string {
        // Handle very large or very small numbers
        if (Math.abs(number) > 999999999 || (Math.abs(number) < 0.000001 && number !== 0)) {
            return number.toExponential(6);
        }
        
        // Round to prevent floating point errors
        const rounded = Math.round(number * 100000000) / 100000000;
        const stringNumber = rounded.toString();
        
        // Limit decimal places if too long
        if (stringNumber.includes('.') && stringNumber.length > 12) {
            return rounded.toFixed(6).replace(/\.?0+$/, '');
        }
        
        return stringNumber;
    }

    private clear(): void {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.updateDisplay(true);
        this.updatePreviousOperand();
    }

    private delete(): void {
        if (this.shouldResetDisplay) return;
        this.currentOperand = this.currentOperand.slice(0, -1);
        if (this.currentOperand === '' || this.currentOperand === '-') {
            this.currentOperand = '0';
        }
        this.updateDisplay(true);
    }

    private percentage(): void {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
        this.updateDisplay(true);
    }

    private updateDisplay(animate: boolean = false): void {
        this.displayElement.textContent = this.currentOperand;
        if (animate) {
            this.displayElement.classList.add('update');
            setTimeout(() => {
                this.displayElement.classList.remove('update');
            }, 300);
        }
    }

    private updatePreviousOperand(): void {
        if (this.operation != null && this.previousOperand !== '') {
            const operatorSymbol = this.getOperatorSymbol(this.operation);
            this.previousOperandElement.textContent = `${this.previousOperand} ${operatorSymbol}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    private getOperatorSymbol(operator: string): string {
        switch (operator) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            default: return operator;
        }
    }

    private showError(): void {
        this.currentOperand = 'Error';
        this.displayElement.classList.add('error');
        setTimeout(() => {
            this.displayElement.classList.remove('error');
            this.clear();
        }, 1500);
    }

    private handleKeyboard(e: KeyboardEvent): void {
        if (e.key >= '0' && e.key <= '9') {
            this.appendNumber(e.key);
        } else if (e.key === '.') {
            this.appendNumber('.');
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            this.chooseOperation(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.compute();
        } else if (e.key === 'Escape') {
            this.clear();
        } else if (e.key === 'Backspace') {
            this.delete();
        } else if (e.key === '%') {
            this.percentage();
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
