import { refreshAccessToken } from "../service/SalesforceService.js";
import axios from "axios";
import { User, SfDetail } from "../config/dbConfig.js";

const instance_url = process.env.instance_url;
const api_version = process.env.api_version;
const query_url = `/services/data/v${api_version}/query/?q=`;
let sfDetail = undefined;
let counter = 0;

export const findAll = async (req, res) => {
  try {
    let access_token = await getAccessTokenFromSfDetail(req.userId);
    const { fields, objectName, limit } = req.body;
    const query = `Select ${fields} FROM ${objectName} ${limit || ""}`;
    const URL = instance_url + query_url + query;

    const response = await axios.get(URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    res.status(200).json({ response: response.data });
  } catch (error) {
    retryAccessToken(req, res, error);
  }
};

export const updateRecord = async (req, res) => {
  try {
    let access_token = getAccessTokenFromSfDetail(req.userId);
    const query_uri = `/services/data/${process.env.api_version}/sobjects/${req.params.objectName}/${req.params.recordId}`;
    const URL = instance_url + query_uri;

    const response = await axios.patch(URL, req.body, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    res.status(200).json({ response: response.data });
  } catch (error) {
    retryAccessToken(req, res, error);
  }
};

export const createRecord = async (req, res) => {
  try {
    let access_token = getAccessTokenFromSfDetail(req.userId);
    const query_uri = `/services/data/${process.env.api_version}/sobjects/${req.params.objectName}`;
    const URL = instance_url + query_uri;

    const response = await axios.post(URL, req.body, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    res.status(200).json({ response: response.data });
  } catch (error) {
    retryAccessToken(req, res, error);
  }
};

export const deleteRecord = async (req, res) => {
  try {
    let access_token = getAccessTokenFromSfDetail(req.userId);

    const query_uri = `/services/data/${process.env.api_version}/sobjects/${req.params.objectName}/${req.params.recordId}`;
    const URL = instance_url + query_uri;

    const response = await axios.delete(URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    res.status(200).json({ response: response.data });
  } catch (error) {
    retryAccessToken(req, res, error);
  }
};

const getAccessTokenFromSfDetail = async (userId) => {
  const existingUser = await User.findOne({ where: { id: userId } });
  if (!existingUser) return res.status(400).json({ error: "User not found" });

  sfDetail = await SfDetail.findOne({
    where: { sf_org_id: existingUser.sf_org_id },
  });
  return sfDetail.access_token;
};

const retryAccessToken = async (req, res, error) => {
  if (
    counter < 1 &&
    error &&
    error.code === "ERR_BAD_REQUEST" &&
    error.status === 401
  ) {
    console.log("entered");
    counter++;
    const data = await refreshAccessToken();
    await sfDetail.update({ access_token: data.access_token });
    findAll(req, res);
  } else {
    return res.status(400).json({
      message: error.message,
      code: error.code,
      status: error.status,
    });
  }
};
