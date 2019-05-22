import React, { Component } from "react";
import "./App.css";
import { Auth } from "aws-amplify";
import FacebookButton from "./components/FacebookButton";

class App extends Component {

  async componentDidMount() {
    this._loadFacebookSDK()
    try {
      console.log("성공")
      await Auth.currentAuthenticatedUser();
    } catch (e) {
      if (e !== "not authenticated") {
        console.log(e);
      }
    }
  }
  
  _loadFacebookSDK() {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId            : "877706145908567",
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v3.3'
      });
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/ko_KR/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  _logout = () => {
    window.FB.logout();
  }

  render() {
    return (
      <div>
        <h1>Cognito-Facebook-Test</h1>
        <FacebookButton/>
        <div onClick={this._logout}>로그아웃</div>
      </div>
    );
  }
}

export default App;
