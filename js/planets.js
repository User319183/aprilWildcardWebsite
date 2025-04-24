const planets = [
	{
		name: "Mercury",
		description: "The smallest and innermost planet in the Solar System.",
		distance: "57.9 million km",
		diameter: "4,879 km",
		orbitalPeriod: "88 days",
		funFact: "Despite being closest to the Sun, it's not the hottest planet.",
		color: 0x8c8c8c,
		textureUrl:
			"https://space-assets-1.cdn.spotlightvisuals.com/mercury-4k.jpg",
		ring: false,
	},
	{
		name: "Venus",
		description:
			"Second planet from the Sun and Earth's closest planetary neighbor.",
		distance: "108.2 million km",
		diameter: "12,104 km",
		orbitalPeriod: "225 days",
		funFact: "Its thick atmosphere traps heat, making it the hottest planet.",
		color: 0xe6c35c,
		textureUrl: "https://space-assets-1.cdn.spotlightvisuals.com/venus-4k.jpg",
		ring: false,
	},
	{
		name: "Earth",
		description:
			"Our home planet and the only known celestial body to support life.",
		distance: "149.6 million km",
		diameter: "12,742 km",
		orbitalPeriod: "365.25 days",
		funFact: "71% of Earth's surface is covered by water.",
		color: 0x2268b3,
		textureUrl: "https://space-assets-1.cdn.spotlightvisuals.com/earth-4k.jpg",
		ring: false,
	},
	{
		name: "Mars",
		description:
			"The fourth planet from the Sun, often called the 'Red Planet'.",
		distance: "227.9 million km",
		diameter: "6,779 km",
		orbitalPeriod: "687 days",
		funFact: "Has the largest volcano in the solar system: Olympus Mons.",
		color: 0xc65831,
		textureUrl: "https://space-assets-1.cdn.spotlightvisuals.com/mars-4k.jpg",
		ring: false,
	},
	{
		name: "Jupiter",
		description: "The largest planet in our Solar System and a gas giant.",
		distance: "778.5 million km",
		diameter: "139,820 km",
		orbitalPeriod: "11.9 years",
		funFact:
			"Has a storm called the Great Red Spot that has been raging for over 300 years.",
		color: 0xd8ca9d,
		textureUrl:
			"https://space-assets-1.cdn.spotlightvisuals.com/jupiter-4k.jpg",
		ring: false,
	},
	{
		name: "Saturn",
		description: "Famous for its spectacular ring system made of ice and rock.",
		distance: "1.4 billion km",
		diameter: "116,460 km",
		orbitalPeriod: "29.5 years",
		funFact:
			"Its density is so low that it would float in water if there were an ocean large enough.",
		color: 0xead6b8,
		textureUrl: "https://space-assets-1.cdn.spotlightvisuals.com/saturn-4k.jpg",
		ring: true,
	},
	{
		name: "Uranus",
		description:
			"An ice giant that rotates on its side, giving it extreme seasons.",
		distance: "2.9 billion km",
		diameter: "50,724 km",
		orbitalPeriod: "84 years",
		funFact:
			"Unlike other planets, it rotates on its side like a rolling barrel.",
		color: 0x9db8d9,
		textureUrl: "https://space-assets-1.cdn.spotlightvisuals.com/uranus-4k.jpg",
		ring: true,
		tilt: Math.PI / 2, // 90-degree tilt
	},
	{
		name: "Neptune",
		description:
			"The windiest planet with the strongest measured winds in the Solar System.",
		distance: "4.5 billion km",
		diameter: "49,244 km",
		orbitalPeriod: "165 years",
		funFact:
			"Has a dark storm similar to Jupiter's Great Red Spot called the Great Dark Spot.",
		color: 0x3e54e8,
		textureUrl:
			"https://space-assets-1.cdn.spotlightvisuals.com/neptune-4k.jpg",
		ring: false,
	},
];

// Planet 3D Viewer class
class PlanetViewer {
	constructor(container) {
		this.container = container;
		this.scene = null;
		this.camera = null;
		this.renderer = null;
		this.controls = null;
		this.planet = null;
		this.ring = null;
		this.animationFrameId = null;

		this.init();
	}

	init() {
		// Create scene
		this.scene = new THREE.Scene();

		// Set up camera
		const width = this.container.clientWidth;
		const height = this.container.clientHeight;
		this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
		this.camera.position.z = 5;

		// Set up renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(width, height);
		this.renderer.setClearColor(0x000000, 0);
		this.container.appendChild(this.renderer.domElement);

		// Add lighting
		const ambientLight = new THREE.AmbientLight(0x404040, 2);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
		directionalLight.position.set(5, 3, 5);
		this.scene.add(ambientLight, directionalLight);

		// Set up controls
		this.controls = new THREE.OrbitControls(
			this.camera,
			this.renderer.domElement
		);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.05;

		// Handle resize
		window.addEventListener("resize", () => this.onWindowResize());
	}

	loadPlanet(planetData) {
		// Clear previous planet if exists
		if (this.planet) {
			this.scene.remove(this.planet);
		}
		if (this.ring) {
			this.scene.remove(this.ring);
		}

		// Cancel previous animation if running
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
		}

		// Create planet geometry
		const geometry = new THREE.SphereGeometry(1, 64, 64);
		let material;

