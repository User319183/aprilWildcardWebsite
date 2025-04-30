class SpaceBackground {
    constructor() { // Constructor initializes all properties and sets up the 3D environment
        this.scene = new THREE.Scene(); // Create a new THREE.js scene to hold all 3D objects
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Create camera with field of view, aspect ratio, near and far clipping planes
        this.renderer = new THREE.WebGLRenderer({ // Set up the WebGL renderer
            canvas: document.querySelector('#spaceCanvas'), // Use existing canvas from HTML
            antialias: true // Enable anti-aliasing for smoother edges
        });

        // Mouse tracking - stores current and interpolated mouse positions
        this.mouse = {
            x: 0, // Raw horizontal mouse position (normalized -1 to 1)
            y: 0, // Raw vertical mouse position (normalized -1 to 1)
            xDamped: 0, // Smoothed horizontal position (for fluid camera movement)
            yDamped: 0 // Smoothed vertical position (for fluid camera movement)
        };

        // Track mouse movement - updates mouse position when mouse moves
        document.addEventListener('mousemove', (event) => { // Arrow function preserves 'this' context
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1; // Convert pixel coordinates to normalized device coordinates (-1 to +1)
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // Invert Y axis to match THREE.js coordinate system
        });

        // Handle window resize - updates camera and renderer when window size changes
        window.addEventListener('resize', () => this.onWindowResize()); // Arrow function preserves 'this' context

        // Navigation transition state - used for page transition effects
        this.isNavigating = false; // Flag to track if navigation transition is in progress
        this.targetUrl = ''; // URL to navigate to after transition
        this.zoomSpeed = 0; // Speed of camera zoom during transition

        // Setup the journey button - connects CTA button to transition effect
        this.setupJourneyButton(); // Initialize journey button functionality
        
        // Setup navigation links - adds transition effects to navigation
        this.setupNavLinks(); // Initialize navigation link functionality

        this.init(); // Initialize renderer and camera
        this.createStars(); // Create background stars
        this.createShootingStars(); // Create shooting star animations
        this.animate(); // Start animation loop
    }

    init() { // Basic initialization of renderer and camera
        this.renderer.setSize(window.innerWidth, window.innerHeight); // Set renderer to full window size
        this.camera.position.z = 5; // Position camera away from origin
    }

    createStars() { // Creates the starfield background using THREE.js points
        const starGeometry = new THREE.BufferGeometry(); // More efficient geometry for large number of vertices
        const starMaterial = new THREE.PointsMaterial({ // Material for rendering points
            color: 0xFFFFFF, // White color
            size: 0.1 // Size of each star point
        });

        const starVertices = []; // Array to hold star coordinates
        for (let i = 0; i < 10000; i++) { // Create 10,000 stars
            const x = (Math.random() - 0.5) * 2000; // Random X position in large space
            const y = (Math.random() - 0.5) * 2000; // Random Y position
            const z = -Math.random() * 2000; // Random Z position (negative to appear in front of camera)
            starVertices.push(x, y, z); // Add coordinates to array
        }

        starGeometry.setAttribute('position',
            new THREE.Float32BufferAttribute(starVertices, 3)); // Set buffer attribute with 3 values per vertex (x,y,z)
        this.stars = new THREE.Points(starGeometry, starMaterial); // Create the star points object
        this.scene.add(this.stars); // Add stars to the scene
    }

    createShootingStars() { // Creates initial set of shooting stars
        // Create shooting stars
        this.shootingStars = []; // Array to track all shooting star objects

        for (let i = 0; i < 20; i++) { // Create initial batch of 20 shooting stars
            this.createShootingStar();
        }
    }

    createShootingStar() { // Creates a single shooting star with trail effect
        // Create a shooting star
        const geometry = new THREE.BufferGeometry(); // Efficient geometry for line segments
        const points = []; // Array to hold points for trail

        // Create a line with a trail - multiple points create the illusion of a trail
        for (let i = 0; i < 10; i++) { // 10 points per star trail
            points.push(0, 0, i * -0.1); // Points are arranged in a line along Z-axis
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3)); // Create buffer from points array

        const material = new THREE.LineBasicMaterial({ // Material for the line trail
            color: 0xffffff, // White color
            transparent: true, // Enable transparency
            opacity: Math.random() * 0.8 + 0.2 // Random opacity for varied star brightness
        });

        const shootingStar = new THREE.Line(geometry, material); // Create line object from geometry and material

        // Random position outside view - place stars at random positions
        shootingStar.position.set(
            (Math.random() - 0.5) * 200, // Random X position
            (Math.random() - 0.5) * 200, // Random Y position
            -Math.random() * 100 // Random Z position (negative to be in front of camera)
        );

        // Random velocity vector for animation - determines direction and speed of shooting star
        shootingStar.userData = { // Custom data stored on the object
            velocity: new THREE.Vector3( // Vector3 stores x,y,z components of velocity
                (Math.random() - 0.5) * 1, // Random X velocity
                (Math.random() - 0.5) * 1, // Random Y velocity
                (Math.random() + 1) * 3 // Z velocity (mostly positive to move toward camera)
            ),
            lifespan: 0, // Current life counter
            maxLifespan: Math.random() * 200 + 100 // Maximum frames the star will exist before recycling
        };

        this.scene.add(shootingStar); // Add to scene
        this.shootingStars.push(shootingStar); // Add to tracking array

        return shootingStar; // Return for any additional configuration
    }

    updateShootingStars() { // Updates position and lifecycle of all shooting stars
        // Update and recycle shooting stars
        for (let i = 0; i < this.shootingStars.length; i++) {
            const star = this.shootingStars[i]; // Get current star
            const data = star.userData; // Get star's custom data

            // Move the star - add velocity vector to position
            star.position.add(data.velocity);

            // Increment lifespan - track how long the star has existed
            data.lifespan++;

            // If the star has lived its life, recycle it - object pooling technique to avoid garbage collection
            if (data.lifespan > data.maxLifespan) {
                star.position.set( // Reset position
                    (Math.random() - 0.5) * 200,
                    (Math.random() - 0.5) * 200,
                    -Math.random() * 100
                );

                star.userData.lifespan = 0; // Reset lifespan counter
                star.userData.maxLifespan = Math.random() * 200 + 100; // New random lifespan
            }
        }
    }

    setupJourneyButton() { // Adds event listener to the main CTA button
        const button = document.getElementById('start-journey'); // Get button element
        if (button) {
            button.addEventListener('click', () => { // Add click event
                // Navigate to planets page instead of scrolling
                this.targetUrl = 'planets.html'; // Set target URL
                this.startNavigationTransition(); // Start the transition effect
            });
        }
    }

    startJourneyEffect() { // Creates warp speed effect by accelerating star rotation
        // Create a zoom/warp effect
        const originalStarSpeed = 0.0004; // Normal rotation speed of stars
        const warpSpeed = 0.05; // Maximum warp speed
        let currentSpeed = originalStarSpeed; // Current rotation speed, will be animated
        let accelerating = true; // Flag for acceleration phase

        // Star warp animation - gradually increases then decreases star rotation speed
        const warpInterval = setInterval(() => { // Create interval running at ~60fps
            if (accelerating) {
                currentSpeed += 0.001; // Gradually increase speed
                if (currentSpeed >= warpSpeed) {
                    accelerating = false; // Start decelerating when max speed reached
                }
            } else {
                currentSpeed -= 0.001; // Gradually decrease speed
                if (currentSpeed <= originalStarSpeed) {
                    clearInterval(warpInterval); // Stop interval when back to normal
                    currentSpeed = originalStarSpeed; // Ensure exact reset
                }
            }

            // Set the current speed - used in animate() method
            this.starsRotationSpeed = currentSpeed;

        }, 16); // ~60fps (1000ms/60 ≈ 16ms)

        // Add more shooting stars during warp - enhances visual effect
        for (let i = 0; i < 30; i++) {
            setTimeout(() => { // Stagger creation for natural effect
                this.createShootingStar();
            }, i * 100); // Create new star every 100ms
        }
    }

    setupNavLinks() { // Sets up transition effects for all navigation links
        // Get all navigation links except for anchor links
        const navLinks = document.querySelectorAll('nav a'); // Select all links in nav
        
        navLinks.forEach(link => {
            if (!link.getAttribute('href').startsWith('#')) { // Skip anchor links (same-page navigation)
                link.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevent default navigation
                    this.targetUrl = link.getAttribute('href'); // Get URL from link
                    this.startNavigationTransition(); // Start transition effect
                });
            }
        });
    }

    startNavigationTransition() { // Creates dramatic page transition effect with camera zoom
        if (this.isNavigating) return; // Guard clause: prevent multiple transitions
        
        this.isNavigating = true; // Set navigation state
        this.zoomSpeed = 0; // Start with zero zoom speed
        
        // Intense zoom/warp effect than the journey button
        const maxZoomSpeed = 0.2; // Maximum camera zoom speed
        
        // Zoom animation - gradually accelerates camera zoom
        const zoomInterval = setInterval(() => {
            this.zoomSpeed += 0.006; // Slower acceleration for longer effect
            
            if (this.zoomSpeed >= maxZoomSpeed) {
                clearInterval(zoomInterval); // Stop acceleration once max speed reached
                
                // Delay before navigating to fully experience the effect
                setTimeout(() => {
                    // Class to body that will trigger the final white flash right before navigation
                    document.body.classList.add('space-transition-final'); // CSS class for white flash effect
                    
                    // Navigate after the flash animation has started
                    setTimeout(() => {
                        window.location.href = this.targetUrl; // Actually navigate to new page
                    }, 300); // Wait 300ms for flash effect to be visible
                }, 800); // Wait 800ms of zooming at max speed
            }
        }, 16); // ~60fps
        
        // Add more shooting stars during transition - enhances visual effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const star = this.createShootingStar();
                // Make transition shooting stars move faster - more dramatic
                star.userData.velocity.multiplyScalar(3); // Triple the velocity
            }, i * 50); // Create new star every 50ms
        }
        
        // Add visual brightness effect to the page - CSS transition for brightness
        document.body.classList.add('space-transition');
    }

    onWindowResize() { // Updates camera and renderer when window size changes
        this.camera.aspect = window.innerWidth / window.innerHeight; // Update aspect ratio
        this.camera.updateProjectionMatrix(); // Must be called after changing projection parameters
        this.renderer.setSize(window.innerWidth, window.innerHeight); // Update renderer size
    }

    animate() { // Main animation loop that runs continuously
        requestAnimationFrame(() => this.animate()); // Schedule next frame using requestAnimationFrame API

        // Dampen mouse movement for smooth camera response - exponential smoothing
        this.mouse.xDamped += (this.mouse.x - this.mouse.xDamped) * 0.1; // Move 10% of the way to target position
        this.mouse.yDamped += (this.mouse.y - this.mouse.yDamped) * 0.1; // Creates smooth, organic movement

        // Subtle camera movement based on mouse position - parallax effect
        this.camera.position.x = this.mouse.xDamped * 2; // Amplify mouse movement for camera effect
        this.camera.position.y = this.mouse.yDamped * 2;
        
        // If navigating, zoom the camera forward - creates forward motion during transition
        if (this.isNavigating) {
            this.camera.position.z -= this.zoomSpeed; // Move camera forward based on current zoom speed
        }
        
        this.camera.lookAt(0, 0, 0); // Always look at center of scene

        // Star rotation - use variable speed for warp effect
        this.stars.rotation.y += this.starsRotationSpeed || 0.0004; // Default to slow rotation if not set

        // Update shooting stars - handle movement and recycling
        if (this.shootingStars) {
            this.updateShootingStars();
        }

        this.renderer.render(this.scene, this.camera); // Render the scene from camera's perspective
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new SpaceBackground(); // Create an instance of the class to start everything
});