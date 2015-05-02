
HospRank = function(_parentElement, _data, _eventHandler){
	this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;

	
	    //define all "constants" here
    this.margin = {top: 20, right: 0, bottom: 30, left: 0},
    this.width = 300 - this.margin.left - this.margin.right,
    this.height = 700 - this.margin.top - this.margin.bottom;
	
    this.initVis();
	
}

HospRank.prototype.initVis = function(){
	// constructs SVG layout
		//console.log(this.data);
	    this.svg = this.parentElement.select("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      	.append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.y = d3.scale.ordinal()
        .rangeRoundBands([0, this.height], .2);

        this.x = d3.scale.linear()
        .range([0, this.width]);

        this.xAxis = d3.svg.axis()
        			 .scale(this.x)
        			 .orient("top");

        this.yAxis = d3.svg.axis()
        			.scale(this.y)
        			.orient("left")

        //Add axes visual elements

        this.svg.append("g")
        	.attr("class", "x axis")
        	.append("text")

        	//call the update method
        	this.updateVis();
}

HospRank.prototype.updateVis = function(){
	var that = this;

	this.x.domain(d3.extent(this.data.map(function(d){return d.values ;})));

	this.y.domain(this.data.map(function(d){return d.key}));

	//updates axis
	this.svg.select(".x.axis")
		.call(this.xAxis);

	//Data join
	var bar = this.svg.selectAll(".bar")
				.data(this.data, function(d){return d.key;});

	//Append new bar groups
	var bar_enter = bar.enter().append("g");

	// Append a rect and a text only for the Enter set (new g)
	bar_enter.append("rect");
	bar_enter.append("text");

	//Add attributes (position) to all bars
	bar
		.attr("class", "bar")
		.transition()
		.attr("transform", function(d, i) {return "translate(0," + (that.y(d.key)) + ")";});

	//Update all the inner rects
	bar.select("rect").transition()
		.attr("x", 0)
		.attr("y", 0)
		.style("fill", "green")
		.attr("width", function(d){return that.x(d.values); })
		.attr("height", this.y.rangeBand())
}