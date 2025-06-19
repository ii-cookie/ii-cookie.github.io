async function fetchData() {
    try {
        let language_list = [];
        let xp_list = [];

        const response = await fetch('https://codestats.net/api/users/iicookie');
        if (!response.ok) {
            console.log('Problem fetching data');
            return { languages: [], xps: [] }; // return empty arrays on error
        }

        const data = await response.json();
        const languages = data.languages;

        for (const language in languages) {
            language_list.push(language); 
            xp_list.push(languages[language].xps); 
        }

        return { languages: language_list, xps: xp_list }; // return as array
    } catch (error) {
        console.error('Error:', error);
        return { languages: [], xps: [] }; // returning empty when error
    }
}


fetchData().then(result => {
    const lang = result.languages; // Extract language names
    const xp = result.xps; // Extract XP values
    console.log('Languages:', lang); // Array of language names
    console.log('XP:', xp); // Array of XP numbers
}).catch(error => {
    console.error('Failed to fetch data:', error);
});