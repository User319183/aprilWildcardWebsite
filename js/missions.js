const missions = { // Object containing all mission data, accessed by unique keys (apollo11, curiosity, etc.)
    apollo11: {
        name: "Apollo 11",
        description: "Apollo 11 was the spaceflight that first landed humans on the Moon. Commander Neil Armstrong and lunar module pilot Buzz Aldrin formed the American crew that landed the Apollo Lunar Module Eagle on July 20, 1969.",
        details: [ // Array of strings for structured information display
            "Launch Date: July 16, 1969",
            "Landing Date: July 20, 1969",
            "Return to Earth: July 24, 1969",
            "Crew: Neil Armstrong, Buzz Aldrin, Michael Collins",
            "First words on the Moon: 'That's one small step for man, one giant leap for mankind.'"
        ],
        funFact: "The Apollo 11 mission achieved its primary objective of landing humans on the Moon and returning them safely to Earth, fulfilling the goal set by President John F. Kennedy in 1961.",
        modelType: "spacecraft", // Used to determine which 3D model to render
        modelColor: 0xC0C0C0, // Hexadecimal color code for the 3D model (silver)
        website: "https://www.nasa.gov/mission_pages/apollo/apollo-11.html"
    },
    curiosity: {
        name: "Curiosity Rover",
        description: "Curiosity is a car-sized rover designed to explore the crater Gale on Mars as part of NASA's Mars Science Laboratory mission. It was launched from Cape Canaveral on November 26, 2011.",
        details: [
            "Launch Date: November 26, 2011",
            "Mars Landing: August 6, 2012",
            "Mission Status: Active",
            "Landing Site: Gale Crater",
            "Size: 9.5 × 8.9 × 7.2 feet (2.9 × 2.7 × 2.2 m)"
        ],
        funFact: "Curiosity's on-board laboratory has found chemical and mineral evidence of past habitable environments on Mars.",
        modelType: "rover",
        modelColor: 0xE74C3C,
        website: "https://mars.nasa.gov/msl/home/"
    },
    voyager: {
        name: "Voyager Missions",
        description: "The Voyager program consists of two spacecraft, Voyager 1 and Voyager 2, launched in 1977 to take advantage of a favorable alignment of Jupiter, Saturn, Uranus, and Neptune.",
        details: [
            "Launch Dates: Voyager 1 on Sept 5, 1977; Voyager 2 on Aug 20, 1977",
            "Current Status: Both operating in interstellar space",
            "Voyager 1 Distance: 14+ billion miles from Earth",
            "Voyager 2 Distance: 12+ billion miles from Earth",
            "Power Source: Radioisotope thermoelectric generators (RTGs)"
        ],
        funFact: "The Voyager spacecrafts carry a golden record containing sounds and images selected to portray the diversity of life and culture on Earth, intended for any intelligent extraterrestrial life form who may find them.",
        modelType: "probe",
        modelColor: 0x0AC1DE,
        website: "https://voyager.jpl.nasa.gov/"
    },
    europa: {
        name: "Europa Clipper",
        description: "Europa Clipper is an interplanetary mission in development by NASA to study Jupiter's moon Europa through a series of flybys while in orbit around Jupiter.",
        details: [
            "Launch Date: Planned for October 2024",
            "Arrival at Jupiter: April 2030",
            "Mission Duration: At least 4 years",
            "Primary Goal: Determine if Europa could harbor conditions suitable for life",
            "Science Instruments: 9 instruments to study Europa's surface, subsurface and atmosphere"
        ],
        funFact: "Europa has a subsurface ocean with more water than all of Earth's oceans combined, making it one of the most promising places to look for life beyond Earth.",
        modelType: "probe",
        modelColor: 0xE9B44C,
        website: "https://europa.nasa.gov/"
    },
    perseverance: {
        name: "Perseverance Rover",
        description: "Perseverance is a car-sized Mars rover designed to explore the crater Jezero on Mars as part of NASA's Mars 2020 mission. It was launched on July 30, 2020.",
        details: [
            "Launch Date: July 30, 2020",
            "Mars Landing: February 18, 2021",
            "Mission Status: Active",
            "Landing Site: Jezero Crater",
            "Notable Technology: First helicopter on Mars (Ingenuity)"
        ],
        funFact: "Perseverance is collecting rock samples that will be returned to Earth in a future mission, potentially providing evidence of ancient microbial life on Mars.",
        modelType: "rover",
        modelColor: 0xE74C3C,
        website: "https://mars.nasa.gov/mars2020/"
    },
    artemis: {
        name: "Artemis Program",
        description: "The Artemis program is a U.S. government-led crewed spaceflight program with the goal of landing 'the first woman and the next man' on the Moon by 2025.",
        details: [
            "First Mission: Artemis I (uncrewed) launched November 2022",
            "Upcoming: Artemis II (crewed lunar flyby) planned for 2024",
            "Lunar Landing: Artemis III planned for 2025",
            "Vehicle: Space Launch System (SLS) and Orion spacecraft",
            "Future Plans: Establish sustainable lunar presence and eventual Mars missions"
        ],
        funFact: "The Artemis program aims to establish the first long-term human presence on the Moon, with an orbital outpost called Gateway and a base camp on the lunar surface.",
        modelType: "spacecraft",
        modelColor: 0xC0C0C0,
        website: "https://www.nasa.gov/artemis"
    }
};

