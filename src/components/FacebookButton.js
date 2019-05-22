import React, { Component } from "react";
import { Auth } from "aws-amplify";

function waitForInit() {
  return new Promise((res, rej) => {
    const hasFbLoaded = () => {
      if (window.FB) {
        res();
      } else {
        setTimeout(hasFbLoaded, 300);
      }
    };
    hasFbLoaded();
  });
}

export default class FacebookButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    await waitForInit();
    this.setState({ isLoading: false });
  }

  _statusChangeCallback = response => {
    console.log("3");
    if (response.status === "connected") {
      console.log("OOO", response);
      this._handleResponse(response.authResponse);
    } else {
      console.log("XXX", response);
      this._handleError(response);
    }
  };

  _checkLoginState = () => {
    console.log("2");
    window.FB.getLoginStatus(this._statusChangeCallback);
  };

  _handleClick = () => {
    console.log("1");
    window.FB.login(this._checkLoginState, { scope: "public_profile,email" });
  };

  _handleError(error) {
    console.log("handleError", error);
  }

  //todo
  _handleResponse(data) {
    const { email, accessToken: token, expiresIn } = data;
    const expires_at = expiresIn * 1000 + new Date().getTime();
    const user = { email };
    console.log("날짜", expires_at);
    console.log("사용자", user);
    console.log("토큰", token);

    Auth.federatedSignIn("facebook", { token, expires_at }, user)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // console.log("응답", response);
    // try {
    //   const response = await Auth.federatedSignIn(
    //     "facebook",
    //     { token, expires_at },
    //     user
    //   );
    //   console.log("응답", response);
    // } catch (e) {
    //   this._handleError(e);
    // }
  }

  render() {
    return (
      <div className="facebook-btn" onClick={this._handleClick}>
        <div>
          <i className="fab fa-facebook-square fa-2x" />
        </div>
        <div className="facebook-btn-inner">페이스북으로 로그인</div>
      </div>
    );
  }
}
