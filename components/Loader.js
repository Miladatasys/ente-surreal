import '../styles/loader.scss';

export function createLoader() {
    const loaderContainer = document.createElement('div');
    loaderContainer.classList.add('loader-container');
    const loaderElement = document.createElement('div');
    loaderElement.classList.add('loader');

    document.body.appendChild(loaderContainer);
    loaderContainer.appendChild(loaderElement);

    return {
        show() {
            loaderContainer.classList.add('visible')
        },
        hide() {
            loaderContainer.classList.remove('visible')
        }
    };

}