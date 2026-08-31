/* ==============================
   PORTFOLIO JAVASCRIPT
   ============================== */


/* ==============================
   BUTTON CLICK FEATURE
   ============================== */

const welcomeButton = document.createElement("button");

welcomeButton.textContent = "Welcome";

welcomeButton.addEventListener("click", function () {
    alert("Welcome to Ishanya Jha's Portfolio!");
});

const homeSection = document.getElementById("home");

if (homeSection) {
    homeSection.appendChild(welcomeButton);
}


/* ==============================
   CONTACT FORM VALIDATION
   ============================== */

const contactForm = document.querySelector("#contact form");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (name === "" || email === "" || message === "") {

            event.preventDefault();

            alert("Please fill in your name, email and message.");

            return;
        }

        alert("Thank you! Your message has been submitted.");
    });
}


/* ==============================
   CURRENT YEAR IN FOOTER
   ============================== */

const footerText = document.querySelector("footer p");

if (footerText) {
    footerText.innerHTML =
        "&copy; " + new Date().getFullYear() +
        " Ishanya Jha. All rights reserved.";
}
