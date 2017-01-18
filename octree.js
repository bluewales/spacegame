function Octree(size, midpoint) {
	this.size = size;
	this.midpoint = midpoint;
	this.numVoxels = 0;
	if(this.size >= 1) {
		this.children = [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
	} else {
		this.size = 0;
		this.midpoint[0] = Math.floor(this.midpoint[0]),
		this.midpoint[1] = Math.floor(this.midpoint[1]),
		this.midpoint[2] = Math.floor(this.midpoint[2])
	}
}

Octree.prototype.addVoxel = function(coord, type) {
	
	if(this.boundingBox) {
		if(this.boundingBox.min[0] > coord[0]) this.boundingBox.min[0] = coord[0];
		if(this.boundingBox.min[1] > coord[1]) this.boundingBox.min[1] = coord[1];
		if(this.boundingBox.min[2] > coord[2]) this.boundingBox.min[2] = coord[2];
		
		if(this.boundingBox.max[0] < coord[0]+1) this.boundingBox.max[0] = coord[0]+1;
		if(this.boundingBox.max[1] < coord[1]+1) this.boundingBox.max[1] = coord[1]+1;
		if(this.boundingBox.max[2] < coord[2]+1) this.boundingBox.max[2] = coord[2]+1;
		
	} else {
		this.boundingBox = {"min":[coord[0], coord[1], coord[2]],"max":[coord[0]+1, coord[1]+1, coord[2]+1]};
	}
	
	if(this.size == 0) {
		var reallyNew = (this.numVoxels == 0);
		this.numVoxels = 1;
		this.type = type;
		return reallyNew;
	}
	var high_x = coord[0] >= this.midpoint[0];
	var high_y = coord[1] >= this.midpoint[1];
	var high_z = coord[2] >= this.midpoint[2];
	
	var index = (high_x?0x4:0x00) + (high_y?0x2:0x00) + (high_z?0x1:0x00);
	
	if(!this.children[index]) {
		
		var newSize = this.size/2;
		var newMidpoint = [
			this.midpoint[0] + (high_x?newSize:-newSize),
			this.midpoint[1] + (high_y?newSize:-newSize),
			this.midpoint[2] + (high_z?newSize:-newSize)
		];
		this.children[index] = new Octree(newSize, newMidpoint)
	}
	
	var reallyNew = this.children[index].addVoxel(coord, type);
	if(reallyNew) {
		this.numVoxels += 1;
	}
	return reallyNew;
}
