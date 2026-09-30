const API_URL = "http://localhost:5000/api";

// SIGNUP
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            message.textContent = data.message;

            if (response.ok) {
                message.className = "success";

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);
            } else {
                message.className = "error";
            }

        } catch (error) {
            message.textContent = "Unable to connect to server.";
            message.className = "error";
        }
    });
}


// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            message.textContent = data.message;

            if (response.ok) {
                message.className = "success";

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 800);

            } else {
                message.className = "error";
            }

        } catch (error) {
            message.textContent = "Unable to connect to server.";
            message.className = "error";
        }
    });
}


// DASHBOARD
if (window.location.pathname.includes("dashboard.html")) {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        window.location.href = "login.html";
    } else {
        document.getElementById("welcome").textContent =
            `Welcome, ${user.name}`;
    }
}


// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    });
}