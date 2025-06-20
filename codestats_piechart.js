//taken from https://codepen.io/githiro/pen/AgZGEV

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


function getRandomColor(){
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i<6; i++){
        color += letters[Math.floor(Math.random()*16)]
    }
    return color
}

//https://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
function getRandomPastelColor(){
    let red = Math.floor(Math.random()*255)
    let green = Math.floor(Math.random()*255)
    let blue = Math.floor(Math.random()*255)

    for (let i = 0; i<1; i++){
      // r = Math.floor(Math.random()*255)
      // g = Math.floor(Math.random()*255)
      // b = Math.floor(Math.random()*255)
      r = 255
      g = 255
      b = 255
      red = Math.floor((r + red) / 2)
      green = Math.floor((g + green) / 2)
      blue = Math.floor((b + blue) / 2)
    }

    color = 'rgb(' + red.toString() + ', ' + blue.toString() + ', ' + green.toString() + ')'

    return color
}

function getGooglePaletteColor(size, index){
  var sq = palette('tol-sq', size);
  var rb = palette('tol-rainbow', size)
  var dv = palette('tol-dv', size +10)
  reverse_seq = sq.reverse()
  reverse_rb = rb.reverse()
  return '#' + dv[index].toString()
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


// fetchData().then(result => {
//     const lang = result.languages; // Extract language names
//     const xp = result.xps; // Extract XP values
//     console.log('Languages:', lang); // Array of language names
//     console.log('XP:', xp); // Array of XP numbers
// }).catch(error => {
//     console.error('Failed to fetch data:', error);
// });

// fetchData().then(result => {
//     const lang = result.languages
//     const xp = result.xps
//     const dataArray = createDataArray(lang, xp)
//     console.log('Data Array:', dataArray)
// }).catch(error => {
//     console.error('failed to get dataArray:', error)
// })

// $(function(){
//     $("#pieChart").drawPieChart([
//       { title: "Tokyo",         value : 180,  color: "#02B3E7" },
//       { title: "San Francisco", value:  60,   color: "#CFD3D6" },
//       { title: "London",        value : 190,   color: "#736D79" },
//       { title: "New York",      value:  30,   color: "#776068" },
//       { title: "Sydney",        value : 20,   color: "#EB0D42" },
//       { title: "Berlin",        value : 90,   color: "#FFEC62" },
//       { title: "Osaka",         value : 7,    color: "#04374E" }
//     ]);
//   });
  
  /*!
   * jquery.drawPieChart.js
   * Version: 0.3(Beta)
   * Inspired by Chart.js(http://www.chartjs.org/)
   *
   * Copyright 2013 hiro
   * https://github.com/githiro/drawPieChart
   * Released under the MIT license.
   */
  (function($, undefined) {
    $.fn.drawPieChart = function(data, options) {
      var $this = this,
        W = $this.width(),
        H = $this.height(),
        centerX = W/2,
        centerY = H/2,
        cos = Math.cos,
        sin = Math.sin,
        PI = Math.PI,
        settings = $.extend({
          segmentShowStroke : true,
          segmentStrokeColor : "#fff",
          segmentStrokeWidth : 1,
          baseColor: "#fff",
          baseOffset: 15,
          edgeOffset: 30,//offset from edge of $this
          pieSegmentGroupClass: "pieSegmentGroup",
          pieSegmentClass: "pieSegment",
          lightPiesOffset: 12,//lighten pie's width
          lightPiesOpacity: .3,//lighten pie's default opacity
          lightPieClass: "lightPie",
          animation : true,
          animationSteps : 90,
          animationEasing : "easeInOutExpo",
          tipOffsetX: -15,
          tipOffsetY: -45,
          tipClass: "pieTip",
          beforeDraw: function(){  },
          afterDrawed : function(){  },
          onPieMouseenter : function(e,data){  },
          onPieMouseleave : function(e,data){  },
          onPieClick : function(e,data){  }
        }, options),
        animationOptions = {
          linear : function (t){
            return t;
          },
          easeInOutExpo: function (t) {
            var v = t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
            return (v>1) ? 1 : v;
          }
        },
        requestAnimFrame = function(){
          return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
              window.setTimeout(callback, 1000 / 60);
            };
        }();
  
      var $wrapper = $('<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>').appendTo($this);
      var $groups = [],
          $pies = [],
          $lightPies = [],
          easingFunction = animationOptions[settings.animationEasing],
          pieRadius = Min([H/2,W/2]) - settings.edgeOffset,
          segmentTotal = 0;
  
      //Draw base circle
      var drawBasePie = function(){
        var base = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        var $base = $(base).appendTo($wrapper);
        base.setAttribute("cx", centerX);
        base.setAttribute("cy", centerY);
        base.setAttribute("r", pieRadius+settings.baseOffset);
        base.setAttribute("fill", settings.baseColor);
      }();
  
      //Set up pie segments wrapper
      var pathGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      var $pathGroup = $(pathGroup).appendTo($wrapper);
      $pathGroup[0].setAttribute("opacity",0);
  
      //Set up tooltip
      var $tip = $('<div class="' + settings.tipClass + '" />').appendTo('body').hide(),
        tipW = $tip.width(),
        tipH = $tip.height();
  
      for (var i = 0, len = data.length; i < len; i++){
        segmentTotal += data[i].value;
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute("data-order", i);
        g.setAttribute("class", settings.pieSegmentGroupClass);
        $groups[i] = $(g).appendTo($pathGroup);
        $groups[i]
          .on("mouseenter", pathMouseEnter)
          .on("mouseleave", pathMouseLeave)
          .on("mousemove", pathMouseMove)
          .on("click", pathClick);
  
        var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute("stroke-width", settings.segmentStrokeWidth);
        p.setAttribute("stroke", settings.segmentStrokeColor);
        p.setAttribute("stroke-miterlimit", 2);
        p.setAttribute("fill", data[i].color);
        p.setAttribute("class", settings.pieSegmentClass);
        $pies[i] = $(p).appendTo($groups[i]);
  
        var lp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        lp.setAttribute("stroke-width", settings.segmentStrokeWidth);
        lp.setAttribute("stroke", settings.segmentStrokeColor);
        lp.setAttribute("stroke-miterlimit", 2);
        lp.setAttribute("fill", data[i].color);
        lp.setAttribute("opacity", settings.lightPiesOpacity);
        lp.setAttribute("class", settings.lightPieClass);
        $lightPies[i] = $(lp).appendTo($groups[i]);
      }
  
      settings.beforeDraw.call($this);
      //Animation start
      triggerAnimation();
  
      function pathMouseEnter(e){
        var index = $(this).data().order;
        $tip.text(data[index].title + ": " + data[index].value).fadeIn(200);
        if ($groups[index][0].getAttribute("data-active") !== "active"){
          $lightPies[index].animate({opacity: .8}, 180);
        }
        settings.onPieMouseenter.apply($(this),[e,data]);
      }
      function pathMouseLeave(e){
        var index = $(this).data().order;
        $tip.hide();
        if ($groups[index][0].getAttribute("data-active") !== "active"){
          $lightPies[index].animate({opacity: settings.lightPiesOpacity}, 100);
        }
        settings.onPieMouseleave.apply($(this),[e,data]);
      }
      function pathMouseMove(e){
        $tip.css({
          top: e.pageY + settings.tipOffsetY,
          left: e.pageX - $tip.width() / 2 + settings.tipOffsetX
        });
      }
      function pathClick(e){
        var index = $(this).data().order;
        var targetGroup = $groups[index][0];
        for (var i = 0, len = data.length; i < len; i++){
          if (i === index) continue;
          $groups[i][0].setAttribute("data-active","");
          $lightPies[i].css({opacity: settings.lightPiesOpacity});
        }
        if (targetGroup.getAttribute("data-active") === "active"){
          targetGroup.setAttribute("data-active","");
          $lightPies[index].css({opacity: .8});
        } else {
          targetGroup.setAttribute("data-active","active");
          $lightPies[index].css({opacity: 1});
        }
        settings.onPieClick.apply($(this),[e,data]);
      }
      function drawPieSegments (animationDecimal){
        var startRadius = -PI/2,//-90 degree
            rotateAnimation = 1;
        if (settings.animation) {
          rotateAnimation = animationDecimal;//count up between0~1
        }
  
        $pathGroup[0].setAttribute("opacity",animationDecimal);
  
        //draw each path
        for (var i = 0, len = data.length; i < len; i++){
          var segmentAngle = rotateAnimation * ((data[i].value/segmentTotal) * (PI*2)),//start radian
              endRadius = startRadius + segmentAngle,
              largeArc = ((endRadius - startRadius) % (PI * 2)) > PI ? 1 : 0,
              startX = centerX + cos(startRadius) * pieRadius,
              startY = centerY + sin(startRadius) * pieRadius,
              endX = centerX + cos(endRadius) * pieRadius,
              endY = centerY + sin(endRadius) * pieRadius,
              startX2 = centerX + cos(startRadius) * (pieRadius + settings.lightPiesOffset),
              startY2 = centerY + sin(startRadius) * (pieRadius + settings.lightPiesOffset),
              endX2 = centerX + cos(endRadius) * (pieRadius + settings.lightPiesOffset),
              endY2 = centerY + sin(endRadius) * (pieRadius + settings.lightPiesOffset);
          var cmd = [
            'M', startX, startY,//Move pointer
            'A', pieRadius, pieRadius, 0, largeArc, 1, endX, endY,//Draw outer arc path
            'L', centerX, centerY,//Draw line to the center.
            'Z'//Cloth path
          ];
          var cmd2 = [
            'M', startX2, startY2,
            'A', pieRadius + settings.lightPiesOffset, pieRadius + settings.lightPiesOffset, 0, largeArc, 1, endX2, endY2,//Draw outer arc path
            'L', centerX, centerY,
            'Z'
          ];
          $pies[i][0].setAttribute("d",cmd.join(' '));
          $lightPies[i][0].setAttribute("d", cmd2.join(' '));
          startRadius += segmentAngle;
        }
      }
  
      var animFrameAmount = (settings.animation)? 1/settings.animationSteps : 1,//if settings.animationSteps is 10, animFrameAmount is 0.1
          animCount =(settings.animation)? 0 : 1;
      function triggerAnimation(){
        if (settings.animation) {
          requestAnimFrame(animationLoop);
        } else {
          drawPieSegments(1);
        }
      }
      function animationLoop(){
        animCount += animFrameAmount;//animCount start from 0, after "settings.animationSteps"-times executed, animCount reaches 1.
        drawPieSegments(easingFunction(animCount));
        if (animCount < 1){
          requestAnimFrame(arguments.callee);
        } else {
          settings.afterDrawed.call($this);
        }
      }
      function Max(arr){
        return Math.max.apply(null, arr);
      }
      function Min(arr){
        return Math.min.apply(null, arr);
      }
      return $this;
    };
  })(jQuery);




$(function(){
    fetchData().then(result => {
        const lang = result.languages;
        const xp = result.xps;
        const dataArray = createDataArray(lang,xp);
        //might as well sort it
        const sorted_dataArray = dataArray.sort((a,b) => b.value - a.value)
        console.log(sorted_dataArray)
        console.log(sorted_dataArray.title)
        
        sorted_dataArray.map(function(e, index){
          e.color = getGooglePaletteColor(sorted_dataArray.length, index)
        })

        $('#pieChart').drawPieChart(sorted_dataArray)

    }).catch(error => {
        console.error('cant draw it bro cuz:', error);
        $('#pieChart').drawPieChart([])
    })
})