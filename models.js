var models = {
	"voxel": {
		"basic":true,
		"pivot":[0, 0, 0],
		"file_location": "voxel.txt"
	},
	"inner hull plate": {
		"basic":true,
		"pivot":[50, 50, 1],
		"file_location": "inner_hull_panel.txt"
	},
	"inner hull edge": {
		"basic":true,
		"pivot":[0, 50, 0],
		"file_location": "inner_hull_edge.txt"
	},
	"inner hull vertex": {
		"basic":true,
		"pivot":[0, 0, 0],
		"file_location": "inner_hull_vertex.txt"
	},
	"inner hull door": {
		"basic":true,
		"pivot":[101, 6, 50],
		"file_location": "inner_hull_door.txt"
	},
	"inner hull corner": {
		"basic":false,
		"pieces":[
			{
				"name": "inner hull vertex",
				"x": 0,
				"y": 0,
				"z": 0,
				"yaw": 0,
				"pitch": 0,
				"roll": 0
			},{
				"name": "inner hull edge",
				"x": 0,
				"y": 62,
				"z": 0,
				"yaw": 0,
				"pitch": 0,
				"roll": 0
			},
			{
				"name": "inner hull edge",
				"x": 0,
				"y": 0,
				"z": 62,
				"yaw": 0,
				"pitch": Math.PI / 2,
				"roll": Math.PI / 2
			},
			{
				"name": "inner hull edge",
				"x": 63,
				"y": 0,
				"z": 0,
				"yaw": Math.PI / 2,
				"pitch": 0,
				"roll": 0
			}
		]
	},
	"2x2 wall": {
		"basic":false,
		"pieces" : [
			{
				"name": "inner hull plate",
				"x": 50,
				"y": 50,
				"z": 0,
				"yaw": 0,
				"pitch": 0,
				"roll": 0
			},
			{
				"name": "inner hull plate",
				"x": -51,
				"y": 50,
				"z": 0,
				"yaw": 0,
				"pitch": 0,
				"roll": 0
			},{
				"name": "inner hull plate",
				"x": 50,
				"y": -51,
				"z": 0,
				"yaw": 0,
				"pitch": 0,
				"roll": 0
			},{
				"name": "inner hull plate",
				"x": -51,
				"y": -51,
				"z": 0,
				"yaw": 0,
				"pitch": 0,
				"roll": 0
			}
		]
	},
	"2x2 wall with door": {
		"basic":false,
		"pieces" : [
			{
				"name": "inner hull door",
				"x": 0,
				"y": 51,
				"z": 5,
				"yaw": 0,
				"pitch": Math.PI/2,
				"roll": 0
			},{
				"name": "inner hull plate",
				"x": 50,
				"y": -51,
				"z": 0,
				"yaw": 0,
				"pitch": 0,
				"roll": 0
			},{
				"name": "inner hull plate",
				"x": -51,
				"y": -51,
				"z": 0,
				"yaw": 0,
				"pitch": 0,
				"roll": 0
			}
		]
	},
	"small room": {
		"basic":false,
		"pieces" : [
			{
				"name": "2x2 wall",
				"x": 0,
				"y": 0,
				"z": -112,
				"yaw": 0,
				"pitch": 0,
				"roll": 0
			},{
				"name": "2x2 wall",
				"x": 0,
				"y": 0,
				"z": 111,
				"yaw": 0,
				"pitch": 0,
				"roll": 0
			},
			{
				"name": "2x2 wall",
				"x": -112,
				"y": 0,
				"z": 0,
				"yaw": 0,
				"pitch": 0,
				"roll": Math.PI / 2
			},
			{
				"name": "2x2 wall with door",
				"x": 111,
				"y": 0,
				"z": 0,
				"yaw": 0,
				"pitch": 0,
				"roll": Math.PI / 2
			},
			{
				"name": "2x2 wall",
				"x": 0,
				"y": 111,
				"z": 0,
				"yaw": 0,
				"pitch": 3 * Math.PI / 2,
				"roll": 0
			},
			{
				"name": "2x2 wall",
				"x": 0,
				"y": -112,
				"z": 0,
				"yaw": 0,
				"pitch": 3 * Math.PI / 2,
				"roll": 0
			},
			{
				"name": "inner hull corner",
				"x": 113,
				"y": 113,
				"z": 113,
				"yaw": Math.PI,
				"pitch":  - Math.PI / 2,
				"roll": 0
			},
			{
				"name": "inner hull corner",
				"x": 113,
				"y": -113,
				"z": 113,
				"yaw": Math.PI / 2,
				"pitch":  - Math.PI / 2,
				"roll": 0
			},
			{
				"name": "inner hull corner",
				"x": -113,
				"y": -113,
				"z": 113,
				"yaw": 0,
				"pitch":  - Math.PI / 2,
				"roll": 0
			},
			{
				"name": "inner hull corner",
				"x": -113,
				"y": 113,
				"z": 113,
				"yaw": - Math.PI / 2,
				"pitch":  - Math.PI / 2,
				"roll": 0
			},
			{
				"name": "inner hull corner",
				"x": 113,
				"y": 113,
				"z": -113,
				"yaw": Math.PI,
				"pitch": 0,
				"roll": 0
			},
			{
				"name": "inner hull corner",
				"x": 113,
				"y": -113,
				"z": -113,
				"yaw": Math.PI / 2,
				"pitch": 0,
				"roll": 0
			},
			{
				"name": "inner hull corner",
				"x": -113,
				"y": -113,
				"z": -113,
				"yaw": 0,
				"pitch": 0,
				"roll": 0
			},
			{
				"name": "inner hull corner",
				"x": -113,
				"y": 113,
				"z": -113,
				"yaw": - Math.PI / 2,
				"pitch": 0,
				"roll": 0
			}
		]
	}
}
