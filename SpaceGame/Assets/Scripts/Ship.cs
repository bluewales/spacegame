using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Ship : MonoBehaviour {

	public Transform floor;
	public Transform ship;
	public Transform wallNorthEastCorner;
	public Transform wallSouthEastCorner;
	public Transform wallSouthWestCorner;
	public Transform wallNorthWestCorner;
	public Transform wallVertical;
	public Transform wallHorizontal;


	private int width = 6;
	private int height = 6;

	// Use this for initialization
	void Start () {

		ship = GameObject.Find ("Ship").transform;

		for (int y = -2; y < height; y++) {
			for (int x = -2; x < width; x++) {
				Transform new_structure;

				if (x == 0 && y == 0) {
					new_structure = Instantiate (wallSouthWestCorner, new Vector3 (x, y, 0), Quaternion.identity).transform;
				} else if (x == 0 && y == height - 1) {
					new_structure = Instantiate (wallNorthWestCorner, new Vector3 (x, y, 0), Quaternion.identity).transform;
				} else if (x == height-1 && y == 0) {
					new_structure = Instantiate (wallSouthEastCorner, new Vector3 (x, y, 0), Quaternion.identity).transform;
				} else if (x == height-1 && y == height - 1) {
					new_structure = Instantiate (wallNorthEastCorner, new Vector3 (x, y, 0), Quaternion.identity).transform;
				} else if (x == 0 || x == width-1) {
					new_structure = Instantiate (wallVertical, new Vector3 (x, y, 0), Quaternion.identity).transform;
				} else if (y == 0 || y == height-1) {
					new_structure = Instantiate (wallHorizontal, new Vector3 (x, y, 0), Quaternion.identity).transform;
				} else {
					new_structure = Instantiate (floor, new Vector3 (x, y, 0), Quaternion.identity).transform;
					
				}
				new_structure.parent = ship;

			}
		}
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
