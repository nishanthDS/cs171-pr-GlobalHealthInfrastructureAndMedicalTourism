
Scatter = function(_parentElement, _data, _eventHandler){
	this.parentElement = _parentElement;
	this.data = _data.features;
	this.eventHandler = _eventHandler;
//18602086633
	//define all constants
	this.margin = {top:20, right: 50, bottom: 50, left: 30},
	this.width = 650 - this.margin.left - this.margin.right,
	this.height = 250 - this.margin.top - this.margin.bottom;

	this.initVis();
}

Scatter.prototype.initVis = function(){
	// constructs SVG layout

	this.svg = this.parentElement.select("svg")
				.attr("width", this.width+this.margin.left+this.margin.right)
				.attr("height", this.height + this.margin.top + this.margin.bottom)
				.append("g")
				.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

	this.y = d3.scale.linear()
			 .range([this.height, 0]);

	this.x = d3.scale.linear()
			.range([0, this.width-50]);

	this.r = d3.scale.linear()
			 .range([0,8]);

	this.color = d3.scale.linear()
				.domain([0, 20, 30, 35, 40])
				.range(["darkred", "red", "orange",  "lightgreen", "green"]);

	this.xAxis = d3.svg.axis()
				 .scale(this.x)
				 .orient("bottom");

	this.yAxis = d3.svg.axis()
				.scale(this.y)
				.orient("left");

	//Add axes visual elements
	this.svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0,"+(this.height+10)+")")
		.attr("y",30)
		.append("text")
		.attr("transform", "translate(100,-5)")
		.style("text-anchor", "start")
		.text("Per Capita Health Spending")

	this.svg.append("g")
		.attr("class", "y axis")
		.append("text")
		.attr("transform", "translate(-32,0)rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Doctors Per 1000")

	
	//call the update method
	this.updateVis();

}


Scatter.prototype.updateVis = function(){
	var that = this;

	this.x.domain(d3.extent(this.data.map(function(d){return parseInt(d.properties.pcap[2010]);})));

	this.y.domain(d3.extent(this.data.map(function(d){return parseFloat(d.properties.p1000[2010]);})));

	this.r.domain(d3.extent(this.data.map(function(d){return parseInt(d.properties.LE[2010]);})));

	//this.color.domain(d3.extent(this.data.map(function(d){return parseInt(d.properties.LE[2010]);})));

	//updates axis

	console.log(d3.extent(this.data.map(function(d){return d.properties.pcap[2010];})));

	this.svg.select(".x.axis")
		.call(this.xAxis);

	this.svg.select(".y.axis")
		.call(this.yAxis);

	//Data join
	var circle = this.svg.selectAll(".circle")
				 .data(this.data, function(d){return d.properties.name;});

	//Append new circles
		var circle_enter = circle.enter().append("g");

	//Append a rect and a text only for the Enter set (new g)
		circle_enter.append("circle");
		circle_enter.append("text");

	//update all circles

	circle.select("circle").transition()
		.attr("cx", function(d){
			if(parseInt(d.properties.pcap[2010]) > 0)
			{return that.x(parseInt(d.properties.pcap[2010]));}
			else {return 0;}
		})

		.attr("cy", function(d){
			if(parseFloat(d.properties.p1000[2010]) > 0)
				{return that.y(parseFloat(d.properties.p1000[2010]));}
			else {return 0;}
				})
		.attr("r", function(d){return that.r(parseInt(d.properties.LE[2010]));})
		.style("fill", function(d) {
			return that.color(parseInt(d.properties.LE[2010])); })
}