async function fetchCodeData() {
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


function getRandomColor(){
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i<6; i++){
        color += letters[Math.floor(Math.random()*16)]
    }
}



function createDataArray(languages, xps){
    if(languages.length !== xps.length){
        console.error('xp and language not the same array length')
        return []
    }

    return languages.map((language, index) => ({
        title: language,
        value: xps[index],
        color: getRandomColor()
    }))
}


// fetchCodeData().then(result => {
//     const lang = result.languages; // Extract language names
//     const xp = result.xps; // Extract XP values
//     console.log('Languages:', lang); // Array of language names
//     console.log('XP:', xp); // Array of XP numbers
// }).catch(error => {
//     console.error('Failed to fetch data:', error);
// });

fetchCodeData().then(result => {
    const lang = result.languages
    const xp = result.xps
    const dataArray = createDataArray(lang, xp)
    console.log('Data Array:', dataArray)
    //might as well sort it
    const sorted_dataArray = dataArray.sort((a,b) => b.value - a.value)
}).catch(error => {
    console.error('failed to get dataArray:', error)
})