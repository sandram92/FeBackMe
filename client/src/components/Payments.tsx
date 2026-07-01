import { Component } from "react";
import axios from "axios";

type PaymentsState = {
  errorMessage: string | null;
  isLoading: boolean;
};

type CheckoutSessionResponse = {
  url: string;
};

class Payments extends Component<{}, PaymentsState> {
  state: PaymentsState = {
    errorMessage: null,
    isLoading: false,
  };

  handleClick = async () => {
    this.setState({ errorMessage: null, isLoading: true });

    try {
      const res = await axios.post<CheckoutSessionResponse>(
        "/api/create-checkout-session",
      );

      window.location.assign(res.data.url);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unable to start payment.";

      this.setState({ errorMessage });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <>
        <button
          className="btn"
          disabled={this.state.isLoading}
          onClick={this.handleClick}
        >
          {this.state.isLoading ? "Loading..." : "Add Credits"}
        </button>
        {this.state.errorMessage && (
          <span className="red-text text-lighten-4">
            {this.state.errorMessage}
          </span>
        )}
      </>
    );
  }
}

export default Payments;
