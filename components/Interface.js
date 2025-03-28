import "../styles/interface.scss";
import { createThemeManager } from "./ThemeManager";
import resetViewManager from "./ResetViewManager";

export function createInterface() {
  // Initialize theme manager
  const themeManager = createThemeManager();

  // Create border lines in corners
  const createBorderLines = () => {
    const lines = [
      { position: "top-left-h", type: "horizontal" },
      { position: "top-left-v", type: "vertical" },
      { position: "top-right-h", type: "horizontal" },
      { position: "top-right-v", type: "vertical" },
      { position: "bottom-left-h", type: "horizontal" },
      { position: "bottom-left-v", type: "vertical" },
      { position: "bottom-right-h", type: "horizontal" },
      { position: "bottom-right-v", type: "vertical" },
    ];

    lines.forEach((line) => {
      const element = document.createElement("div");
      element.classList.add("border-line", `border-line-${line.position}`, `border-line-${line.type}`);
      document.body.appendChild(element);
    });
  };
  createBorderLines();

  const interfaceContainer = document.createElement("div");
  interfaceContainer.classList.add("interface");
  const controlsContainer = document.createElement("div");
  controlsContainer.classList.add("interface-controls");

  // Icons for theme
  const sunIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  const moonIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  // Controls without audio option
  const controls = [
    {
      id: "theme",
      text: themeManager.isDarkTheme() ? "Light Mode" : "Dark Mode",
      icon: themeManager.isDarkTheme() ? sunIcon : moonIcon,
    },
    {
      id: "help",
      text: "Help",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    },
    {
      id: "reset",
      text: "Reset View",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>',
    },
    {
      id: "about",
      text: "About",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    },
  ];

  controls.forEach((control) => {
    const button = document.createElement("button");
    button.classList.add("control-button");
    button.id = `${control.id}-btn`;
    button.innerHTML = `${control.icon} <span>${control.text}</span>`;

    button.addEventListener("click", () => {
      switch (control.id) {
        case "theme":
          const isDark = themeManager.toggleTheme();
          button.innerHTML = isDark ? `${sunIcon} <span>Light Mode</span>` : `${moonIcon} <span>Dark Mode</span>`;
          break;
        case "help":
          showHelp();
          break;
        case "reset":
          resetViewManager.resetView();
          break;
        case "about":
          showAbout();
          break;
      }
    });

    controlsContainer.appendChild(button);
  });

  // Create page counter (initially hidden)
  const pageCounter = document.createElement("div");
  pageCounter.classList.add("page-counter", "hidden");
  pageCounter.textContent = "000/000";

  const imageCounter = {
    current: 0,
    total: 0,
    isActive: false,
    poemShown: false,
  };

  function updateImageCounter(index, total) {
    imageCounter.current = index;
    imageCounter.total = total;
    pageCounter.textContent = `${String(index).padStart(3, "0")}/${String(total).padStart(3, "0")}`;
    
    if (total > 0 && !imageCounter.isActive) {
      imageCounter.isActive = true;
      pageCounter.classList.remove("hidden");
    }
  }

  function initImageCounter() {
    imageCounter.poemShown = true;
    updateImageCounter(0, 0);
  }

  // Add elements to DOM
  interfaceContainer.appendChild(controlsContainer);
  document.body.appendChild(interfaceContainer);
  document.body.appendChild(pageCounter);

  // Helper functions
  function showHelp() {
    const helpModal = document.createElement("div");
    helpModal.classList.add("modal");
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
    helpModal.querySelector(".close-modal").addEventListener("click", () => {
      document.body.removeChild(helpModal);
    });
  }

  function showAbout() {
    const aboutModal = document.createElement("div");
    aboutModal.classList.add("modal");
    aboutModal.innerHTML = `
      <div class="modal-content">
        <h2>About</h2>
        <p>An immersive surreal experience exploring Mila's photography art.</p>
        <button class="close-modal">Close</button>
      </div>
    `;
    document.body.appendChild(aboutModal);
    aboutModal.querySelector(".close-modal").addEventListener("click", () => {
      document.body.removeChild(aboutModal);
    });
  }

  return {
    container: interfaceContainer,
    showHelp,
    showAbout,
    initImageCounter,
    updateImageCounter,
    themeManager,
  };
}