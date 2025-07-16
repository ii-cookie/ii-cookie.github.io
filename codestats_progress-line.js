//copied from codestats.js
async function fetchstat() {
    try {
        let language_list = [];
        let xp_list = [];

        const response = await fetch('https://codestats.net/api/users/iicookie');
        if (!response.ok) {
            console.log('Problem fetching stat');
            return { languages: [], xps: [] }; // return empty arrays on error
        }

        const stat = await response.json();
        const languages = stat.languages;

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

function createstatArray(languages, xps){
    if(languages.length !== xps.length){
        console.error('xp and language not the same array length')
        return []
    }

    return languages.map((language, index) => ({
        title: language,
        value: xps[index]
        // // color: getRandomColor()
        // // color: getRandomPastelColor()
        // color: getGooglePaletteColor(languages.length, index)
    }))
}

const known_languages_with_logo = {
    "HTML": " <i class='bxl  bx-html5'  ></i> ", 
    "CSS": " <i class='bxl  bx-css3'  ></i> ", 
    "Python": " <i class='bxl  bx-python'  ></i> ", 
    "C++": " <i class='bxl  bx-c-plus-plus'  ></i> ", 
    "JavaScript": " <i class='bxl  bx-javascript'  ></i> ", 
}



$(function(){
    fetchstat().then(result => {
        const lang = result.languages;
        const xp = result.xps;
        const statArray = createstatArray(lang,xp);
        //might as well sort it
        const sorted_statArray = statArray.sort((a,b) => b.value - a.value)
        console.log(sorted_statArray)
        console.log(sorted_statArray.title)
        
        // sorted_statArray.map(function(e, index){  //CHANGE COLOR HERE 
        //   e.color = getGooglePaletteColor(sorted_statArray.length, index)
        //   e.color = getPrimaryGradientColor(sorted_statArray.length, index)
        // })

        // $('#pieChart').drawPieChart(sorted_statArray)

        const parentElement = document.getElementById('Technical-bars')

        for(let i = 0; i < sorted_statArray.length; i++){
            const bar = document.createElement("div")
            bar.classList.add("bar")

            const info = document.createElement("div")
            info.classList.add("info")
            info.textContent = sorted_statArray[i].title + ' - ' + sorted_statArray[i].value.toString()

            if (sorted_statArray[i].title in known_languages_with_logo){
                info.innerHTML = sorted_statArray[i].title + known_languages_with_logo[sorted_statArray[i].title] + ' - ' + sorted_statArray[i].value.toString()
            }

            const progress_line = document.createElement("div")
            progress_line.classList.add("progress-line")
            progress_line.classList.add(sorted_statArray[i].title)
            let span = document.createElement("span")
            progress_line.append(span)

            let percentage = (sorted_statArray[i].value / sorted_statArray[0].value) * 100
            span.style.width = percentage.toString() + '%'

            bar.append(info)
            bar.append(progress_line)
            parentElement.append(bar)
        }


    }).catch(error => {
        console.error('cant draw it bro cuz:', error);
        // $('#pieChart').drawPieChart([])
    })
})

function progress_line_theme_toggle(){
    old = document.getElementById('Technical-bars');
    old.innerHTML = ""

    $(function(){
        fetchstat().then(result => {
            const lang = result.languages;
            const xp = result.xps;
            const statArray = createstatArray(lang,xp);
            //might as well sort it
            const sorted_statArray = statArray.sort((a,b) => b.value - a.value)
            console.log(sorted_statArray)
            console.log(sorted_statArray.title)
            
            // sorted_statArray.map(function(e, index){  //CHANGE COLOR HERE 
            //   e.color = getGooglePaletteColor(sorted_statArray.length, index)
            //   e.color = getPrimaryGradientColor(sorted_statArray.length, index)
            // })
    
            // $('#pieChart').drawPieChart(sorted_statArray)
    
            const parentElement = document.getElementById('Technical-bars')
    
            for(let i = 0; i < sorted_statArray.length; i++){
                const bar = document.createElement("div")
                bar.classList.add("bar")
    
                const info = document.createElement("div")
                info.classList.add("info")
                info.textContent = sorted_statArray[i].title + ' - ' + sorted_statArray[i].value.toString()
    
                if (sorted_statArray[i].title in known_languages_with_logo){
                    info.innerHTML = sorted_statArray[i].title + known_languages_with_logo[sorted_statArray[i].title] + ' - ' + sorted_statArray[i].value.toString()
                }
    
                const progress_line = document.createElement("div")
                progress_line.classList.add("progress-line")
                progress_line.classList.add(sorted_statArray[i].title)
                let span = document.createElement("span")
                progress_line.append(span)
    
                let percentage = (sorted_statArray[i].value / sorted_statArray[0].value) * 100
                span.style.width = percentage.toString() + '%'
    
                bar.append(info)
                bar.append(progress_line)
                parentElement.append(bar)
            }
    
    
        }).catch(error => {
            console.error('cant draw it bro cuz:', error);
            // $('#pieChart').drawPieChart([])
        })
    })
}