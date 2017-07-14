/**
 * Created by ldavidson on 7/13/2017.
 */


function can_build_ns_wall(x, y, z) {

}

function can_build_ew_wall(x, y, z) {

}

function can_build_floor(x, y, z) {

}


function get_context_dependant_menu_for_hull(hulls, x, y, z) {
    var hull = (hulls[z] && hulls[z][y] && hulls[z][y][x]);

    var menu = [];

    if(!hull) {
        menu.push({"name": "Build", "handle": function() {}});

    }
    else if(hull.built == 100) {
        menu.push({"name": "Material: " + hull.material, "info": true});
        menu.push({"name": "Destroy", "handle": function() {}});
    }
    else if(hull.built < 100) {
        menu.push({"name": "Constructing: " + hull.built + "%", "info": true});
        menu.push({"name": "Material: " + hull.material, "info": true});
        menu.push({"name": "Cancel", "handle": function() {}});

    }

    return menu;
}