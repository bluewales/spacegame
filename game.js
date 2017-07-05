/**
 * Created by Ox The Automaton on 7/1/2017.
 */
var gl;
function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

var ship = {
    floors:[
        {x:1,y:1},{x:3,y:1},{x:5,y:1},{x:7,y:1},
        {x:1,y:3},{x:3,y:3},{x:5,y:3},{x:7,y:3},
        {x:3,y:5},{x:5,y:5},{x:7,y:5},
        {x:3,y:7},{x:5,y:7},{x:7,y:7},
        {x:11,y:11}
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
        {x:3,y:8},{x:5,y:8},{x:7,y:8},
        {x:8,y:5},{x:8,y:7},
        {x:10,y:11},{x:11,y:10},
        {x:11,y:12},{x:12,y:11}

    ]
};

function draw() {

    for(var i = 0; i < data.length; i++) {
        data[i].x += Math.random() - 0.5;
        data[i].y += Math.random() - 0.5;
    }

    d3.selectAll("rect")
        .data(data)
        .attr("x", function(d,i) {return d.x + 100; })
        .attr("y", function(d,i) { return d.y + 100; })


    window.requestAnimationFrame(draw);
}

function clear_highlight() {
    d3.select("svg #highlight")
        .remove();

    if(highlighted_menu) {
        menus.destroy(highlighted_menu);
    }
}

var highlighted_menu = null;

function highlight_square(square) {
    clear_highlight();



    d3.select("svg")
        .append("g")
        .attr("id", "highlight")
        .selectAll("rect")
        .data([square])
        .enter().append("rect")
        .attr("x", function(d,i) { return d.x * (floor_width + wall_width)/2 - wall_width/2; })
        .attr("y", function(d,i) { return d.y * (floor_width + wall_width)/2 - wall_width/2; })
        .attr("width", floor_width + wall_width)
        .attr("height", floor_width + wall_width)
        .style("fill", "yellow")
        .style("stroke", "white")
        .style("stroke-width", wall_width)
        .style("opacity", 0.5)
        .on("click", function(d){
            clear_highlight();
            console.log("clear")
        });
}



function handle_click(item) {
    var square_x = Math.floor(0.5 + (d3.event.pageX) / (floor_width + wall_width)) * 2 - 1;
    var square_y = Math.floor(0.5 + (d3.event.pageY) / (floor_width + wall_width)) * 2 - 1;

    console.log(square_x + "," + square_y);

    highlight_square({x:square_x,y:square_y});

    var menu_options = ["Empty Space","Buid"];


    var menu_stucture = [
        {
            "name": "First",
            "list":[
                {
                    "name":"Sub First",
                    "list":[
                        {"name":"Three levels deep"},
                        {"name":"From the first one"}
                    ]
                },
                {"name":"Sub First 2"}
            ]
        },
        {
            "name": "Second",
            "list":[
                {"name":"Sub Second"},
                {"name":"Sub Second again"}
            ]
        },{
            "name": "Third"
        },
    ];

    highlighted_menu = menus.create(menu_stucture, d3.select("#menus"),d3.event.pageX,d3.event.pageY)
}



var floor_width = 50;
var wall_width = floor_width / 10;

function start_game() {


    d3.select("svg")
        .append("g")
        .attr("id", "space-background")
        .append("rect")
        .attr("x", 0).attr("y", 0)
        .style("width", "100%")
        .style("height","100%")
        .style("background", "#112e08")
        .on("click", function(d) {
            handle_click();
            console.log("click svg");
        });

    d3.select("svg")
        .append("g")
        .attr("id", "floors")
        .selectAll("rect")
        .data(ship.floors)
        .enter().append("rect")
        .attr("x", function(d,i) { return d.x * (floor_width + wall_width)/2 - wall_width/2; })
        .attr("y", function(d,i) { return d.y * (floor_width + wall_width)/2 - wall_width/2; })
        .attr("width", floor_width + wall_width)
        .attr("height", floor_width + wall_width)
        .style("fill", "lightgrey")
        .style("stroke", "white")
        .style("stroke-width", wall_width/2)
        .on("click", function(d){
            console.log("click square");
            handle_click(this);
        });

    d3.select("svg")
        .append("g")
        .attr("id", "walls")
        .selectAll("rect")
        .data(ship.walls)
        .enter().append("rect")
        .attr("x", function(d,i) {
            return (d.x+d.y%2) * (floor_width + wall_width)/2 - wall_width;
        })
        .attr("y", function(d,i) {
            return (d.y+d.x%2) * (floor_width + wall_width)/2 - wall_width;
        })
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
        .style("fill", "#7f6d92")


}

