fetchData();

async function fetchData(){
    try{
        let languages = [];
        let language = [];
        let language_list = [];
        let xp_list = [];
        
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
        console.log(languages)
        c=0;
        for (language in languages){
            ++c
            console.log(language)   //name of each language here
            language_list.push(language)
            xp = languages[language].xps
            console.log(xp)         //xp in this language here
            xp_list.push(xp);
        }
        console.log(c)  //total number of languages here
        console.log(language_list)  //list of languages here
        console.log(xp_list)        //list of xp here

        return language_list, xp_list;
    }
    catch(error){
        console.error(error);
    }
}