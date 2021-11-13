import React, { useState } from "react";
import "./App.css";
import { Button, Container, Divider, Stack, Typography } from "@mui/material";
import GoogleLogin, { GoogleLoginResponse } from "react-google-login";
import { showSnackBar } from "./components/InfoSnackBar";
import InfoSnackBar from "./components/InfoSnackBar";
import GoogleButton from "react-google-button";
import FacebookLogin from "react-facebook-login-typed";
// import FacebookLogin from "react-facebook-login";
import FacebookIcon from "@mui/icons-material/Facebook";
import MicrosoftLogin from "react-microsoft-login";

interface UserDetails {
  name?: string;
  email?: string;
  picture?: string;
  id?: string;
  source?: string;
}

function App() {
  const [user, setUser] = useState<UserDetails>();
  const [msalInstance, onMsalInstanceChange] = useState<any>();
  const onGoogleSuccess = async (googleData: any) => {
    console.log("Google User Details", googleData.profileObj);
    var test: GoogleLoginResponse = googleData;
    const { profileObj } = test;
    setUser({
      id: profileObj.googleId,
      name: profileObj.name,
      email: profileObj.email,
      picture: profileObj.imageUrl,
      source: "Google",
    });
  };

  const responseFacebook = (response: any) => {
    console.log("Facebook user details", response);
    setUser({
      id: response.userID,
      name: response.name,
      email: response.email,
      picture: response.picture.data.url,
      source: "Facebook",
    });
  };

  const loginHandlerMicrosoft = (err: any, data: any, msal: any) => {
    if (!err && data) {
      onMsalInstanceChange(msal);
      console.log("Microsoft User Details", data);
    }
    setUser({
      id: data.account.accountIdentifier,
      name: data.account.name,
      email: data.account.userName,
      // picture: response.picture.data.url,
      source: "Microsoft",
    });
  };

  const logOutHandler = () => {
    setUser((prev) => undefined);
    if (msalInstance !== undefined) msalInstance.logout();
  };

  const onGoogleFailure = (error: any) => {
    console.log(error);
    showSnackBar("Log in failed. Try Again!", "error");
  };

  if (user) {
    return (
      <Container>
        <Stack
          marginTop={20}
          alignItems="center"
          justifyContent="row"
          width="100%"
        >
          <Typography variant="h6" fontWeight="400" marginBottom={5}>
            User Authenticated in the App from {user.source}
          </Typography>
          <Typography variant="h6" fontWeight="400" marginBottom={1}>
            User Details:
          </Typography>
          <img alt="user profile" src={user.picture} />
          <Typography variant="subtitle1" fontWeight="400">
            Identity Id: {user.id}
          </Typography>
          <Typography variant="subtitle1" fontWeight="400">
            Email: {user.email}
          </Typography>
          <Typography variant="subtitle1" fontWeight="400">
            User Name: {user.name}
          </Typography>
          <Button variant="outlined" onClick={logOutHandler}>
            Log out
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container>
      <Stack
        marginTop={20}
        alignItems="center"
        justifyContent="row"
        width="100%"
      >
        <Typography variant="h3" fontWeight="400" marginBottom={10}>
          Authenticate using the bellow methods.
        </Typography>
        <GoogleLogin
          clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
          buttonText="Log in with Google"
          render={(renderProps) => (
            <GoogleButton
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              style={{
                marginBottom: "20px",
                width: "215px",
              }}
            >
              Sign in with Google
            </GoogleButton>
          )}
          accessType="online"
          onSuccess={onGoogleSuccess}
          onFailure={(error) => onGoogleFailure(error)}
          cookiePolicy={"single_host_origin"}
        />
        <Divider />
        <FacebookLogin
          appId="1244307739382446"
          autoLoad={false}
          callback={responseFacebook}
          fields="name,email,picture"
          scope="public_profile,email,pages_messaging_subscriptions"
          render={(renderProps) => (
            <Button
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={renderProps.onClick}
              sx={{
                width: "215px",
                marginBottom: "20px",
                fontSize: "13px",
                height: "41px",
                borderRadius: 0,
              }}
            >
              Sign in with Facebook
            </Button>
          )}
        />
        <Divider light />
        <MicrosoftLogin
          clientId={"6916da9c-9f03-473f-b7a3-ce644006a40e"}
          authCallback={loginHandlerMicrosoft}
        />
      </Stack>
      <InfoSnackBar />
    </Container>
  );
}

export default App;
