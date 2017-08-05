import loadStyle from '../shared/loadStyle'
import color from '../shared/color'
import fira from './fira'
import open from './open'

export const style = `
  @font-face {
    font-family: '_reFira';
    src: url('data:application/font-woff;base64,${fira}') format('woff');
    font-style: normal;
    font-weight: normal;
  }

  @font-face {
    font-family: '_reOpen';
    src: url(data:font/truetype;charset=utf-8;base64,${open}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  .__restoreAction {
    overflow: hidden;
    color: ${color.text};
    background: ${color.levelThree};
    position: relative;
  }

  .__restoreTimeMachine {
    position: fixed;
    width: 320px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    background: ${color.levelOne};
    font-size: 14px;
    font-family: _reOpen, Helvetica, Arial, sans-serif;
    transition: 0.4s all cubic-bezier(0.85, 0, 0.15, 1);
    color: ${color.text};
    font-weight: normal;
    z-index: 99999999;
  }

  .__restoreTimeMachineExpanded {
    right: -324px;
  }

  .__restoreTimeline {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 30px;
    font-size: 14px;
    overflow: scroll;
    padding: 5px 5px 0px 5px;
  }

  .__restoreItem {
    overflow: hidden;
    background: ${color.levelTwo};
    margin-bottom: 5px;
    padding: 0px 5px 0px 5px;
    position: relative;
    fill: ${color.text};
  }

  .__restoreMarker {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 30px;
    background: ${color.levelThree};
    z-index: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .__restoreMarkerCurrent {
    background: ${color.highlight};
  }

  .__restoreMarkerIcon {
    position: absolute;
    left: 0px;
    bottom: 0;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    cursor: pointer;
    color: ${color.text};
    padding-top: 3px;
    box-sizing: border-box;
  }

  .__restoreMarkerIconCurrent {
    color: ${color.levelThree};
    fill: ${color.levelThree};
  }

  .__restoreTimelineBody {
    margin-left: 10px;
    position: relative;
    z-index: 1;
  }

  .__restoreTimelineBodyTop {
    height: 30px;
  }

  .__restoreTimelineBodyBot {
    height: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .__restoreTimelineBodyBotLog {
    text-transform: uppercase;
    font-size: 10px;
    padding-right: 2px;
    padding-top: 0px;
    cursor: pointer;
  }

  .__restoreDevToolsExpand {
    position: absolute;
    height: 40px;
    width: 40px;
    border-radius: 20px;
    background: ${color.levelFour};
    cursor: pointer;
    bottom: 50%;
    left: -52px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
  }

  .__restoreDevToolsIcon {
    height: 38px;
    width: 38px;
    border-radius: 19px;
    background: ${color.highlight};
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 0px 0px 2px 2px;
    fill: ${color.levelTwo};
  }

  .__restoreDevToolsMenu {
    display: flex;
    position: absolute;
    color: ${color.text};
    fill: ${color.text};
    background: ${color.levelThree};
    bottom: 5px;
    right: 5px;
    left: 5px;
    height: 30px;
    box-shadow: 0px 1px 3px rgba(0, 0, 150, 0.3);
    z-index: 30;
  }

  .__restoreMenuBack {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 30px;
    minWidth: 30px;
    background: ${color.levelFour};
    cursor: pointer;
  }

  .__restoreMenuForward {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 1px;
    height: 30px;
    width: 30px;
    min-width: 30px;
    background: ${color.levelFour};
    cursor: pointer;
  }

  .__restoreMenuText {
    text-transform: uppercase;
    width: 100%;
    font-size: 12px;
    letter-spacing: 5px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: rgba(0, 0, 0, 0.9);
    user-select: none;
    margin: 2px 1px 0px 2px;
    line-height: 9px;
  }
`

loadStyle(style)
