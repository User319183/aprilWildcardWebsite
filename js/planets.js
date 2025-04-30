const planets = [ // Array of planet data objects with properties for each planet
	{
		name: "Mercury", // Planet name
		description: "The smallest and innermost planet in the Solar System.", // Brief description
		distance: "57.9 million km", // Distance from sun as a formatted string
		diameter: "4,879 km", // Planet diameter as a formatted string
		orbitalPeriod: "88 days", // Time to orbit the sun
		funFact: "Despite being closest to the Sun, it's not the hottest planet.", // Interesting fact about the planet
		color: 0x8c8c8c, // Hexadecimal color code for fallback if texture fails
		textureUrl:
			"https://space-assets-1.cdn.spotlightvisuals.com/mercury-4k.jpg", // URL to high-resolution planet texture
		ring: false, // Boolean indicating if the planet has rings
        categories: ["rocky"], // Array of categories for filtering
        atmosphere: 0, // Atmosphere density percentage (0-100)
        temperature: "430°C (day) to -180°C (night)", // Temperature range as a string
        surfaceFeature: "Heavily cratered terrain" // Notable surface feature
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
		tilt: Math.PI / 2, // 90-degree tilt in radians
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
class PlanetViewer { // Class to handle 3D rendering of planets using THREE.js
	constructor(container) { // Constructor takes a DOM element where the 3D scene will be rendered
		this.container = container; // Store reference to container DOM element
		this.scene = null; // Will hold the THREE.js scene object
		this.camera = null; // Will hold the camera object for 3D perspective
		this.renderer = null; // Will handle rendering the scene
		this.controls = null; // Will handle user interaction with the 3D model
		this.planet = null; // Will reference the planet mesh
		this.ring = null; // Will reference the ring mesh if applicable
		this.stars = null; // Will reference the background starfield
		this.animationFrameId = null; // Used to track animation frame request for cleanup
		this.isRotating = true; // Boolean to control planet rotation

		// Add reference to instance on the container for access from outside
		this.container.viewer = this;

		this.init(); // Call initialization method
	}

	init() { // Initialize the 3D scene and components
		// Create scene - the container for all 3D objects
		this.scene = new THREE.Scene();

		// Set up camera with perspective projection
		const width = this.container.clientWidth;
		const height = this.container.clientHeight;
		this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000); // (FOV, aspect ratio, near plane, far plane)
		this.camera.position.z = 5; // Position camera 5 units away from center

		// Set up WebGL renderer with anti-aliasing and transparency
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(width, height);
		this.renderer.setClearColor(0x000000, 0); // Transparent background
		this.container.appendChild(this.renderer.domElement); // Add the canvas to the container

		// Create starfield background to enhance visual experience
		this.createStarfield();

		// Add lighting to make planet visible and realistic
		const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft ambient light for overall illumination
		const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Directional light to simulate sun
		directionalLight.position.set(5, 3, 5);
		this.scene.add(ambientLight, directionalLight);

		// Set up OrbitControls to allow user interaction with the 3D model
		this.controls = new THREE.OrbitControls(
			this.camera,
			this.renderer.domElement
		);
		this.controls.enableDamping = true; // Add inertia to controls
		this.dampingFactor = 0.05;
		this.controls.enableZoom = true;

		// Handle window resize events to maintain proper aspect ratio
		window.addEventListener("resize", () => this.onWindowResize());
        
		// Setup UI control buttons
		this.setupControls();
	}

	createStarfield() { // Creates a background of random stars using point particles
		// Create a starfield background using THREE.js Points
		const starGeometry = new THREE.BufferGeometry();
		const starMaterial = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 0.05,
			transparent: true
		});

		const starVertices = []; // Array to hold vertex coordinates
		for (let i = 0; i < 1000; i++) { // Generate 1000 random star positions
			const x = (Math.random() - 0.5) * 100; // Random x position between -50 and 50
			const y = (Math.random() - 0.5) * 100; // Random y position
			const z = (Math.random() - 0.5) * 100; // Random z position
			starVertices.push(x, y, z); // Add coordinates to array
		}

		starGeometry.setAttribute('position', 
			new THREE.Float32BufferAttribute(starVertices, 3)); // Set buffer attribute with 3 values per vertex (x,y,z)

		this.stars = new THREE.Points(starGeometry, starMaterial); // Create the star points object
		this.scene.add(this.stars); // Add stars to the scene
	}

	setupControls() { // Sets up UI control buttons for controlling the 3D view
		const rotateToggle = document.getElementById('rotateToggle'); // Button to toggle rotation
		const zoomIn = document.getElementById('zoomIn'); // Button to zoom in
		const zoomOut = document.getElementById('zoomOut'); // Button to zoom out
		const resetView = document.getElementById('resetView'); // Button to reset view

		if (rotateToggle) {
			rotateToggle.addEventListener('click', () => { // Add click event listener using arrow function
				this.isRotating = !this.isRotating; // Toggle rotation state
				rotateToggle.classList.toggle('active'); // Toggle active class for visual feedback
			});
		}

		if (zoomIn) {
			zoomIn.addEventListener('click', () => {
				this.camera.position.z *= 0.8; // Move camera closer (80% of current distance)
			});
		}

		if (zoomOut) {
			zoomOut.addEventListener('click', () => {
				this.camera.position.z *= 1.2; // Move camera farther (120% of current distance)
			});
		}

		if (resetView) {
			resetView.addEventListener('click', () => {
				this.camera.position.set(0, 0, 5); // Reset camera to starting position
				this.camera.lookAt(0, 0, 0); // Look at center
				this.controls.reset(); // Reset orbit controls
			});
		}
	}

	loadPlanet(planetData) { // Load and render a planet based on planet data object
		// Clear previous planet if exists to prevent memory leaks
		if (this.planet) {
			this.scene.remove(this.planet);
		}
		if (this.ring) {
			this.scene.remove(this.ring);
		}

		// Cancel previous animation frame if running
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId); // Prevent multiple animation loops
		}

		// Create planet geometry (sphere)
		const geometry = new THREE.SphereGeometry(1, 64, 64); // (radius, width segments, height segments)
		let material;

		// Try to load texture if available, fallback to solid color
		if (planetData.textureUrl) {
			const textureLoader = new THREE.TextureLoader(); // Create texture loader
			textureLoader.load(
				planetData.textureUrl, // URL to texture
				(texture) => { // Success callback - texture loaded
					material = new THREE.MeshStandardMaterial({
						map: texture, // Apply texture to material
						roughness: 0.8,
						metalness: 0.1,
					});
					this.planet.material = material; // Update planet material with texture
				},
				undefined, // Progress callback (not used)
				() => { // Error callback - fallback to color
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

		// Create planet mesh by combining geometry and material
		this.planet = new THREE.Mesh(geometry, material);

		// Apply tilt if specified (e.g., Uranus has extreme tilt)
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
            // More detailed ring for Saturn with multiple layers
            if (planetData.name === "Saturn") {
                const innerRadius = 1.4;
                const outerRadius = 2.5;
                const segments = 64;
                
                // Create multiple rings for more detail using a loop
                for (let i = 0; i < 3; i++) {
                    const ringGeometry = new THREE.RingGeometry(
                        innerRadius + i * 0.2, // Inner radius increases with each ring
                        innerRadius + 0.15 + i * 0.2, // Outer radius with small gap
                        segments
                    );
                    
                    const ringMaterial = new THREE.MeshBasicMaterial({
                        color: i === 1 ? 0xd6b879 : 0xf8e9c8, // Middle ring has different color
                        side: THREE.DoubleSide, // Render both sides
                        transparent: true,
                        opacity: 0.7 - i * 0.15 // Decreasing opacity for outer rings
                    });
                    
                    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                    ring.rotation.x = Math.PI / 2; // Rotate to horizontal plane
                    
                    if (planetData.tilt) {
                        ring.rotation.x += planetData.tilt; // Apply planet's tilt to rings
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
                    opacity: 0.4 // Very transparent
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

	addAtmosphereGlow(planetData) { // Add atmospheric glow effect based on planet type
        // Adapted atmosphere properties based on the planet type using conditional (ternary) operator
        const atmosphereColor = 
            planetData.categories.includes('rocky') ? 0x6f9eff : // Blue for rocky planets
            planetData.categories.includes('gas') ? 0xffedbc : // Yellow for gas giants
            0xadefff; // Default blueish for ice giants
            
        const atmosphereSize = 1.05 + (planetData.atmosphere / 100) * 0.12; // Size based on atmosphere percentage
        const atmosphereOpacity = 0.15 + (planetData.atmosphere / 100) * 0.3; // Opacity based on atmosphere percentage

		// Create glow effect using a slightly larger sphere with a translucent material
		const glowGeometry = new THREE.SphereGeometry(atmosphereSize, 32, 32);
		const glowMaterial = new THREE.MeshBasicMaterial({
			color: atmosphereColor,
			transparent: true,
			opacity: atmosphereOpacity,
			side: THREE.BackSide // Render inside of the sphere so it surrounds the planet
		});

		const atmosphereGlow = new THREE.Mesh(glowGeometry, glowMaterial);
		this.scene.add(atmosphereGlow);

        // Apply tilt to atmosphere if planet has tilt
        if (planetData.tilt) {
            atmosphereGlow.rotation.x = planetData.tilt;
        }
	}

	animate() { // Animation loop to continuously update and render the scene
		this.animationFrameId = requestAnimationFrame(() => this.animate()); // Request next frame using requestAnimationFrame

		// Rotate planet if rotation is enabled
		if (this.planet && this.isRotating) {
			this.planet.rotation.y += 0.005; // Rotate around y-axis (slow rotation)

            // Rotate stars slowly in the opposite direction for parallax effect
            if (this.stars) {
                this.stars.rotation.y -= 0.0005; // Very slow opposite rotation
            }
		}

		this.controls.update(); // Update orbit controls
		this.renderer.render(this.scene, this.camera); // Render the scene
	}

	onWindowResize() { // Handle window resize to maintain proper aspect ratio
		const width = this.container.clientWidth;
		const height = this.container.clientHeight;

		this.camera.aspect = width / height; // Update aspect ratio
		this.camera.updateProjectionMatrix(); // Update camera projection
		this.renderer.setSize(width, height); // Resize renderer
	}
}

function createPlanetCards() { // Create interactive planet cards in the grid layout
	const planetGrid = document.getElementById("planetGrid"); // Get the grid container

	planets.forEach((planet, index) => { // Loop through each planet in the planets array
		const card = document.createElement("div"); // Create card container element
		card.className = "col-12 col-sm-6 col-md-4 col-lg-3 planet-card-container"; // Bootstrap responsive grid classes
        card.style.animationDelay = `${index * 0.1}s`; // Stagger animation based on index
        
		// Add data attributes for filtering functionality
		const categoryClasses = planet.categories.join(' '); // Join categories with space for CSS classes
		
		card.innerHTML = `
            <div class="planet-card h-100" data-planet="${planet.name.toLowerCase()}" data-categories="${categoryClasses}">
                <div class="planet-preview"></div>
                <h3 class="mt-3">${planet.name}</h3>
                <p class="flex-grow-1">${planet.description}</p>
                <div class="d-grid gap-2 mt-auto">
                    <button class="btn btn-outline-light btn-sm">Explore</button>
                </div>
            </div>
        `; // Template literal to generate card HTML
		planetGrid.appendChild(card); // Add card to the grid

		// Add click event listener to the button
		card.querySelector('button').addEventListener('click', () => {
			showPlanetDetails(planet); // Show modal with planet details
		});

        // Make entire card clickable for better UX
        card.querySelector('.planet-card').addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') { // Don't trigger if button was clicked (already has handler)
                showPlanetDetails(planet);
            }
        });

		// Create small 3D preview of planet for each card
		createPlanetPreview(card.querySelector('.planet-preview'), planet);
	});

	// Add planet search functionality
	const searchInput = document.getElementById('planetSearch');
	if (searchInput) {
		searchInput.addEventListener('input', function () { // Use regular function to preserve 'this' context
			const searchTerm = this.value.toLowerCase(); // Get search text and convert to lowercase
			filterPlanets('search', searchTerm); // Call filter function
		});
	}
    
    // Add filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() { // Use regular function to preserve 'this' context
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Apply filter based on data-filter attribute
                const filter = this.getAttribute('data-filter');
                filterPlanets('category', filter);
            });
        });
    }
}

