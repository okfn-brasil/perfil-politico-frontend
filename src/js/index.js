// detect mobile browser
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// globals
window.d3 = require("d3");
let ptBR_data = require("./data/locale-pt_BR");
window.ptBR = window.d3.formatLocale(ptBR_data);

//window.data = require("./data/data");// temporary fake list
window.filters = require("./data/filters");// to populate the selects
let populateFilters = require("./modules/mod-filters");
window.customSelects = require("./modules/mod-select");
let viz = require("./modules/mod-viz");
let chart2 = require("./modules/mod-chart2");
let chart1 = require("./modules/mod-chart1");

window.currentFilters = {
	"estado": "sp",
	"estado_nome": "São Paulo",
	"estado_prep": "em",
	"cargo": "deputado-federal",
	"cargo_pl": "deputados federais"
}

populateFilters(window.filters);
window.customSelects();
viz();
chart2();
chart1();

document.addEventListener("scroll", function(ev) {
	let footerHeight = document.querySelector("#footer").innerHeight;
	let bottomDesc = document.querySelector("#tags").querySelector(".description");

    if (window.innerHeight + window.scrollY > document.body.offsetHeight) {
        bottomDesc.classList.add("hidden");
    }else{
    	bottomDesc.classList.remove("hidden");
    }
})
