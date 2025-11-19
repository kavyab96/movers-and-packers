
const capitalizeFirst = (text) => {


    if (!text) return null;
     // Remove extra spaces: collapse multiple → one
    text = text.replace(/\s+/g, " ").trim();

    
   // Capitalize first letter of each word
    return text
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

module.exports = { capitalizeFirst };