function createPlanetPreview(container, planetData) { // Create small 3D preview of planet for cards
	// Mini version of planet for card preview - simplified THREE.js scene
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000); // 1:1 aspect ratio for preview
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

	renderer.setSize(100, 100); // Small fixed size for preview
	renderer.setClearColor(0x000000, 0); // Transparent background
	container.appendChild(renderer.domElement); // Add the canvas to the container

	// Lighting
	const ambientLight = new THREE.AmbientLight(0x404040, 2);
	const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
	directionalLight.position.set(5, 3, 5);
	scene.add(ambientLight, directionalLight);

	// Create planet with texture
	const geometry = new THREE.SphereGeometry(0.8, 32, 32); // Smaller radius for preview
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
				planet.material = material; // Apply texture when loaded
			},
			undefined,
			() => {
				material = new THREE.MeshStandardMaterial({
					color: planetData.color
				});
				planet.material = material; // Fallback to color on error
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
		ring.rotation.x = Math.PI / 2; // Rotate to horizontal plane
		scene.add(ring);

		if (planetData.tilt) {
			planet.rotation.x = planetData.tilt; // Apply tilt to planet
			ring.rotation.x += planetData.tilt; // Apply tilt to rings
		}
	}

	// Position camera
	camera.position.z = 2;

	// Animation function - self-contained loop for this preview
	function animate() {
		requestAnimationFrame(animate); // Create animation loop
		planet.rotation.y += 0.01; // Rotate faster than main view for visual interest
		renderer.render(scene, camera);
	}

	animate(); // Start the animation
}

