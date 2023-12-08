document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('submit-form');
    const usernameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const phoneInput = document.querySelector('input[name="mno"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const confirmPasswordInput = document.querySelector('input[name="singin-confirm-password"]');

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateInputs()) {
            registrationForm.submit();
        }
    });

    const setError = (element, message) => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');
        errorDisplay.innerText = message;

        inputControl.classList.remove('success');
    };

    const setSuccess = element => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');
        errorDisplay.innerText = '';
        inputControl.classList.add('success');
        inputControl.classList.remove('error');
    };

    const validateInputs = () => {
        const usernameValue = usernameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const phoneValue = phoneInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        const confirmPasswordValue = confirmPasswordInput.value.trim();

        let isValid = true;

        if (usernameValue === '') {
            setError(usernameInput, 'Name required');
            isValid = false;
        } else if (!isValidName(usernameValue)) {
            setError(usernameInput, 'Only alphabets are allowed');
            isValid = false;
        } else if (usernameValue.length < 5) {
            setError(usernameInput, 'Minimum of 5 characters');
            isValid = false;
        } else {
            setSuccess(usernameInput);
        }

        if (emailValue === '') {
            setError(emailInput, 'Email required');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            setError(emailInput, 'Invalid email format');
            isValid = false;
        } else {
            setSuccess(emailInput);
        }

        if (phoneValue === '') {
            setError(phoneInput, 'Phone number required');
            isValid = false;
        } else if (!isValidPhoneNumber(phoneValue)) {
            setError(phoneInput, 'Invalid phone number format');
            isValid = false;
        } else {
            setSuccess(phoneInput);
        }

        if (passwordValue === '') {
            setError(passwordInput, 'Password required');
            isValid = false;
        } else {
            setSuccess(passwordInput);
        }

        if (confirmPasswordValue === '') {
            setError(confirmPasswordInput, 'Confirm Password required');
            isValid = false;
        } else if (passwordValue !== confirmPasswordValue) {
            setError(confirmPasswordInput, 'Passwords do not match');
            isValid = false;
        } else {
            setSuccess(confirmPasswordInput);
        }

        return isValid;
    };

    const isValidEmail = email => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const isValidPhoneNumber = number => {
        const regex = /^\d{10}$/;
        return regex.test(number);
    };

    const isValidName = name => {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(name);
    };
});
