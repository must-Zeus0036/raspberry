document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("main");
    const header = document.querySelector("header");

    // Create navigation
    createNavigation(header);

    // Create contact form
    createContactForm(main);

    // Apply styles
    document.body.style.backgroundColor = "black";
    header.style.color = "";
});

function createNavigation(header) {
    const nav = document.createElement("nav");
    const ul = document.createElement("ul");
    ul.classList.add("active");

    const navItems = [
        { text: "Home", link: "index.html" },
        { text: "Posts", link: "posts.html", class: "active" },
        { text: "Contact", link: "contact.html" }
    ];

    navItems.forEach(({ text, link, class: className }) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link;
        a.textContent = text;
        if (className) a.classList.add(className);
        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.appendChild(ul);
    header.appendChild(nav);
}

function createContactForm(main) {
    const formSection = createElement("section", null, "contact-form");
    const form = createElement("form", null, null, { id: "contactForm" });

    const heading = createElement("h2", "Contact Us");
    const nameLabel = createLabel("name", "Name:");
    const nameInput = createInput("text", "name", "name");
    const nameError = createErrorSpan("nameError");

    const emailLabel = createLabel("email", "Email:");
    const emailInput = createInput("email", "email", "email");
    const emailError = createErrorSpan("emailError");

    const feedbackLabel = createLabel("feedback", "Your Feedback:");
    const feedbackTextarea = createTextarea("feedback", "feedback", 5, 40, "Enter your feedback here...");

    const confirmLabel = createLabel("confirm", "");
    const confirmCheckbox = createInput("checkbox", "confirm", "confirm");
    confirmLabel.append(confirmCheckbox, " Confirm to send");
    const confirmError = createErrorSpan("confirmError");

    const submitBtn = createButton("submit", "Send", { id: "submitBtn", disabled: true });

    form.append(heading, nameLabel, nameInput, nameError, emailLabel, emailInput, emailError, feedbackLabel, feedbackTextarea, confirmError, confirmLabel, submitBtn);
    formSection.appendChild(form);
    main.appendChild(formSection);

    addFormValidation(nameInput, nameError, emailInput, emailError, confirmCheckbox, confirmError, submitBtn, form);
}

function createElement(tag, textContent, className, attributes = {}) {
    const element = document.createElement(tag);
    if (textContent) element.textContent = textContent;
    if (className) element.classList.add(className);
    Object.keys(attributes).forEach(attr => element.setAttribute(attr, attributes[attr]));
    return element;
}

function createLabel(forAttr, textContent) {
    return createElement("label", textContent, null, { for: forAttr });
}

function createInput(type, id, name) {
    return createElement("input", null, null, { type, id, name, required: true });
}

function createTextarea(id, name, rows, cols, placeholder) {
    return createElement("textarea", null, null, { id, name, rows, cols, placeholder, required: true });
}

function createErrorSpan(id) {
    return createElement("span", null, "error", { id, style: "color: red;" });
}

function createButton(type, textContent, attributes = {}) {
    return createElement("button", textContent, null, { type, ...attributes });
}

function addFormValidation(nameInput, nameError, emailInput, emailError, confirmCheckbox, confirmError, submitBtn, form) {
    // Validate Name
    const validateName = () => {
        const nameValue = nameInput.value.trim();
    
        if (nameValue === '') {
            nameError.textContent = '';
            return false;
        } else if (!/^[a-zA-Z\s]+$/.test(nameValue)) {
            nameError.textContent = 'Name cannot contain numbers or special characters.';
            return false;
        } else {
            nameError.textContent = '';
            return true;
        }
    };
    

    // Validate Email
    const validateEmail = () => {
        const isValid = /@/.test(emailInput.value) && /\./.test(emailInput.value);
        emailError.textContent = isValid ? '' : 'Invalid email format.';
        return isValid;
    };

    // Validate Confirmation Checkbox
    const validateConfirm = () => {
        const isValid = confirmCheckbox.checked;
        confirmError.textContent = isValid ? '' : 'Please confirm!';
        return isValid;
    };

    // Enable or Disable Submit Button
    const enableSubmit = () => {
        submitBtn.disabled = !(validateName() && validateEmail() && validateConfirm());
    };

    // Show error only when input is invalid after the user interacts with the field
    nameInput.addEventListener("input", function () {
        if (nameInput.value.trim() !== '' && isNaN(nameInput.value)) {
            nameError.style.display = 'none';  // Hide error while typing
        } else {
            nameError.style.display = 'block'; // Show error if invalid
        }
        enableSubmit();
    });

    // Validate and enable/disable submit button
    emailInput.addEventListener("input", enableSubmit);
    confirmCheckbox.addEventListener("change", enableSubmit);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!submitBtn.disabled) {
            submitBtn.disabled = true;
            setTimeout(() => {
                alert("Form submitted successfully!");
                form.reset();
                enableSubmit();
            }, 1000);
        }
    });

    // Highlight the current page link in the navigation
    function highlightCurrentPage() {
        const path = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll("a").forEach((link) => {
            if (link.getAttribute("href") === path) {
                link.style.backgroundColor = "rgb(0, 140, 255)";
                link.style.color = "white";
                link.style.fontWeight = "bold";
                link.style.borderRadius = "5px";
                link.style.padding = "10px";
            } else {
                link.style.backgroundColor = "";
                link.style.color = "";
                link.style.fontWeight = "";
            }
        });
    }

    // Initialize the form validation
    enableSubmit();
    highlightCurrentPage();
}
