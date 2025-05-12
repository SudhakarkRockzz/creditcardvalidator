document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('card-number');
    const cardDisplay = document.getElementById('card-display');
    const cardNameInput = document.getElementById('card-name');
    const cardHolder = document.getElementById('card-holder');
    const cardExpiryInput = document.getElementById('card-expiry-input');
    const cardExpiryDisplay = document.getElementById('card-expiry');
    const cardLogo = document.getElementById('card-logo');
    const cardType = document.getElementById('card-type');
    const resultDiv = document.getElementById('result');
    const form = document.getElementById('card-form');
    
    // Format card number with spaces
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '');
        if (value.length > 0) {
            value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        e.target.value = value;
        cardDisplay.textContent = value || '•••• •••• •••• ••••';
        
        // Detect card type
        detectCardType(value.replace(/\s/g, ''));
    });
    
    // Update card holder name
    cardNameInput.addEventListener('input', function(e) {
        cardHolder.textContent = e.target.value || 'YOUR NAME';
    });
    
    // Format expiration date
    cardExpiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
        cardExpiryDisplay.textContent = value || '••/••';
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cardNumber = cardNumberInput.value.replace(/\s/g, '');
        const cardName = cardNameInput.value;
        const expiry = cardExpiryInput.value;
        const cvv = document.getElementById('card-cvv').value;
        
        // Basic validation
        if (!cardNumber || !cardName || !expiry || !cvv) {
            showResult('Please fill in all fields', false);
            return;
        }
        
        // Validate card number with Luhn algorithm
        const isValid = validateWithLuhn(cardNumber);
        
        if (isValid) {
            showResult('✓ Valid credit card number (passed Luhn check)', true);
        } else {
            showResult('✗ Invalid credit card number (failed Luhn check)', false);
        }
    });
    
    // Luhn algorithm implementation
    function validateWithLuhn(cardNumber) {
        // Remove all non-digit characters
        cardNumber = cardNumber.replace(/\D/g, '');
        
        // Check if the card number is empty or contains non-digits
        if (!cardNumber || !/^\d+$/.test(cardNumber)) {
            return false;
        }
        
        let sum = 0;
        let shouldDouble = false;
        
        // Loop from the end to the beginning
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i), 10);
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return (sum % 10) === 0;
    }
    
    // Detect card type based on number
    function detectCardType(cardNumber) {
        cardNumber = cardNumber.replace(/\D/g, '');
        
        let type = 'Unknown';
        let logo = '••••';
        
        // Visa
        if (/^4/.test(cardNumber)) {
            type = 'Visa';
            logo = 'VISA';
        } 
        // Mastercard
        else if (/^5[1-5]/.test(cardNumber)) {
            type = 'Mastercard';
            logo = 'MC';
        } 
        // American Express
        else if (/^3[47]/.test(cardNumber)) {
            type = 'American Express';
            logo = 'AMEX';
        } 
        // Discover
        else if (/^6(?:011|5)/.test(cardNumber)) {
            type = 'Discover';
            logo = 'DISC';
        }
        // Diners Club
        else if (/^3(?:0[0-5]|[68])/.test(cardNumber)) {
            type = 'Diners Club';
            logo = 'Diners';
        }
        // JCB
        else if (/^35(2[89]|[3-8])/.test(cardNumber)) {
            type = 'JCB';
            logo = 'JCB';
        }
        // UnionPay
        else if (/^62/.test(cardNumber)) {
            type = 'UnionPay';
            logo = 'UnionPay';
        }
        
        cardType.textContent = type !== 'Unknown' ? 
            `Card type: ${type}` : 'Enter card number to detect type';
        cardLogo.textContent = logo;
    }
    
    function showResult(message, isValid) {
        resultDiv.textContent = message;
        resultDiv.className = 'result ' + (isValid ? 'valid' : 'invalid');
    }
});
