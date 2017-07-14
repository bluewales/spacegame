/**
 * Created by Luke on 7/9/2017.
 */


var ship = {};




var ship_palette = 0;
var floor_width = 64;
var wall_width = floor_width/8;

function color_from_palettes(palette, color, wash) {
    return d3.rgb(color_palets[palette][color]).darker(wash*2);
}



function get_context_dependant_menu_for_cell(x, y, z) {
    var menu_structure = [];
    if(ship.data.cells[z] && ship.data.cells[z][y] && ship.data.cells[z][y][x]) {
        var cell = ship.data.cells[z][y][x];
    } else {
        var cell = {};
    }
    if(cell.enclosed) {
        menu_structure.push({"name": "Enclosed area", "header": true});
    } else {
        menu_structure.push({"name": "Outer space", "header": true});
    }

    var list = [];
    list.push({"name": "North Wall", "list": get_context_dependant_menu_for_hull(ship, x, y-1, z)});
    list.push({"name": "South Wall", "list": get_context_dependant_menu_for_hull(ship, x, y+1, z)});
    list.push({"name": "East Wall", "list": get_context_dependant_menu_for_hull(ship, x+1, y, z)});
    list.push({"name": "West Wall", "list": get_context_dependant_menu_for_hull(ship, x-1, y, z)});
    list.push({"name": "Ceiling", "list": get_context_dependant_menu_for_hull(ship, x, y, z+1)});
    list.push({"name": "Floor", "list": get_context_dependant_menu_for_hull(ship, x, y, z-1)});

    if(list.length > 0) {
        menu_structure.push({"name": "Structure", "list": list})
    }

    if(cell.enclosed) {
        menu_structure.push({"name": "Pressurized to " + cell.pressure + " atm.", "info": true})
    }

    return menu_structure;
}


function draw_floors(ship_g, floors_data, class_prefix, color_wash) {
    ship_g.append("g")
        .classed(class_prefix + "floors", true)
        .selectAll("g")
        .data(d3.entries(floors_data))
        .enter().append("g")
            .attr("y", function (d, i) { return d.key; })
            .selectAll("rect")
            .data(function(d) { return d3.entries(d.value);})
            .enter().append("rect")
                .attr("x", function (d, i) {
                    var x = d.key * 1;
                    var y = d3.select(this.parentNode).attr("y") * 1;

                    return Math.floor(x / 2) * (floor_width + wall_width) - wall_width/4;
                })
                .attr("y", function (d, i) {
                    var x = d.key * 1;
                    var y = d3.select(this.parentNode).attr("y") * 1;

                    return Math.floor(y / 2) * (floor_width + wall_width) - wall_width/4;
                })
                .attr("width", floor_width + wall_width/2)
                .attr("height", floor_width + wall_width/2)
                .style("fill", color_from_palettes(ship_palette, 3, color_wash))
                .style("stroke", color_from_palettes(ship_palette, 1, color_wash))
                .style("stroke-width", wall_width/2)
                .on("click", handle_click);
}

function draw_walls(ship_g, walls_data, class_prefix, color_wash) {
    ship_g.append("g")
        .classed(class_prefix + "walls", true)
        .selectAll("g")
        .data(d3.entries(walls_data))
        .enter().append("g")
            .attr("y", function (d, i) { return d.key; })
            .selectAll("polygon")
            .data(function(d) {return d3.entries(d.value);})
            .enter().append("polygon")
                .filter(function(d) { return d.value.built>=0;})
                .attr("points", function (d, i) {
                    var x = d.key * 1;
                    var y = d3.select(this.parentNode).attr("y") * 1;
                    var f = floor_width;
                    var w = wall_width;
                    var hw = wall_width/2;
                    var t = f + w;
                    var xs = Math.floor(x/2) * t;
                    var ys = Math.floor(y/2) * t;

                    if(Math.abs(x%2) == 1) {
                        var points = (xs) + "," + (ys - w) + " " +
                            (xs + f) + "," + (ys - w) + " " +
                            (xs + f + hw) + "," + (ys - hw) + " " +
                            (xs + f) + "," + (ys) + " " +
                            (xs) + "," + (ys) + " " +
                            (xs - hw) + "," + (ys - hw);
                    }
                    if(Math.abs(y%2) == 1) {
                        var points = (xs - w) + "," + (ys) + " " +
                            (xs - w) + "," + (ys + f) + " " +
                            (xs - hw) + "," + (ys + f + hw) + " " +
                            (xs) + "," + (ys + f) + " " +
                            (xs) + "," + (ys) + " " +
                            (xs - hw) + "," + (ys - hw);
                    }
                    return points;
                })
                .style("fill", color_from_palettes(ship_palette, 2, color_wash));
}


function draw_ship(ship_g, z){

    for(var z_level = ship.min_z; z_level < z; z_level+=2) {
        draw_floors(ship_g, ship.data.hulls[z_level-1], "under-", (z - z_level));
        draw_walls(ship_g, ship.data.hulls[z_level], "under-", (z - z_level));
    }

    draw_floors(ship_g, ship.data.hulls[z-1], "", 0);
    draw_walls(ship_g, ship.data.hulls[z], "", 0);
}

function redraw_ship(ship_g, z) {

    d3.selectAll(".floors").remove();
    d3.selectAll(".walls").remove();

    d3.selectAll(".under-floors").remove();
    d3.selectAll(".under-walls").remove();

    draw_ship(this.g, this.current_z);
}



function init_ship(ship_g, z, done) {
    d3.json("dat/sample_ship2.json", function(data) {
        ship.data = data;

        for (var key in ship.data.cells) {
            var z_level = key*1;

            if(ship.max_z == undefined || z_level > ship.max_z) {
                ship.max_z = z_level;
            }
            if(ship.min_z == undefined || z_level < ship.min_z) {
                ship.min_z = z_level;
            }
        }
        for (var key in ship.data.hulls) {
            var z_level = key*1;
            if(z_level % 2 == 0) z_level += 1;

            if(ship.max_z == undefined || z_level > ship.max_z) {
                ship.max_z = z_level;
            }
            if(ship.min_z == undefined || z_level < ship.min_z) {
                ship.min_z = z_level;
            }
        }
        ship.g = ship_g;
        ship.redraw = redraw_ship;
        ship.current_z = z;

        draw_ship(ship_g, z);

        done();
    });
}