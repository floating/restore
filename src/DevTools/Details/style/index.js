import loadStyle from '../../shared/loadStyle'
import color from '../../shared/color'

export const style = `
  .__restoreDetails {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: ${color.text};
  }

  .__restoreDisplay {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    margin-left: 8px;
    margin-right: 2px;
  }

  .__restoreDisplayIcon {
    padding: 4px 4px 2px 4px;
  }

  .__restoreDisplayCount {
    font-size: 16px;
  }
`

loadStyle(style)
