/**
 * Created by Luke on 7/9/2017.
 */


var ship = {};




var ship_palette = 0;
var floor_width = 50;
var wall_width = floor_width / 10;

function color_from_palettes(palette, color, wash) {
    return d3.rgb(color_palets[palette][color]).darker(wash*2);
}


function draw_floors(ship_g, floors_data, class_prefix, color_wash) {
    ship_g.append("g")
        .classed(class_prefix + "floors", true)
        .selectAll("rect")
        .data(floors_data)
        .enter().append("rect")
        .attr("x", function (d, i) {
            return Math.floor(d.x / 2) * (floor_width + wall_width);
        })
        .attr("y", function (d, i) {
            return Math.floor(d.y / 2) * (floor_width + wall_width);
        })
        .attr("width", floor_width + wall_width)
        .attr("height", floor_width + wall_width)
        .style("fill", color_from_palettes(ship_palette, 3, color_wash))
        .style("stroke", color_from_palettes(ship_palette, 1, color_wash))
        .style("stroke-width", wall_width / 2)
        .on("click", function (d) {
            handle_click(d);
        });
}

function draw_walls(ship_g, walls_data, class_prefix, color_wash) {
    ship_g.append("g")
        .classed(class_prefix + "walls", true)
        .selectAll("rect")
        .data(walls_data)
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
        .style("fill", color_from_palettes(ship_palette, 2, color_wash));
}


function draw_ship(ship_g, z){

    for(var z_level = ship.min_z; z_level < z; z_level++) {

        if (!ship.data[z_level]) continue;

        draw_floors(ship_g, ship.data[z_level].floors, "under-", (z - z_level));
        draw_walls(ship_g, ship.data[z_level].walls, "under-", (z - z_level));
    }

    if(ship.data[z]) {
        draw_floors(ship_g, ship.data[z].floors, "", 0);
        draw_walls(ship_g, ship.data[z].walls, "", 0);
    }
}

function redraw_ship(ship_g, z) {

    d3.selectAll(".floors").remove();
    d3.selectAll(".walls").remove();

    d3.selectAll(".under-floors").remove();
    d3.selectAll(".under-walls").remove();

    draw_ship(ship_g, z);
}



function init_ship(ship_g, z) {

    d3.json("dat/sample_ship1.json", function(data){
        ship.data = data;

        for (var key in ship.data) {
            var z_level = key*1;

            if(ship.max_z == undefined || z_level > ship.max_z) {
                ship.max_z = z_level;
            }
            if(ship.min_z == undefined || z_level < ship.min_z) {
                ship.min_z = z_level;
            }
        }
        draw_ship(ship_g, z);
    });
}
