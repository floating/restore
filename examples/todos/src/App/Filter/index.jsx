import React from 'react'
import Restore from '../../../../../'

class Filter extends React.Component {
  visibilityLink = (visibility) => {
    if (this.store('visibility') === visibility) return <span>{visibility}</span>
    let clickVisibility = (e) => {
      e.preventDefault()
      this.store.setVisibility(visibility)
    }
    return <a href='' onClick={clickVisibility}>{visibility}</a>
  }
  render () {
    return (
      <div>
        {'Show: '}
        {this.visibilityLink('All')}{', '}
        {this.visibilityLink('Active')}{', '}
        {this.visibilityLink('Completed')}
      </div>
    )
  }
}

export default Restore.connect(Filter)
