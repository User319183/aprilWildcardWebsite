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
        categories: ["rocky"],
        atmosphere: 0,
        temperature: "430°C (day) to -180°C (night)",
        surfaceFeature: "Heavily cratered terrain"
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
        categories: ["rocky"],
        atmosphere: 90,
        temperature: "462°C (constantly)",
        surfaceFeature: "Volcanic plains and highlands"
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
        categories: ["rocky"],
        atmosphere: 70,
        temperature: "15°C (average)",
        surfaceFeature: "Oceans, continents, and polar ice caps"
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
        categories: ["rocky"],
        atmosphere: 10,
        temperature: "-63°C (average)",
        surfaceFeature: "Vast canyons and dusty terrain"
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
        categories: ["gas"],
        atmosphere: 100,
        temperature: "-145°C (cloud top)",
        surfaceFeature: "Bands of clouds and the Great Red Spot"
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
        categories: ["gas", "ring"],
        atmosphere: 100,
        temperature: "-178°C (average)",
        surfaceFeature: "Distinctive ring system with thousands of bands"
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
        categories: ["ice", "ring"],
        atmosphere: 95,
        temperature: "-224°C (average)",
        surfaceFeature: "Bland blue-green atmosphere with subtle cloud bands"
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
        categories: ["ice"],
        atmosphere: 95,
        temperature: "-214°C (average)",
        surfaceFeature: "Deep blue color with visible storm systems"
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
		this.stars = null;
		this.animationFrameId = null;
		this.isRotating = true;

		// Add reference to instance
		this.container.viewer = this;

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

		// Create starfield background
		this.createStarfield();

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
		this.dampingFactor = 0.05;
		this.controls.enableZoom = true;

		// Handle resize
		window.addEventListener("resize", () => this.onWindowResize());
        
		// Setup control buttons
		this.setupControls();
	}

	createStarfield() {
		// Create a starfield background
		const starGeometry = new THREE.BufferGeometry();
		const starMaterial = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 0.05,
			transparent: true
		});

		const starVertices = [];
		for (let i = 0; i < 1000; i++) {
			const x = (Math.random() - 0.5) * 100;
			const y = (Math.random() - 0.5) * 100;
			const z = (Math.random() - 0.5) * 100;
			starVertices.push(x, y, z);
		}

		starGeometry.setAttribute('position', 
			new THREE.Float32BufferAttribute(starVertices, 3));

		this.stars = new THREE.Points(starGeometry, starMaterial);
		this.scene.add(this.stars);
	}

	setupControls() {
		const rotateToggle = document.getElementById('rotateToggle');
		const zoomIn = document.getElementById('zoomIn');
		const zoomOut = document.getElementById('zoomOut');
		const resetView = document.getElementById('resetView');

		if (rotateToggle) {
			rotateToggle.addEventListener('click', () => {
				this.isRotating = !this.isRotating;
				rotateToggle.classList.toggle('active');
			});
		}

		if (zoomIn) {
			zoomIn.addEventListener('click', () => {
				this.camera.position.z *= 0.8;
			});
		}

		if (zoomOut) {
			zoomOut.addEventListener('click', () => {
				this.camera.position.z *= 1.2;
			});
		}

		if (resetView) {
			resetView.addEventListener('click', () => {
				this.camera.position.set(0, 0, 5);
				this.camera.lookAt(0, 0, 0);
				this.controls.reset();
			});
		}
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
						roughness: 0.8,
						metalness: 0.1,
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
                roughness: 0.8,
                metalness: 0.1
			});
		} else {
			material = new THREE.MeshStandardMaterial({
				color: planetData.color,
                roughness: 0.8,
                metalness: 0.1
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

		// Add atmospheric glow effect for planets with atmosphere
		if (planetData.atmosphere > 0) {
			this.addAtmosphereGlow(planetData);
		}

		// Add rings for Saturn and Uranus
		if (planetData.ring) {
            // More detailed ring for Saturn
            if (planetData.name === "Saturn") {
                const innerRadius = 1.4;
                const outerRadius = 2.5;
                const segments = 64;
                
                // Create multiple rings for more detail
                for (let i = 0; i < 3; i++) {
                    const ringGeometry = new THREE.RingGeometry(
                        innerRadius + i * 0.2, 
                        innerRadius + 0.15 + i * 0.2, 
                        segments
                    );
                    
                    const ringMaterial = new THREE.MeshBasicMaterial({
                        color: i === 1 ? 0xd6b879 : 0xf8e9c8,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.7 - i * 0.15
                    });
                    
                    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                    ring.rotation.x = Math.PI / 2;
                    
                    if (planetData.tilt) {
                        ring.rotation.x += planetData.tilt;
                    }
                    
                    this.scene.add(ring);
                }
                
                // Wide outer ring
                const outerRingGeometry = new THREE.RingGeometry(
                    outerRadius - 0.3, 
                    outerRadius, 
                    segments
                );
                
                const outerRingMaterial = new THREE.MeshBasicMaterial({
                    color: 0xf8e9c8,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.4
                });
                
                this.ring = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
                this.ring.rotation.x = Math.PI / 2;
                
                if (planetData.tilt) {
                    this.ring.rotation.x += planetData.tilt;
                }
                
                this.scene.add(this.ring);
            } else {
                // Regular ring for other planets (like Uranus)
                const ringGeometry = new THREE.RingGeometry(1.4, 2.0, 64);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0xf8e9c8,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.7
                });
                this.ring = new THREE.Mesh(ringGeometry, ringMaterial);
                this.ring.rotation.x = Math.PI / 2;
                
                if (planetData.tilt) {
                    this.ring.rotation.x += planetData.tilt;
                }
                
                this.scene.add(this.ring);
            }
		}

		// Start the animation loop
		this.animate();
	}

	addAtmosphereGlow(planetData) {
        // Adapted atmosphere properties based on the planet type
        const atmosphereColor = 
            planetData.categories.includes('rocky') ? 0x6f9eff : 
            planetData.categories.includes('gas') ? 0xffedbc : 
            0xadefff; // ice giants
            
        const atmosphereSize = 1.05 + (planetData.atmosphere / 100) * 0.12;
        const atmosphereOpacity = 0.15 + (planetData.atmosphere / 100) * 0.3;

		// A glow effect using a slightly larger sphere with a translucent shader
		const glowGeometry = new THREE.SphereGeometry(atmosphereSize, 32, 32);
		const glowMaterial = new THREE.MeshBasicMaterial({
			color: atmosphereColor,
			transparent: true,
			opacity: atmosphereOpacity,
			side: THREE.BackSide
		});

		const atmosphereGlow = new THREE.Mesh(glowGeometry, glowMaterial);
		this.scene.add(atmosphereGlow);

        // For planets with tilt
        if (planetData.tilt) {
            atmosphereGlow.rotation.x = planetData.tilt;
        }
	}

	animate() {
		this.animationFrameId = requestAnimationFrame(() => this.animate());

		// Rotate planet if enabled
		if (this.planet && this.isRotating) {
			this.planet.rotation.y += 0.005;

            // Rotate stars slowly in the opposite direction for parallax effect
            if (this.stars) {
                this.stars.rotation.y -= 0.0005;
            }
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

	planets.forEach((planet, index) => {
		const card = document.createElement("div");
		card.className = "col-12 col-sm-6 col-md-4 col-lg-3 planet-card-container";
        card.style.animationDelay = `${index * 0.1}s`;
        
		// Add data attributes for filtering
		const categoryClasses = planet.categories.join(' ');
		
		card.innerHTML = `
            <div class="planet-card h-100" data-planet="${planet.name.toLowerCase()}" data-categories="${categoryClasses}">
                <div class="planet-preview"></div>
                <h3 class="mt-3">${planet.name}</h3>
                <p class="flex-grow-1">${planet.description}</p>
                <div class="d-grid gap-2 mt-auto">
                    <button class="btn btn-outline-light btn-sm">Explore</button>
                </div>
            </div>
        `;
		planetGrid.appendChild(card);

		// Add click event listener
		card.querySelector('button').addEventListener('click', () => {
			showPlanetDetails(planet);
		});

        // Make entire card clickable
        card.querySelector('.planet-card').addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                showPlanetDetails(planet);
            }
        });

		// Create small preview of planet
		createPlanetPreview(card.querySelector('.planet-preview'), planet);
	});

	// Add planet search functionality
	const searchInput = document.getElementById('planetSearch');
	if (searchInput) {
		searchInput.addEventListener('input', function () {
			const searchTerm = this.value.toLowerCase();
			filterPlanets('search', searchTerm);
		});
	}
    
    // Add filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Apply filter
                const filter = this.getAttribute('data-filter');
                filterPlanets('category', filter);
            });
        });
    }
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

	// Create planet with texture this time
	const geometry = new THREE.SphereGeometry(0.8, 32, 32);
	let material;

	if (planetData.textureUrl) {
		const textureLoader = new THREE.TextureLoader();
		textureLoader.load(
			planetData.textureUrl,
			(texture) => {
				material = new THREE.MeshStandardMaterial({
					map: texture,
					roughness: 0.8, 
					metalness: 0.1
				});
				planet.material = material;
			},
			undefined,
			() => {
				material = new THREE.MeshStandardMaterial({
					color: planetData.color
				});
				planet.material = material;
			}
		);

		// Temporary material while loading
		material = new THREE.MeshStandardMaterial({
			color: planetData.color
		});
	} else {
		material = new THREE.MeshStandardMaterial({
			color: planetData.color
		});
	}

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

	// Fill planet info with enhanced data
	document.getElementById("planetInfo").innerHTML = `
        <h4>${planet.name}</h4>
        <p class="planet-description">${planet.description}</p>
        
        <div class="planet-stats">
            <div class="planet-stat-item">
                <div class="stat-value">${planet.diameter}</div>
                <div class="stat-label">Diameter</div>
            </div>
            <div class="planet-stat-item">
                <div class="stat-value">${planet.distance}</div>
                <div class="stat-label">From Sun</div>
            </div>
            <div class="planet-stat-item">
                <div class="stat-value">${planet.orbitalPeriod}</div>
                <div class="stat-label">Orbit</div>
            </div>
            <div class="planet-stat-item">
                <div class="stat-value">${planet.temperature}</div>
                <div class="stat-label">Temperature</div>
            </div>
        </div>
        
        ${planet.atmosphere > 0 ? `
            <div class="mt-4">
                <h5>Atmosphere Density</h5>
                <div class="atmosphere-bar">
                    <div class="atmosphere-fill" style="width: ${planet.atmosphere}%"></div>
                </div>
            </div>
        ` : ''}
        
        <div class="mt-4">
            <h5>Notable Features</h5>
            <p>${planet.surfaceFeature}</p>
        </div>
        
        <div class="fun-fact">
            <h5>★ FUN FACT</h5>
            <p>${planet.funFact}</p>
        </div>
    `;

	// Initialize or update 3D planet viewer
	const container = document.getElementById("planetViewer");

	// Clear any existing content
	container.innerHTML = `
        <div class="planet-controls">
            <button class="planet-control-btn active" id="rotateToggle" title="Toggle Rotation">
                <i class="fas fa-sync-alt"></i>
            </button>
            <button class="planet-control-btn" id="zoomIn" title="Zoom In">
                <i class="fas fa-search-plus"></i>
            </button>
            <button class="planet-control-btn" id="zoomOut" title="Zoom Out">
                <i class="fas fa-search-minus"></i>
            </button>
            <button class="planet-control-btn" id="resetView" title="Reset View">
                <i class="fas fa-compress-arrows-alt"></i>
            </button>
        </div>
    `;

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
            
            // Animate atmosphere bar if present
            const atmosphereFill = document.querySelector('.atmosphere-fill');
            if (atmosphereFill) {
                setTimeout(() => {
                    atmosphereFill.style.width = `${planet.atmosphere}%`;
                }, 100);
            }
		},
		{ once: true }
	); // Use once option to ensure this only happens once per modal opening

	modalInstance.show();
    
    // Set "Learn More" button href based on planet name
    document.getElementById('learnMore').href = `https://en.wikipedia.org/wiki/${planet.name}_(planet)`;
}

