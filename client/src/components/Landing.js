import React from "react";
import { Component } from "react";
import { connect } from "react-redux";

class  Landing extends Component {
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

function mapStateToProps({ auth }) {
  return { auth };
}
export default connect(mapStateToProps)(Landing);
