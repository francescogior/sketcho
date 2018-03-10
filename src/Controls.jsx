import React, { Fragment as _ } from 'react'
import PropTypes from 'prop-types'
import cxs from 'cxs'
import stylexs from 'cxs/component'
import { equals, find, map, prop } from 'ramda'
import {
  toolIcons,
  thicknessIcon,
  clearIcon,
  undoIcon,
  redoIcon,
} from './icons'
import Point from './modules/Canvas/Point'
import Icon, { ICON_COLOR, ICON_SIZE } from './Icon'

const makeView = stylexs('div')

const SelectMenu = makeView({
  position: 'absolute',
})

const Select = ({
  direction,
  elements,
  onSelect,
  selectedValue,
  isMenuOpen,
  onMenuOpen,
  onMenuClose,
  color = 'white',
  background,
}) => (
  <div style={{ position: 'relative' }}>
    <Square
      direction={direction}
      color={color}
      onClick={onMenuOpen}
      background={background}
    >
      {elements.find((el) => equals(el.value, selectedValue)).label}
    </Square>
    {isMenuOpen && (
      <SelectMenu>
        {elements
          .filter((el) => !equals(el.value, selectedValue))
          .map(({ value, label }) => (
            <Square
              direction={direction}
              background={background}
              color={color}
              key={JSON.stringify(value)}
              onClick={() => {
                onMenuClose()
                onSelect(value)
              }}
            >
              {label}
            </Square>
          ))}
      </SelectMenu>
    )}
  </div>
)

const Square = makeView(
  ({ direction, size, children, selected, background, color, visible }) => ({
    visibility: visible === false ? 'hidden' : 'visible',
    height: `${50 + (selected && direction === 'row' ? 20 : 0)}px`,
    width: `${50 + (selected && direction === 'column' ? 20 : 0)}px`,
    cursor: 'pointer',
    transition: 'width .2s, height .2s, box-shadow .5s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background,
    ':active': {
      transform: 'scale(.9, .9)',
    },
    boxShadow: `${selected && direction === 'column' ? '6px' : '3px'} ${
      selected && direction === 'row' ? '6px' : '3px'
    } 5px rgba(0,0,0,.3)`,
    color,
  }),
)

Square.propTypes = {
  visible: PropTypes.bool,
}

const Space = makeView(({ vertical, horizontal }) => ({
  marginLeft: `${horizontal}px`,
  marginRight: `${horizontal}px`,
  marginTop: `${vertical}px`,
  marginBottom: `${vertical}px`,
}))

const Thicknesses = ({
  direction,
  thicknesses,
  selectedThickness,
  setThickness,
}) => (
  <_>
    {thicknesses.map((thickness) => (
      <Square
        direction={direction}
        key={thickness}
        background={'rgba(255,255,255,.8)'}
        color={'rgba(0,0,0,.8)'}
        selected={selectedThickness === thickness}
        onClick={() => setThickness(thickness)}
      >
        {thicknessIcon(thickness)}
      </Square>
    ))}
  </_>
)

const Clear = ({ direction, onClear }) => (
  <Square
    direction={direction}
    background={'rgba(255,255,255,.8)'}
    color={'rgba(0,0,0,.8)'}
    onClick={onClear}
  >
    {clearIcon}
  </Square>
)

const UndoAndRedo = ({ direction, onUndo, onRedo, redoable, undoable }) => (
  <_>
    <Square
      visible={undoable}
      direction={direction}
      background={'rgba(255,255,255,.8)'}
      color={'rgba(0,0,0,.8)'}
      onClick={onUndo}
    >
      {undoIcon}
    </Square>
    <Square
      visible={redoable}
      direction={direction}
      background={'rgba(255,255,255,.8)'}
      color={'rgba(0,0,0,.8)'}
      onClick={onRedo}
    >
      {redoIcon}
    </Square>
  </_>
)

const TheSpace = ({ direction }) => (
  <Space
    vertical={direction === 'column' ? 15 : 0}
    horizontal={direction === 'row' ? 15 : 0}
  />
)

const Controls = ({
  direction,
  className,
  colors,
  selectedColor,
  setColor,
  isColorMenuOpen,
  openColorMenu,
  closeColorMenu,
  tools,
  selectedTool,
  setTool,
  isToolMenuOpen,
  openToolMenu,
  closeToolMenu,
  thicknesses,
  selectedThickness,
  setThickness,
  onClear,
  onUndo,
  onRedo,
  redoable,
  undoable,
}) => (
  <div className={className}>
    <Select
      isMenuOpen={isColorMenuOpen}
      selectedValue={selectedColor}
      elements={colors.map((color) => ({
        value: color,
        label: <Square background={color} />,
      }))}
      onSelect={setColor}
      onMenuClose={closeColorMenu}
      onMenuOpen={openColorMenu}
    />
    <TheSpace direction={direction} />
    <Select
      isMenuOpen={isToolMenuOpen}
      selectedValue={selectedTool}
      background="rgba(255, 255, 255, .8)"
      color="rgba(0, 0, 0, .8)"
      elements={tools.map((tool) => ({
        value: tool,
        label: toolIcons[tool],
      }))}
      onSelect={setTool}
      onMenuClose={closeToolMenu}
      onMenuOpen={openToolMenu}
    />
    <TheSpace direction={direction} />
    <Thicknesses
      direction={direction}
      thicknesses={thicknesses}
      selectedThickness={selectedThickness}
      setThickness={setThickness}
    />
    <TheSpace direction={direction} />
    <Clear direction={direction} onClear={onClear} />
    <TheSpace direction={direction} />
    <UndoAndRedo
      direction={direction}
      onUndo={onUndo}
      onRedo={onRedo}
      redoable={redoable}
      undoable={undoable}
    />
  </div>
)

export default stylexs(Controls)(({ direction }) => ({
  position: 'absolute',
  zIndex: 1,
  display: 'flex',
  flexDirection: direction,
}))
