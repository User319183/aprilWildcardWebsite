class SolarSystem {
    constructor() {
        this.container = document.getElementById('solar-system-model');
        if (!this.container) return;

        // Set up scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        // Initial setup
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.set(0, 20, 50);
        this.camera.lookAt(0, 0, 0);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(ambientLight, directionalLight);

        // Add planets
        this.planets = {};
        this.createSolarSystem();

        // Controls
        this.addOrbitControls();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation
        this.animate();
    }

    createSolarSystem() {
        // Sun
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.5
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);

        // Planet data: [size, distance, color, speed]
        const planetData = {
            mercury: [0.8, 10, 0xC0C0C0, 0.004],
            venus: [1.2, 15, 0xFFA500, 0.0035],
            earth: [1.3, 20, 0x6495ED, 0.003],
            mars: [1.0, 25, 0xFF4500, 0.0025],
            jupiter: [3.0, 35, 0xFFA07A, 0.002],
            saturn: [2.5, 45, 0xF0E68C, 0.0015]
        };

        Object.entries(planetData).forEach(([name, [size, distance, color, speed]]) => {
            // Create planet
            const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
            const planetMaterial = new THREE.MeshStandardMaterial({ color });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);

            // Create orbit
            const orbitGeometry = new THREE.RingGeometry(distance - 0.1, distance + 0.1, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                opacity: 0.2,
                transparent: true,
                side: THREE.DoubleSide
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;

            // Position planet
            planet.position.x = distance;

            // Group for rotation
            const planetGroup = new THREE.Group();
            planetGroup.add(planet);

            // Add to scene
            this.scene.add(orbit);
            this.scene.add(planetGroup);

            // Store reference with metadata
            this.planets[name] = {
                object: planet,
                group: planetGroup,
                distance,
                speed
            };
        });
    }

    addOrbitControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 100;
    }

    onWindowResize() {
        if (!this.container) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate sun
        if (this.sun) {
            this.sun.rotation.y += 0.001;
        }

        // Rotate planets around sun
        Object.values(this.planets).forEach(planet => {
            planet.group.rotation.y += planet.speed;
            planet.object.rotation.y += planet.speed * 5;
        });

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('solar-system-model')) {
        new SolarSystem();
    }
});