		// Try to load texture if available, fallback to color
		if (planetData.textureUrl) {
			const textureLoader = new THREE.TextureLoader();
			textureLoader.load(
				planetData.textureUrl,
				(texture) => {
					material = new THREE.MeshStandardMaterial({
						map: texture,
					});
					this.planet.material = material;
				},
				undefined,
				() => {
					// Fallback on texture load error
					material = new THREE.MeshStandardMaterial({
						color: planetData.color,
					});
					this.planet.material = material;
				}
			);

			// Temporary material while loading
			material = new THREE.MeshStandardMaterial({
				color: planetData.color,
			});
		} else {
			material = new THREE.MeshStandardMaterial({
				color: planetData.color,
			});
		}

		// Create planet mesh
		this.planet = new THREE.Mesh(geometry, material);

		// Apply tilt if specified
		if (planetData.tilt) {
			this.planet.rotation.x = planetData.tilt;
		}

		// Add planet to scene
		this.scene.add(this.planet);

		// Add rings for Saturn and Uranus
		if (planetData.ring) {
			const ringGeometry = new THREE.RingGeometry(1.4, 2.5, 64);
			const ringMaterial = new THREE.MeshBasicMaterial({
				color: 0xf8e9c8,
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.8,
			});
			this.ring = new THREE.Mesh(ringGeometry, ringMaterial);
			this.ring.rotation.x = Math.PI / 2;
			this.scene.add(this.ring);

			// Apply tilt to ring if planet has tilt
			if (planetData.tilt) {
				this.ring.rotation.x += planetData.tilt;
			}
		}

		// Start the animation loop
		this.animate();
	}

	animate() {
		this.animationFrameId = requestAnimationFrame(() => this.animate());

		// Rotate planet
		if (this.planet) {
			this.planet.rotation.y += 0.005;
		}

		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}

	onWindowResize() {
		const width = this.container.clientWidth;
		const height = this.container.clientHeight;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	}
}

function createPlanetCards() {
	const planetGrid = document.getElementById("planetGrid");

	planets.forEach((planet) => {
		const card = document.createElement("div");
		card.className = "col-md-6 col-lg-3";
		card.innerHTML = `
            <div class="planet-card" data-planet="${planet.name.toLowerCase()}">
                <div class="planet-preview"></div>
                <h3>${planet.name}</h3>
                <p>${planet.description}</p>
                <button class="btn btn-outline-light btn-sm mt-2">Explore</button>
            </div>
        `;
		planetGrid.appendChild(card);

		// Add click event listener
		card.querySelector("button").addEventListener("click", () => {
			showPlanetDetails(planet);
		});

		// Create small preview of planet
		createPlanetPreview(card.querySelector(".planet-preview"), planet);
	});
}

function createPlanetPreview(container, planetData) {
	// Mini version of planet for card preview
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

	renderer.setSize(100, 100);
	renderer.setClearColor(0x000000, 0);
	container.appendChild(renderer.domElement);

	// Lighting
	const ambientLight = new THREE.AmbientLight(0x404040, 2);
	const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
	directionalLight.position.set(5, 3, 5);
	scene.add(ambientLight, directionalLight);

	// Create planet with basic color (no texture for preview)
	const geometry = new THREE.SphereGeometry(0.8, 32, 32);
	const material = new THREE.MeshStandardMaterial({ color: planetData.color });
	const planet = new THREE.Mesh(geometry, material);
	scene.add(planet);

	// Add rings if needed
	if (planetData.ring) {
		const ringGeometry = new THREE.RingGeometry(1.2, 1.8, 32);
		const ringMaterial = new THREE.MeshBasicMaterial({
			color: 0xf8e9c8,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.8,
		});
		const ring = new THREE.Mesh(ringGeometry, ringMaterial);
		ring.rotation.x = Math.PI / 2;
		scene.add(ring);

		if (planetData.tilt) {
			planet.rotation.x = planetData.tilt;
			ring.rotation.x += planetData.tilt;
		}
	}

	// Position camera
	camera.position.z = 2;

	// Animation function
	function animate() {
		requestAnimationFrame(animate);
		planet.rotation.y += 0.01;
		renderer.render(scene, camera);
	}

	animate();
}

function showPlanetDetails(planet) {
	// Set modal title
	document.getElementById("planetModalTitle").textContent = planet.name;

	// Fill planet info
	document.getElementById("planetInfo").innerHTML = `
        <h4>${planet.name}</h4>
        <p>${planet.description}</p>
        <ul class="list-unstyled">
            <li><strong>Distance from Sun:</strong> ${planet.distance}</li>
            <li><strong>Diameter:</strong> ${planet.diameter}</li>
            <li><strong>Orbital Period:</strong> ${planet.orbitalPeriod}</li>
        </ul>
        <div class="fun-fact">
            <h5>Fun Fact</h5>
            <p>${planet.funFact}</p>
        </div>
    `;

	// Initialize or update 3D planet viewer
	const container = document.getElementById("planetViewer");

	// Clear any existing content
	container.innerHTML = "";

	// Show the modal
	const planetModal = document.getElementById("planetModal");
	const modalInstance = new bootstrap.Modal(planetModal);

	// Create a reference to the planet data for use in the event handler
	planetModal._planetData = planet;

	// Listen for the 'shown.bs.modal' event, (which should fire when the modal is fully visible)
	planetModal.addEventListener(
		"shown.bs.modal",
		function () {
			// Initialize new viewer with the selected planet after modal is visible
			const viewer = new PlanetViewer(container);
			viewer.loadPlanet(planetModal._planetData);

			// Force a resize to ensure proper rendering
			viewer.onWindowResize();
		},
		{ once: true }
	); // Use once option to ensure this only happens once per modal opening

	modalInstance.show();
}

document.addEventListener("DOMContentLoaded", createPlanetCards);
