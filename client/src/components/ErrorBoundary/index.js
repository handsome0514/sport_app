import { Component } from 'react'
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false,}
  }
  componentDidCatch() {
    this.setState({ hasError: true })
  }
  render() {
    return this.state.hasError ? (
      <h1>Oops! something went wrong</h1>
    ) : (
      this.props.children
    )
  }
}