// Timeline filtering functionality
document.addEventListener('DOMContentLoaded', () => { // Execute code when DOM is fully loaded
    new SpaceCursor(); // Initialize custom cursor defined in cursor.js

    // Set up timeline filters
    const filterButtons = document.querySelectorAll('.timeline-filters button'); // Select all filter buttons using CSS selector
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Event listeners for filter buttons
    filterButtons.forEach(button => { // Iterate through each button with forEach
        button.addEventListener('click', () => { // Add click event listener using arrow function
            filterButtons.forEach(btn => btn.classList.remove('active')); // Remove active class from all buttons
            button.classList.add('active'); // Add active class to clicked button
            const filter = button.getAttribute('data-filter'); // Get filter value from data-filter attribute
            filterTimelineItems(filter); // Call filter function with selected filter
        });
    });

    // Filter timeline items based on category
    function filterTimelineItems(filter) {
        timelineItems.forEach(item => {
            if (filter === 'all') {
                item.classList.remove('hidden'); // Show all items when 'all' filter is selected
            } else {
                // Show items matching filter category, hide others using classList
                if (item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });
    }

    // Set up mission detail buttons
    const missionButtons = document.querySelectorAll('.mission-details-btn');
    missionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const missionId = button.getAttribute('data-mission'); // Get mission ID from data attribute
            showMissionDetails(missionId); // Call function to show mission details
        });
    });

    // Mission 3D Viewer class - Object-oriented approach to manage 3D rendering
    class MissionViewer {
        constructor(container) { // Constructor gets called when we create a new MissionViewer instance
            this.container = container; // DOM element where the 3D model will be rendered
            this.scene = null; // Will hold the THREE.js scene
            this.camera = null; // Will hold the THREE.js camera
            this.renderer = null; // Will handle rendering the 3D scene
            this.controls = null; // Will handle user interaction with the 3D model
            this.model = null; // Will hold the 3D model being displayed
            this.animationFrameId = null; // Used to track animation frame for cancellation

            this.init(); // Call initialization method
        }

        init() {
            // Create scene - the container for all 3D objects
            this.scene = new THREE.Scene();

            // Set up camera with perspective projection
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000); // (FOV, aspect ratio, near plane, far plane)
            this.camera.position.z = 10; // Position camera 10 units back on Z axis

            // Set up WebGL renderer with anti-aliasing and transparency
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(width, height);
            this.renderer.setClearColor(0x000000, 0); // Transparent background
            this.container.appendChild(this.renderer.domElement); // Add canvas to container

            // Add lighting to the scene
            const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft ambient light
            const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Directional light like sunlight
            directionalLight.position.set(5, 3, 5);
            this.scene.add(ambientLight, directionalLight);

            // Set up OrbitControls to allow user interaction (rotation, zoom)
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true; // Add inertia to controls
            this.controls.dampingFactor = 0.05;

            // Handle window resize events to maintain proper aspect ratio
            window.addEventListener("resize", () => this.onWindowResize());
        }

        loadModel(missionData) {
            // Clear previous model if exists to prevent memory leaks
            if (this.model) {
                this.scene.remove(this.model);
            }

            // Cancel previous animation if running to prevent multiple animation loops
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }

            // Simple model based on mission type - use switch statement to handle different model types
            let geometry;

            switch (missionData.modelType) {
                case 'spacecraft':
                    // Create a simple spacecraft model using THREE.js geometric primitives
                    const mainBody = new THREE.CylinderGeometry(1, 1, 3, 16);
                    const cone = new THREE.ConeGeometry(1, 1.5, 16);
                    const solarPanel1 = new THREE.BoxGeometry(6, 0.1, 2);
                    const solarPanel2 = new THREE.BoxGeometry(6, 0.1, 2);

                    // Create meshes by combining geometries with materials
                    const mainBodyMesh = new THREE.Mesh(mainBody, new THREE.MeshStandardMaterial({ color: missionData.modelColor }));
                    mainBodyMesh.position.y = 0;

                    const coneMesh = new THREE.Mesh(cone, new THREE.MeshStandardMaterial({ color: missionData.modelColor }));
                    coneMesh.position.y = 2.25; // Position cone at top of cylinder

                    const solarPanel1Mesh = new THREE.Mesh(solarPanel1, new THREE.MeshStandardMaterial({ color: 0x1a5fb4 }));
                    solarPanel1Mesh.position.x = 3.5; // Position solar panel to the right

                    const solarPanel2Mesh = new THREE.Mesh(solarPanel2, new THREE.MeshStandardMaterial({ color: 0x1a5fb4 }));
                    solarPanel2Mesh.position.x = -3.5; // Position solar panel to the left

                    // Create group to combine all meshes into a single object that can be transformed together
                    this.model = new THREE.Group();
                    this.model.add(mainBodyMesh);
                    this.model.add(coneMesh);
                    this.model.add(solarPanel1Mesh);
                    this.model.add(solarPanel2Mesh);

                    // Position camera to see the entire model
                    this.camera.position.set(0, 0, 15);
                    break;

                case 'rover':
                    // Simple rover model
                    const body = new THREE.BoxGeometry(3, 1, 4);
                    const bodyMesh = new THREE.Mesh(body, new THREE.MeshStandardMaterial({ color: missionData.modelColor }));

                    // Create wheels
                    const wheelGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 16);
                    wheelGeometry.rotateZ(Math.PI / 2);

                    const wheel1 = new THREE.Mesh(wheelGeometry, new THREE.MeshStandardMaterial({ color: 0x333333 }));
                    wheel1.position.set(1.5, -0.5, 1.5);

                    const wheel2 = new THREE.Mesh(wheelGeometry, new THREE.MeshStandardMaterial({ color: 0x333333 }));
                    wheel2.position.set(-1.5, -0.5, 1.5);

                    const wheel3 = new THREE.Mesh(wheelGeometry, new THREE.MeshStandardMaterial({ color: 0x333333 }));
                    wheel3.position.set(1.5, -0.5, -1.5);

                    const wheel4 = new THREE.Mesh(wheelGeometry, new THREE.MeshStandardMaterial({ color: 0x333333 }));
                    wheel4.position.set(-1.5, -0.5, -1.5);

                    // Add antenna
                    const antennaRod = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
                    const antennaDish = new THREE.SphereGeometry(0.5, 16, 8, 0, Math.PI);
                    antennaDish.rotateX(Math.PI / 2);

                    const antennaRodMesh = new THREE.Mesh(antennaRod, new THREE.MeshStandardMaterial({ color: 0x888888 }));
                    antennaRodMesh.position.set(0, 1.5, 0);

                    const antennaDishMesh = new THREE.Mesh(antennaDish, new THREE.MeshStandardMaterial({ color: 0xCCCCCC }));
                    antennaDishMesh.position.set(0, 2.5, 0);

                    // Create group and add all meshes
                    this.model = new THREE.Group();
                    this.model.add(bodyMesh);
                    this.model.add(wheel1);
                    this.model.add(wheel2);
                    this.model.add(wheel3);
                    this.model.add(wheel4);
                    this.model.add(antennaRodMesh);
                    this.model.add(antennaDishMesh);

                    // Position camera
                    this.camera.position.set(0, 5, 10);
                    break;

                case 'probe':
                default:
                    // Create a simple space probe model
                    const probeBody = new THREE.SphereGeometry(1.5, 32, 32);
                    const probeBodyMesh = new THREE.Mesh(probeBody, new THREE.MeshStandardMaterial({ color: missionData.modelColor }));

                    const antenna = new THREE.ConeGeometry(1, 2, 16);
                    antenna.rotateX(Math.PI);
                    const antennaMesh = new THREE.Mesh(antenna, new THREE.MeshStandardMaterial({ color: 0xCCCCCC }));
                    antennaMesh.position.y = -2;

                    const solarArray1 = new THREE.BoxGeometry(5, 0.1, 1.5);
                    const solarArray1Mesh = new THREE.Mesh(solarArray1, new THREE.MeshStandardMaterial({ color: 0x1a5fb4 }));
                    solarArray1Mesh.position.x = 3;

                    const solarArray2 = new THREE.BoxGeometry(5, 0.1, 1.5);
                    const solarArray2Mesh = new THREE.Mesh(solarArray2, new THREE.MeshStandardMaterial({ color: 0x1a5fb4 }));
                    solarArray2Mesh.position.x = -3;

                    // Create group and add all meshes
                    this.model = new THREE.Group();
                    this.model.add(probeBodyMesh);
                    this.model.add(antennaMesh);
                    this.model.add(solarArray1Mesh);
                    this.model.add(solarArray2Mesh);

                    // Position camera
                    this.camera.position.set(0, 0, 12);
                    break;
            }

            // Add the model to the scene
            this.scene.add(this.model);

            // Start the animation loop
            this.animate();
        }

        animate() {
            // requestAnimationFrame creates a smooth animation loop that syncs with display refresh rate
            this.animationFrameId = requestAnimationFrame(() => this.animate()); // Arrow function preserves 'this' context

            // Rotate model slowly on y-axis to show all sides
            if (this.model) {
                this.model.rotation.y += 0.005;
            }

            this.controls.update(); // Update orbit controls
            this.renderer.render(this.scene, this.camera); // Render the scene
        }

        onWindowResize() {
            // Adjust camera and renderer when window size changes
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix(); // Must call after changing projection parameters
            this.renderer.setSize(width, height);
        }
    }

    // Show mission details in modal
    function showMissionDetails(missionId) {
        const mission = missions[missionId];

        if (!mission) return; // Guard clause: exit if mission not found

        document.getElementById('missionModalTitle').textContent = mission.name;

        // Fill mission info using template literal (backtick syntax) for multiline HTML generation
        const infoHtml = `
            <h4>${mission.name}</h4>
            <p>${mission.description}</p>
            <ul class="list-unstyled">
                ${mission.details.map(detail => `<li>${detail}</li>`).join('')} <!-- Array.map to transform array items into HTML list items -->
            </ul>
            <div class="fun-fact">
                <h5>Mission Highlight</h5>
                <p>${mission.funFact}</p>
            </div>
        `;
        document.getElementById('missionInfo').innerHTML = infoHtml; // Set inner HTML of element

        document.getElementById('learnMoreLink').href = mission.website;

        // Display the modal using Bootstrap's Modal API
        const missionModal = document.getElementById('missionModal');
        const modalInstance = new bootstrap.Modal(missionModal);

        // Listen for the modal shown event to initialize the 3D model
        missionModal.addEventListener('shown.bs.modal', function () {
            const container = document.getElementById('missionViewer');

            container.innerHTML = ''; // Clear any existing content

            // Initialize new viewer with the selected mission when modal is visible
            const viewer = new MissionViewer(container);
            viewer.loadModel(mission);

            viewer.onWindowResize(); // Force a resize to ensure proper rendering
        }, { once: true }); // Use once: true to ensure event listener only fires once

        modalInstance.show(); // Show the modal
    }

    // Add scroll animation for timeline items using Intersection Observer API
    const observerOptions = {
        root: null, // Use viewport as root
        rootMargin: '0px', // No margin
        threshold: 0.2 // Trigger when 20% of element is visible
    };

    // Create observer that watches for elements becoming visible in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { // Element is visible
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)'; // Animate in by changing opacity and position
            }
        });
    }, observerOptions);

    // Apply initial transform to timeline items (start offscreen and invisible)
    timelineItems.forEach(item => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(50px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; // CSS transition for smooth animation

        observer.observe(item); // Start observing each timeline item
    });
});