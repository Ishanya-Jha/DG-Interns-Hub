/* =========================================================
   ISHANYA JHA - PORTFOLIO JAVASCRIPT
   Week 2 Web Development Internship

   JavaScript Features:
   1. Furnisher's automatic image slider
   2. Interactive slider dots
   3. Contact form validation
   4. Form submission message
========================================================= */


/* =========================================================
   1. FURNISHER'S PROJECT IMAGE SLIDER
========================================================= */

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let currentSlide = 0;


/* Show a specific slide */

function showSlide(index) {

    if (slides.length === 0) {
        return;
    }

    slides.forEach(function (slide) {

        slide.classList.remove("active");

    });


    dots.forEach(function (dot) {

        dot.classList.remove("active");

    });


    slides[index].classList.add("active");


    if (dots[index]) {

        dots[index].classList.add("active");

    }

}


/* Move to the next screenshot */

function nextSlide() {

    currentSlide++;

    if (currentSlide >= slides.length) {

        currentSlide = 0;

    }

    showSlide(currentSlide);

}


/* Automatically change screenshot every 3 seconds */

if (slides.length > 0) {

    setInterval(nextSlide, 3000);

}


/* =========================================================
   2. CLICKABLE SLIDER DOTS
========================================================= */

dots.forEach(function (dot, index) {

    dot.addEventListener("click", function () {

        currentSlide = index;

        showSlide(currentSlide);

    });

});


/* =========================================================
   3. CONTACT FORM VALIDATION
========================================================= */

const contactForm = document.querySelector("form");


if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();


        /* Get form values */

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const subject =
            document.getElementById("subject").value.trim();

        const message =
            document.getElementById("message").value.trim();


        /* =================================================
           BASIC VALIDATION
        ================================================= */

        if (name === "") {

            alert("Please enter your full name.");

            return;

        }


        if (email === "") {

            alert("Please enter your email address.");

            return;

        }


        if (!email.includes("@") || !email.includes(".")) {

            alert("Please enter a valid email address.");

            return;

        }


        if (phone === "") {

            alert("Please enter your phone number.");

            return;

        }


        if (subject === "") {

            alert("Please enter a subject.");

            return;

        }


        if (message === "") {

            alert("Please enter your message.");

            return;

        }


        /* =================================================
           SUCCESS MESSAGE
        ================================================= */

        alert(
            "Thank you, " +
            name +
            "! Your message has been submitted successfully."
        );


        /* Clear the form */

        contactForm.reset();

    });

}


/* =========================================================
   4. PAGE LOAD MESSAGE
========================================================= */

console.log(
    "Ishanya Jha Portfolio loaded successfully."
);
