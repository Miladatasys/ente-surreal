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
    {
        content:"Soy como mis fantasias \n" +
                "Ambulante de ojos cristalizados."
    },
    {
        content:"Apesadumbrado \n" +
                "En la lumbrera."
    }
];

export function getPoemByTitle(title) {
    return poems.find(poem => poem.title === title);
}

export function getAllPoems() {
    return poems;
}