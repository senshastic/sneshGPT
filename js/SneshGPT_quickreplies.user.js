// ==UserScript==
// @name        SneshGPT_quickreplies
// @namespace   Violentmonkey Scripts
// @match       https://chatgpt.com/*
// @grant       none
// @version     1.0.0
// @author      sensha
// @icon        https://cdn.discordapp.com/emojis/1245456048383459439.webp?size=240&quality=lossless
// @description Offers a set of predetermined customized quik replies.
// ==/UserScript==

(function () {
    'use strict';

    // Define two sets of quick replies
    const quickRepliesWithCode = [
        "Find another way of doing this.",
        "No worky, pls fix.",
        "It works! How do I make it better?",
        "Can you explain this code?"
    ];

    const quickRepliesWithoutCode = [
        "Can you give other examples?",
        "Can you write this better?",
        "Give this a more casual tone"
    ];

    function createQuickReplyButtons() {
        const assistantMessages = document.querySelectorAll('div[data-message-author-role="assistant"]');
        console.log('Assistant messages found:', assistantMessages.length);

        if (assistantMessages.length > 0) {
            const latestMessage = assistantMessages[assistantMessages.length - 1];
            console.log('Latest message found:', latestMessage);

            // Clear existing buttons if present
            const existingButtons = latestMessage.querySelector('.quick-reply-buttons');
            if (existingButtons) {
                existingButtons.remove(); // Remove old buttons
                console.log('Existing buttons removed.');
            }

            // Check for code blocks within the latest message
            const codeBlocks = latestMessage.querySelectorAll('pre'); 

            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('quick-reply-buttons');
            buttonContainer.style.marginTop = '10px';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '10px';

            // Choose the set of replies based on the presence of code blocks
            const quickReplies = codeBlocks.length > 0 ? quickRepliesWithCode : quickRepliesWithoutCode;

            quickReplies.forEach(reply => {
                const button = document.createElement('button');
                button.textContent = reply;

                // Apply button styling
                Object.assign(button.style, {
                    backgroundColor: 'rgba(5, 5, 5, 0.281)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(100px) saturate(110%)',
                    WebkitBackdropFilter: 'blur(100px)',
                    transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
                    padding: '5px',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                });

                // Add hover effect
                button.addEventListener('mouseenter', () => {
                    Object.assign(button.style, {
                        backgroundColor: 'rgba(5, 5, 5, 0.5)',  // Slightly darker on hover
                        boxShadow: '0 8px 15px rgba(0, 0, 0, 0.37)',
                        transform: 'translateY(-2px)',
                    });
                });

                button.addEventListener('mouseleave', () => {
                    Object.assign(button.style, {
                        backgroundColor: 'rgba(5, 5, 5, 0.281)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(0)',
                    });
                });

                // Simulate message send on click
                button.addEventListener('click', () => {
                    simulateUserMessage(reply);
                });

                buttonContainer.appendChild(button);
            });

            latestMessage.appendChild(buttonContainer);
            console.log('Buttons appended to the latest message.');
        } else {
            console.log('No assistant messages found.');
        }
    }

    function simulateUserMessage(message) {
        const inputBox = document.querySelector('div.ProseMirror');
        const sendButton = document.querySelector('button[data-testid="send-button"]');
        console.log('Input box found:', inputBox !== null);
        console.log('Send button found:', sendButton !== null);

        if (inputBox && sendButton) {
            inputBox.innerHTML = `<p>${message}</p>`;
            inputBox.dispatchEvent(new Event('input', { bubbles: true }));

            sendButton.click();
            console.log('Message sent:', message);
        } else {
            console.log('Failed to find input box or send button.');
        }
    }

    // Observe changes to the whole document
    const observer = new MutationObserver(() => {
        console.log('Mutation observed. Checking for assistant messages...');
        createQuickReplyButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('Mutation observer started.');

    // Log the number of assistant messages every 2 seconds
    setInterval(() => {
        const assistantMessages = document.querySelectorAll('div[data-message-author-role="assistant"]');
        console.log('Checking for assistant messages:', assistantMessages.length);

        // Check for code blocks and adjust buttons accordingly
        if (assistantMessages.length > 0) {
            createQuickReplyButtons();
        }
    }, 2000);

    // Initial check for assistant messages
    createQuickReplyButtons();
})();
