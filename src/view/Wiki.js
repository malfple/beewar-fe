import React from 'react'

import queenPNG from '../pixi/assets/unit-queen.png'
import infantryPNG from '../pixi/assets/unit-infantry.png'
import jetCrewPNG from '../pixi/assets/unit-jet-crew.png'
import wizardPNG from '../pixi/assets/unit-wizard.png'
import tankPNG from '../pixi/assets/unit-tank.png'
import mortarPNG from '../pixi/assets/unit-mortar.png'

import plainsPNG from '../pixi/assets/terrain-plains.png'
import wallsPNG from '../pixi/assets/terrain-walls.png'
import honeyFieldPNG from '../pixi/assets/terrain-honeyfield.png'
import wastelandPNG from '../pixi/assets/terrain-wasteland.png'
import iceFieldPNG from '../pixi/assets/terrain-icefield.png'

import './Wiki.css'

function Wiki() {
  return (
    <div className="main-container wiki">
      <h1>Wiki</h1>
      <p>
        Welcome to the wiki page.
      </p>
      <h2>Units</h2>
      <table>
        <tr>
          <th>Name</th>
          <th>Image</th>
          <th>Description</th>
          <th>Maximum health</th>
          <th>Move Range</th>
          <th>Weight</th>
          <th>Attack Range</th>
          <th>Attack Power</th>
        </tr>
        <tr>
          <th>
            <h3>Queen</h3>
          </th>
          <th>
            <img src={queenPNG} alt="queen" />
          </th>
          <th>
            <p>
              This is you. If you die (in-game) then you lose immediately.
            </p>
            <p>
              Can move 1 step in a turn and cannot attack.
            </p>
          </th>
          <th>10</th>
          <th>1</th>
          <th>0</th>
          <th>-</th>
          <th>-</th>
        </tr>
        <tr>
          <th>
            <h3>Infantry</h3>
          </th>
          <th>
            <img src={infantryPNG} alt="infantry" />
          </th>
          <th>
            <p>
              A weak unit that carries a handgun.
            </p>
            <p>
              Can move 3 steps in a turn and can attack adjacent units.
            </p>
          </th>
          <th>10</th>
          <th>3</th>
          <th>0</th>
          <th>1</th>
          <th>0.5</th>
        </tr>
        <tr>
          <th>
            <h3>Jet Crew</h3>
          </th>
          <th>
            <img src={jetCrewPNG} alt="jet-crew" />
          </th>
          <th>
            <p>
              An even weaker unit but much faster.
            </p>
            <p>
              Can move 6 steps in a turn and can attack adjacent units.
            </p>
          </th>
          <th>8</th>
          <th>6</th>
          <th>0</th>
          <th>1</th>
          <th>0.5</th>
        </tr>
        <tr>
          <th>
            <h3>Wizard</h3>
          </th>
          <th>
            <img src={wizardPNG} alt="wizard" />
          </th>
          <th>
            <p>
              A magical unit!
            </p>
            <p>
              This unit moves by blinking or instantly teleporting to a target hex. The range is 2-3 hexes.
              It can also attack units up to 2 hexes away (attack range is 1-2), but cannot move and attack in the same turn.
              It can also swap itself with any friendly unit within move/blink range.
            </p>
          </th>
          <th>10</th>
          <th>2-3</th>
          <th>0</th>
          <th>1-2</th>
          <th>0.5</th>
        </tr>
        <tr>
          <th>
            <h3>Tank</h3>
          </th>
          <th>
            <img src={tankPNG} alt="tank" />
          </th>
          <th>
            <p>
              A fairly mobile unit with good firepower suited for battle.
            </p>
            <p>
              Can move 4 steps in a turn and can attack adjacent units.
              At the end of your turn, regenerates 2 health point
            </p>
          </th>
          <th>14</th>
          <th>4</th>
          <th>1</th>
          <th>1</th>
          <th>0.5</th>
        </tr>
        <tr>
          <th>
            <h3>Mortar</h3>
          </th>
          <th>
            <img src={mortarPNG} alt="mortar" />
          </th>
          <th>
            <p>
              A ranged unit suited for long range assault. It's super weak in close range.
            </p>
            <p>
              Can move 4 steps in a turn and can attack with range 2-3, but cannot move and attack in the same turn.
            </p>
          </th>
          <th>4</th>
          <th>4</th>
          <th>0</th>
          <th>2-3</th>
          <th>1</th>
        </tr>
      </table>
      <h2>Combat</h2>
      <p>
        A unit's ability to deliver attack damage depends in its current health point and its attack power stat.
        The formula is ceil(unit_hp * attack_power).
        So an Infantry with 7 hp will be able to deliver 4 un-reduced damage.
      </p>
      <h2>Terrains</h2>
      <table>
        <tr>
          <th>Name</th>
          <th>Image</th>
          <th>Description</th>
          <th>Move Cost</th>
        </tr>
        <tr>
          <th>
            <h3>Plains</h3>
          </th>
          <th>
            <img src={plainsPNG} alt="plains" />
          </th>
          <th>
            A normal terrain. Easily traversed by all units.
          </th>
          <th>1</th>
        </tr>
        <tr>
          <th>
            <h3>Walls</h3>
          </th>
          <th>
            <img src={wallsPNG} alt="walls" />
          </th>
          <th>
            Units cannot move into walls unless forced. Exception to this are units with blink move type.
          </th>
          <th>infinite</th>
        </tr>
        <tr>
          <th>
            <h3>Honey Field</h3>
          </th>
          <th>
            <img src={honeyFieldPNG} alt="honey-field" />
          </th>
          <th>
            Honey Field is harder to traverse than plains for most units
          </th>
          <th>2</th>
        </tr>
        <tr>
          <th>
            <h3>Wasteland</h3>
          </th>
          <th>
            <img src={wastelandPNG} alt="wasteland" />
          </th>
          <th>
            Wasteland is easy to traverse for lighter units and harder for heavier units.
          </th>
          <th>1 + weight</th>
        </tr>
        <tr>
          <th>
            <h3>Ice Field</h3>
          </th>
          <th>
            <img src={iceFieldPNG} alt="ice-field" />
          </th>
          <th>
            Ice Field is hard to traverse and units staying here will take damage depending on their weight at the start of their next turn,
            specifically units take (1 + weight) damage.
          </th>
          <th>2</th>
        </tr>
      </table>
    </div>
  )
}

export default Wiki
