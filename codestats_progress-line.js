//copied from codestats.js
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

function createDataArray(languages, xps){
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
    fetchData().then(result => {
        const lang = result.languages;
        const xp = result.xps;
        const dataArray = createDataArray(lang,xp);
        //might as well sort it
        const sorted_dataArray = dataArray.sort((a,b) => b.value - a.value)
        console.log(sorted_dataArray)
        console.log(sorted_dataArray.title)
        
        // sorted_dataArray.map(function(e, index){  //CHANGE COLOR HERE 
        //   e.color = getGooglePaletteColor(sorted_dataArray.length, index)
        //   e.color = getPrimaryGradientColor(sorted_dataArray.length, index)
        // })

        // $('#pieChart').drawPieChart(sorted_dataArray)

        const parentElement = document.getElementById('Technical-bars')

        for(let i = 0; i < sorted_dataArray.length; i++){
            const bar = document.createElement("div")
            bar.classList.add("bar")

            const info = document.createElement("div")
            info.classList.add("info")
            info.textContent = sorted_dataArray[i].title + ' - ' + sorted_dataArray[i].value.toString()

            if (sorted_dataArray[i].title in known_languages_with_logo){
                info.innerHTML = sorted_dataArray[i].title + known_languages_with_logo[sorted_dataArray[i].title] + ' - ' + sorted_dataArray[i].value.toString()
            }

            const progress_line = document.createElement("div")
            progress_line.classList.add("progress-line")
            progress_line.classList.add(sorted_dataArray[i].title)
            let span = document.createElement("span")
            progress_line.append(span)

            let percentage = (sorted_dataArray[i].value / sorted_dataArray[0].value) * 100
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