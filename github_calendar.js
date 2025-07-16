//https://www.reddit.com/r/github/comments/srmr5h/recreating_githubs_contributions_calendar_in_a_js/

function getDayOfWeek(date) {
  const dayOfWeek = new Date(date).getDay();    
  return isNaN(dayOfWeek) ? null : dayOfWeek;
}

async function fetchData() {
    try {
        let contribution_list = [];

        const response = await fetch('https://github-contributions-api.jogruber.de/v4/ii-cookie');
        if (!response.ok) {
            console.log('Problem fetching data');
            return []; // return empty 
        }
        const data = await response.json();
        const contibution_data_list = data.contributions;

        for (const contribution_data in contibution_data_list) {
            contribution = {}
            contribution["count"] = contribution_data["count"]
            contribution["day"] = contribution_data["date"]
            contribution["weekday"] = getDayOfWeek(contribution_data["date"])
            contribution["level"] = contribution_data["level"]
            contribution_list.push(contribution)
        }

        return contribution_list; // return as array
    } catch (error) {
        console.error('Error:', error);
        return []; // returning empty when error
    }
}


anychart.onDocumentReady(function() {

    // load the json file
    
    anychart.data.loadJsonFile(
      'https://gist.githubusercontent.com/shacheeswadia/56f3867eb6f8fcc4532e7ac458c8d9f7/raw/702f30b457cc1b573093c6977a69958fb741ede6/calendarData.json',
      // create a function with the data parameter
      function(data) {
        
        // define a dataset variable to store the data
        var dataset = anychart.data.set(data);
  
        // map the data
        var mapping = dataset.mapAs({
          x: 'date',
          value: 'level'
        });
  
        // pass the mapped data to the calendar function
        var chart = anychart.calendar(mapping);
        
        // specify the color of the background
        chart.background('#0d1117');
  
        // configure a custom color scale
        var customColorScale = anychart.scales.ordinalColor();
        customColorScale.ranges([
          {equal: 1, color: '#400554'},
          {equal: 2, color: '#693699'},
          {equal: 3, color: '#7c40a9'},
          {equal: 4, color: '#9570dd'}
        ]);
  
        // set the custom color scale
        chart.colorScale(customColorScale);
        
        // hide the color legend
        chart.colorRange(false);
        
        // remove the stroke
        chart.months()
          .stroke(false)
          .noDataStroke(false);
  
        // set the spacing and other options
        chart.days()
          .spacing(4)
          .stroke(false)
          .noDataStroke(false)
          .noDataFill('#161b22')
          .noDataHatchFill(false);
        
        // set the height of the chart
        chart.listen('chartDraw', function() {
          document.getElementById('container').style.height = chart.getActualHeight() + 'px';
        });
        
        // set and customize the chart title
        var title = chart.title();
        title.enabled(true);
        title
          .text("GitHub Contributions of Mike Bostock in 2017–2021")
          .fontSize(22)
          .fontWeight(500)
          .fontColor("#dfdfdf")
          .padding(10);
  
        // configure the chart tooltip
        chart.tooltip()
          .format('{%contributionCount} contributions');
        
        // configure the inverted order of years
        chart.years().inverted(true);
        
        // set the container reference
        chart.container('container');
        
        // draw the resulting chart
        chart.draw();
        
      }
      
    );
    
  });