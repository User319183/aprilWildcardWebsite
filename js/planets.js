const planets = [
	{
		name: "Mercury",
		description: "The smallest and innermost planet in the Solar System.",
		distance: "57.9 million km",
		diameter: "4,879 km",
	},
	{
		name: "Venus",
		description:
			"Second planet from the Sun and Earth's closest planetary neighbor.",
		distance: "108.2 million km",
		diameter: "12,104 km",
	},
];

function createPlanetCards() {
	const planetGrid = document.getElementById("planetGrid");

	planets.forEach((planet) => {
		const card = document.createElement("div");
		card.className = "col-md-6 col-lg-4";
		card.innerHTML = `
            <div class="planet-card">
                <h3>${planet.name}</h3>
                <p>${planet.description}</p>
                <div class="planet-stats">
                    <p>Distance from Sun: ${planet.distance}</p>
                    <p>Diameter: ${planet.diameter}</p>
                </div>
            </div>
        `;
		planetGrid.appendChild(card);
	});
}

document.addEventListener("DOMContentLoaded", createPlanetCards);
