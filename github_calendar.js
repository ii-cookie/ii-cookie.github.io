//https://www.reddit.com/r/github/comments/srmr5h/recreating_githubs_contributions_calendar_in_a_js/

function getDayOfWeek(date) {
  const dayOfWeek = new Date(date).getDay();    
  return isNaN(dayOfWeek) ? null : dayOfWeek;
}

function getCalendarGradientColor(size, index) {
  // Validate inputs
  if (!Number.isInteger(size) || size <= 0) {
    console.error('Invalid size:', size);
    return 'hsl(0, 0%, 50%)'; // Fallback color
  }
  if (!Number.isInteger(index) || index < 0 || index >= size) {
    console.error('Invalid index:', index);
    return 'hsl(0, 0%, 50%)'; // Fallback color
  }

  // Check light mode (currently unused, but kept for potential future use)
  const lightMode = document.body.classList.contains('light');

  // Get CSS custom property
  const style = window.getComputedStyle(document.body);
  const primaryColor = style.getPropertyValue('--primary').trim();
  
  // Parse HSL string
  const hslPrimary = parseHslString(primaryColor);
  if (!hslPrimary) {
    console.error('Failed to parse --primary color, using fallback');
    return 'hsl(0, 0%, 50%)'; // Fallback color
  }

  // Calculate lightness
  maxLight = 85;
  minLight = 20;
  
  if (lightMode){
    maxLight = 99;
    minLight = 40;
  }

  const lightDiff = (maxLight - minLight) / size;
  let lightness = Math.min(100, Math.max(0, minLight + lightDiff * index));

  // if (lightMode){
  //   lightness = Math.max(0, Math.min(100, maxLight - lightDiff * index));
  // }

  // Log for debugging
  console.log(`hsl(${hslPrimary[0]}, ${hslPrimary[1]}%, ${lightness}%)`);

  // Return HSL string
  return `hsl(${hslPrimary[0]}, ${hslPrimary[1]}%, ${lightness}%)`;
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

        for (const contribution_data of contibution_data_list) {
            const contribution = {
              contributionCount: contribution_data["count"],
              date: contribution_data["date"],
              weekday: getDayOfWeek(contribution_data["date"]),
              level: contribution_data["level"]
            }
            contribution_list.push(contribution)
        }
        console.log("my data")
        console.log(contribution_list[0])
        return contribution_list; // return as array
    } catch (error) {
        console.error('Error:', error);
        return []; // returning empty when error
    }
}

// async function fetchRawData(){
//   const response = await fetch('https://github-contributions-api.jogruber.de/v4/ii-cookie');
//   const data = await response.json();
//   const contibution_data_list = data.contributions;
//   return contribution_data_list
// }

async function createChart(){
  const data = await fetchData()

  console.log(data[12])
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
  const style = window.getComputedStyle(document.body);
  const bgColor = style.getPropertyValue('--bg-dark').trim();

  chart.background('#0d1117');
  chart.background(bgColor);

  // configure a custom color scale
  var customColorScale = anychart.scales.ordinalColor();
  customColorScale.ranges([
    {equal: 0, color: getCalendarGradientColor(5,0)},
    {equal: 1, color: getCalendarGradientColor(5,1)},
    {equal: 2, color: getCalendarGradientColor(5,2)},
    {equal: 3, color: getCalendarGradientColor(5,3)},
    {equal: 4, color: getCalendarGradientColor(5,4)}
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
    .noDataFill('#000000')
    .noDataHatchFill(false);
  
  // set the height of the chart
  chart.listen('chartDraw', function() {
    document.getElementById('github_contribute_calendar').style.height = chart.getActualHeight() + 'px';
  });
  
  // set and customize the chart title
  var title = chart.title();
  title.enabled(false);
  title
    .text("GitHub Contributions of ii-cookie in 2017–2021 (dummy data)")
    .fontSize(22)
    .fontWeight(500)
    .fontColor("#000000")
    .padding(10);

  // configure the chart tooltip
  chart.tooltip()
    .format('{%contributionCount} contributions');
  
  // configure the inverted order of years
  chart.years().inverted(true);

  const text_color = style.getPropertyValue('--text').trim();
  const muted_color = style.getPropertyValue('--text-muted').trim();
  chart.years().title().fontColor(text_color)
  chart.months().labels().fontColor(muted_color);
  
  // set the container reference
  chart.container('github_contribute_calendar');
  
  // draw the resulting chart
  chart.draw();
    
}

anychart.onDocumentReady(function() {
  createChart()
});

function github_calendar_theme_toggle(){
  old = document.getElementById("github_contribute_calendar")
  old.innerHTML = ""
  createChart()
}