class SpaceBackground {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#spaceCanvas'),
            antialias: true
        });

        // Mouse tracking
        this.mouse = {
            x: 0,
            y: 0,
            xDamped: 0,
            yDamped: 0
        };

        // Track mouse movement
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Setup the journey button
        this.setupJourneyButton();

        this.init();
        this.createStars();
        this.createShootingStars();
        this.animate();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.position.z = 5;
    }

    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.1
        });

        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = -Math.random() * 2000;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position',
            new THREE.Float32BufferAttribute(starVertices, 3));
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }

    createShootingStars() {
        // Create shooting stars
        this.shootingStars = [];

        for (let i = 0; i < 20; i++) {
            this.createShootingStar();
        }
    }

    createShootingStar() {
        // Create a shooting star
        const geometry = new THREE.BufferGeometry();
        const points = [];

        // Create a line with a trail
        for (let i = 0; i < 10; i++) {
            points.push(0, 0, i * -0.1);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: Math.random() * 0.8 + 0.2
        });

        const shootingStar = new THREE.Line(geometry, material);

        // Random position outside view
        shootingStar.position.set(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            -Math.random() * 100
        );

        // Random velocity vector for animation
        shootingStar.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 1,
                (Math.random() - 0.5) * 1,
                (Math.random() + 1) * 3
            ),
            lifespan: 0,
            maxLifespan: Math.random() * 200 + 100
        };

        this.scene.add(shootingStar);
        this.shootingStars.push(shootingStar);

        return shootingStar;
    }

    updateShootingStars() {
        // Update and recycle shooting stars
        for (let i = 0; i < this.shootingStars.length; i++) {
            const star = this.shootingStars[i];
            const data = star.userData;

            // Move the star
            star.position.add(data.velocity);

            // Increment lifespan
            data.lifespan++;

            // If the star has lived its life, recycle it
            if (data.lifespan > data.maxLifespan) {
                star.position.set(
                    (Math.random() - 0.5) * 200,
                    (Math.random() - 0.5) * 200,
                    -Math.random() * 100
                );

                star.userData.lifespan = 0;
                star.userData.maxLifespan = Math.random() * 200 + 100;
            }
        }
    }

    setupJourneyButton() {
        const button = document.getElementById('start-journey');
        if (button) {
            button.addEventListener('click', () => {
                // Animate to Solar System section
                document.getElementById('solar-system').scrollIntoView({
                    behavior: 'smooth'
                });

                // Visual effect - speed up stars temporarily
                this.startJourneyEffect();
            });
        }
    }

    startJourneyEffect() {
        // Create a zoom/warp effect
        const originalStarSpeed = 0.0004;
        const warpSpeed = 0.05;
        let currentSpeed = originalStarSpeed;
        let accelerating = true;

        // Star warp animation
        const warpInterval = setInterval(() => {
            if (accelerating) {
                currentSpeed += 0.001;
                if (currentSpeed >= warpSpeed) {
                    accelerating = false;
                }
            } else {
                currentSpeed -= 0.001;
                if (currentSpeed <= originalStarSpeed) {
                    clearInterval(warpInterval);
                    currentSpeed = originalStarSpeed;
                }
            }

            // Set the current speed
            this.starsRotationSpeed = currentSpeed;

        }, 16);

        // Add more shooting stars during warp
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                this.createShootingStar();
            }, i * 100);
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Dampen mouse movement for smooth camera response
        this.mouse.xDamped += (this.mouse.x - this.mouse.xDamped) * 0.1;
        this.mouse.yDamped += (this.mouse.y - this.mouse.yDamped) * 0.1;

        // Subtle camera movement based on mouse position
        this.camera.position.x = this.mouse.xDamped * 2;
        this.camera.position.y = this.mouse.yDamped * 2;
        this.camera.lookAt(0, 0, 0);

        // Star rotation - use variable speed for warp effect
        this.stars.rotation.y += this.starsRotationSpeed || 0.0004;

        // Update shooting stars
        if (this.shootingStars) {
            this.updateShootingStars();
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new SpaceBackground();
});