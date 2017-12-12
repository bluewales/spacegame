"use strict";

var mass_of_sun = 1.98855e30;
var gravitational_constant = 6.67384e-11;
var orbital_mu = 1.327124400419394e+20;



var current_transfer = null;


class planet extends createjs.Container {
	constructor(name, r, possitoin_at_zero, color, draw_scale) {
		super();

		var orbit = new createjs.Shape();
		orbit.graphics.setStrokeStyle(2).beginStroke(color).drawCircle(0, 0, r * draw_scale);
		orbit.x = 0;
		orbit.y = 0;

		this.addChild(orbit);

		var planet_market = new createjs.Shape();
		planet_market.graphics
			.beginFill(color)
			.drawCircle(0, 0, 5);
		planet_market.x = r * draw_scale;
		planet_market.y = 0;

		this.addChild(planet_market);

		this.name = name
		this.r = r;
		this.color = color;
		this.draw_scale = draw_scale;
		this.orbital_period = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / orbital_mu);
		this.possitoin_at_zero = possitoin_at_zero;

		this.set_time(0);
	}

	set_time(t) {
		this.t = t;
		this.rotation = -(this.possitoin_at_zero + this.t / this.orbital_period * 360);
	}
}

class transfer extends createjs.Container {
	constructor(from, to) {
		super();


		var major_axis = from.r + to.r;
		var minor_axis = 2*Math.sqrt(Math.pow(major_axis/2, 2) - Math.pow(major_axis/2 - to.r, 2));

		var arc = new createjs.Shape();
		arc.graphics
			.setStrokeStyle(2)
			.setStrokeDash([2, 4])
			.beginStroke("teal")
			.drawEllipse(-to.r*from.draw_scale, -minor_axis/2*from.draw_scale, major_axis*from.draw_scale, minor_axis*from.draw_scale);

		var curve = new createjs.Shape();
		curve.graphics
			.setStrokeStyle(2)
			.setStrokeDash([2, 4])
			.beginStroke("yellow")
			.moveTo(-to.r*from.draw_scale, 0)
			.bezierCurveTo(-to.r*from.draw_scale, -minor_axis/2*from.draw_scale * (4/3), from.r*from.draw_scale, -minor_axis/2*from.draw_scale * (4/3), from.r*from.draw_scale,  0);

		var target_ghost = new createjs.Shape();
		target_ghost.graphics
			.setStrokeStyle(1)
			.beginStroke(to.color)
			.drawCircle(0, 0, 5);
		target_ghost.x = -to.r * to.draw_scale;


		this.transfer_time = Math.PI * Math.sqrt(Math.pow(major_axis/2, 3) / orbital_mu);

		console.log("this.transfer_time" + this.transfer_time)

		var real_target_ghost = new createjs.Shape();
		real_target_ghost.graphics
			.setStrokeStyle(1)
			.beginStroke(to.color)
			.drawCircle(0, 0, 7);
		real_target_ghost.x = to.r * to.draw_scale;

		var real = new createjs.Container();
		real.rotation = -from.rotation + to.rotation - this.transfer_time/to.orbital_period * 360;
		real.addChild(real_target_ghost);



		//this.addChild(arc);
		this.addChild(curve);
		this.addChild(target_ghost);
		this.addChild(real);

		this.rotation = from.rotation;
	}
}

