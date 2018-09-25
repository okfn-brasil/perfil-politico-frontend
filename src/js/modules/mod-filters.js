// Populate the select boxes
// with all available filters
module.exports = function(filters){
	let d3 = window.d3;
	let selects = d3.select("#intro").selectAll("select");
	let Break = {};

	window.repopulateFilters = function(){
		filters.forEach(function(item, i){
			let select = d3.select("#filtro-"+item.filtro);
			select.html("");
			
			item.lista.forEach(function(obj, ia){
				let opt;
				let dep;

				if(obj.dependencia){
					/*
					obj.dependencia.forEach(function(item, id){
						dep = item.split("-");

						// if the combo box option depends on 
						// other previous
						if( dep &&
							dep.indexOf(window.currentFilters[dep[0]]) > -1 ){

							opt = select.append("option");
							opt.text(obj.value).attr("value", obj.code);

							//console.log(window.currentFilters[filter.name].toLowerCase());
							if(window.currentFilters[filter.name].toLowerCase() 
								== obj.code.toLowerCase() ){
								opt.attr("selected", true);
							}else{
								opt.attr("selected", null);
							}
						}
					})
					*/
					
				}else{
					opt = select.append("option");
					opt.text(obj.nome)
					opt.attr("value", obj.valor.toLowerCase());

					if(window.currentFilters[item.filtro].toLowerCase() 
						== obj.valor.toLowerCase() ){
						opt.attr("selected", true);
					}else{
						opt.attr("selected", null);
					}
				}

				if(item.filtro == "estado"){
					opt.text(obj.valor.toUpperCase())
					opt.attr("data-name", obj.nome);
					opt.attr("data-preposition", obj.preposicao);
				}
			});
		});

		/*
		filters.forEach(function(filter, i){
			let optSelected = d3.select("select[data-name="+filter.name+"] option[selected=true]");

			if(optSelected.size() == 0){
				optSelected = d3.select("select[data-name="+filter.name+"] option:first-child");
				optSelected.attr("selected", true);

				if(optSelected.size() == 1){
					window.currentFilters[filter.name] = optSelected.attr("value");

					if(filter.name != "ano" && filter.name != "turno"){
						window.setParamId(filter.name, window.params[filter.name].data);
					}else{
						window.params[filter.name].value = window.currentFilters[filter.name];
					}
				}
			}
		});*/
	}

	window.repopulateFilters();
	
	selects.on("change", function(d){
		let filterType = d3.select(this).attr("data-name");
		let selected = d3.select(this).property('value');

		d3.select(this)
		.selectAll("option")
		.attr("selected", function(d){
			if(d3.select(this).attr("value")==selected){
				return true;
			}else{
				return null;
			}
		});

		clearTimeout(window.partyTimeout);

		window.currentFilters[filterType] = selected;

		if(window.currentFilters.cargo == "presidente"){
			window.currentFilters.estado = "br";
		}else{
			window.currentFilters.estado = d3.select("#filtro-estado").property('value')
		}

		if(filterType == "estado"){
			window.currentFilters.estado_nome = d3.select("#filtro-estado option[selected]").attr("data-name");
			window.currentFilters.estado_prep = d3.select("#filtro-estado option[selected]").attr("data-preposition");
		}
		
		window.init();
	});
	
}

