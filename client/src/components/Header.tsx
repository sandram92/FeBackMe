import { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import type { AuthProps, RootState } from "../types";
import Payments from "./Payments";
class Header extends Component<AuthProps> {
  renderContent() {
    console.log("this", this.props);
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li>
            <a href="/auth/google">Login With Google</a>
          </li>
        );

      default:
        return [
          <li key="payments">
            <Payments />
          </li>,
          <li style={{ margin: "0 10px" }} key="credit">
            Credits: {this.props.auth.credits}
          </li>,
          <li key="logout">
            <a href="/api/logout">Logout</a>
          </li>,
        ];
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to={this.props.auth ? "/surveys" : "/"} className="brand-logo">
            Feebackme
          </Link>
          <ul className="right">{this.renderContent()}</ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth }: RootState): AuthProps {
  return { auth };
}
export default connect(mapStateToProps)(Header);
