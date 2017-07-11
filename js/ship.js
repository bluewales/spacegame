/**
 * Created by Luke on 7/9/2017.
 */


var ship = {};


function draw_ship(ship_g, z){

    console.log("z " + ship.min_z + " to " + z);

    for(var z_level = ship.min_z; z_level < z; z_level++) {

        console.log(z_level);

        if (!ship.data[z_level]) continue;

        ship_g.append("g")
            .classed("under-floors", true)
            .selectAll("rect")
            .data(ship.data[z_level].floors)
            .enter().append("rect")
            .attr("x", function (d, i) {
                return Math.floor(d.x / 2) * (floor_width + wall_width);
            })
            .attr("y", function (d, i) {
                return Math.floor(d.y / 2) * (floor_width + wall_width);
            })
            .attr("width", floor_width + wall_width)
            .attr("height", floor_width + wall_width)
            .style("fill", "lightgrey")
            .style("stroke", "white")
            .style("stroke-width", wall_width / 2)
            .on("click", function (d) {
                handle_click(d);
            });

        ship_g.append("g")
            .classed("under-walls", true)
            .selectAll("rect")
            .data(ship.data[z_level].walls)
            .enter().append("rect")
            .attr("x", function (d, i) {
                return Math.floor(d.x / 2) * (floor_width + wall_width) - wall_width / 2;
            })
            .attr("y", function (d, i) {
                return Math.floor(d.y / 2) * (floor_width + wall_width) - wall_width / 2;
            })
            .attr("width", function (d, i) {
                if (d.x % 2 == 0 && d.y % 2 == 1) {
                    return wall_width;
                } else if (d.y % 2 == 0 && d.x % 2 == 1) {
                    return floor_width + 2 * wall_width;
                }
            })
            .attr("height", function (d, i) {
                if (d.x % 2 == 0 && d.y % 2 == 1) {
                    return floor_width + 2 * wall_width;
                } else if (d.y % 2 == 0 && d.x % 2 == 1) {
                    return wall_width;
                }
            })
            .style("fill", "#7f6d92");
    }

    if (!ship.data[z]) return;

    ship_g.append("g")
        .attr("id", "floors")
        .selectAll("rect")
        .data(ship.data[z].floors)
        .enter().append("rect")
        .attr("x", function (d, i) {
            return Math.floor(d.x / 2) * (floor_width + wall_width);
        })
        .attr("y", function (d, i) {
            return Math.floor(d.y / 2) * (floor_width + wall_width);
        })
        .attr("width", floor_width + wall_width)
        .attr("height", floor_width + wall_width)
        .style("fill", "lightgrey")
        .style("stroke", "white")
        .style("stroke-width", wall_width / 2)
        .on("click", function (d) {
            handle_click(d);
        });

    ship_g.append("g")
        .attr("id", "walls")
        .selectAll("rect")
        .data(ship.data[z].walls)
        .enter().append("rect")
        .attr("x", function (d, i) {
            return Math.floor(d.x / 2) * (floor_width + wall_width) - wall_width / 2;
        })
        .attr("y", function (d, i) {
            return Math.floor(d.y / 2) * (floor_width + wall_width) - wall_width / 2;
        })
        .attr("width", function (d, i) {
            if (d.x % 2 == 0 && d.y % 2 == 1) {
                return wall_width;
            } else if (d.y % 2 == 0 && d.x % 2 == 1) {
                return floor_width + 2 * wall_width;
            }
        })
        .attr("height", function (d, i) {
            if (d.x % 2 == 0 && d.y % 2 == 1) {
                return floor_width + 2 * wall_width;
            } else if (d.y % 2 == 0 && d.x % 2 == 1) {
                return wall_width;
            }
        })
        .style("fill", "#7f6d92");
}

function redraw_ship(ship_g, z) {

    d3.selectAll("#floors").remove();
    d3.selectAll("#walls").remove();

    d3.selectAll(".under-floors").remove();
    d3.selectAll(".under-walls").remove();

    draw_ship(ship_g, z);
}



function init_ship(ship_g, z) {

    d3.json("dat/sample_ship1.json", function(data){
        ship.data = data;


        for (var key in ship.data) {
            var z_level = key*1;

            console.log("z_level " + z_level);

            if(ship.max_z == undefined || z_level > ship.max_z) {
                ship.max_z = z_level;
            }
            if(ship.min_z == undefined || z_level < ship.min_z) {

                console.log(z_level + " is less than " + ship.min_z);

                ship.min_z = z_level;
            }

            console.log(JSON.stringify(ship));
        }

        draw_ship(ship_g, z);



    });
}
