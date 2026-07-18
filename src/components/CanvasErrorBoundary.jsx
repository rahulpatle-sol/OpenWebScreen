import { Component } from 'react'

export default class CanvasErrorBoundary extends Component {
  state = { errored: false }
  static getDerivedStateFromError() { return { errored: true } }
  render() {
    return this.state.errored ? null : this.props.children
  }
}
