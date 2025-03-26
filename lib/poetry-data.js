export const poems = [
    {
        title: "Laberintos Personales",
        content:"Esta soy yo,\n" +
                "Etérea ante mi umbría \n" +
                "La pulsación me corresponde \n" +
                "Halo de iniciación \n" +
                "Sin mayor dilación \n" +
                "Torno a mi encuentro.",
        author: "Camila Morales"    
    },
];

export function getPoemByTitle(title) {
    return poems.find(poem => poem.title === title);
}

export function getAllPoems() {
    return poems;
}