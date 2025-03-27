import '../styles/interface.scss';

export function createInterface(toggleAudio, isAudioPlaying) {
    const interfaceContainer = document.createElement('div');
    interfaceContainer.classList.add('interface');
    interfaceContainer.style.zIndex = '10000'; // Ensure it's on top

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('interface-controls');

    const controls = [
        { 
            id: 'sound', 
            text: isAudioPlaying ? 'Sound On' : 'Sound Off', 
            icon: isAudioPlaying ? 
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a9 9 0 0 1 0 14.14"></path></svg>' : 
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="22" y2="15"></line></svg>' 
        },
        { 
            id: 'help', 
            text: 'Help', 
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>' 
        },
        { 
            id: 'reset', 
            text: 'Reset View', 
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-compass"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>' 
        },
        { 
            id: 'about', 
            text: 'About', 
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>' 
        }
    ];

    controls.forEach(control => {
        const button = document.createElement('button');
        button.classList.add('control-button');
        button.id = `${control.id}-btn`;
        button.innerHTML = `${control.icon} <span>${control.text}</span>`;
        
        button.addEventListener('click', () => {
            switch(control.id) {
                case 'sound':
                    toggleAudio();
                    // Update button text and icon
                    button.innerHTML = isAudioPlaying ? 
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="22" y2="15"></line></svg> <span>Sound Off</span>' : 
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a9 9 0 0 1 0 14.14"></path></svg> <span>Sound On</span>';
                    break;
                case 'help':
                    showHelp();
                    break;
                case 'reset':
                    resetView();
                    break;
                case 'about':
                    showAbout();
                    break;
            }
        });

        controlsContainer.appendChild(button);
    });

    const pageCounter = document.createElement('div');
    pageCounter.classList.add('page-counter');
    pageCounter.textContent = '001/005';

    interfaceContainer.appendChild(controlsContainer);
    interfaceContainer.appendChild(pageCounter);
    document.body.appendChild(interfaceContainer);

    function showHelp() {
        const helpModal = document.createElement('div');
        helpModal.classList.add('modal');
        helpModal.innerHTML = `
            <div class="modal-content">
                <h2>Gallery Controls</h2>
                <ul>
                    <li><strong>Click + Drag:</strong> Rotate view</li>
                    <li><strong>Scroll:</strong> Zoom in/out</li>
                    <li><strong>Hover Points:</strong> Reveal poetry</li>
                </ul>
                <button class="close-modal">Close</button>
            </div>
        `;
        document.body.appendChild(helpModal);

        helpModal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(helpModal);
        });
    }

    function resetView() {
        console.log('View reset');
    }

    function showAbout() {
        const aboutModal = document.createElement('div');
        aboutModal.classList.add('modal');
        aboutModal.innerHTML = `
            <div class="modal-content">
                <h2>About</h2>
                <p>An immersive surreal experience exploring Mila's photography art.</p>
                <button class="close-modal">Close</button>
            </div>
        `;
        document.body.appendChild(aboutModal);

        aboutModal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(aboutModal);
        });
    }

    return {
        container: interfaceContainer,
        showHelp,
        resetView,
        showAbout
    };
}