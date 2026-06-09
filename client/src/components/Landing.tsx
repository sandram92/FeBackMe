import React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import type { AuthProps, RootState } from "../types";


class Landing extends Component<AuthProps> {
  componentDidMount() {
    console.log("Landing component rendered", this.props.auth);
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Welcome to Feebackme!</h1>
        <p>Collect feedback from your users with ease.</p>
      </div>
    );
  }
}

function mapStateToProps({ auth }: RootState): AuthProps {
  return { auth };
}
export default connect(mapStateToProps)(Landing);