function filterPlanets(filterType, filterValue) {
    const planetCards = document.querySelectorAll('.planet-card-container');
    
    planetCards.forEach(card => {
        const planetElement = card.querySelector('.planet-card');
        const planetName = planetElement.getAttribute('data-planet');
        const planetCategories = planetElement.getAttribute('data-categories');
        
        if (filterType === 'search') {
            // Search filter
            const planetText = planetElement.textContent.toLowerCase();
            
            if (planetName.includes(filterValue) || planetText.includes(filterValue)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        } else if (filterType === 'category') {
            // Category filter
            if (filterValue === 'all' || planetCategories.includes(filterValue)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Add constellation animation for extra visual interest
function createConstellation() {
    const constellations = document.querySelectorAll('.constellation');
    
    constellations.forEach(constellation => {
        // Slowly animate the constellation position for parallax effect
        let x = 0;
        let y = 0;
        const speed = 0.2;
        
        function animateConstellation() {
            x += speed;
            y += speed / 2;
            
            constellation.style.transform = `translate(${Math.sin(x / 50) * 10}px, ${Math.cos(y / 50) * 10}px)`;
            
            requestAnimationFrame(animateConstellation);
        }
        
        animateConstellation();
    });
}

// Single event listener that calls both functions
document.addEventListener("DOMContentLoaded", () => {
    createPlanetCards();
    createConstellation();
});
