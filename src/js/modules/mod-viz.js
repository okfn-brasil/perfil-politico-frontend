// builds the chart using d3
module.exports = function(){
	const d3 = window.d3;
	let selectedParty = "AVANTE";
	let url = "http://api-perfilpolitico.serenata.ai/api/candidate/2018/";
	let candURL = "http://api-perfilpolitico.serenata.ai/api/candidate/";
	let breakPoint = 580; // screen width
	let margin, wHeight, wWidth, svgWidth, svgHeight, colWidth, colHeight;
	let x, y, linePath, svg;
	let blockData = [], blocks = [], partyCharts = [];
	let scrollTimeout;
	let infoTimeout, msgTimeout;
	let currGender;
	let staticURL;
	let staticData = [];
	let clickedBlock = null;
	let clickedCandidate = -1;
	window.parseDate = d3.timeParse("%Y-%m-%d");

	let setup = function(){
		window.contextFilters = [];
		let searchBox = document.querySelector("#name-search");
		searchBox.addEventListener("click", function(){
			this.focus();
			this.setSelectionRange(0,this.value.length);
		});
		searchBox.addEventListener("input", function(event){
			var val = this.value.toLowerCase().split(" - ")[0];
		    var opts = document.getElementById('candidate-list').childNodes;
		    var id;

		    
		    for (var i = 0; i < opts.length; i++) {
		    	//
			    if (opts[i] != "#text" && opts[i].value != undefined){
			      let optVal = opts[i].value.toLowerCase().split(" - ")[0];

			      if (optVal === val) {
			      	id = d3.select(opts[i]).attr("data-id");
			        loadCandidateData(id);
			        break;
			      }
			    }
			}
		});

		let questions = document.querySelector("#filtro-perguntas");
		questions.addEventListener("change", function(event){
			//console.log(blockData);
			let selected = questions.value.toLowerCase();
			
			addBlock(selected);
		});

		d3.select("#full-info").classed("hidden", true);
		window.resize();
		d3.select(window).on('resize', window.resize);

		window.init();
	}

	window.init = function(){
		let filters = window.currentFilters;
		let listURL = url + filters.estado + "/" + filters.cargo;

		d3.select("#full-info").classed("hidden", true);

		// reset control arrays
		blockData = [];
		blocks = [];
		staticData = [];
		clickedBlock = null;
		clickedCandidate = -1;

		window.contextFilters = [];
		currGender = "m";

		// add svg wrapper with initial size
		if(svg){ svg.remove(); svg = null };
		d3.selectAll(".pc").remove();

		d3.selectAll(".box-content:not(.first)").remove();
		d3.selectAll(".d-height:not(.first)").remove();
		svg = d3.select("body").insert("svg",".first")//d3.select(".block").append("svg")
			.attr("class", "viz")
			.attr("viewBox", "0 0 " +svgWidth+ " " + svgHeight)
			.attr("width", svgWidth)
			.attr("height", svgHeight);

		svg.append("defs")
			.append("filter")
			.attr("id", "grayscale");

		svg.select("filter")
			.append("feColorMatrix")
			.attr("type", "matrix")
			.attr("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0")

		
		d3.select("#box1")
				.select(".description")
				.html("")

		d3.json(listURL, function(loadedData){
			window.data = loadedData.objects;
			//window.data = window.data.objects;

			// corrects errors with data...
			window.data.forEach(function(obj, i){
				obj.party = obj.party.replace("SOLIDARIEDADE", "SD");
				obj.party = obj.party.replace("PC DO B", "PDdoB");
				obj.party = obj.party.replace("PT DO B", "PTdoB");
			});

			window.data = window.data.sort(function(a, b){
			   return d3.descending(a.party, b.party);
			});

			addBlock("");
		});
		staticURL = [
			"http://api-perfilpolitico.serenata.ai/api/stats/2014/" + filters.cargo + "/age",
			"http://api-perfilpolitico.serenata.ai/api/stats/2014/" + filters.cargo + "/education",
			"http://api-perfilpolitico.serenata.ai/api/stats/2014/" + filters.cargo + "/gender",
			"http://api-perfilpolitico.serenata.ai/api/stats/2014/" + filters.cargo + "/ethnicity"
		];

		if(window.currentFilters.cargo != "presidente"){
			for(var i=0; i<staticURL.length; i++){
				loadStaticData(i);
			}
		}
		initFileEvents();
	}

	let loadStaticData = function(i){
		let dataPoint = staticData[i];
		d3.json(staticURL[i], function(error, data){

			staticData[i] = data;
		})
	}

	let addBlock = function(filterType){
		let filters = window.currentFilters;
		let newBlock, newBox, newSpacer;
		let filteredData;
		let text;
		let selectedOption = document.querySelector("option[value='"+filterType+"']")
		let h2Title = "";
		let prevCandidates, removed, prevBlock, temp;

		window.contextFilters.push(filterType);
		//console.log(blockData);


		if(blockData.length == 0){
			filteredData = window.data;
		}else{
			filteredData = blockData[blockData.length-1 ];//blockData.length-1 
			prevBlock = blocks[blocks.length-1];//blocks.length-1
			prevCandidates = prevBlock.selectAll(".c");
		}

		if(filterType == "nunca eleitos"){
			filteredData = filteredData.filter(function(c) {
				return c.elections_won == 0;
			});
			removed = prevCandidates.filter(function(d,i){
				return d.elections_won == 0;
			});
		}else if(filterType == "nunca concorreram"){
			filteredData = filteredData.filter(function(c) {
				return c.elections == 0;
			});
			removed = prevCandidates.filter(function(d,i){
				return d.elections == 0;
			}); 
		}else if(filterType == "mulheres"){
			filteredData = filteredData.filter(function(c) {
				return c.gender.toLowerCase() == "feminino";
			});
			removed = prevCandidates.filter(function(d,i){
				return d.gender.toLowerCase() == "feminino";
			});
		}else if(filterType == "negros ou pardos"){
			filteredData = filteredData.filter(function(c) {
				return c.ethnicity.toLowerCase() == "preta" || 
					c.ethnicity.toLowerCase() == "parda" || 
					c.ethnicity.toLowerCase() == "indigena";
			});
			removed = prevCandidates.filter(function(d,i){
				return d.ethnicity.toLowerCase() == "preta" || 
					d.ethnicity.toLowerCase() == "parda" || 
					d.ethnicity.toLowerCase() == "indigena";
			});
		}else{
			text = "São <b>" + filteredData.length
				+ "</b> candidatos a <b>" +  filters.cargo.replace("-", " ")
				+ "</b> " + filters.estado_prep + " <b>" + filters.estado_nome
				+ "</b>";
		}
		if( filterType != "" ){
			animateRemoved(prevBlock, removed);
			h2Title = selectedOption.innerHTML;
			text = getDescription(filterType, filteredData.length);
		}
		

		if(filteredData.length == 0){
			d3.select("#msg-box").html("Nenhum candidato corresponde a este filtro");
			d3.select("#msg-box").classed("hidden", false);
			clearTimeout(msgTimeout);

			msgTimeout = setTimeout(function(){
				d3.select("#msg-box").classed("hidden", true);
			}, 4500);

			return;
		}else{
			console.log(filteredData.length);
		}

		/*filteredData = filteredData.sort(function(a, b){
		   return d3.ascending(a.party, b.party);
		});*/
		
		blockData.push(filteredData);

		svgHeight = wHeight*(blockData.length);

		svg.attr("viewBox", "0 0 " +svgWidth+ " " + svgHeight)
			.attr("width", svgWidth)
			.attr("height", svgHeight);

		
		if(blockData.length > 1){
			newBox = d3.select("body").insert("div","#bottom-bar");
			newBox.attr("class", "box-content")
				.attr("id", "box"+blockData.length)
				.append("h2")
					.append("div")
					.attr("class", "column")
					.text(h2Title);
			newBox.append("div")
					.attr("class", "column description")
					.html(text);
			newSpacer = d3.select("body").insert("div","#bottom-bar")
				.attr("class", "d-height");
		}else{
			d3.select(".box-content")
				.select(".description")
				.html(text);
		}

		let pBox = document.querySelectorAll(".box-content")[blockData.length-1];
		let newBlockY = pBox.offsetHeight + 45 + (wHeight*(blockData.length-1));

		//
		newBlock = svg.append("g")
			.attr("id", "viz_"+blockData.length)
			.attr("class", "viz")
			.attr("transform", "translate(0," + newBlockY + ")")

		blocks.push(newBlock); 

		let sortedByName = filteredData.sort(function(a, b){
		   return d3.ascending(a.name, b.name);
		});

		sortedByName.forEach(function(obj, i){
			let party = obj.party;
			let value = obj.name + " - " + party;
			let nameList = d3.select("#candidate-list");
			let occurrences = nameList.selectAll("option[value='"+value+"']")
			
			//console.log(value);
			if(occurrences.size() < 1){
				d3.select("#candidate-list")
					.append("option")
					.attr("value", value)
					.attr("data-id", obj.id)
			}
		});

		blockData[blockData.length-1] = filteredData.sort(function(a, b){
		   return d3.ascending(a.party, b.party);
		});
		//console.log(blockData[blockData.length-1]);

		rebuildViz(blockData.length-1);
	}

	let rebuildViz = function(index, noAnim){
		let block = blocks[index];
		let list = blockData[index];
		let area = colHeight * colWidth;
		let cellWidth = Math.floor(Math.sqrt(area/list.length)*10)/10;//Math.sqrt( 2 * (testA/list.length) );
		let cellHeight = cellWidth;
		let lin, col;
		let dotRadius = Math.floor( (cellHeight/7)*5 )/2;
		let blockWidth;
		let initRadius = 0.5;

		d3.selectAll(".pc").remove();

		if(index > 0){
			initRadius = blocks[index-1].select(".c").attr("r");
			//console.log(initRadius);
		}

		lin = Math.ceil(colHeight/cellWidth); 
		col = Math.ceil(list.length/lin);

		//console.log(col*cellWidth, colWidth);
		if(list.length <= 10 &&
			(colWidth >= breakPoint) ){
			cellWidth = (colWidth)/list.length;
			
			if (cellWidth > 120){
				cellWidth = 120;
			}
			if (cellHeight > 120){
				cellHeight = 120;
			}
			if(cellWidth < cellHeight){
				cellWidth = cellHeight;
			}
			col = Math.ceil(colWidth/cellWidth);
			lin = 1;
		}else if(col*cellWidth < colWidth - 2){
			cellWidth = Math.floor((colWidth-10)*10/col)/10;

			if (cellWidth > 120){
				cellWidth = 120;
			}
			if (cellHeight > 120){
				cellHeight = 120;
			}
			col = Math.ceil(colWidth/cellWidth);
			lin = Math.ceil(list.length/col);
		}
		dotRadius = Math.floor( (cellHeight/7)*5 )/2;
		block.selectAll(".c").remove();
		block.selectAll(".c-stroke").remove();

		let candidates = block.selectAll("circle")
			.data(list)
			.enter()
			.append("circle");

		candidates.attr("r", initRadius)
			.attr("id", function(d, i){
				return "c_"+index+"_"+d.id;
			})
			.on("click", function(d, i){
				clickedBlock = blockData;
				clickedCandidate = i;
				console.log("clicked "+i);
				console.log(clickedBlock[0][clickedCandidate]);
				loadCandidateData(d.id);
			})
			.attr("class", function(d){
				let selected = "";

				if(d.party === selectedParty){
					selected = " selected";
				}

				if(list.length <= 20){
					return "c candB" + selected;
				}else{
					return "c cand" + selected;
				}
			})
			.attr("cx", function(d, i){
				let startX = (cellWidth/2);
				let currCol = Math.floor(i/lin);
				let currLin = i - (currCol*lin);

				return startX + (currCol*cellWidth);
			})
			.attr("cy", function(d, i){
				let startY = (cellHeight/2);
				let pastCols = Math.floor(i/lin);
				let currLin = i - (pastCols*lin)

				return startY + (currLin*cellHeight);
			})
			.attr("fill", function(d, i){
				if(list.length <= 20){
					svg.select("defs")
						.append("pattern")
						.attr("id", function(dd,ii){
							return "img_"+index+"_"+d.id;
						})
						.attr("patternUnits", "objectBoundingBox")
						.attr("x", 0)
						.attr("y", 4)
						.attr("width", 1.1) // dotRadius*2
						.attr("height", 1.4) // (dotRadius*2)*1.3
							.append("image")
							.attr("xlink:href", function(dd,ii){
								return d.image;
							})
							.attr("width", dotRadius*2) // dotRadius*2
							.attr("height", (dotRadius*2.8)) // (dotRadius*2)*1.3
					//

					return "url(#img_"+index+"_"+d.id;+")";
				}else{
					return false;
				}
			})
			.attr("style", function(){
				if(list.length <= 20){
					return "filter: url(#grayscale)";
				}else{
					return "";
				}
			})
			.on("mouseover", function(d){

				d3.select("#info-box").html(capitalizeName(d.name) + " ("+d.party+")");
				d3.select("#info-box").classed("hidden", false);
				
				clearTimeout(infoTimeout);
			})
			.on("mouseout", function(d){
				clearTimeout(infoTimeout);
				infoTimeout = setTimeout(function(){
					d3.select("#info-box").classed("hidden", true);
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
					.attr("style", "margin-left: " +(coordinates[0]-40)+ "px; margin-top: "+(coordinates[1] - height - 15)+"px");
				
				clearTimeout(infoTimeout);
			})
			
			.transition()
				.attr("r", dotRadius)
				.ease(d3.easeElastic)
				.delay(function(d,i){
					let random = Math.random()*20; 

					if(noAnim){
						return 0
					}
					return random*50;
				})
				.duration(function(d,i){ 
					let random = Math.random()*20; 

					if(noAnim){
						return 0
					}
					return 500 + (10*random);
				});

		let pBox = document.querySelectorAll(".box-content")[index];
		let newBlockY = pBox.offsetHeight + (wHeight*(index)) + 40;

		blockWidth = block.node().getBBox().width + cellWidth;
		block.attr("transform", 
			"translate("+ (colWidth - blockWidth)/2 +"," + newBlockY + ")")
		
		if(list.length <= 20){
			let candidateStrokes = block.selectAll("circle");
			candidateStrokes = block.selectAll(".c-stroke")
				.data(list)
				.enter()
				.append("circle")
				.attr("r", dotRadius)
				.attr("class", function(d, i){
					let selected = "";
					if(d.party === selectedParty){
						selected = " selected";
					}
					return "c-stroke" + selected;
				})
				.attr("id", function(d, i){
					return "cs_"+index+"_"+d.id;
				})
				.attr("cx", function(d, i){
					let startX = (cellWidth/2);
					let currCol = Math.floor(i/lin);
					let currLin = i - (currCol*lin);

					return startX + (currCol*cellWidth);
				})
				.attr("cy", function(d, i){
					let startY = (cellHeight/2);
					let pastCols = Math.floor(i/lin);
					let currLin = i - (pastCols*lin)

					return startY + (currLin*cellHeight);
				})
				.attr("opacity", 0)
				.transition()
					.attr("opacity", 1)
					.delay(function(){
						if(noAnim){
							return 0
						}else{
							return 800;
						}
					});
		}

		let filteredData = list;
		// new stuff
		let nestedByParty = d3.nest()
			.key(function(d) { return d.party; })
			.rollup(function(leaves) { 
				return leaves.length;
			})
			.entries(filteredData)
			.sort(function(a, b){ 
				return d3.ascending(b.value, a.value); 
			})

		partyCharts[partyCharts.length] = svg.append("g")
			.attr("id", "viz_"+blockData.length)
			.attr("class", "pc")
			.attr("transform", "translate(0," + (newBlockY + colHeight + 90) + ")");

		let maxPValue = nestedByParty[0].value;

		partyCharts[partyCharts.length-1]
			.selectAll(".party-bar")
			.data(nestedByParty)
			.enter()
			.append("rect")
			.attr("width", ((svgWidth-20)/nestedByParty.length) - 2)
			.attr("height", function(d,i){
				return 1 + ((d.value/maxPValue)*50);
			})
			.attr("x", function(d, i){
				let width = (svgWidth-20)/nestedByParty.length;
				return 10 + (i*width);
			})
			.attr("y", function(d, i){
				let height = 1 + ((d.value/maxPValue)*50);
				return -height;
			})
			.attr("class", function(d,i){
				let pClass = "party-bar";
				console.log(d.key)
				console.log(selectedParty)
				if(d.key.toUpperCase() == selectedParty.toUpperCase()){
					pClass += " highlighted";
				}
				return pClass;
			})
			.attr("data-index", blockData.length-1)
			.on("click", function(d, i){
				let index = d3.select(this).attr("data-index");
				selectedParty = d.key;

				rebuildViz(index, true);

				return;
			});
		partyCharts[partyCharts.length-1]
			.selectAll(".party-label")
			.data(nestedByParty)
			.enter()
			.append("text")
			.attr("class", "party-label")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-90)")
			.attr("y", function(d, i){
				let width = (svgWidth-20)/nestedByParty.length;
				return (width) + (i*width);
			})
			.attr("x", -5)
			.text(function(d,i){
				return d.key;
			})
			.attr("data-index", blockData.length-1)
			.on("click", function(d, i){
				let index = d3.select(this).attr("data-index");
				selectedParty = d.party;

				rebuildViz(index);

				return;
			});
	}

	let animateRemoved = function(prevBlock, removed){
		let temp;

		if(removed.length == 0){
			return;
		}

		temp = prevBlock.append("g");
		removed.each(function(d,i){
			let cand = d3.select(this);
			let cloned = cand.node().cloneNode(true);

			temp.node().appendChild(cloned);
		});
		temp.selectAll(".c")
			.attr("fill-opacity", 1)
			.attr("stroke-opacity", 1)
			.transition()
				.attr("cy", function(dd,ii){
					let candY = d3.select(this).attr("cy");
					return parseInt(candY) + 500;
				})
				.attr("fill-opacity", 0)
				.attr("stroke-opacity", 0)
				.duration(700)
				.delay(function(d,i){
					return (Math.random()*10)*100
				})
				.on("end", function(d, i){
					d3.select(this).remove();
				});
		
		removed.classed("removed", true);

		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(function(){
			let lastBlock = document.querySelector("#box"+blockData.length);
			smoothScroll(lastBlock.offsetTop, 10);
		},800)
	}

	let smoothScroll = function(pos, time){
		/*Time is only for scrolling upwards*/
		/*pos is the y-position to scroll to (in pixels)*/
		if(isNaN(pos)){
			throw "Position must be a number";
		}
		if(pos<0){
			throw "Position can not be negative";
		}
		var currentPos = window.scrollY||window.screenTop;
		if(currentPos<pos){
			if(time){
				var x;
				var i = currentPos;
				x = setInterval(function(){
					window.scrollTo(0, i);
					i += 10;
					if(i>=pos){
					 	clearInterval(x);
					}
				}, time);
			} else {
				var t = 10;
				for(let i = currentPos; i <= pos; i+=10){
					t+=10;
					setTimeout(function(){
						window.scrollTo(0, i);
					}, t/2);
				}
			}
		} else {
			time = time || 2;
			var i = currentPos;
			var x;
			x = setInterval(function(){
				window.scrollTo(0, i);
				i -= 10;
				if(i<=pos){
				 	clearInterval(x);
				}
			}, time);
		}
	}

	let loadCandidateData = function(id) {
		let infoBlock = d3.select("#full-info").node();

	    d3.json(candURL+id+"/", function(error, cData){
	 		d3.select("#chart2").classed("hidden", true);

	    	if(error){
	    		console.log(error);
	    		d3.select("#msg-box").html("Erro ao carregar dados do candidato (id "+id+")");
				d3.select("#msg-box").classed("hidden", false);
				clearTimeout(msgTimeout);

				msgTimeout = setTimeout(function(){
					d3.select("#msg-box").classed("hidden", true);
				}, 3500);

	    		return false;
	    	}else if(cData){
	    		fillCandidateInfo(cData);

				

	    		// fake click event
	    		// only if not president
	    		if(window.currentFilters.cargo != "presidente"){
	    			window.buildChart1(staticData, cData);
		    		let e = document.createEvent('UIEvents');
					e.initUIEvent('click', true, true, window, 1);
		    		d3.select("#basic-info div:nth-child(1)").node().dispatchEvent(e);
	    		}else{
	    			d3.selectAll("#chart1 svg").remove();
	    			d3.selectAll("#chart2 svg").remove();
					d3.select("#chart1-title").html("");
	    		}
	    		d3.selectAll("#chart2 svg").remove();
	    		window.buildChart2(cData);

	    		d3.select("#full-info").classed("hidden", false);
    			smoothScroll(infoBlock.offsetTop, 6);
	    	}
			
		});
	}

	let makePartyChart = function(){

	}

	let fillCandidateInfo = function(cData){

		d3.select("#profile-pic")
    		.select("img")
    		.attr("src", "");

		d3.select("#profile-pic")
    		.select("img")
    		.attr("src", cData.image);

    	d3.select("#profile-name span")
    		.text(capitalizeName(cData.ballot_name));

    	d3.select("#info-partido")
    		.text(correctParty(cData.party_abbreviation));

    	d3.select("#info-profissao")
    		.text(cData.occupation.toLowerCase());

    	d3.select("#info-idade")
    		.text(cData.age);

    	d3.select("#info-genero")
    		.text(cData.gender.toLowerCase());

    	d3.select("#info-estudo")
    		.text(cData.education.toLowerCase());

    	d3.select("#info-raca")
    		.text(cData.ethnicity.toLowerCase());

    	d3.select("#info-elected")
    		.text(function(d,i){
    			let num_won = cData.elections_won;

    			if(num_won > 0){
    				return "Sim"
    			}else{
    				return "Não"
    			}
    		});

    	d3.select("#info-coliga")
    		.text(correctParty(cData.coalition_description));
		//d3.select("#info-partido").text();
	}

	let initFileEvents = function(){
		let buttons = d3.selectAll("#basic-info .clickable");
		let arrowLeft = d3.select("#profile-name button.last");
		let arrowRight = d3.select("#profile-name button.next");

		buttons.on("click", function(item, i){
			let prop = d3.select(this).attr("data-prop");

			buttons.classed("active", false);
			d3.select(this).classed("active", true);

			d3.selectAll("#chart1 svg").classed("active", false);
			d3.select("#chart1 svg#chart-"+prop).classed("active", true);
		})

		arrowLeft.on("click", function(item, i){

			if(clickedCandidate > 0){
				clickedCandidate -= 1;
			}else{
				clickedCandidate = clickedBlock[0].length-1;
			}

			console.log(clickedCandidate);

			loadCandidateData(clickedBlock[0][clickedCandidate].id);
		})

		arrowRight.on("click", function(item, i){

			if(clickedCandidate < clickedBlock[0].length-1){
				clickedCandidate += 1;
			}else{
				clickedCandidate = 0;
			}
			console.log(clickedCandidate);

			loadCandidateData(clickedBlock[0][clickedCandidate].id);
		})
	}

	window.resize = function(){
		wHeight = parseInt(window.innerHeight);
		colWidth = parseInt(d3.select('.column').style('width'));

		if(colWidth > breakPoint){
			colHeight = wHeight - 580;//Math.round(colWidth*0.4);
			margin = {top: 0, right: 0, bottom: 0, left: 0};
		}else{
			colHeight = wHeight - 580;
			margin = {top: 0, right: 0, bottom: 0, left: 0};
		}
		if(colHeight < 140){
			colHeight = 140;
		}
		if(wHeight < 500){
			wHeight = 500;
		}

	    svgHeight = wHeight*blockData.length;
	    svgWidth = colWidth;

	    if(svg){
	      svg.attr("viewBox", "0 0 " +svgWidth+ " " + svgHeight)
			.attr("width", svgWidth)
			.attr("height", svgHeight)
		}

	    blocks.forEach(function(item, i){
	    	//let vizdata = blockData[i];
	    	rebuildViz(i);
	    });

	    if(window.resizeChart2){
	    	d3.selectAll("#chart2 svg").remove();
	    	window.resizeChart2();
	    }
	    if(window.resizeChart1){
	    	d3.selectAll("#chart1 svg").remove();
	    	window.resizeChart1();
	    }
	    
	}

	let printData = function(data){
		console.log(data);
	}

	let getDescription = function(filterType, amount){
		let phrase = "";
		let prep = { m: "Destes", f: "Destas"};
		let color = { m: "negros, pardos ou indígenas", f: "negras, pardas ou indígenas"};

		if(amount > 1){
			if(filterType == "mulheres"){
				phrase = prep[currGender] + ", <b>"+amount+"</b> são mulheres";
				currGender = "f";
			}else if(filterType == "nunca concorreram"){
				phrase = prep[currGender] + ", <b>"+amount+"</b> nunca concorreram numa eleição";
			}else if(filterType == "nunca eleitos"){
				phrase = prep[currGender] + ", <b>"+amount+"</b> nunca foram eleitos";
			}else if(filterType == "negros ou pardos"){
				phrase = prep[currGender] + ", <b>"+amount+"</b> são "+color[currGender];
			}
		}else{
			if(filterType == "mulheres"){
				phrase = prep[currGender] + ", <b>"+amount+"</b> é mulher";
				currGender = "f";
			}else if(filterType == "nunca concorreram"){
				phrase = prep[currGender] + ", <b>"+amount+"</b> nunca concorreu numa eleição";
			}else if(filterType == "nunca eleitos"){
				phrase = prep[currGender] + ", <b>"+amount+"</b> nunca foi eleito";
			}else if(filterType == "negros ou pardos"){
				phrase = prep[currGender] + ", <b>"+amount+"</b> é "+color[currGender];
			}
		}
		

		return phrase;
	}

	setup();
}

// utilitary functions
let correctParty = function(party){
	let corrected = party.toUpperCase();
	
	// corrects some parties that are wrong in database...
	corrected = party.toUpperCase().replace("SOLIDARIEDADE", "SD");
	corrected = corrected.toUpperCase().replace("PC DO B", "PCdoB");
	corrected = corrected.toUpperCase().replace("PT DO B", "PTdoB");
	corrected = corrected.toUpperCase().replace("SOLIDARIEDADE", "SD");
	corrected = corrected.toUpperCase().replace("PC DO B", "PCdoB");
	corrected = corrected.toUpperCase().replace("PT DO B", "PTdoB");

	return corrected;
}
const exceptions = [
  "Do",
  "Da",
  "Dos",
  "Das",
  "De",
  "Des",
  "Van",
  "Von",
  "E"
];
const capitalizeName = function(name) {
  let lastCharWasNotALetter = true;
  return name
      .toLowerCase()
      .split('')
      .map(function (char) {
        if (lastCharWasNotALetter) {
          char = char.toUpperCase();
        }
        lastCharWasNotALetter = char.search(/[a-zA-Záãàéêíóôõúü]/) == -1;
        return char;
      })
      .join('')
      .split(' ')
      .map(function (word) {
        if (exceptions.indexOf(word) != -1) {
          return word.toLowerCase();
        }
        return word;
      })
      .join(' ');
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};