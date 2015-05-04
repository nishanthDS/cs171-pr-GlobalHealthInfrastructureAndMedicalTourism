
Scatter = function(_parentElement, _data, _eventHandler){
	this.parentElement = _parentElement;
	this.data = _data.features;
	this.eventHandler = _eventHandler;
	this.dp = this.data;
//18602086633
	//define all constants
	this.margin = {top:20, right: 0, bottom: 50, left: 60},
	this.width = 500 - this.margin.left - this.margin.right,
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

	this.y = d3.scale.pow().exponent(1)
			 .range([this.height, 0]);

	this.x = d3.scale.pow().exponent(1)
			.range([0, this.width-50]);

	this.xh = d3.scale.ordinal()
      .rangeRoundBands([0, 540], .2);

	this.r = d3.scale.linear()
			 .range([0,8]);

	this.color = d3.scale.linear()
				.domain([40, 60, 70, 75, 80])
				.range(["darkred", "red", "orange",  "lightgreen", "green"]);

	that = this;
	this.brush = d3.svg.brush()
				.x(this.x)
				.y(this.y)
      			.on("brush", this.brushmove)
      			


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
		.style("font-size", 12)
		.style("font-weight", "bold")
		.text("Per Capita Health Spending")

	this.svg.append("g")
		.attr("class", "y axis")
		.append("text")
		.attr("transform", "translate(-50,0)rotate(-90)")
		.attr("y", 15)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.style("font-size", 12)
		.style("font-weight", "bold")
		.text("Doctors Per 1000")


	 


		this.svg.append("g")
        .attr("class", "brush");
	
	//call the update method
	this.updateVis();

}



Scatter.prototype.brushmove = function(data){
	
	e = d3.event.target.extent();
	
	

	$(that.eventHandler).trigger("selectionChangedScatter",{"selection": e});


}



Scatter.prototype.onSelectionChange = function(data){
	this.data = data.features;
	this.updateVis();
}

Scatter.prototype.onSelectionChangeHistogram = function(s){
		that = this;
		e = s.selection;
		that.data = that.dp;

		this.data_fil_s = that.data.filter(function(d){ return parseFloat(d.properties.gdp) > 0 && parseFloat(d.properties.gdp) > 0 && parseFloat(d.properties.p1000) > 0; });
     	this.data_sort_s = this.data_fil_s.sort(function(a,b){return d3.descending(parseFloat(a.properties.gdp), parseFloat(b.properties.gdp))});
	  		
	//updates scales
	    that.xh.domain(this.data_sort_s.map(function(d){return d.properties.name;}));
		//console.log(that.data);
	   var fil_sdata = that.data.filter(function(d){
   		var xsh = that.xh(d.properties.name);
   		
   		
   		//console.log(that.x);

   		return xsh >= e[0] && xsh <= e[1];
   })
	   

	   if(fil_sdata.length > 1){
	   	this.data = fil_sdata;

	   }

	   this.updateVis();
}


Scatter.prototype.updateVis = function(){
	var that = this;

	this.data_fil = this.data.filter(function(d){ return parseFloat(d.properties.gdp) > 0 && parseFloat(d.properties.p1000) > 0; });

	this.data = this.data_fil;

	

	this.x.domain(d3.extent(this.data.map(function(d){return parseInt(d.properties.pcap);})));

	this.y.domain(d3.extent(this.data.map(function(d){return parseFloat(d.properties.p1000);})));

	//this.r.domain(d3.extent(this.data.map(function(d){return parseInt(d.properties.LE);})));
	this.r.domain([0,90])
	//this.color.domain(d3.extent(this.data.map(function(d){return parseInt(d.properties.LE[2010]);})));

	//updates axis

	
	this.svg.select(".x.axis")
		.call(this.xAxis);

	this.svg.select(".y.axis")
		.call(this.yAxis);

	//Data join
	var circle = this.svg.selectAll(".circle")
				 .data(this.data, function(d){return d.properties.name;});

		

	//Append new circles

			//Append new circles
		var circle_enter = circle
							.enter()
							.append("g")
							.attr("class", "circle")
							.on('mouseover', function(d){
							$(that.eventHandler).trigger("geoCountrySelect", d.properties.name);
								console.log(d.properties.name);
								})
							.on('mouseout', function(d){
							$(that.eventHandler).trigger("countryRank", "s");
							});

	//Append a rect and a text only for the Enter set (new g)
		circle_enter.append("circle");
		circle_enter.append("text")
					.attr("class", "scatter-text");

				


		circle.selectAll("circle").transition()
			.attr("cx", function(d){
			if(parseInt(d.properties.pcap) > 0)
			{return that.x(parseInt(d.properties.pcap));}
			else {return 0;}
			})
		.attr("cy", function(d){
			if(parseFloat(d.properties.p1000) > 0)
				{return that.y(parseFloat(d.properties.p1000));}
			else {return 0;}
				})
		.attr("r", function(d){ return that.r(parseInt(d.properties.LE));})
		.style("fill", function(d) {
			return that.color(parseInt(d.properties.LE)); });

		circle.selectAll("text").transition()
			.attr("x", function(d){
			if(parseInt(d.properties.pcap) > 0)
			{return that.x(parseInt(d.properties.pcap));}
			else {return 0;}
			})
		.attr("y", function(d){
			if(parseFloat(d.properties.p1000) > 0)
				{return that.y(parseFloat(d.properties.p1000));}
			else {return 0;}
				})
		.text(function(d){return d.properties.name; })

		

		circle.exit().remove();
		
		
		//circle.exit().transition().remove();

		

        	this.svg.select(".brush")
            .call(this.brush);
            
}



