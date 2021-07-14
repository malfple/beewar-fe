import Map from './Map'
import Terrain from './Terrain'

/**
 * This class is an extension of Map and allows terrain and unit change/edit
 */
class MapForEdit extends Map {
  createTerrain(type, y, x) {
    const terrain = new Terrain(type, y, x, true, true, this.comms)
    if(terrain.pixiNode) {
      this.pixiNode.addChild(terrain.pixiNode)
    }
    this.terrains[y][x] = terrain
  }

  // MIRROR: copy of formatter from BE
  calcTerrainInfo() {
    let terrainInfo = ''
    for(let i = 0; i < this.height; i++) {
      for(let j = 0; j < this.width; j++) {
        terrainInfo += String.fromCharCode(this.terrains[i][j].type)
      }
    }
    return btoa(terrainInfo)
  }

  // MIRROR: copy of formatter from BE
  calcUnitInfo() {
    let unitInfo = ''
    for(let i = 0; i < this.height; i++) {
      for(let j = 0; j < this.width; j++) {
        const unit = this.units[i][j]
        if(!unit) {
          continue
        }

        switch (unit.type) {
          default:
            // basic ordinary unit
            unitInfo = unitInfo.concat(String.fromCharCode(i), String.fromCharCode(j),
              String.fromCharCode(unit.owner), String.fromCharCode(unit.type),
              String.fromCharCode(unit.hp), String.fromCharCode(unit.state))
        }
      }
    }
    return btoa(unitInfo)
  }

  // size changers
  addRow() {
    this.terrains.push([])
    this.units.push([])
    for(let j = 0; j < this.width; j++) {
      this.terrains[this.height].push(null)
      this.units[this.height].push(null)
      this.createTerrain(0, this.height, j)
    }
    this.height++
  }
  delRow() {
    this.height--
    for(let j = 0; j < this.width; j++) {
      this.removeTerrain(this.height, j)
      this.removeUnit(this.height, j)
    }
    this.terrains.pop()
    this.units.pop()
  }
  addCol() {
    for(let i = 0; i < this.height; i++) {
      this.terrains[i].push(null)
      this.units[i].push(null)
      this.createTerrain(0, i, this.width)
    }
    this.width++
  }
  delCol() {
    this.width--
    for(let i = 0; i < this.height; i++) {
      this.removeTerrain(i, this.width)
      this.removeUnit(i, this.width)
      this.terrains[i].pop()
      this.units[i].pop()
    }
  }

  shiftRowsDown() {
    const tmp = this.terrains[this.height-1]
    const tmpU = this.units[this.height-1]
    for(let i = this.height-1; i > 0; i--) {
      this.terrains[i] = this.terrains[i-1]
      this.units[i] = this.units[i-1]
    }
    this.terrains[0] = tmp
    this.units[0] = tmpU
    this._resetPositions()
  }
  shiftRowsUp() {
    const tmp = this.terrains[0]
    const tmpU = this.units[0]
    for(let i = 0; i < this.height-1; i++) {
      this.terrains[i] = this.terrains[i+1]
      this.units[i] = this.units[i+1]
    }
    this.terrains[this.height-1] = tmp
    this.units[this.height-1] = tmpU
    this._resetPositions()
  }
  shiftColsRight() {
    for(let i = 0; i < this.height; i++) {
      const tmp = this.terrains[i][this.width-1]
      const tmpU = this.units[i][this.width-1]
      for(let j = this.width-1; j > 0; j--) {
        this.terrains[i][j] = this.terrains[i][j-1]
        this.units[i][j] = this.units[i][j-1]
      }
      this.terrains[i][0] = tmp
      this.units[i][0] = tmpU
    }
    this._resetPositions()
  }
  shiftColsLeft() {
    for(let i = 0; i < this.height; i++) {
      const tmp = this.terrains[i][0]
      const tmpU = this.units[i][0]
      for(let j = 0; j < this.width-1; j++) {
        this.terrains[i][j] = this.terrains[i][j+1]
        this.units[i][j] = this.units[i][j+1]
      }
      this.terrains[i][this.width-1] = tmp
      this.units[i][this.width-1] = tmpU
    }
    this._resetPositions()
  }

  _resetPositions() {
    for(let i = 0; i < this.height; i++) {
      for(let j = 0; j < this.width; j++) {
        this.terrains[i][j].setPosition(i, j)
        if(this.units[i][j]) {
          this.units[i][j].setPosition(i, j)
        }
      }
    }
  }
}

export default MapForEdit
