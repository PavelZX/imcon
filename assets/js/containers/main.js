import React from 'react'

export default class MainLayout extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    );
  }
}
