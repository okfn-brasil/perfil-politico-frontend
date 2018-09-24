// builds the chart using d3
module.exports = function(){
	const d3 = window.d3; 
	let breakPoint = 580; // screen width
	let margin, wHeight, wWidth, svgWidth, svgHeight, colWidth, colHeight;
	let x, y, assetsLine, svg, xAxis, yAxis;
	let parent;
	let parseYear = d3.timeParse("%Y");
	let formatMoney = window.ptBR.format("$,.2f");
	let formatNumber = d3.format(".2f");
	let max, maxDate, minDate;
	let chartData;
	let infoTimeout, msgTimeout;
	//window.parseDate = d3.timeParse("%Y-%m-%d");

	let init = function(){
		//
		d3.select("#chart2").classed("hidden", true);
		d3.select("#chart2-title").classed("hidden", true);
		d3.select("#chart2-title").html("");
		window.resizeChart2();
	}
	

	window.buildChart2 = function(data){
		let affiliations, assets, elections, elections_won, earliestYear;

		d3.selectAll("#chart2 svg").remove();
		d3.select("#chart2").classed("hidden", true);
		d3.select("#chart2-title").classed("hidden", true);
		d3.select("#chart2-title").html("");

		if(data){
			chartData = data;
			affiliations = chartData.affiliation_history;
			assets = chartData.asset_history;
			elections = chartData.election_history;
		}

		if( !chartData || 
			(!affiliations && !assets) ||
			(affiliations.length < 1 && assets.length < 1) ){
			
			return;
		}else{
			d3.select("#chart2").classed("hidden", false);
			d3.select("#chart2-title").classed("hidden", false);
		}

		if(affiliations.length < 1 && assets.length < 1){
			d3.select("#chart2-title").html("");
			d3.select("#chart2").classed("hidden", true);
		}else if(affiliations.length < 1 && assets.length >= 1){
			d3.select("#chart2-title").html("Patrimônio declarado");
		}else if(affiliations.length >= 1 && assets.length < 1){
			d3.select("#chart2-title").html("Histórico partidário");
		}else{
			d3.select("#chart2-title").html("Patrimônio declarado e histórico partidário");
		}

		d3.select("#chart2").classed("hidden", false);
		d3.select("#chart2-title").classed("hidden", false);

		d3.select("#chart2-svg").remove();

		// add svg wrapper with initial size
		svg = d3.select("#chart2").append("svg")//d3.select(".block").append("svg")
			.attr("class", "chart2-svg")
			.attr("viewBox", "0 0 " +colWidth+ " " + colHeight)
			.attr("width", colWidth)
			.attr("height", colHeight + 60);

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
			minDate = new Date(maxDate.getFullYear()-1, 0, 1);
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
			.tickSize(-svgHeight + margin.bottom - margin.top)
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

		      if(s.toString().length > 4){
		      	s = formatNumber(s);
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
		  .attr("transform", "translate(0," + (svgHeight - margin.top - 10 )  + ")")
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
		  	.on("mouseover click", function(d){
				d3.select("#info-box").html(function() { 
					return formatMoney(d.value); 
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

				if(coordinates[0] < 0){
					coordinates[0] = 0;
				}else if(coordinates[0] > colWidth - width){
					coordinates[0] = colWidth - width;
				}

				d3.select("#info-box")
					.attr("style", "margin-left: " +(coordinates[0])+ "px; margin-top: "+(coordinates[1] - height - 15)+"px");
				
				clearTimeout(infoTimeout);
			});

		elections_won = elections.filter(function(d,i){
			return d.elected;
		})
		let election_points = svg.selectAll(".elect-point")
		  .data(elections_won)
		  .enter()
		  .append("rect")
		  .attr("class", "elect-point")
		  .attr("width", function(d,i){
		  	let start = x(new Date(d.year+1, 0, 1));
		  	let end;
		  	if(d.post == "SENADOR"){
		  		end = x(new Date(d.year+8, 11, 30))
		  		return end - start;
		  	}else{
		  		end = x(new Date(d.year+4, 11, 30))
		  		return end - start;
		  	}
		  })
		  .attr("height", 12)
		  .attr("x", function(d, i){
		  	return x(new Date(d.year+1, 0, 1));
		  })
		  .attr("y", svgHeight - margin.bottom + 30)
			.on("mouseover click", function(d){
				if(d.post == "SENADOR"){
			  		d3.select("#info-box").html((d.year+1) + "-" + (d.year+7));
			  	}else{
			  		d3.select("#info-box").html((d.year+1) + "-" + (d.year+4));
			  	}
				
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

				if(coordinates[0] < 0){
					coordinates[0] = 0;
				}else if(coordinates[0] > colWidth - width){
					coordinates[0] = colWidth - width;
				}
				d3.select("#info-box")
					.attr("style", "margin-left: " +(coordinates[0])+ "px; margin-top: "+(coordinates[1] - height - 15)+"px");
				
				clearTimeout(infoTimeout);
			})

		d3.selectAll(".history-year").classed("selected, enabled",false);

		elections.forEach(function(obj, i){
			let year = obj.year;
			let text = "";

			let button = d3.select(".history-year.y"+year);
			//button.attr("data-elected", obj.elected);
			//button.attr("data-post", obj.post);
			//button.attr("data-desc", obj.result);
			text += "<b>"+year+":</b> Candidatou-se ao cargo de <b>";
			text += window.capitalizeName(obj.post);
			text += "</b> ("+window.capitalizeName(obj.result) + ")";

			button.on("click", function(d,i){
				d3.select("#election-text").html(text);
				d3.selectAll(".history-year").classed("selected",false);
				
				button.classed("selected", true);
			});
			button.classed("enabled", true);
		});

		let button = d3.select(".history-year.y2018");
		console.log(button.node());
		button.on("click", function(d,i){
			d3.select("#election-text").html("<b>2018:</b> Candidatou-se ao cargo de <b>" + window.capitalizeName(window.currentFilters.cargo.replace("-", " ")) + "</b>");
			d3.selectAll(".history-year").classed("selected",false);
			
			button.classed("selected", true);
		});
		button.classed("enabled", true);

		let e = document.createEvent('UIEvents');
		e.initUIEvent('click', true, true, window, 1);
		button.node().dispatchEvent(e);

		if(affiliations.length < 1){
			return;
		}

		let affiliation_points = svg.selectAll(".affil-point")
		  .data(affiliations)
		  .enter()
		  .append("rect")
		  .attr("class", "affil-point")
		  .attr("width", 10)
		  .attr("height", 10)
		  .attr("x", function(d, i){
		  	return x(window.parseDate(d.started_in)) - 5;
		  })
		  .attr("y", svgHeight - margin.bottom + 32)
		  .on("click", function(d, i){
		  	console.log(d.started_in);
		  	console.log(x(window.parseDate(d.started_in)));
		  })
			.on("mouseover click", function(d){
				d3.select("#info-box").html(formatDate(d.started_in));
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

				if(coordinates[0] < 0){
					coordinates[0] = 0;
				}else if(coordinates[0] > colWidth - width){
					coordinates[0] = colWidth - width;
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
		  .attr("dy", svgHeight - 25 )
		  .text(function(d, i){
		  	return d.party;
		  });

		svg.append("rect")
			.attr("class", "affil-sq")
			.attr("y", svgHeight - 10)
			.attr("x", colWidth - 10)
			.attr("width", 10)
			.attr("height", 10)

		svg.append("text")
			.attr("class", "affil-leg")
			.attr("y", colHeight)
			.attr("x", colWidth - 20)
			.attr("text-anchor", "end")
			.text("filiação a partido")

		svg.append("rect")
			.attr("class", "elect-sq")
			.attr("y", colHeight + 7)
			.attr("x", colWidth - 10)
			.attr("width", 10)
			.attr("height", 10)

		svg.append("text")
			.attr("class", "elect-leg")
			.attr("y", colHeight + 17)
			.attr("x", colWidth - 20)
			.attr("text-anchor", "end")
			.text("exerceu cargo eletivo")

		svg.append("circle")
			.attr("class", "asset-point")
			.attr("cy", colHeight + 30)
			.attr("cx", colWidth - 5)
			.attr("r", 5)

		svg.append("text")
			.attr("class", "asset-leg")
			.attr("y", colHeight + 35)
			.attr("x", colWidth - 20)
			.attr("text-anchor", "end")
			.text("patrimônio declarado")


		
	}

	let formatDate = function(value){
		let date = value.split("-");

		date.reverse();
		let newDate = date.join("/");

		return newDate;
	}

	let customXAxis = function(g) {
	  g.call(xAxis);
	  g.select(".domain").remove();
	  g.selectAll(".tick text").attr("dy", -svgHeight + margin.top);
	  g.selectAll(".tick").each(function(d,i){
	  	if(maxDate.getFullYear() - minDate.getFullYear() <= 5){
	  		d3.select(this).classed("opaque", false);
	  		return;
	  	}

	  	let yearFrom1962 = d.getFullYear() - 1962;
	  	let divBy4 = (yearFrom1962/4).toString();

	  	if(	divBy4.indexOf(".") == -1 ){
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

			if(!assetData || assetData.length < 1){
				colHeight = 160;
				margin = {top: 30, right: 20, bottom: 80, left: 20};
			}else{
				colHeight = 340;
				margin = {top: 30, right: 0, bottom: 80, left: 70};
			}
		}else{
			if(!assetData || assetData.length < 1){
				colHeight = 120;
				margin = {top: 30, right: 20, bottom: 80, left: 20};
			}else{
				colHeight = 340;
				margin = {top: 30, right: 0, bottom: 80, left: 40};
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