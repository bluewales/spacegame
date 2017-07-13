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

function get_context_dependant_menu(x, y, z) {

    //console.log("creating cell at " + x + " " + y + " " + z);

    var menu_structure = [
        {
            "name": "Menu",
            "header": true
        },{
            "name": "First",
            "list": [
                {
                    "name":"Sub First",
                    "list":[
                        {"name": "Three levels deep", "handle": function(){}},
                        {"name": "From the first one", "handle": function(){}}
                    ]
                },
                {"name": "Sub First 2", "handle": function(){}},
                {"name": "info", "info": true}
            ]
        },
        {
            "name": "Second",
            "list": [
                {"name": "Sub Second", "handle": function(){}},
                {"name": "Sub Second again", "handle": function(){}}
            ]
        },
        {"name": "Third", "handle": function(){}},
        {"name": "info", "info": true}
    ];

    menu_structure = [];
    if(ship.data.cells[z] && ship.data.cells[z][x] && ship.data.cells[z][x][y]) {
        var cell = ship.data.cells[z][x][y];
    } else {
        var cell = {};
    }
    if(cell.has_ceiling && cell.has_floor) {
        menu_structure.push({"name": "Enclosed area", "header": true});
    } else {
        menu_structure.push({"name": "Empty space", "header": true});
    }

    list = []

    if(!cell.has_east_wall) {
        list.push({"name": "Build East Wall", "handle": function(){}})
    }
    if(!cell.has_west_wall) {
        list.push({"name": "Build West Wall", "handle": function(){}})
    }
    if(!cell.has_north_wall) {
        list.push({"name": "Build North Wall", "handle": function(){}})
    }
    if(!cell.has_south_wall) {
        list.push({"name": "Build South Wall", "handle": function(){}})
    }
    if(!cell.has_ceiling) {
        list.push({"name": "Build Ceiling", "handle": function(){}})
    }
    if(!cell.has_floor) {
        list.push({"name": "Build Floor", "handle": function(){}})
    }


    menu_structure.push({"name": "Structure", "list": list})


    return menu_structure;
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

        if (!ship.data.structure[z_level]) continue;

        draw_floors(ship_g, ship.data.structure[z_level].floors, "under-", (z - z_level));
        draw_walls(ship_g, ship.data.structure[z_level].walls, "under-", (z - z_level));
    }

    if(ship.data.structure[z]) {
        draw_floors(ship_g, ship.data.structure[z].floors, "", 0);
        draw_walls(ship_g, ship.data.structure[z].walls, "", 0);
    }
}

function redraw_ship(ship_g, z) {

    d3.selectAll(".floors").remove();
    d3.selectAll(".walls").remove();

    d3.selectAll(".under-floors").remove();
    d3.selectAll(".under-walls").remove();

    draw_ship(ship_g, z);
}



function init_ship(ship_g, z, done) {

    d3.json("dat/sample_ship1.json", function(data){
        ship.data = data;

        for (var key in ship.data.structure) {
            var z_level = key*1;

            if(ship.max_z == undefined || z_level > ship.max_z) {
                ship.max_z = z_level;
            }
            if(ship.min_z == undefined || z_level < ship.min_z) {
                ship.min_z = z_level;
            }
            /*
             function check_cell(x, y, z) {
             console.log(x + " " + y + " " + z);
             if(!ship.data.cells[z]) {
             console.log("creating cell at z = " + z);
             ship.data.cells[z] = {};
             }
             if(!ship.data.cells[z][x]) {
             console.log("creating cell at x = " + x);
             ship.data.cells[z][x] = {};
             }
             if(!ship.data.cells[z][x][y]) {
             console.log("creating cell at y = " + y);
             ship.data.cells[z][x][y] = {};
             }
             }



             for(var i = 0; i < ship.data.structure[z_level].walls.length; i += 1) {
             var x = ship.data.structure[z_level].walls[i].x;
             var y = ship.data.structure[z_level].walls[i].y;

             if(x%2 == 0) {
             check_cell(x+1, y, z_level);
             check_cell(x-1, y, z_level);
             ship.data.cells[z_level][x+1][y].has_west_wall = true;
             ship.data.cells[z_level][x-1][y].has_east_wall = true;
             }
             if(y%2 == 0) {
             check_cell(x, y+1, z_level);
             check_cell(x, y-1, z_level);

             console.log("out " + x + " " + y + " " + z_level);


             ship.data.cells[z_level][x][y+1].has_north_wall = true;
             ship.data.cells[z_level][x][y-1].has_south_wall = true;
             }
             }

             for(var i = 0; i < ship.data.structure[z_level].floors.length; i += 1) {
             var x = ship.data.structure[z_level].floors[i].x;
             var y = ship.data.structure[z_level].floors[i].y;

             check_cell(x, y, z_level);
             check_cell(x, y, z_level-1);
             ship.data.cells[z_level][x][y].has_floor = true;
             ship.data.cells[z_level-1][x][y].has_ceiling = true;
             }
             */


        }
        draw_ship(ship_g, z);

        done();
    });
}