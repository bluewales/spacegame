/**
 * Created by ldavidson on 7/13/2017.
 */

function create_floor() {
  window.game.ship.add_floor_at(this, "X");
}

function create_wall() {
  window.game.ship.add_wall(this);
}