function showPlanetDetails(planet) { // Display modal with detailed planet information and 3D model
	// Set modal title
	document.getElementById("planetModalTitle").textContent = planet.name;

	// Fill planet info with enhanced data using template literal
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
        ` : ''} <!-- Conditional template that only shows atmosphere if present -->
        
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

	// Clear any existing content and add control buttons
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

	// Show the modal using Bootstrap's Modal API
	const planetModal = document.getElementById("planetModal");
	const modalInstance = new bootstrap.Modal(planetModal);

	// Create a reference to the planet data for use in the event handler
	planetModal._planetData = planet; // Store planet data on modal DOM element

	// Listen for the 'shown.bs.modal' event (Bootstrap event fired when modal is fully visible)
	planetModal.addEventListener(
		"shown.bs.modal",
		function () {
			// Initialize new viewer with the selected planet after modal is visible
			const viewer = new PlanetViewer(container);
			viewer.loadPlanet(planetModal._planetData);

			// Force a resize to ensure proper rendering
			viewer.onWindowResize();
            
            // Animate atmosphere bar if present with delay for visual effect
            const atmosphereFill = document.querySelector('.atmosphere-fill');
            if (atmosphereFill) {
                setTimeout(() => {
                    atmosphereFill.style.width = `${planet.atmosphere}%`; // Animate width from 0 to atmosphere value
                }, 100);
            }
		},
		{ once: true } // Use once option to ensure event handler is removed after execution
	);

	modalInstance.show(); // Show the modal
    
    // Set "Learn More" button href based on planet name for Wikipedia link
    document.getElementById('learnMore').href = `https://en.wikipedia.org/wiki/${planet.name}_(planet)`;
}

