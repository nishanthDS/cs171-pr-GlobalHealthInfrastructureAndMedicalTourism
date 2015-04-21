Choropleth = function(_parentElement, _data, _eventHandler){

	this.parentElement = _parentElement;
	this.data = _data.features;
	this.eventHandler = _eventHandler;

	//define all constants
	this.margin = {top:100, right: 0, bottom: 50, left: 0},
	this.width = 878 - this.margin.left - this.margin.right,
	this.height = 450 - this.margin.top - this.margin.bottom;

	this.initVis();
}

Choropleth.prototype.initVis = function(){
	// constructs SVG layout

	this.svg = this.parentElement.select("svg")
				.attr("width", this.width+this.margin.left+this.margin.right)
				.attr("height", this.height + this.margin.top + this.margin.bottom)
				.append("g")
				.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

	//Define map projection
	this.projection = d3.geo.equirectangular()
								   .translate([this.width/2+20, this.height/2+30])
								   .scale([this.width/6.5]);	

	//Color
	//this.color = d3.scale.quantize()
                    //.range(["rgb(237,248,233)", "rgb(186,228,179)",
                     //"rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"]);

    this.color = d3.scale.linear()
				.domain([0, 20, 30, 35, 40])
				.range(["darkred", "red", "orange",  "lightgreen", "green"]);

	//Define path generator
	this.path = d3.geo.path()
				.projection(this.projection);


	//call the update method
	this.updateVis();

}

Choropleth.prototype.updateVis = function(){
	var that = this;

	//this.color.domain(d3.extent(this.data.map(function(d){return d.properties.LE[2012]})));

	this.svg.selectAll("path")
		.data(this.data)
		.enter()
		.append("path")
		.attr("d", this.path)
		 .style("fill", function(d) {
                                //Get data value
                                var value = d.properties.LE[2010];

                                if (value > 0) {
                                        //If value exists…
                                        return that.color(value);
                                } else {
                                        //If value is undefined…
                                        return "#ccc";
                                }
                   });
}