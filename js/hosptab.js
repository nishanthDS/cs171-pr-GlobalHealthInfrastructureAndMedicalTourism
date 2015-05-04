
HospTab = function(_parentElement,_geodata, _data, _meta, _eventHandler){
	this.parentElement = _parentElement;
    this.hdata = _data;
    this.hp = this.hdata;
    this.geodata = _geodata.features;
    this.eventHandler = _eventHandler;
    this.option = _meta;

	
	    //define all "constants" here
    this.margin = {top: 20, right: 0, bottom: 30, left: 0},
    this.width = 300 - this.margin.left - this.margin.right,
    this.height = 500 - this.margin.top - this.margin.bottom;
	
    this.initVis();
	
}

HospTab.prototype.initVis = function(){
	// constructs SVG layout
		//console.log(this.data);
		 this.x = d3.scale.ordinal()
                    .rangeRoundBands([0, 540], .2);

        	//call the update method
        	this.updateVis();
        	this.hoverLock = "F";
}

HospTab.prototype.onSelectionChange = function(data, meta){
	
	this.option = meta;
	if (this.hoverLock == "F")
	{ 
		this.hdata = data;
		this.updateVis();
	}

	if(this.option = "cRank"){
		this.hp = data;
	}

	
}

HospTab.prototype.onSelectionChangeHistogram = function(s){

		that = this;
		e = s.selection;
		

		this.data_fil = that.geodata.filter(function(d){ return parseFloat(d.properties.gdp) > 0 && parseFloat(d.properties.gdp) > 0 && parseFloat(d.properties.p1000) > 0; });
     	this.data_sort = this.data_fil.sort(function(a,b){return d3.descending(parseFloat(a.properties.gdp), parseFloat(b.properties.gdp))});
	  
		
	//updates scales
		

	    this.x.domain(this.data_sort.map(function(d){return d.properties.name;}));

	   this.fil_data = that.geodata.filter(function(d){
   		var xs = that.x(d.properties.name);

   		return xs >= e[0] && xs <= e[1];
   		})

	 

	  
}

HospTab.prototype.onSelectionChangeScatter = function(s){

	e = s.selection;
	//console.log(e);
	this.hdata = this.hp;
	that = this;
	this.fil_data = that.geodata.filter(function(d){
		var xs = parseInt(d.properties.pcap);
		var ys = parseFloat(d.properties.p1000);

		return xs > e[0][0] && xs < e[1][0] && ys > e[0][1] && ys < e[1][1];
	})

		//console.log(this.fil_data);

	var list_country_hosp =	this.fil_data.map(function(d){return d.properties.name;});

	
	this.hdata_t = this.hdata.filter(function(d){return list_country_hosp.indexOf(d.key) > -1;})

	if (this.hdata_t.length > 0)
		{
			this.hdata = this.hdata_t;
			this.hoverLock = "T";
		}
	else
		{
			this.hdata = this.hp;
			this.hoverLock = "F"
		}

		//console.log(this.hdata);
	this.updateVis();
}

HospTab.prototype.updateVis = function(){
	var that = this;
	d3.select("table").remove();

	var head 

 	if(this.option == "cHosp")
	{head = ["","rank", "hospital"];}
	else
		{head = ["", "country", "top hospitals"];}
	
	//Data join
	var table = this.parentElement.append("table"),
		thead = table.append("thead")
					  .attr("class", "thead");
		tbody = table.append("tbody");

		//table.append("caption")
         // .html("World Countries Ranking");
		
		thead.append("tr").selectAll("th")
			 .data(head)
			 .enter()
			 .append("th")
			 .text(function(d) {return d; })
		
		var rows = tbody.selectAll("tr.row")
						.data(this.hdata, function(d) {
							if(that.option == "cHosp")
							{return d.rank;}
							else{return d.key;}
						})
						.enter()
						.append("tr")
						.attr("class", "row");
		
		var cells = rows.selectAll("td")
						.data(function(d){
							if(that.option == "cHosp")
							{return [d.rank, d.hospital];}
							else{return [d.key, d.values];}
					})
						.enter()
						.append("td")

						cells.transition()
						.text(function(d) {return d;});

						//rows.exit().transition().remove();
						
}