function init_navigation() {

	var width = 600;
	var height = 600;


	d3.select("#system_map")
        .attr("width", width)
        .attr("height", height)
        .style("width", width + "px")
        .style("height", height + "px")
        .style("background-color", "black")
        .style("possition", "absolute")
        .style("top", "10px")
        .style("left", "10px")
        .style("border-style", "solid")
        .style("border-color", "white")
        .style("border-width", "5px");

    var centerX = width / 2;
 	var centerY = height / 2;

    var canvas = d3.select("#system_map").node();
	var stage = new createjs.Stage(canvas);
	stage.x = centerX;
	stage.y = centerY;




 	var max_r = Math.min(centerX, centerY) * 0.9;

 	var planets_raw = [
 		{"name":"sun","r":0,"start_rotation":0,"color":"yellow"},
 		{"name":"mercury","r":57.91e+9,"start_rotation":37,"color":"brown"},
 		{"name":"venus","r":108.2e+9,"start_rotation":266,"color":"green"},
 		{"name":"earth","r":149.6e+9,"start_rotation":100,"color":"blue"},
 		{"name":"mars","r":227.9e+9,"start_rotation":20,"color":"red"},
 		//{"name":"vesta","r":353e+9,"start_rotation":Math.random()*360,"color":"grey"},
 		//{"name":"ceres","r":414e+9,"start_rotation":Math.random()*360,"color":"grey"},
 		//{"name":"palas","r":414e+9,"start_rotation":Math.random()*360,"color":"grey"},
 		//{"name":"hygiea","r":470e+9,"start_rotation":Math.random()*360,"color":"grey"},
 		//{"name":"jupiter","r":778.5e+9,"start_rotation":Math.random()*360,"color":"purple"},
 		//{"name":"saturn","r":1.429e+12,"start_rotation":Math.random()*360,"color":"gold"},
 		//{"name":"george","r":2.871e+12,"start_rotation":Math.random()*360,"color":"blue"},
 		//{"name":"neptune","r":4.498e+12,"start_rotation":Math.random()*360,"color":"darkblue"}
	];

 	var r_convert = max_r / d3.max(planets_raw, function(d){return d.r;});

 	var system = new createjs.Container()

	var planets = [];
 	for(var i = 0; i < planets_raw.length; i++) {
 		var p = planets_raw[i];
 		planets.push(new planet(p.name, p.r, p.start_rotation, p.color, r_convert));
 	}

 	var current_planet = 3;

 	var now_t = new Date().getTime() / 1000;


	for(var i = 0; i < planets.length; i++) {
		system.addChild(planets[i]);

		planets[i].set_time(now_t);
	}

	var transfers = [];



	var target_t = now_t;

	var target_index = 0;

	for(var i = 0; i < planets.length; i++) {
		if(i != current_planet && planets[i].r > 0) {

			var major_axis = planets[current_planet].r + planets[i].r;
			var transfer_time = Math.PI * Math.sqrt(Math.pow(major_axis/2, 3) / orbital_mu);

			var transfer_angle = (transfer_time / planets[i].orbital_period) * 360;

			var current_seperation = (((planets[current_planet].rotation - planets[i].rotation) % 360) + 360) % 360;

			var target_seperation = (180 - transfer_angle);

			while(target_seperation < current_seperation) {
				target_seperation += 360;
			}

			console.log(target_seperation + " " + current_seperation);

			var difference = target_seperation - current_seperation;

			var time_till_window = difference / ((360 / planets[i].orbital_period) - (360 / planets[current_planet].orbital_period));

			console.log(planets[i].name + " " + time_till_window);

			if(time_till_window < 0) {
				time_till_window -= 360 / ((360 / planets[i].orbital_period) - (360 / planets[current_planet].orbital_period))
			}

			console.log(planets[i].name + " " + time_till_window);


			transfers.push({
				"destination": planets[i].name,
				"time_till_window": time_till_window,
				"color": planets[i].color,
				"planet_index": i,
				"transfer_angle": transfer_angle,
				"target_seperation": target_seperation,
				"current_seperation": current_seperation,
				"difference": difference,
				"transfer_time": transfer_time / (60*60*24)
			});
		}
	}


    function change_time(t) {

		target_t = now_t + t;

    }

    function get_left_from_time(t) {
    	var max_time = 60 * 60 * 24 * 30 * 26;
    	return (20 + 600*t/max_time);
    }

    d3.select("#transfers")
		.style("top", "650px")
		.style("left", "0px")
		.style("position", "fixed");

	d3.select("#timeline")
		.style("top", "10px")
		.style("left", "0px")
		.style("position", "absolute")
		.style("background-color", "lightblue")
    	.style("height", "20px")
    	.style("width", "600px")
    	.style("border-radius", "10px")
    	.style("padding", "0px 20px")
    	.style("margin", "20px 0px");

	d3.select("#timeline")
    	.append("div")
	    	.attr("id", "display_marker")
	    	.style("height", "20px")
			.style("width", "5px")
			//.style("background-color", "yellow")
			.style("position", "absolute")
			.style("left", function(d){return (get_left_from_time(0) - 9) + "px";})
			.style("top", "-9px")
			.style("border-style", "solid")
			.style("border-color", "yellow transparent")
			.style("border-width", "9px")

    d3.select("#timeline")
    	.append("div")
    	.selectAll("div")
			.data(transfers)
			.enter().append("div")
				.style("height", "20px")
				.style("width", "5px")
				.style("background-color", function(d){return d.color;})
				.style("position", "absolute")
				.style("left", function(d){return get_left_from_time(d.time_till_window) + "px";})
				.on("click", function(d) {
		            stage.removeChild(current_transfer);
		            current_transfer = null;
		            target_index = d.planet_index;

		            change_time(d.time_till_window);
		        })
		        .append("p")
			        .text(function(d) {return d.destination;})
			        .style("color", function(d){return d.color;})
			        .style("position", "absolute")
			        .style("top", "35px")

	d3.select("#timeline")
    	.append("div")
	    	.attr("id", "now_marker")
	    	.style("height", "20px")
			.style("width", "5px")
			.style("background-color", "grey")
			.style("position", "absolute")
			.style("left", function(d){return get_left_from_time(0) + "px";})
			.on("click", function(d) {
	            stage.removeChild(current_transfer);
	            current_transfer = null;
	            target_index = 0;

	            d3.select("#status").select("div")
            	.selectAll("*").remove();

	            change_time(0);
	        })
	        .append("p")
		        .text("Now")
		        .style("color", "grey")
		        .style("position", "absolute")
		        .style("top", "35px")
		        .style("left", "-15px");

	d3.select("#status")
		.style("background-color", "darkblue")
		.style("color", "white")
		.style("position", "absolute")
		.style("top", "10px")
		.style("left", "650px")
		.append("h1")
			.text("Navigation");
	d3.select("#status").append("div")
		.style("width", "400px");



	stage.addChild(system);

	stage.update();

	//stage.addChild(new transfer(planets[3], planets[2]));

	var t = target_t;

	createjs.Ticker.setFPS(30);
	createjs.Ticker.on("tick", function(event) {
		stage.update(event);

		var dt = 3600*24;

		if(target_t > t) {
			t += (target_t - t)/20 + dt;
		}
		if(target_t < t) {
			t -= (t - target_t)/20 + dt;
		}
		if(Math.abs(target_t - t) < dt) {
			t = target_t;
		}


		for(var i = 0; i < planets.length; i++) {
			planets[i].set_time(t);
		}

		d3.select("#display_marker")
		.style("left", function(d){return (get_left_from_time(t - now_t) - 9) + "px";})

		if(t == target_t && target_index > 0) {

			current_transfer = new transfer(planets[current_planet], planets[target_index]);
            stage.addChild(current_transfer);

            var messages = [
            	"Current planet: " + planets[current_planet].name,
            	"Destination: " + planets[target_index].name,
            	"Launch window: " + Math.floor((t - now_t) / (60*60*24)) + " days from now",
            	"Travel Time: " + Math.floor((current_transfer.transfer_time) / (60*60*24)) + " days",
            	"Arrive: " + Math.floor((t - now_t + current_transfer.transfer_time) / (60*60*24)) + " days from now",
            ];
			d3.select("#status").select("div")
            	.selectAll("*").remove();

            d3.select("#status").select("div")
            	.selectAll("p")
            	.data(messages)
            	.enter().append("p")
					.style("position", "absolute")
					.style("top", function(d, i) {return i*20 + 20 + "px"})
	            	.text(function(d) {return d;})

			target_index = 0;
		}
	})
}
