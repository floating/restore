import color from '../../shared/color'

export const style = `
  .__restoreAction {
    overflow: hidden;
    color: ${color.text};
    background: ${color.levelThree};
    position: relative;
    margin-top: 1px;
  }

  .__restoreAction:first-child {
    margin-top: 1px;
  }

  .__restoreActionTop {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    pointer-events: none;
  }

  .__restoreActionName {
    padding: 5px 0px 5px 35px;
    font-size: 12px;
    font-family: _reFira, monospace;
    pointer-events: none;
  }

  .__restoreActionIcon {
    position: absolute;
    width: 30px;
    top: 0;
    left: 0;
    bottom: 0;
    background: ${color.levelFour};
    display: flex;
    justify-content: center;
    align-items: center;
    fill: ${color.text};
    pointer-events: none;
  }
`

export default style
