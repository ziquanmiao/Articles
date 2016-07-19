// http://bl.ocks.org/jose187/4733747
var svg_width = 600;
var svg_height = 500;

// run only when doc is ready other we will have asynchronous issues
$(document).ready(function(){
	makeGraph("#graph")
})

function makeGraph(DOM_PATH){
	var width = svg_width,
        height = svg_height;

    var color = d3.scale.linear()
    			.domain([0.2,1])
    			.range(["blue","yellow"]);
    var strokeColor;

    // initialize svg
    var svg = d3.select(DOM_PATH).append("svg")
			    .attr("width", width)
			    .attr("height", height);

	// initialize force network structure
	var force = d3.layout.force()
				.gravity(1)
				.distance(280)
				.charge(-800)
				.size([width,height]);

// read data
	d3.json("officeStuff.json", function(error, graph) {
		if(error) throw error;

		// assign nodes//links
		force.nodes(graph.nodes)
			.links(graph.links)
			.start();

		strokeColor = d3.scale.linear()
						.domain([0,d3.max(graph.links.map(function (d){
							return d.value;
						}))])
						.range(["white","black"])

// LINK PROPERTIES + INIT
		var link = svg.selectAll(".link")
			        .data(graph.links)
			        .enter().append("line")
			        .attr("class", "link")
			        .style("stroke-width", function(d) { return Math.sqrt(d.value); })
			        .style("stroke", function (d) { return strokeColor(d.value); });
// NODE INITIALIZATION
        var node = svg.selectAll(".node")
			        .data(graph.nodes)
			        .enter()
			        .append("g")
			        .attr("class", "node")
			        .call(force.drag);

// NODE CIRCLE PROPERTIES
			node.append("circle")
				.attr("r", function(d){ return Math.sqrt(d.pageRank) * 100})
			    .style("fill", function(d) { return color(d.closenessCent); })

		var title = svg.append("text")
					.attr("x", 5)
					.attr("y", 20)
					.text("The Office Season 3 Network")
					.attr("font-size", "20px")
					.attr("font-family", "Arial");

// NODE LABEL PROPERTIES
			node.append("text")
				.attr("dx", 12)
				.attr("dy", ".35em")
				.attr("class", "labelText")
				.text(function(d){ return d.name.charAt(0).toUpperCase() + d.name.slice(1); })
				.attr("stroke", "black")
				.attr("font-size", function(d){return 100 * d.betweenessCent + 10;})

// Asyncrhonous call
		force.on("tick", function() {
		    link.attr("x1", function(d) { return d.source.x; })
		        .attr("y1", function(d) { return d.source.y; })
		        .attr("x2", function(d) { return d.target.x; })
		        .attr("y2", function(d) { return d.target.y; });

		    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		  });
		});

}