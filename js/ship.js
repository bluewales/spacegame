/**
 * Created by Luke on 7/9/2017.
 */


var ship_data = {
    1:{
        floors:[
            {x:1,y:1},{x:3,y:1},{x:5,y:1},{x:7,y:1},
            {x:1,y:3},{x:3,y:3},{x:5,y:3},{x:7,y:3},
            {x:3,y:5},{x:5,y:5},{x:7,y:5},
            {x:3,y:7},{x:5,y:7},{x:7,y:7}
        ],
        walls:[
            {x:4,y:3},{x:3,y:4},
            {x:0,y:1},{x:1,y:0},
            {x:3,y:0},{x:4,y:1},
            {x:0,y:3},{x:1,y:4},
            {x:5,y:0},{x:7,y:0},
            {x:8,y:1},{x:8,y:3},
            {x:5,y:4},{x:7,y:4},
            {x:2,y:5},{x:2,y:7},
            {x:3,y:8},{x:5,y:8},
            {x:7,y:8},{x:8,y:5},
            {x:8,y:7}
        ]
    },
    2:{
        floors:[
            {x:1,y:1},{x:3,y:1},{x:5,y:1},{x:7,y:1},
            {x:1,y:3},{x:3,y:3},{x:5,y:3},{x:7,y:3},
            {x:3,y:5},{x:5,y:5},{x:7,y:5},
            {x:3,y:7},{x:5,y:7},{x:7,y:7}
        ],
        walls:[
        ]
    }
};



function draw_ship(ship_g, z) {






    ship_g.append("g")
        .attr("id", "floors")
        .selectAll("rect")
        .data(ship_data[z].floors)
        .enter().append("rect")
        .attr("x", function(d,i) { return Math.floor(d.x/2) * (floor_width + wall_width); })
        .attr("y", function(d,i) { return Math.floor(d.y/2) * (floor_width + wall_width); })
        .attr("width", floor_width + wall_width)
        .attr("height", floor_width + wall_width)
        .style("fill", "lightgrey")
        .style("stroke", "white")
        .style("stroke-width", wall_width/2)
        .on("click", function(d){
            console.log("click square");
            handle_click(d);
        });

    ship_g.append("g")
        .attr("id", "walls")
        .selectAll("rect")
        .data(ship_data[z].walls)
        .enter().append("rect")
        .attr("x", function(d,i) { return Math.floor(d.x/2) * (floor_width + wall_width) - wall_width/2; })
        .attr("y", function(d,i) { return Math.floor(d.y/2) * (floor_width + wall_width) - wall_width/2; })
        .attr("width", function(d,i) {
            if(d.x % 2 == 0 && d.y % 2 == 1) {
                return wall_width;
            } else if (d.y % 2 == 0 && d.x % 2 == 1) {
                return floor_width + 2 * wall_width;
            }
        })
        .attr("height", function(d,i) {
            if(d.x % 2 == 0 && d.y % 2 == 1) {
                return floor_width + 2 * wall_width;
            } else if (d.y % 2 == 0 && d.x % 2 == 1) {
                return wall_width;
            }
        })
        .style("fill", "#7f6d92");
}