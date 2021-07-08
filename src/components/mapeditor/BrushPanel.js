import React, {useState} from 'react'
import PropTypes from 'prop-types'
import './Brush.css'

import voidPlaceholderPNG from '../../pixi/assets/terrain-void-placeholder.png'
import plainsPNG from '../../pixi/assets/terrain-plains.png'
import wallsPNG from '../../pixi/assets/terrain-walls.png'
import honeyFieldPNG from '../../pixi/assets/terrain-honeyfield.png'
import wastelandPNG from '../../pixi/assets/terrain-wasteland.png'
import iceFieldPNG from '../../pixi/assets/terrain-icefield.png'

import queenPNG from '../../pixi/assets/unit-queen.png'
import infantryPNG from '../../pixi/assets/unit-infantry.png'
import jetCrewPNG from '../../pixi/assets/unit-jet-crew.png'
import wizardPNG from '../../pixi/assets/unit-wizard.png'
import tankPNG from '../../pixi/assets/unit-tank.png'
import mortarPNG from '../../pixi/assets/unit-mortar.png'

import {TERRAIN_BRUSH} from '../../pixi/objects/editorConstants'
import BrushForUnitTerrain from './BrushForUnitTerrain'
import BrushForColor from './BrushForColor'
import {COMMS_BRUSH_SELECT} from '../../modules/communication/messageConstants'
import {GROUP_MAP_CONTROLLER} from '../../modules/communication/groupConstants'

function BrushPanel(props) {
  const [state, setState] = useState({
    selectedBrushCode: TERRAIN_BRUSH,
    selectedPlayerOrder: 1,
  })

  const setSelectedBrushCode = (brushCode) => {
    setState(prevState => ({
      selectedBrushCode: brushCode,
      selectedPlayerOrder: prevState.selectedPlayerOrder,
    }))
    props.comms.triggerMsg({
      cmd: COMMS_BRUSH_SELECT,
      data: {
        brush_code: brushCode,
        player_order: -1,
      },
    }, GROUP_MAP_CONTROLLER)
  }

  const setSelectedPlayerOrder = (playerOrder) => {
    setState(prevState => ({
      selectedBrushCode: prevState.selectedBrushCode,
      selectedPlayerOrder: playerOrder,
    }))
    props.comms.triggerMsg({
      cmd: COMMS_BRUSH_SELECT,
      data: {
        brush_code: -1,
        player_order: playerOrder,
      },
    }, GROUP_MAP_CONTROLLER)
  }

  return (
    <div>
      <h1>Terrains</h1>
      <div>
        {/*These brush codes does not use constants because they are a pain to type*/}
        <BrushForUnitTerrain
          brushCode={100}
          selectedBrushCode={state.selectedBrushCode} setSelectedBrushCode={setSelectedBrushCode}
          src={voidPlaceholderPNG} />
        <BrushForUnitTerrain
          brushCode={101}
          selectedBrushCode={state.selectedBrushCode} setSelectedBrushCode={setSelectedBrushCode}
          src={plainsPNG} />
        <BrushForUnitTerrain
          brushCode={102}
          selectedBrushCode={state.selectedBrushCode} setSelectedBrushCode={setSelectedBrushCode}
          src={wallsPNG} />
        <BrushForUnitTerrain
          brushCode={103}
          selectedBrushCode={state.selectedBrushCode} setSelectedBrushCode={setSelectedBrushCode}
          src={honeyFieldPNG} />
        <BrushForUnitTerrain
          brushCode={104}
          selectedBrushCode={state.selectedBrushCode} setSelectedBrushCode={setSelectedBrushCode}
          src={wastelandPNG} />
        <BrushForUnitTerrain
          brushCode={105}
          selectedBrushCode={state.selectedBrushCode} setSelectedBrushCode={setSelectedBrushCode}
          src={iceFieldPNG} />
      </div>
      <h1>Units</h1>
      <div>
        <BrushForUnitTerrain
          brushCode={201}
          selectedBrushCode={state.selectedBrushCode} setSelectedBrushCode={setSelectedBrushCode}
          src={queenPNG} />
        <BrushForUnitTerrain
          brushCode={203}
          selectedBrushCode={state.selectedBrushCode} setSelectedBrushCode={setSelectedBrushCode}
          src={infantryPNG} />
        <BrushForUnitTerrain
          brushCode={204}
          selectedBrushCode={state.selectedBrushCode} setSelectedBrushCode={setSelectedBrushCode}
          src={jetCrewPNG} />
        <BrushForUnitTerrain
          brushCode={205}
          selectedBrushCode={state.selectedBrushCode} setSelectedBrushCode={setSelectedBrushCode}
          src={wizardPNG} />
        <BrushForUnitTerrain
          brushCode={206}
          selectedBrushCode={state.selectedBrushCode} setSelectedBrushCode={setSelectedBrushCode}
          src={tankPNG} />
        <BrushForUnitTerrain
          brushCode={209}
          selectedBrushCode={state.selectedBrushCode} setSelectedBrushCode={setSelectedBrushCode}
          src={mortarPNG} />
      </div>
      <h1>Unit color</h1>
      <div>
        <BrushForColor
          playerOrder={1} selectedPlayerOrder={state.selectedPlayerOrder} setSelectedPlayerOrder={setSelectedPlayerOrder} />
        <BrushForColor
          playerOrder={2} selectedPlayerOrder={state.selectedPlayerOrder} setSelectedPlayerOrder={setSelectedPlayerOrder} />
        <BrushForColor
          playerOrder={3} selectedPlayerOrder={state.selectedPlayerOrder} setSelectedPlayerOrder={setSelectedPlayerOrder} />
        <BrushForColor
          playerOrder={4} selectedPlayerOrder={state.selectedPlayerOrder} setSelectedPlayerOrder={setSelectedPlayerOrder} />
      </div>
    </div>
  )
}

BrushPanel.propTypes = {
  comms: PropTypes.object.isRequired,
}

export default BrushPanel
