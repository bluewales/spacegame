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


var ship_g = null;
var z_menu = null;


var x = 0, y = 0, zoom = 1;
var z = 1;


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

    ship_g
        .append("g")
        .attr("id", "highlight")
        .selectAll("rect")
        .data([square])
        .enter().append("rect")
        .attr("x", function(d,i) { return Math.floor(d.x/2) * (floor_width + wall_width); })
        .attr("y", function(d,i) { return Math.floor(d.y/2) * (floor_width + wall_width); })
        .attr("width", floor_width + wall_width)
        .attr("height", floor_width + wall_width)
        .style("fill", "orange")
        .style("stroke", "white")
        .style("stroke-width", wall_width)
        .style("opacity", 0.5)
        .on("click", function(d) {
            clear_highlight();
        });
}



function handle_click(item) {
    var square_x = Math.floor(((d3.event.pageX - x) / zoom) / (floor_width + wall_width)) * 2+1;
    var square_y = Math.floor(((d3.event.pageY - y) / zoom) / (floor_width + wall_width)) * 2+1;

    highlight_square({x:square_x,y:square_y});


    var menu_structure = get_context_dependant_menu(square_x, square_y, z);

    highlighted_menu = menus.create(menu_structure, d3.select("#menus"), d3.event.pageX+15, d3.event.pageY-10);
}

function change_z(new_z) {
    z_menu.lines.text("z-level: " + new_z);
    redraw_ship(ship_g, new_z);

    clear_highlight();

    z = new_z;
}

var currentlyPressedKeys = {};

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;

    if(event.keyCode == 69) {
        change_z(z + 1)
    }
    if(event.keyCode == 81) {
        change_z(z - 1)
    }
}
function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}
function handleMouseWheel(event) {
    zoom *= 1+(event.deltaY / 1000);
}



function init_scene() {
    d3.select("svg").selectAll("g").remove();

    x = d3.select("svg").node().getBoundingClientRect().width / 2;
    y = d3.select("svg").node().getBoundingClientRect().height / 2;

    d3.select("svg")
        .append("g")
        .attr("id", "space-background")
        .append("rect")
        .attr("x", 0).attr("y", 0)
        .style("width", "100%")
        .style("height","100%")
        .style("fill","transparent")
        .on("click", function(d) {
            handle_click();

        });

    ship_g = d3.select("svg")
        .append("g")
        .attr("id", "ship")
        .attr("transform", "translate(" + x + "," + y + ") scale(0.75)");

    init_ship(ship_g, z, function(ship) {
        var window_width = d3.select("svg").node().getBoundingClientRect().width;
        var window_height = d3.select("svg").node().getBoundingClientRect().height;
        var ship_width = ship_g.node().getBBox().width;
        var ship_height = ship_g.node().getBBox().height;

        console.log(window_width + " " + window_height);
        console.log(ship_width + " " + ship_height);

        x = window_width / 2 - ship_width / 2;
        y = window_height / 2 - ship_height / 2;


        z_menu = menus.create([{"name":"z-level: " + z,"info":true}], d3.select("#menus"), window_width - 100, window_height - 25);
    });
}

function tick() {

    if(currentlyPressedKeys[87]) {
        y -= 5;
    }
    if(currentlyPressedKeys[83]) {
        y += 5;
    }
    if(currentlyPressedKeys[65]) {
        x -= 5;
    }
    if(currentlyPressedKeys[68]) {
        x += 5;
    }
    if(currentlyPressedKeys[81]) {

    }
    if(currentlyPressedKeys[69]) {

    }

    ship_g.attr("transform", "translate(" + x + "," + y + ") scale(" + (zoom) + ")");

    window.requestAnimationFrame(tick);
}



function start_game() {

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    document.onmousewheel = handleMouseWheel;

    init_scene();
    tick();
}
