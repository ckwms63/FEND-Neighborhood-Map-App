
// Credit: https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html

import React from "react";

class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {

    if (this.state.hasError) {
      return <h1>Error Message: Authorization Failed. Please try again!</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
