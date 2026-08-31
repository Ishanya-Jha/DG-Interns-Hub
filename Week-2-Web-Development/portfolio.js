// =========================
// WELCOME MESSAGE
// =========================

window.addEventListener("load", function () {
    console.log("Portfolio website loaded successfully.");
});

const welcomeButton = document.getElementById("welcomeButton");

if (welcomeButton) {
    welcomeButton.addEventListener("click", function () {
        alert("Welcome to Ishanya Jha's Portfolio!");
    });
}
// =========================
// CONTACT FORM VALIDATION
// =========================

const form = document.querySelector("form");

if (form) {
    form.addEventListener("submit", function (event) {

        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const message = document.getElementById("message");

        if (
            name.value.trim() === "" ||
            email.value.trim() === "" ||
            message.value.trim() === ""
        ) {
            event.preventDefault();

            alert("Please fill in your name, email and message before submitting.");
            return;
        }

        alert("Thank you! Your message has been submitted.");
    });
}


// =========================
// NAVIGATION CLICK EFFECT
// =========================

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.forEach(function (item) {
            item.style.background = "";
            item.style.color = "";
        });

        this.style.background = "#dbeafe";
        this.style.color = "#1d4ed8";
    });

});
