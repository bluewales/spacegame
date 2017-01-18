var collision_checks = 0;

function ray_vs_aabb(ray, box) {
	
	collision_checks += 1;
	
	if(!ray.dirfrac) {
		ray.dirfrac = [1.0 / ray.dir[0], 1.0 / ray.dir[1], 1.0 / ray.dir[2]];
	}
	
	// lb is the corner of AABB with minimal coordinates - left bottom, rt is maximal corner
	var t1 = (box.min[0] - ray.origin[0])*ray.dirfrac[0];
	var t2 = (box.max[0] - ray.origin[0])*ray.dirfrac[0];
	var t3 = (box.min[1] - ray.origin[1])*ray.dirfrac[1];
	var t4 = (box.max[1] - ray.origin[1])*ray.dirfrac[1];
	var t5 = (box.min[2] - ray.origin[2])*ray.dirfrac[2];
	var t6 = (box.max[2] - ray.origin[2])*ray.dirfrac[2];

	var tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
	var tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));

	// if tmax < 0, ray (line) is intersecting AABB, but whole AABB is behing us
	if (tmax < 0) {
		ray.collission_dis = tmax;
		return false;
	}

	// if tmin > tmax, ray doesn't intersect AABB
	if (tmin > tmax) {
		ray.collission_dis = tmax;
		return false;
	}
	
	ray.collission_dis = tmin;
	if (ray.collission_dis > ray.length) {
		return false;
	}
	
	return true;
}

function laser_vs_octree(laser, octree) {
	
	//console.log("laser " + JSON.stringify(laser.origin) + JSON.stringify(laser.dir));
	//console.log("box " + JSON.stringify(octree.boundingBox));
	
	var collides = ray_vs_aabb(laser, octree.boundingBox);
	
	
	
	if(collides) {
		
		if(octree.size == 0) {
			console.log(JSON.stringify(octree.midpoint) + " " + laser.collission_dis);
			return {"coord":[octree.midpoint[0],octree.midpoint[1],octree.midpoint[2]], "distance": laser.collission_dis};
		}
		var somethingCollides = false;
		for(var i = 0; i < octree.children.length; i++) {
			if(octree.children[i] && octree.children[i].numVoxels > 0) {
				var collides = laser_vs_octree(laser, octree.children[i])
				if(collides) {
					somethingCollides = true;
				}
			}
		}
		return somethingCollides;
	}
	
	return false;
}

function laser_vs_component(laser, model_name, transform) {
	
	var this_model = models[model_name];
	
	var transformedLaser = {
		"origin":[0,0,0],
		"end":[0,0,0],
		"dir":[0,0,0]
	};
	
	vec3.transformMat4(transformedLaser.origin, laser.origin, transform);
	vec3.transformMat4(transformedLaser.end, laser.end, transform);
	vec3.sub(transformedLaser.dir, transformedLaser.end, transformedLaser.origin);
	vec3.normalize(transformedLaser.dir, transformedLaser.dir);
	transformedLaser.length = Math.sqrt(vec3.sqrDist(transformedLaser.origin, transformedLaser.end));
	transformedLaser.dirfrac = undefined;
	
	
	
	var collides = ray_vs_aabb(transformedLaser, models[model_name].boundingBox);
	
	if(!collides) {
		return false;
	}
	
	
	
	//console.log(model_name + " laser " + JSON.stringify(transformedLaser.origin) + JSON.stringify(transformedLaser.dir));
	//console.log(model_name + " box " + JSON.stringify(models[model_name].boundingBox));
	
	
	
	if(this_model['basic']) {
		console.log(model_name + " collides " + transformedLaser.collission_dis);
		return laser_vs_octree(transformedLaser, this_model.octree);
	} else {
		var somethingCollides = false;
		for(var i = 0; i < this_model['pieces'].length; i++) {
			var piece = this_model['pieces'][i];
			
			var pieceTransform = {};
			mat4.mul(pieceTransform, piece.reverseTransform, transform);
			
			if(laser_vs_component(laser, piece.name, pieceTransform)) {
				somethingCollides = true;
			}
		}
		return somethingCollides;
	}
	
	return false;
}

/*

I should optimize the collision detection by stopping the search when I find the one intersection closest to the origin of the ray
Instead of checking an object, I should check its children.  Then call the check on the children in order of who is closest.
If a child returns a point closer than any of the other children, then we don't need to check any of the other children.
In an octree, where we know siblings can't overlap, we don't need to compare a returned collision against other children, we can just
return

*/