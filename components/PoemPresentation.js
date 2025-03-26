import '../styles/poem-presentation.scss';
import { getPoemByTitle } from '../lib/poetry-data';

export function createPoemPresentation(poemTitle = "Laberintos Personales") {
    const selectedPoem = getPoemByTitle(poemTitle);

    if (!selectedPoem) {
        console.error(`Poem with title "${poemTitle}" not found`)
        return null;
    }

    const poemContainer = document.createElement('div');
    poemContainer.classList.add('poem-container'); 

    poemContainer.innerHTML = `
    <div class="poem">
        <h2>${selectedPoem.title}</h2>
        <p>${selectedPoem.content.split('\n').join('<br>')}</p>
        <p class="author">${selectedPoem.author}</p>
    </div>
    `;

    document.body.appendChild(poemContainer);

    // Add click event to remove poem
    poemContainer.addEventListener('click', () => {
        poemContainer.classList.add('fade-out');
        setTimeout(() => {
            poemContainer.remove();
        }, 500);
    });

    return {
        show() {
            poemContainer.classList.add('visible');
        }
    };

}