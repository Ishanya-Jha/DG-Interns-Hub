// =========================
// GAME DATA
// =========================

const games = [
    {
        id: 1,
        name: "Cyber Strike",
        category: "Action",
        image: "images/game1.jpg",
        description:
            "Enter a futuristic battlefield and fight your way through intense action-packed missions."
    },

    {
        id: 2,
        name: "Speed Legends",
        category: "Racing",
        image: "images/game2.jpg",
        description:
            "Race against skilled opponents, master challenging tracks and become a racing legend."
    },

    {
        id: 3,
        name: "Shadow Quest",
        category: "Adventure",
        image: "images/game3.jpg",
        description:
            "Explore mysterious environments, discover hidden secrets and complete exciting quests."
    },

    {
        id: 4,
        name: "Battle Arena",
        category: "Fighting",
        image: "images/game4.jpg",
        description:
            "Enter the arena and compete in fast-paced battles against powerful opponents."
    },

    {
        id: 5,
        name: "Galaxy Warriors",
        category: "Space",
        image: "images/game5.jpg",
        description:
            "Travel across the galaxy, battle enemy forces and defend the universe from danger."
    },

    {
        id: 6,
        name: "Mystic Worlds",
        category: "Fantasy",
        image: "images/game6.jpg",
        description:
            "Explore a magical world filled with mysteries, challenges and unforgettable adventures."
    }
];


// =========================
// GET HTML ELEMENTS
// =========================

const gamesContainer = document.getElementById("gamesContainer");

const searchInput = document.getElementById("searchInput");

const detailName = document.getElementById("detailName");

const detailDescription =
    document.getElementById("detailDescription");

const detailCategory =
    document.getElementById("detailCategory");


// =========================
// DISPLAY GAMES
// =========================

function displayGames(gameList) {

    gamesContainer.innerHTML = "";

    if (gameList.length === 0) {

        gamesContainer.innerHTML = `
            <p style="grid-column: 1 / -1; text-align: center; color: #888;">
                No games found.
            </p>
        `;

        return;
    }


    gameList.forEach(function (game) {

        const card = document.createElement("div");

        card.className = "game-card";

        card.innerHTML = `
            <img
                src="${game.image}"
                alt="${game.name}"
            >

            <div class="game-card-content">

                <h3>${game.name}</h3>

                <p class="game-category">
                    ${game.category}
                </p>

                <div class="game-card-buttons">

                    <button
                        class="play-button"
                        onclick="startGame('${game.name}')"
                    >
                        ▶ Play
                    </button>

                    <button
                        class="details-button"
                        onclick="showGameDetails(${game.id})"
                    >
                        Details
                    </button>

                </div>

            </div>
        `;

        gamesContainer.appendChild(card);
    });
}


// =========================
// PLAY BUTTON
// =========================

function startGame(gameName) {

    alert("Game is starting...");

    console.log("Starting game:", gameName);
}


// =========================
// GAME DETAILS
// =========================

function showGameDetails(gameId) {

    const game = games.find(function (item) {

        return item.id === gameId;

    });


    if (!game) {
        return;
    }


    detailName.textContent = game.name;

    detailDescription.textContent =
        game.description;

    detailCategory.textContent =
        game.category;


    document.getElementById("gameDetails").scrollIntoView({
        behavior: "smooth"
    });
}


// =========================
// SEARCH FEATURE
// =========================

searchInput.addEventListener("input", function () {

    const searchText =
        searchInput.value.toLowerCase().trim();


    const filteredGames = games.filter(function (game) {

        return (
            game.name.toLowerCase().includes(searchText) ||
            game.category.toLowerCase().includes(searchText)
        );

    });


    displayGames(filteredGames);
});


// =========================
// INITIAL DISPLAY
// =========================

displayGames(games);
