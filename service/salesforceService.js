import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";

dotenv.config();

const grant_type = "password";
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const username = process.env.username;
const password = process.env.password;
const refresh_token = process.env.refresh_token;

export const getAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://login.salesforce.com/services/oauth2/token",
      qs.stringify({
        grant_type,
        client_id,
        client_secret,
        username,
        password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("response====> ", response.data);
    return response.data;
  } catch (error) {
    console.log("error=====> ", error);
    return res.status(400).json({ salesforce_error: error });
  }
};

export const refreshAccessToken = async () => {
  try {
    const url = "https://login.salesforce.com/services/oauth2/token";
    const grant_type = "refresh_token";
    const response = await axios.post(
      url,
      qs.stringify({
        grant_type,
        client_id,
        client_secret,
        refresh_token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // console.log("response====> ", response.data);

    return response.data;
  } catch (error) {
    console.log("error=====> ", error);
    // return res.status(400).json({ salesforce_error: error });
    return error;
  }
};