function filterPlanets(filterType, filterValue) { // Filter planets by search term or category
    const planetCards = document.querySelectorAll('.planet-card-container');
    
    planetCards.forEach(card => {
        const planetElement = card.querySelector('.planet-card');
        const planetName = planetElement.getAttribute('data-planet');
        const planetCategories = planetElement.getAttribute('data-categories');
        
        if (filterType === 'search') {
            // Search filter - check if text includes the search term
            const planetText = planetElement.textContent.toLowerCase();
            
            if (planetName.includes(filterValue) || planetText.includes(filterValue)) {
                card.style.display = 'block'; // Show matching cards
            } else {
                card.style.display = 'none'; // Hide non-matching cards
            }
        } else if (filterType === 'category') {
            // Category filter - check if planet belongs to selected category
            if (filterValue === 'all' || planetCategories.includes(filterValue)) {
                card.style.display = 'block'; // Show matching categories
            } else {
                card.style.display = 'none'; // Hide non-matching categories
            }
        }
    });
}

// Add constellation animation for extra visual interest
function createConstellation() { // Animate constellation elements for parallax effect
    const constellations = document.querySelectorAll('.constellation');
    
    constellations.forEach(constellation => {
        // Slowly animate the constellation position for parallax effect using sine/cosine waves
        let x = 0; // Animation counter for x movement
        let y = 0; // Animation counter for y movement
        const speed = 0.2; // Movement speed factor
        
        function animateConstellation() {
            x += speed; // Increment counters
            y += speed / 2;
            
            constellation.style.transform = `translate(${Math.sin(x / 50) * 10}px, ${Math.cos(y / 50) * 10}px)`; // Apply smooth sinusoidal movement
            
            requestAnimationFrame(animateConstellation); // Continue animation loop
        }
        
        animateConstellation(); // Start animation
    });
}

// Single event listener that calls both functions when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    createPlanetCards(); // Create planet cards with 3D previews
    createConstellation(); // Start constellation animations
});
