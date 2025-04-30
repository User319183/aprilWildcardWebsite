class SpaceCursor {
    constructor() { // Constructor initializes the cursor when an instance is created
        this.customCursor = document.createElement('div'); // Define the custom cursor element
        this.customCursor.classList.add('space-cursor'); // Add a class to the cursor for styling

        const style = document.createElement('style'); // Inject CSS styles for the custom cursor
        style.textContent = `
            body { cursor: none !important; } /* Hide the default cursor completely */
            .space-cursor {
                position: fixed; /* Fixed positioning so cursor follows the mouse */
                width: 40px;
                height: 40px
                border-radius: 50%; /* Makes the cursor circular */
                background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 20%, rgba(25,118,210,0.2) 60%, transparent 70%); /* Creates a glowing radial gradient effect */
                pointer-events: none; /* Prevents the cursor from interfering with clicks */
                z-index: 9999; /* Ensures cursor appears above all other elements */
                transform: translate(-50%, -50%); /* Centers the cursor on the actual pointer position */
                box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.4); /* Adds an outer glow effect */
                transition: transform 0.1s ease; /* Smooth transition for cursor size changes */
            }
            .space-cursor::after { /* Center dot of cursor */
                content: ''; /* Creates the center dot of the cursor */
                position: absolute;
                top: 50%;
                left: 50%;
                width: 6px;
                height: 6px;
                background-color: white; /* White center dot */
                border-radius: 50%; /* Makes the center dot circular */
                transform: translate(-50%, -50%); /* Centers the dot */
            }
            .space-cursor::before { /* Middle ring of cursor */
                content: ''; /* Creates the middle ring of the cursor */
                position: absolute; /* Position absolutely relative to the cursor */
                top: 50%;
                left: 50%;
                width: 16px;
                height: 16px;
                border: 1px solid rgba(255, 255, 255, 0.5); /* White border creates the ring */
                border-radius: 50%; /* Makes the ring circular */
                transform: translate(-50%, -50%); /* Centers the ring */
            }
            a:hover ~ .space-cursor, /* Style for cursor when hovering over links */
            button:hover ~ .space-cursor { /* Style for cursor when hovering over buttons */
                transform: translate(-50%, -50%) scale(1.5); /* Enlarges the cursor when hovering over interactive elements */
                background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 20%, rgba(64,156,255,0.3) 60%, transparent 70%); /* Brighter gradient when hovering over links and buttons */
            }
            .clickable:hover ~ .space-cursor, /* Style for cursor when hovering over elements with clickable class */
            [role="button"]:hover ~ .space-cursor, /* Style for cursor when hovering over elements with button role */
            input:hover ~ .space-cursor, /* Style for cursor when hovering over input elements */
            select:hover ~ .space-cursor, /* Style for cursor when hovering over select elements */
            label:hover ~ .space-cursor { /* Style for cursor when hovering over label elements */
                transform: translate(-50%, -50%) scale(1.5); /* Enlarges the cursor when hovering over these interactive elements */
                background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 20%, rgba(64,156,255,0.3) 60%, transparent 70%); /* Brighter gradient for hover state */
            }
        `;
        document.head.appendChild(style); // Add the style element to the document head
        document.body.appendChild(this.customCursor); // Add the custom cursor element to the document body

        document.addEventListener('mousemove', (event) => { // Track mouse movement
            if (this.customCursor) { // Check if custom cursor exists
                this.customCursor.style.left = `${event.clientX}px`; // Update the horizontal position of the cursor
                this.customCursor.style.top = `${event.clientY}px`; // Update the vertical position of the cursor
            }
        });

        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, label, .clickable'); // Handle cursor state when hovering over interactive elements
        interactiveElements.forEach(element => { // For each interactive element, add event listeners
            element.addEventListener('mouseenter', () => { // Add mouseenter event listener
                this.customCursor.classList.add('hover'); // Add hover class when mouse enters an interactive element
            });
            element.addEventListener('mouseleave', () => { // Add mouseleave event listener
                this.customCursor.classList.remove('hover'); // Remove hover class when mouse leaves an interactive element
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => { // Initialize when the DOM is fully loaded
    new SpaceCursor(); // Create a new instance of SpaceCursor when the page is fully loaded
});