// ==UserScript==
// @name        SneshGPT_sidebar
// @namespace   Violentmonkey Scripts
// @match       https://chatgpt.com/*
// @grant       none
// @version     1.0.0
// @author      sensha
// @downloadURL https://github.com/senshastic/sensha-betterer-todoist/raw/refs/heads/main/js/SneshGPT_sidebar.user.js
// @updateURL   https://github.com/senshastic/sensha-betterer-todoist/raw/refs/heads/main/js/SneshGPT_sidebar.user.js
// @icon        https://cdn.discordapp.com/emojis/1245456048383459439.webp?size=240&quality=lossless
// @description Apply acrylic effect and collapsible functionality to ChatGPT sidebar with a persistent, dynamically visible trigger zone and extra styles.
// ==/UserScript==

(function () {
    'use strict';

    let triggerZone; // Store the reference to the trigger zone

    // Function to apply acrylic effect and styling to the sidebar
    function applySidebarStyles(sidebar) {
        if (sidebar) {
            // First glass effect (Main sidebar)
            Object.assign(sidebar.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '260px',
                height: '100vh',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(25px) saturate(200%) contrast(90%)',
                webkitBackdropFilter: 'blur(25px) saturate(200%) contrast(90%)',
                color: 'white',
                zIndex: '1000',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
                transform: 'translateX(0)',
                opacity: '1',
                pointerEvents: 'auto',
                paddingBottom: '50px',
            });

            // Second glass effect using ::before pseudo-element (Top layer with border)
            let styleSheet = document.createElement("style");
            styleSheet.textContent = `
                div.flex-shrink-0.overflow-x-hidden.bg-token-sidebar-surface-primary::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%);
                    backdrop-filter: blur(15px) saturate(180%) contrast(90%);
                    border: 1px solid rgba(255, 255, 255, 0.1); /* Only border on top layer */
                    box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.1);
                    pointer-events: none;
                    z-index: -1;
                }

                .no-draggable.group.relative.rounded-lg:hover {
                    margin-left: 10px !important;
                    transition: margin-left 0.2s ease;
                }

                .specific-bg-token-sidebar,
                .absolute.bottom-0.top-0.to-transparent.ltr\\:right-0.ltr\\:bg-gradient-to-l.rtl\\:left-0.rtl\\:bg-gradient-to-r.from-token-sidebar-surface-primary.from-token-sidebar-surface-primary.can-hover\\:group-hover\\:from-token-sidebar-surface-secondary.w-8.from-0\\%.can-hover\\:group-hover\\:w-10.can-hover\\:group-hover\\:from-60\\% {
                    position: relative !important;
                    overflow: hidden !important;
                }
            `;
            document.head.appendChild(styleSheet);

            // Create footer similar to Todoist
            createSidebarFooter(sidebar);
        }
    }

    // Function to create a trigger zone and handle sidebar sliding
    function initializeSidebarToggle(sidebar) {
        if (!triggerZone || !document.body.contains(triggerZone)) {
            // Create the trigger zone if it doesn't exist yet or has been removed
            triggerZone = document.createElement('div');
            Object.assign(triggerZone.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '70px', // Increased width for better triggering experience
                height: '100vh',
                backgroundColor: 'rgba(255, 255, 255, 0.5)', // Make the trigger zone white and more visible
                zIndex: '2001', // Increased z-index to ensure it's always on top
                pointerEvents: 'auto',
                transition: 'background-color 0.3s ease-in-out',
            });
            document.body.appendChild(triggerZone);
        }

        // Update trigger zone opacity based on mouse position
        function updateTriggerZoneOpacity(distance) {
            let opacity = Math.max(0, (250 - distance) / 250); // Updated trigger zone sensitivity
            triggerZone.style.backgroundColor = `rgba(255, 255, 255, ${opacity * 0.3})`; // Adjusted color for visibility with higher opacity
        }

        // Show/hide the sidebar based on mouse movement
        function handleMouseMove(e) {
            const leftEdgeDistance = e.clientX;

            // Refresh the toggle button references
            let sidebarToggleButtonOpen = document.querySelector('button[aria-label="Open sidebar"]');
            let sidebarToggleButtonClose = document.querySelector('button[data-testid="close-sidebar-button"]');
            let sidebarToggleButton = sidebarToggleButtonOpen || sidebarToggleButtonClose;

            if (leftEdgeDistance < 70) { // Adjusted distance for better triggering
                // Show sidebar
                Object.assign(sidebar.style, {
                    transform: 'translateX(0)',
                    opacity: '1',
                    pointerEvents: 'auto'
                });
                triggerZone.style.display = "none";

                // Ensure the sidebar is open
                if (sidebarToggleButton && sidebarToggleButton.getAttribute('aria-label') === 'Open sidebar') {
                    sidebarToggleButton.click(); // Simulate button click immediately
                }
            }
            // Hide sidebar
            else if (leftEdgeDistance > 280) {
                // Hide sidebar
                Object.assign(sidebar.style, {
                    transform: 'translateX(-260px)',
                    opacity: '0',
                    pointerEvents: 'none'
                });
                triggerZone.style.display = "block";

                // Ensure the sidebar is closed
                if (sidebarToggleButton && sidebarToggleButton.getAttribute('data-testid') === 'close-sidebar-button') {
                    sidebarToggleButton.click(); // Simulate button click immediately
                }
            }

            // Update opacity of trigger zone for dynamic visibility
            updateTriggerZoneOpacity(leftEdgeDistance);
        }

        document.addEventListener('mousemove', handleMouseMove);
    }

    // Function to create footer at the bottom of the sidebar
    function createSidebarFooter(sidebar) {
        const footer = document.createElement('div');
        footer.style.position = 'absolute';
        footer.style.bottom = '10px';
        footer.style.left = '15px';
        footer.style.fontSize = '9px';
        footer.style.color = 'rgba(255, 255, 255, 0.7)';
        footer.style.zIndex = '1000';

        const linkSensha = document.createElement('a');
        linkSensha.href = 'https://github.com/senshastic';
        linkSensha.innerText = 'SneshCorp. @1984. All rights reserved (to ';
        linkSensha.style.textDecoration = 'none';
        linkSensha.style.color = 'rgba(255, 255, 255, 0.7)';

        const linkFallenStar = document.createElement('a');
        linkFallenStar.href = 'https://github.com/senshastic';
        linkFallenStar.innerText = 'FallenStar';
        linkFallenStar.style.textDecoration = 'none';
        linkFallenStar.style.color = 'rgba(255, 255, 255, 0.7)';

        linkFallenStar.addEventListener('mouseenter', function() {
            linkFallenStar.href = 'https://github.com/FallenStar08';
        });

        linkFallenStar.addEventListener('mouseleave', function() {
            linkFallenStar.href = 'https://github.com/senshastic';
        });

        const endText = document.createTextNode(').');

        footer.appendChild(linkSensha);
        footer.appendChild(linkFallenStar);
        footer.appendChild(endText);

        sidebar.appendChild(footer); // Add the footer to the sidebar
    }

    // Function to observe changes in the DOM and apply sidebar styles when the element appears
    function initializeSidebarObserver() {
        const observer = new MutationObserver(() => {
            let sidebar = document.querySelector('div.flex-shrink-0.overflow-x-hidden.bg-token-sidebar-surface-primary');
            if (sidebar) {
                applySidebarStyles(sidebar);
                initializeSidebarToggle(sidebar);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to initialize the sidebar
    function initializeSidebar() {
        let sidebar = document.querySelector('div.flex-shrink-0.overflow-x-hidden.bg-token-sidebar-surface-primary');

        if (sidebar) {
            applySidebarStyles(sidebar);
            initializeSidebarToggle(sidebar);
        } else {
            initializeSidebarObserver();
        }
    }

    // Add event listener for when the sidebar toggle button is clicked
    function initializeSidebarToggleButtonListener() {
        document.addEventListener('click', (event) => {
            const sidebarToggleButtonOpen = event.target.matches('button[aria-label="Open sidebar"]');
            const sidebarToggleButtonClose = event.target.matches('button[data-testid="close-sidebar-button"]');

            if (sidebarToggleButtonOpen || sidebarToggleButtonClose) {
                let sidebar = document.querySelector('div.flex-shrink-0.overflow-x-hidden.bg-token-sidebar-surface-primary');
                if (sidebar) {
                    applySidebarStyles(sidebar);
                    initializeSidebarToggle(sidebar); 
                }
            }
        });
    }

    // Initialize sidebar styling, listener for toggle button, and trigger zone persistence check
    initializeSidebar();
    initializeSidebarToggleButtonListener();
})();
