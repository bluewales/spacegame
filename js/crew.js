/**
 * Created by Luke on 7/18/2017.
 */


function draw_crew(ship_g, crew_data) {
    ship_g.append("g")
        .classed("crew", true)
        .selectAll("circle")
        .data(crew_data)
        .enter().append("circle")
        .attr("cx", function(d) {return Math.floor(d.location.x / 2) * (floor_width + wall_width) + floor_width/2;})
        .attr("cy", function(d) {return Math.floor(d.location.y / 2) * (floor_width + wall_width) + floor_width/2;})
        .attr("r", floor_width/3)
        .style("fill", function(d, i) {return "hsl(" + Math.random() * 360 + ",100%,50%)"});
}


function get_context_dependant_menu_for_crew(crew_data) {



}
