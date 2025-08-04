import { GoogleLogin } from "@react-oauth/google";

const GoogleAuthButton = ({ onSuccess, onError }) => (
  <div>
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError || (() => console.log("Login Failed"))}
    />
  </div>
);

export default GoogleAuthButton;
