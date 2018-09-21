// builds the chart using d3
module.exports = function(){
	const d3 = window.d3; 
	let breakPoint = 580; // screen width
	let margin, wHeight, wWidth, svgWidth, svgHeight, colWidth, colHeight;
	let x, y, assetsLine, svg, xAxis, yAxis;
	let parent;
	let parseYear = d3.timeParse("%Y");
	let formatMoney = d3.format(",.2f");
	let formatNumber = d3.format(".2f");
	let max, maxDate, minDate;
	let chartData;
	let infoTimeout, msgTimeout;
	//window.parseDate = d3.timeParse("%Y-%m-%d");

	let init = function(){
		//
		d3.select("#chart2").classed("hidden", true);
		d3.select("#chart2-title").classed("hidden", true);
		window.resizeChart2();
	}
	

	window.buildChart2 = function(data){
		let affiliations, assets, earliestYear;

		d3.selectAll("#chart2 svg").remove();
		d3.select("#chart2").classed("hidden", true);
		d3.select("#chart2-title").classed("hidden", true);

		if(data){
			chartData = data;
			affiliations = chartData.affiliation_history;
			assets = chartData.asset_history;
		}

		if( !chartData || (affiliations.length <= 1 && assets.length <= 1) ){
			//chartData = null;
			return;
		}else{
			d3.select("#chart2").classed("hidden", false);
			d3.select("#chart2-title").classed("hidden", false);
		}


		d3.select("#chart2-svg").remove();

		// add svg wrapper with initial size
		svg = d3.select("#chart2").append("svg")//d3.select(".block").append("svg")
			.attr("class", "chart2-svg")
			.attr("viewBox", "0 0 " +colWidth+ " " + colHeight)
			.attr("width", colWidth)
			.attr("height", colHeight);

		max = d3.max(assets, function(d) { return +d.value;} );


		if(max < 900000){
			max = 900000;
		}else if(max < 1000000){
			max = 1000000;
		}else{
			max = Math.ceil(max/10000000)*10000000;
		}

		//
		earliestYear = d3.min(assets, function(d) { 
			return d.year;
		});


		maxDate = new Date(2018, 11, 30);
		//console.log(maxDate);

		/*
		maxDate = new Date(d3.max(affiliations, function(d) {
			let date = window.parseDate(d.started_in);
			return +date;
		}));
		*/

		minDate = new Date(d3.min(affiliations, function(d) { 
			let date = window.parseDate(d.started_in);

			return date;
		}));

		if(minDate.getTime() == maxDate.getTime()){
			minDate = new Date(maxDate.getFullYear()-1, 1, 1);
		}

		if(earliestYear && earliestYear < minDate.getFullYear()){
			minDate = new Date(earliestYear, 0, 1);
		}

		// set the ranges
		x = d3.scaleTime()
			.range([margin.left, colWidth - margin.right]);
		y = d3.scaleLinear().range([svgHeight + margin.top - margin.bottom, margin.top]);

		xAxis = d3.axisBottom(x)
			.tickFormat(d3.timeFormat("%Y"))
			.ticks(4)
			.tickSize(-(svgHeight - margin.bottom))
    		.ticks(d3.timeYear);

		yAxis = d3.axisRight(y)
		    .tickSize(svgWidth)
		    //.ticks(4)
		    .tickFormat(function(d) {
		      let s;
		      let text = " mil";

		      if(max <= 900000){
		      	s = d / 1000;
		      	text = " mil"
		      }else{
		      	s = d / 1000000;
		      	text = " milhões"
		      }
		      
		      //console.log(1e6);
		      return this.parentNode.nextSibling
		          ? "\xa0" + s
		          : "R$" + text;
		    });

		// define the line
		assetsLine = d3.line()
		    .x(function(d) { return x( new Date(d.year, 0, 1)); })
		    .y(function(d) { return y( d.value ); });

		// format the data
		/*
		assets.forEach(function(d) {
			d.year = window.parseDate(d.year);
			console.log(d.year);
			d.value = +d.value;
		});
		*/

		// Scale the range of the data
		//d3.extent(assets, function(d) { return d.year; })
		x.domain([minDate, maxDate]);
		y.domain([0, d3.max(assets, function(d) { return d.value; })]).nice();


		svg.append("rect")
			.attr("width", svgWidth)
			.attr("height", 12)
			.attr("y", (svgHeight - margin.bottom + 30) )
			.attr("x", margin.left )
			.attr("fill", "#eeedf4")

		// Add the X Axis
		svg.append("g")
		  .attr("transform", "translate(0," + (svgHeight - margin.top )  + ")")
		  .call(customXAxis);

		// Add the Y Axis
		svg.append("g")
		  .attr("transform", "translate(" + margin.left + ",0)")
		  .call(customYAxis);

		

		// Add the valueline path.
		svg.append("path")
		  .data([assets])
		  .attr("class", "asset-line")
		  .attr("d", assetsLine);

		
		svg.selectAll("circle")
			.data(assets)
			.enter()
			.append("circle")
			.attr("class", "asset-point")
			.attr("r", 5)
			.attr("cx", function(d, i){
				let date = new Date(d.year, 0, 1);
				return x(date);
			})
			.attr("cy", function(d, i){
				return y(d.value);
			})
		  	.on("mouseover", function(d){
				d3.select("#info-box").html(function() { 
					return "<b>R$</b>" + formatMoney(d.value); 
				});
				d3.select("#info-box").classed("hidden", false);
				d3.select("#info-box").classed("smaller", true);
				
				clearTimeout(infoTimeout);
			})
			.on("mouseout", function(d){
				clearTimeout(infoTimeout);
				infoTimeout = setTimeout(function(){
					d3.select("#info-box").classed("hidden", true);
				d3.select("#info-box").classed("smaller", false);
				}, 500);
			})
			.on("mousemove", function(d){
				let coordinates = d3.mouse(d3.select('body').node());
				let height = d3.select("#info-box").node().offsetHeight;
				let width = d3.select("#info-box").node().offsetWidth;

				if(coordinates[0] > colWidth - width){
					coordinates[0] -= width;
				}

				if(colWidth < 480){
					coordinates[0] = colWidth/2 - (width/2) + 20;
				}

				d3.select("#info-box")
					.attr("style", "margin-left: " +(coordinates[0])+ "px; margin-top: "+(coordinates[1] - height - 15)+"px");
				
				clearTimeout(infoTimeout);
			});

		if(affiliations.length <= 1){
			return;
		}

		let affiliation_points = svg.selectAll(".affil-point")
		  .data(affiliations)
		  .enter()
		  .append("rect")
		  .attr("class", "affil-point")
		  .attr("width", 12)
		  .attr("height", 12)
		  .attr("x", function(d, i){
		  	return x(window.parseDate(d.started_in)) - 6;
		  })
		  .attr("y", svgHeight - margin.bottom + 30)
		  .on("click", function(d, i){
		  	console.log(d.started_in);
		  	console.log(x(window.parseDate(d.started_in)));
		  })
			.on("mouseover", function(d){
				d3.select("#info-box").html(d.started_in.replaceAll("-", "/"));
				d3.select("#info-box").classed("hidden", false);
				d3.select("#info-box").classed("smaller", true);
				
				clearTimeout(infoTimeout);
			})
			.on("mouseout", function(d){
				clearTimeout(infoTimeout);
				infoTimeout = setTimeout(function(){
					d3.select("#info-box").classed("hidden", true);
				d3.select("#info-box").classed("smaller", false);
				}, 500);
			})
			.on("mousemove", function(d){
				let coordinates = d3.mouse(d3.select('body').node());
				let height = d3.select("#info-box").node().offsetHeight;
				let width = d3.select("#info-box").node().offsetWidth;

				if(coordinates[0] > colWidth - width){
					coordinates[0] -= width;
				}

				if(colWidth < 480){
					coordinates[0] = colWidth/2 - (width/2) + 20;
				}

				d3.select("#info-box")
					.attr("style", "margin-left: " +(coordinates[0])+ "px; margin-top: "+(coordinates[1] - height - 15)+"px");
				
				clearTimeout(infoTimeout);
			})
		  /*
		  .attr("y", function(d, i){
		  	return svgHeight + 5;
		  });*/

		let affil_texts = svg.selectAll(".affil-text")
		  .data(affiliations)
		  .enter().append("text")
		  .attr("class", "affil-text")
		  .attr("text-anchor", "middle")
		  .attr("font-family", "sans-serif")
		  .attr("x", function(d, i){
		  	return x(window.parseDate(d.started_in));
		  })
		  .attr("y", svgHeight )
		  .text(function(d, i){
		  	return d.party;
		  });

		/*affil_texts.select('text')
			.attr('x', function(d, i){
				let w = d3.select(this).node().getBoundingClientRect().width;
				
				return x(window.parseDate(d.started_in));// - (w/2);
			});*/
	}


	let customXAxis = function(g) {
	  g.call(xAxis);
	  g.select(".domain").remove();
	  g.selectAll(".tick line").attr("dy", -svgHeight);
	  g.selectAll(".tick text").attr("dy", -svgHeight + margin.top + 5 );
	  g.selectAll(".tick").each(function(d,i){
	  	if(	d.getFullYear() == "1982" || d.getFullYear() == "1986" ||
	  	d.getFullYear() == "1990" || d.getFullYear() == "1994" ||
	  	d.getFullYear() == "1998" || d.getFullYear() == "2002" || 
	  			d.getFullYear() == "2006" || d.getFullYear() == "2010" || 
	  			d.getFullYear() == "2014" || d.getFullYear() == "2018"){
	  		d3.select(this).classed("opaque", false);
	  	}else{
	  		d3.select(this).classed("opaque", true);
	  	}
	  });
	}

	let customYAxis = function(g) {
	  g.call(yAxis);
	  g.select(".domain").remove();
	  g.selectAll(".tick text").attr("x", -margin.left).attr("dy", 4);
	}

	window.resizeChart2 = function(){
		colWidth = document.querySelector('.column').offsetWidth;
		let ratio = 0.4;
		let assetData;

		if(chartData){
			assetData = chartData.asset_history;
		} 

		if(colWidth > breakPoint){
			colHeight = colWidth*0.4;//Math.round(colWidth*0.4);
			margin = {top: 30, right: 0, bottom: 60, left: 70};

			if(!assetData || assetData.length < 1){
				colHeight = 320;
			}
		}else{
			colHeight = colWidth*0.6;
			margin = {top: 30, right: 0, bottom: 60, left: 40};

			if(!assetData || assetData.length < 1){
				colHeight = 320;
			}
		}

	    svgHeight = colHeight;
	    svgWidth = colWidth - margin.left - margin.right;

	    if(chartData){
	    	window.buildChart2(chartData);
	    }

	}

	init();
}