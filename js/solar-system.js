class SolarSystem {
    constructor() { // Constructor initializes all the components needed for the 3D scene
        this.container = document.getElementById('solar-system-model'); // Get the container element from the DOM
        if (!this.container) return; // Guard clause: exit if container doesn't exist

        // Set up scene - the foundation for all 3D objects
        this.scene = new THREE.Scene(); // Create a new THREE.js scene - container for all 3D objects
        this.camera = new THREE.PerspectiveCamera(60, this.container.clientWidth / this.container.clientHeight, 0.1, 1000); // Create camera with field of view, aspect ratio, near and far planes
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Create renderer with anti-aliasing and transparency

        // Initial setup
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight); // Set renderer size to match container
        this.container.appendChild(this.renderer.domElement); // Add the canvas element to the container
        this.camera.position.set(0, 20, 50); // Position camera above and away from the solar system
        this.camera.lookAt(0, 0, 0); // Point camera at the center (origin) of the scene

        // Add lighting - essential for visible 3D objects
        const ambientLight = new THREE.AmbientLight(0x404040); // Soft ambient light that illuminates everything equally
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light that simulates sunlight
        directionalLight.position.set(1, 1, 1); // Position the directional light
        this.scene.add(ambientLight, directionalLight); // Add both lights to the scene

        // Add planets - initialized as empty object to store planet references
        this.planets = {}; // Object to store planet references and metadata
        this.createSolarSystem(); // Call method to create sun and planets

        // Controls - add interactive controls for user navigation
        this.addOrbitControls(); // Add orbit controls to allow user interaction

        // Handle window resize - ensures the scene looks correct when window size changes
        window.addEventListener('resize', () => this.onWindowResize()); // Arrow function preserves 'this' context

        // Start animation - begins the rendering loop
        this.animate(); // Start the animation loop
    }

    createSolarSystem() { // Creates all celestial bodies in the solar system
        // Sun - the center of our solar system
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32); // Create sphere with radius 5 and 32 segments
        const sunMaterial = new THREE.MeshBasicMaterial({ // Material that emits light (doesn't need to be lit)
            color: 0xffff00, // Yellow color
            emissive: 0xffff00, // Same color for emissive (glowing) effect
            emissiveIntensity: 0.5 // Intensity of the glow
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial); // Combine geometry and material to create the sun mesh
        this.scene.add(this.sun); // Add sun to the scene

        // Planet data: [size, distance, color, speed] - array of values for each planet
        const planetData = { // Object containing data for each planet as arrays
            mercury: [0.8, 10, 0xC0C0C0, 0.004], // [size, distance from sun, color, orbital speed]
            venus: [1.2, 15, 0xFFA500, 0.0035],
            earth: [1.3, 20, 0x6495ED, 0.003],
            mars: [1.0, 25, 0xFF4500, 0.0025],
            jupiter: [3.0, 35, 0xFFA07A, 0.002],
            saturn: [2.5, 45, 0xF0E68C, 0.0015]
        };

        Object.entries(planetData).forEach(([name, [size, distance, color, speed]]) => { // Loop through each planet using destructuring assignment
            // Create planet - the physical sphere representing the planet
            const planetGeometry = new THREE.SphereGeometry(size, 32, 32); // Create sphere with planet size
            const planetMaterial = new THREE.MeshStandardMaterial({ color }); // Material that responds to light
            const planet = new THREE.Mesh(planetGeometry, planetMaterial); // Combine geometry and material

            // Create orbit - the visible ring showing the planet's path
            const orbitGeometry = new THREE.RingGeometry(distance - 0.1, distance + 0.1, 64); // Thin ring with radius matching planet distance
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff, // White color for orbit lines
                opacity: 0.2, // Make orbits semi-transparent
                transparent: true, // Enable transparency
                side: THREE.DoubleSide // Make ring visible from both sides
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial); // Create orbit mesh
            orbit.rotation.x = Math.PI / 2; // Rotate orbit to lie flat on the XZ plane (90 degrees)

            // Position planet - initially place planet along its orbit
            planet.position.x = distance; // Position planet along X-axis at its orbital distance

            // Group for rotation - allows planet to rotate around the sun
            const planetGroup = new THREE.Group(); // Create group to handle planetary orbit
            planetGroup.add(planet); // Add planet to the group

            // Add to scene - put everything in the 3D environment
            this.scene.add(orbit); // Add orbit ring to scene
            this.scene.add(planetGroup); // Add planet group to scene

            // Store reference with metadata - for animation and future reference
            this.planets[name] = { // Store planet data in the planets object
                object: planet, // Reference to the planet mesh
                group: planetGroup, // Reference to the rotation group
                distance, // Store distance for possible later use
                speed // Store speed for animation
            };
        });
    }

    addOrbitControls() { // Add interactive camera controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement); // Create controls attached to camera and renderer
        this.controls.enableDamping = true; // Add inertia to controls
        this.controls.dampingFactor = 0.05; // Amount of inertia
        this.controls.screenSpacePanning = false; // Disable panning relative to screen space
        this.controls.minDistance = 20; // Minimum zoom distance
        this.controls.maxDistance = 100; // Maximum zoom distance
    }

    onWindowResize() { // Handle window resizing to maintain proper aspect ratio
        if (!this.container) return; // Guard clause: exit if container doesn't exist
        const width = this.container.clientWidth; // Get container width
        const height = this.container.clientHeight; // Get container height

        this.camera.aspect = width / height; // Update camera aspect ratio
        this.camera.updateProjectionMatrix(); // Must be called after changing camera properties
        this.renderer.setSize(width, height); // Resize renderer to match container
    }

    animate() { // Animation loop that runs continuously
        requestAnimationFrame(() => this.animate()); // Schedule next frame and preserve 'this' context

        // Rotate sun - simple rotation for visual interest
        if (this.sun) {
            this.sun.rotation.y += 0.001; // Slowly rotate sun around its Y axis
        }

        // Rotate planets around sun - creates orbital motion
        Object.values(this.planets).forEach(planet => { // Loop through each planet object
            planet.group.rotation.y += planet.speed; // Rotate the group around the sun (orbital rotation)
            planet.object.rotation.y += planet.speed * 5; // Rotate the planet itself (axial rotation, faster than orbital)
        });

        // Update controls - processes any user interaction
        if (this.controls) {
            this.controls.update(); // Update orbit controls (handles damping)
        }

        this.renderer.render(this.scene, this.camera); // Render the scene with the camera
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('solar-system-model')) { // Check if solar system container exists
        new SolarSystem(); // Create a new SolarSystem instance
    }
});