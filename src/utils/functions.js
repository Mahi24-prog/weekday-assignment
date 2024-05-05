export const toUpperCase = (mySentence) => {
    const words = mySentence.split(" ");

    return words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ");
}