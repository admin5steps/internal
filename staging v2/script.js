const toggle = document.querySelector("[data-menu-toggle]");
const links = document.querySelector("[data-nav-links]");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const contactForm = document.querySelector("[data-contact-form]");
const message = document.querySelector("[data-form-message]");

if (contactForm && message) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    message.classList.add("show");
    contactForm.reset();
  });
}
