/**
 * Created by ldavidson on 7/13/2017.
 */


function can_build_ns_wall(x, y, z) {

}

function can_build_ew_wall(x, y, z) {

}

function can_build_floor(x, y, z) {

}


function get_context_dependant_menu_for_hull(ship, x, y, z) {
    var hulls = ship.data.hulls;
    var hull = (hulls[z] && hulls[z][y] && hulls[z][y][x]);

    var menu = [];

    if(!hull || !(hull.built>=0)) {
        menu.push({"name": "Build","x":x, "y":y, "z":z,"handle": function(d ) {

                if(!hulls[this.z]) hulls[this.z] = {};
                if(!hulls[this.z][this.y]) hulls[this.z][this.y] = {};
                hulls[this.z][this.y][this.x] = {
                    "material": "steel",
                    "built": 100
                };
                ship.redraw();
            }
        });

    }
    else if(hull.built == 100) {
        menu.push({"name": "Material: " + hull.material, "info": true});
        menu.push({"name": "Destroy", "x":x, "y":y, "z":z, "handle": function(d ) {

            if(!hulls[this.z]) hulls[this.z] = {};
            if(!hulls[this.z][this.y]) hulls[this.z][this.y] = {};
            hulls[this.z][this.y][this.x] = {};
            ship.redraw();
        }});
    }
    else if(hull.built < 100) {
        menu.push({"name": "Constructing: " + hull.built + "%", "info": true});
        menu.push({"name": "Material: " + hull.material, "info": true});
        menu.push({"name": "Cancel", "handle": function() {}});

    }

    return menu;
}