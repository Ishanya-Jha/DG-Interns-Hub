const API_BASE_URL = "http://localhost:5000/api";

/* =========================
   COMMON FUNCTIONS
========================= */

function getToken() {
    return localStorage.getItem("token");
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

function showMessage(element, message, type = "error") {
    if (!element) return;

    element.textContent = message;
    element.className = `message ${type}`;
}

function requireAuthentication() {
    const token = getToken();

    if (!token) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}


/* =========================
   SIGNUP
========================= */

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;

        const message = document.getElementById("signupMessage");

        if (name.length < 2 || name.length > 50) {
            showMessage(
                message,
                "Name must be between 2 and 50 characters."
            );
            return;
        }

        if (password.length < 6) {
            showMessage(
                message,
                "Password must be at least 6 characters."
            );
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showMessage(
                    message,
                    data.message || "Signup failed."
                );
                return;
            }

            showMessage(
                message,
                "Account created successfully. Redirecting to login...",
                "success"
            );

            signupForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);

        } catch (error) {
            showMessage(
                message,
                "Unable to connect to the server."
            );
        }
    });
}


/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showMessage(
                    message,
                    data.message || "Invalid email or password."
                );
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            showMessage(
                message,
                "Login successful. Redirecting...",
                "success"
            );

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 700);

        } catch (error) {
            showMessage(
                message,
                "Unable to connect to the server."
            );
        }
    });
}


/* =========================
   USER PROFILE
========================= */

async function loadProfile() {
    if (!requireAuthentication()) return;

    const token = getToken();

    try {
        const response = await fetch(
            `${API_BASE_URL}/users/profile`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }

            throw new Error(data.message || "Unable to load profile.");
        }

        const user = data.user;

        document.getElementById("userName").textContent =
            user.name;

        document.getElementById("userEmail").textContent =
            user.email;

        document.getElementById("userRole").textContent =
            user.role;

        document.getElementById("welcomeName").textContent =
            user.name;

        if (user.createdAt) {
            document.getElementById("userCreated").textContent =
                new Date(user.createdAt).toLocaleDateString();
        }

        if (user.role === "admin") {
            const adminLink =
                document.getElementById("adminLink");

            if (adminLink) {
                adminLink.classList.remove("hidden");
            }
        }

        localStorage.setItem(
            "user",
            JSON.stringify({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            })
        );

    } catch (error) {
        const message =
            document.getElementById("dashboardMessage");

        showMessage(
            message,
            error.message || "Unable to load profile."
        );
    }
}


/* =========================
   ADMIN USER LIST
========================= */

let allUsers = [];

async function loadUsers() {
    if (!requireAuthentication()) return;

    const token = getToken();

    try {
        const response = await fetch(
            `${API_BASE_URL}/users/admin/users`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }

            if (response.status === 403) {
                showMessage(
                    document.getElementById("adminMessage"),
                    "Access denied. Admin privileges required."
                );
                return;
            }

            throw new Error(
                data.message || "Unable to load users."
            );
        }

        allUsers = data.users || [];

        const count =
            document.getElementById("userCount");

        if (count) {
            count.textContent = allUsers.length;
        }

        renderUsers(allUsers);

    } catch (error) {
        showMessage(
            document.getElementById("adminMessage"),
            error.message || "Unable to load users."
        );
    }
}


/* =========================
   RENDER USERS
========================= */

function renderUsers(users) {
    const usersList =
        document.getElementById("usersList");

    if (!usersList) return;

    usersList.textContent = "";

    if (users.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.textContent = "No users found.";
        emptyMessage.style.color = "#64748b";

        usersList.appendChild(emptyMessage);
        return;
    }

    users.forEach((user) => {

        const row = document.createElement("div");
        row.className = "user-row";

        const info = document.createElement("div");
        info.className = "user-info";

        const name = document.createElement("h3");
        name.textContent = user.name;

        const email = document.createElement("p");
        email.textContent = user.email;

        info.appendChild(name);
        info.appendChild(email);

        const meta = document.createElement("div");
        meta.className = "user-meta";

        const role = document.createElement("span");
        role.className = "user-role";
        role.textContent = user.role;

        const deleteButton =
            document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteUser(user._id, user.name);
        });

        meta.appendChild(role);
        meta.appendChild(deleteButton);

        row.appendChild(info);
        row.appendChild(meta);

        usersList.appendChild(row);
    });
}


/* =========================
   SEARCH USERS
========================= */

const searchUsers =
    document.getElementById("searchUsers");

if (searchUsers) {
    searchUsers.addEventListener("input", () => {

        const searchTerm =
            searchUsers.value.trim().toLowerCase();

        const filteredUsers = allUsers.filter((user) => {

            const name =
                String(user.name || "").toLowerCase();

            const email =
                String(user.email || "").toLowerCase();

            const role =
                String(user.role || "").toLowerCase();

            return (
                name.includes(searchTerm) ||
                email.includes(searchTerm) ||
                role.includes(searchTerm)
            );
        });

        renderUsers(filteredUsers);
    });
}


/* =========================
   DELETE USER
========================= */

async function deleteUser(userId, userName) {

    const confirmed = window.confirm(
        `Delete user "${userName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    const token = getToken();

    try {
        const response = await fetch(
            `${API_BASE_URL}/users/admin/users/${userId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }

            throw new Error(
                data.message || "Unable to delete user."
            );
        }

        showMessage(
            document.getElementById("adminMessage"),
            "User deleted successfully.",
            "success"
        );

        await loadUsers();

    } catch (error) {
        showMessage(
            document.getElementById("adminMessage"),
            error.message || "Unable to delete user."
        );
    }
}


/* =========================
   LOGOUT
========================= */

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

const adminLogoutBtn =
    document.getElementById("adminLogoutBtn");

if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", logout);
}


/* =========================
   PAGE INITIALIZATION
========================= */

if (
    document.getElementById("userName") &&
    document.getElementById("userEmail")
) {
    loadProfile();
}

if (document.getElementById("usersList")) {
    loadUsers();
}