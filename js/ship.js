/**
 * Created by Luke on 7/9/2017.
 */


var ship = {};


var color_palets = [
    ["#2A2630","#3F3E53","#005DCF","#DBD6B5","#5498B1"],
    ["#060404","#40575E","#E3EFF7","#8BBBD6","#5091B3"],
    ["#09070A","#760000","#345560","#B8D0E1","#557A9A"],
    ["#110A21","#611405","#2F3458","#B15F2D","#E8B26B"],
    ["#1D0912","#5C1C11","#4B424F","#B15C2A","#929989"],
    ["#0E0A0C","#5B5C5F","#3B3A41","#C5BFBB","#807C7D"],
    ["#5B6261","#363E29","#98A09E","#D2D8D1","#8C9664"],
    ["#041A29","#144F7B","#1F4E6A","#95C3C0","#4685A5"],
    ["#080811","#3E4C58","#BB6C1D","#B8BCC1","#898176"],
    ["#200D21","#3B146D","#1C00ED","#D6A1E1","#BC4E87"],
    ["#1A2E0F","#335E0D","#597D0D","#406551","#86B569"],
    ["#0A042D","#0D0F62","#FFE300","#000DF3","#CF5C49"],
    ["#171A13","#4C4D4F","#F2F6F6","#9EABB5","#8F7168"],
    ["#202309","#734D2C","#C55C12","#F4C899","#C59052"],
    ["#455245","#4A71A3","#A8A098","#F4D8AD","#918873"],
    ["#4A2822","#FF0000","#ECEAE1","#DDB18B","#AC8668"],
    ["#635D59","#2E2435","#EEECDA","#CCB594","#95786B"],
    ["#634A64","#512D4C","#F0EEEC","#C2A39B","#B86B47"],
    ["#2D2B25","#5F5E53","#4A4035","#B8C5C8","#90856B"],
    ["#1D130C","#693E37","#FAA61E","#DDB896","#B35F3C"],
    ["#231601","#70561C","#C98500","#FFBF00","#EACC89"],
    ["#A30000","#2C615B","#C41D00","#F3A700","#87B386"]
];

var ship_palet = 0;

function color_from_palets(palet, color, wash) {
    return d3.rgb(color_palets[palet][color]).darker(wash*2);
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
        .style("fill", color_from_palets(ship_palet, 3, color_wash))
        .style("stroke", color_from_palets(ship_palet, 1, color_wash))
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
        .style("fill", color_from_palets(ship_palet, 4, color_wash));
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
