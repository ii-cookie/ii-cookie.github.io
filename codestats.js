console.log('hi');
// var all_data;
// var lang;

// fetchdata();

// async function fetchdata(){
//     const response = await fetch("https://codestats.net/api/users/iicookie")
//         .then(res => res.json())
//         .then(data => {
//             all_data = data;
//             console.log(data.languages)})
//         .catch(error => console.error(error));
//     console.log(all_data);
// }
fetchData();

async function fetchData(){

    try{
        let languages = [];
        let language = [];
        
        await fetch('https://codestats.net/api/users/iicookie')
        .then(res=>{
            if(!res.ok){
                console.log('Problem');
                return;
            }
            return res.json();
        })
        .then(data=>{
            d=data;
            languages=data.languages;
        })
        .catch(error=>{
            console.log('ERROR')
        });
        // const pokemonSprite = data.sprites.front_default;
        // const imgElement = document.getElementById("pokemonSprite");

        // imgElement.src = pokemonSprite;
        // imgElement.style.display = "block";
        c=0;
        for (language in languages){
            ++c
            console.log(language)   //name of each language here
            xp = languages[language].xps
            console.log(xp)         //xp in this language here
        }
        console.log(c)  //total number of languages here
        
    }
    catch(error){
        console.error(error);
    }
}



// await fetch('https://codestats.net/api/users/iicookie')
//     .then(res=>{
//         if(!res.ok){
//             console.log('Problem');
//             return;
//         }
//         return res.json();
//     })
//     .then(data=>{
//         languages=data.languages;
//     })
//     .catch(error=>{
//         console.log('ERROR')
//     });


// console.log(languages);
// console.log(languages.CSS);