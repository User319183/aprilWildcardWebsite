class SpaceCursor {
    constructor() {
        // Define the custom cursor element
        this.customCursor = document.createElement('div');
        this.customCursor.classList.add('space-cursor');
        
        // Inject CSS styles for the custom cursor
        const style = document.createElement('style');
        style.textContent = `
            body { 
                cursor: none !important; 
            }
            .space-cursor {
                position: fixed;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 20%, rgba(25,118,210,0.2) 60%, transparent 70%);
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.4);
                transition: transform 0.1s ease;
            }
            .space-cursor::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 6px;
                height: 6px;
                background-color: white;
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }
            .space-cursor::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 16px;
                height: 16px;
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }
            a:hover ~ .space-cursor,
            button:hover ~ .space-cursor {
                transform: translate(-50%, -50%) scale(1.5);
                background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 20%, rgba(64,156,255,0.3) 60%, transparent 70%);
            }
            .clickable:hover ~ .space-cursor,
            [role="button"]:hover ~ .space-cursor,
            input:hover ~ .space-cursor,
            select:hover ~ .space-cursor,
            label:hover ~ .space-cursor {
                transform: translate(-50%, -50%) scale(1.5);
                background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 20%, rgba(64,156,255,0.3) 60%, transparent 70%);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(this.customCursor);
        
        // Track mouse movement
        document.addEventListener('mousemove', (event) => {
            if (this.customCursor) {
                this.customCursor.style.left = `${event.clientX}px`;
                this.customCursor.style.top = `${event.clientY}px`;
            }
        });
        
        // Handle cursor state when hovering over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, label, .clickable');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.customCursor.classList.add('hover');
            });
            element.addEventListener('mouseleave', () => {
                this.customCursor.classList.remove('hover');
            });
        });
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new SpaceCursor();
});