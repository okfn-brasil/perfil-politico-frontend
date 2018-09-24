// builds the chart using d3
module.exports = function(){
	const d3 = window.d3; 
	let breakPoint = 580; // screen width
	let margin, wHeight, wWidth, svgWidth, svgHeight, colWidth, colHeight;
	let x, y, assetsLine, svg = [], xAxis, yAxis;
	let parent;
	let parseYear = d3.timeParse("%Y");
	let formatMoney = d3.format(",.2f");
	let formatNumber = d3.format(".1f");
	let max, maxDate, minDate;
	let chartData, cData;
	let infoTimeout, msgTimeout;
	let ageURL;
	let currPost;

	// window.parseDate = d3.timeParse("%Y-%m-%d");

	let init = function(){
		svg = [];
		window.resizeChart1();
	}

	window.buildChart1 = function(staticData, candData){
		let chartBuild;

		svg = [];
		chartData = staticData;
		cData = candData;

		d3.selectAll("#chart1 svg").remove();

		if(!chartData || !staticData){
			return;
		}

		calcColumnValues();

		d3.select("#chart1-title")
			.html(function(){
				let filters = window.currentFilters;
				if(filters.cargo == "deputado-estadual"){
					return "Comparação com os eleitos em 2014 "+filters.estado_prep+" "+filters.estado;
				}else{
					return "Comparação com os eleitos em 2014";
				}
			});

		chartBuild = [
			buildAgeChart,
			buildEducationChart,
			buildGenderChart,
			buildRaceChart
		]
		let props = ["age", "education", "gender", "ethnicity"]

		for(var i = 0; i < chartBuild.length; i++){
			if(chartData[i] && chartData[i].length > 1){
				[chartBuild[i](chartData[i], cData[props[i]], i)];
			}
		}
		//buildAgeChart(chartData.age);
	}

	let calcColumnValues = function(){
		colWidth = parseInt(document.querySelector('#chart1').offsetWidth);
		

		if(colWidth > breakPoint){
			colHeight = 180;//Math.round(colWidth*0.4);
			margin = {top: 0, right: 0, bottom: 0, left: 0};
		}else if(document.querySelector('.column').offsetWidth <= 580){
			colWidth = document.querySelector('.column').offsetWidth;
			colHeight = 180;
			margin = {top: 0, right: 0, bottom: 0, left: 0};
		}else{
			colWidth = 460;
			colHeight = 200;
			margin = {top: 0, right: 0, bottom: 0, left: 0};
		}

		if(colHeight < 180){
			colHeight = 180;
		}
		svgHeight = colHeight;
	    svgWidth = colWidth - margin.left - margin.right;
	}

	let buildAgeChart = function(ageData, age, index){
		let ranges = [[0,24], [25,34], [35,44], [45,59], [60,69], [70,150]];
		let rangesPt = ["até 24", "de 25 a 34", "de 35 a 44", "de 45 a 59", "de 60 a 69", "70 ou mais"];

		let candidateRange=-1;
		let maxValue = 0, allTotals = 0;

		calcColumnValues();

		ranges.forEach(function(r,i){
			if(r[0] <= age && r[1] >= age){
				candidateRange = i;
			}
		});

		if(!ageData){ return; }

		if(svg[index]){ 
			svg[index].remove(); 
			svg[index] = null 
		};

		svg[index] = d3.select("#chart1-container").append("svg")
		.attr("id", "chart-age")
		.attr("viewBox", "0 0 " +colWidth+ " " + colHeight)
		.attr("width", colWidth)
		.attr("height", colHeight);

		maxValue = d3.max(ageData, function(d,i){
			return d.total;
		});
		allTotals = d3.sum(ageData, function(d,i){
			return d.total;
		});

		svg[index].selectAll("rect")
			.data(ageData)
			.enter()
			.append("rect")
			.attr("class", function(d,i){
				let cClass = "bar";

				if(candidateRange == i){
					cClass += " highlight";
				}

				return cClass;
			})
			.attr("y", function(d,i){
				return (colHeight/ageData.length)*i;
			})
			.attr("height", (colHeight/ageData.length)-4)
			.attr("width", function(d,i){
				let fullWidth = colWidth - 120;
				return Math.round(fullWidth*(d.total/allTotals));
			});

		svg[index].selectAll(".bar-line")
			.data(ageData)
			.enter()
			.append("line")
			.attr("class","bar-line")
			.attr("y1", function(d,i){
				let height = (colHeight/ageData.length);
				return (height*(i+1)) - (height/2);
			})
			.attr("y2", function(d,i){
				let height = (colHeight/ageData.length);
				return (height*(i+1)) - (height/2);
			})
			.attr("x1", function(d,i){
				let fullWidth = colWidth - 120;
				return Math.round(fullWidth*(d.total/allTotals)) + 30;
			})
			.attr("x2", function(d,i){
				let fullWidth = colWidth - 70;
				return fullWidth;
			});

		svg[index].selectAll(".bar-number")
			.data(ageData)
			.enter()
			.append("text")
			.attr("class", "bar-number")
			.attr("dx", function(d,i){
				let fullWidth = colWidth - 120;
				return Math.round(fullWidth*(d.total/allTotals)) + 5 ;
			})
			.attr("dy", function(d,i){
				let height = (colHeight/ageData.length);
				return ((colHeight/ageData.length)*(i))+(height/2);
			})
			.text(function(d,i){
				return d.total;
			});

		svg[index].selectAll(".bar-label")
			.data(ageData)
			.enter()
			.append("text")
			.attr("class", "bar-label")
			.attr("dx", function(d,i){
				return colWidth;
			})
			.attr("dy", function(d,i){
				let height = (colHeight/ageData.length);
				return ((colHeight/ageData.length)*(i))+(height/2);
			})
			.attr("text-anchor", "end")
			.text(function(d,i){
				return rangesPt[i];
			});
	}

	let buildEducationChart = function(edData, ed, index){
		let candidateRange=-1;
		let maxValue = 0, allTotals = 0;

		edData.forEach(function(r,i){
			if(r.characteristic.toLowerCase() == ed.toLowerCase()){
				candidateRange = i;
			}
		});

		calcColumnValues();

		if(!edData){ return; }

		if(svg[index]){ 
			svg[index].remove(); 
			svg[index] = null 
		};

		svg[index] = d3.select("#chart1-container").append("svg")
		.attr("id", "chart-education")
		.attr("viewBox", "0 0 " +colWidth+ " " + colHeight)
		.attr("width", colWidth)
		.attr("height", colHeight);

		maxValue = d3.max(edData, function(d,i){
			return d.total;
		});
		allTotals = d3.sum(edData, function(d,i){
			return d.total;
		});

		svg[index].selectAll("rect")
			.data(edData)
			.enter()
			.append("rect")
			.attr("class", function(d,i){
				let cClass = "bar";

				if(candidateRange == i){
					cClass += " highlight";
				}

				return cClass;
			})
			.attr("y", function(d,i){
				return (colHeight/edData.length)*i;
			})
			.attr("height", (colHeight/edData.length)-4)
			.attr("width", function(d,i){
				let fullWidth = colWidth - 190;
				return Math.round(fullWidth*(d.total/allTotals));
			});

		svg[index].selectAll(".bar-number")
			.data(edData)
			.enter()
			.append("text")
			.attr("class", "bar-number")
			.attr("dx", function(d,i){
				let fullWidth = colWidth - 190;
				return Math.round(fullWidth*(d.total/allTotals)) + 5 ;
			})
			.attr("dy", function(d,i){
				let height = (colHeight/edData.length);
				return ((colHeight/edData.length)*(i))+(height/2);
			})
			.text(function(d,i){
				return d.total;
			});

		svg[index].selectAll(".bar-label")
			.data(edData)
			.enter()
			.append("text")
			.attr("class", "bar-label")
			.attr("dx", function(d,i){
				return colWidth;
			})
			.attr("dy", function(d,i){
				let height = (colHeight/edData.length);
				return ((colHeight/edData.length)*(i))+(height/2);
			})
			.attr("text-anchor", "end")
			.text(function(d,i){
				let ed = d.characteristic.toLowerCase();
				ed = ed.replace("fundamental", "fund.");
				return  ed;
			});

		svg[index].selectAll(".bar-line")
			.data(edData)
			.enter()
			.append("line")
			.attr("class","bar-line")
			.attr("y1", function(d,i){
				let height = (colHeight/edData.length);
				return (height*(i+1)) - (height/2);
			})
			.attr("y2", function(d,i){
				let height = (colHeight/edData.length);
				return (height*(i+1)) - (height/2);
			})
			.attr("x1", function(d,i){
				let fullWidth = colWidth - 190;
				return Math.round(fullWidth*(d.total/allTotals)) + 30;
			})
			.attr("x2", function(d,i){
				let label = svg[index].selectAll(".bar-label").filter(function(dd,ii){ 
					return ii == i;
				});
				let w = label.text().length * 6;
				let fullWidth = colWidth - w - 15;
				return fullWidth;
			});
	}

	let buildGenderChart = function(gData, property, index){
		let candidateRange=-1;
		let maxValue = 0, allTotals = 0;

		gData.forEach(function(r,i){
			if(r.characteristic.toLowerCase() == property.toLowerCase()){
				candidateRange = i;
			}
		});

		calcColumnValues();

		if(!gData){ return; }

		if(svg[index]){ 
			svg[index].remove(); 
			svg[index] = null 
		};

		colHeight = 120;

		svg[index] = d3.select("#chart1-container").append("svg")
		.attr("id", "chart-gender")
		.attr("viewBox", "0 0 " +colWidth+ " " + colHeight)
		.attr("width", colWidth)
		.attr("height", colHeight);

		maxValue = d3.max(gData, function(d,i){
			return d.total;
		});
		allTotals = d3.sum(gData, function(d,i){
			return d.total;
		});

		svg[index].selectAll("rect")
			.data(gData)
			.enter()
			.append("rect")
			.attr("class", function(d,i){
				let cClass = "bar";

				if(candidateRange == i){
					cClass += " highlight";
				}

				return cClass;
			})
			.attr("y", function(d,i){
				return (colHeight/gData.length)*i;
			})
			.attr("height", (colHeight/gData.length)-4)
			.attr("width", function(d,i){
				let fullWidth = colWidth - 120;
				return Math.round(fullWidth*(d.total/allTotals));
			});

		svg[index].selectAll(".bar-line")
			.data(gData)
			.enter()
			.append("line")
			.attr("class","bar-line")
			.attr("y1", function(d,i){
				let height = (colHeight/gData.length);
				return (height*(i+1)) - (height/2);
			})
			.attr("y2", function(d,i){
				let height = (colHeight/gData.length);
				return (height*(i+1)) - (height/2);
			})
			.attr("x1", function(d,i){
				let fullWidth = colWidth - 120;
				return Math.round(fullWidth*(d.total/allTotals)) + 30;
			})
			.attr("x2", function(d,i){
				let fullWidth = colWidth - 70;
				return fullWidth;
			});

		svg[index].selectAll(".bar-number")
			.data(gData)
			.enter()
			.append("text")
			.attr("class", "bar-number")
			.attr("dx", function(d,i){
				let fullWidth = colWidth - 120;
				return Math.round(fullWidth*(d.total/allTotals)) + 5 ;
			})
			.attr("dy", function(d,i){
				let height = (colHeight/gData.length);
				return ((colHeight/gData.length)*(i))+(height/2);
			})
			.text(function(d,i){
				return d.total;
			});

		svg[index].selectAll(".bar-label")
			.data(gData)
			.enter()
			.append("text")
			.attr("class", "bar-label")
			.attr("dx", function(d,i){
				return colWidth;
			})
			.attr("dy", function(d,i){
				let height = (colHeight/gData.length);
				return ((colHeight/gData.length)*(i))+(height/2);
			})
			.attr("text-anchor", "end")
			.text(function(d,i){
				let prop = d.characteristic.toLowerCase();
				return  prop;
			});
	}

	let buildRaceChart = function(ethData, property, index){
		let candidateRange=-1;
		let maxValue = 0, allTotals = 0;


		ethData.forEach(function(r,i){
			if(r.characteristic.toLowerCase() == property.toLowerCase()){
				candidateRange = i;
			}
		});

		calcColumnValues();

		if(!ethData){ return; }

		if(svg[index]){ 
			svg[index].remove(); 
			svg[index] = null 
		};

		colHeight = 170;

		svg[index] = d3.select("#chart1-container").append("svg")
		.attr("id", "chart-ethnicity")
		.attr("viewBox", "0 0 " +colWidth+ " " + colHeight)
		.attr("width", colWidth)
		.attr("height", colHeight);

		maxValue = d3.max(ethData, function(d,i){
			return d.total;
		});
		allTotals = d3.sum(ethData, function(d,i){
			return d.total;
		});

		svg[index].selectAll("rect")
			.data(ethData)
			.enter()
			.append("rect")
			.attr("class", function(d,i){
				let cClass = "bar";

				if(candidateRange == i){
					cClass += " highlight";
				}

				return cClass;
			})
			.attr("y", function(d,i){
				return (colHeight/ethData.length)*i;
			})
			.attr("height", (colHeight/ethData.length)-4)
			.attr("width", function(d,i){
				let fullWidth = colWidth - 120;
				return Math.round(fullWidth*(d.total/allTotals));
			});

		svg[index].selectAll(".bar-line")
			.data(ethData)
			.enter()
			.append("line")
			.attr("class","bar-line")
			.attr("y1", function(d,i){
				let height = (colHeight/ethData.length);
				return (height*(i+1)) - (height/2);
			})
			.attr("y2", function(d,i){
				let height = (colHeight/ethData.length);
				return (height*(i+1)) - (height/2);
			})
			.attr("x1", function(d,i){
				let fullWidth = colWidth - 120;
				return Math.round(fullWidth*(d.total/allTotals)) + 30;
			})
			.attr("x2", function(d,i){
				let fullWidth = colWidth - 70;
				return fullWidth;
			});

		svg[index].selectAll(".bar-number")
			.data(ethData)
			.enter()
			.append("text")
			.attr("class", "bar-number")
			.attr("dx", function(d,i){
				let fullWidth = colWidth - 120;
				return Math.round(fullWidth*(d.total/allTotals)) + 5 ;
			})
			.attr("dy", function(d,i){
				let height = (colHeight/ethData.length);
				return ((colHeight/ethData.length)*(i))+(height/2);
			})
			.text(function(d,i){
				return d.total;
			});

		svg[index].selectAll(".bar-label")
			.data(ethData)
			.enter()
			.append("text")
			.attr("class", "bar-label")
			.attr("dx", function(d,i){
				return colWidth;
			})
			.attr("dy", function(d,i){
				let height = (colHeight/ethData.length);
				return ((colHeight/ethData.length)*(i))+(height/2);
			})
			.attr("text-anchor", "end")
			.text(function(d,i){
				let prop = d.characteristic.toLowerCase();
				return  prop;
			});
	}

	window.resizeChart1 = function(){
		colWidth = document.querySelector('#chart1').offsetWidth;

		calcColumnValues();

	    //console.log(colHeight);
	    if(chartData){
	    	window.buildChart1(chartData, cData);
	    }

	}

	init();
}