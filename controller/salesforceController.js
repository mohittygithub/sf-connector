import { refreshAccessToken } from "../service/SalesforceService.js";
import axios from "axios";
import { User, SfDetail } from "../config/dbConfig.js";

const instance_url = process.env.instance_url;
const api_version = process.env.api_version;
const uri = `/services/data/v${api_version}/query/?q=`;
let counter = 0;
let sfDetail = undefined;

export const findAll = async (req, res) => {
  try {
    const existingUser = await User.findOne({ where: { id: req.userId } });
    if (!existingUser) return res.status(400).json({ error: "User not found" });

    sfDetail = await SfDetail.findOne({
      where: { sf_org_id: existingUser.sf_org_id },
    });
    let access_token = sfDetail.access_token;

    const { fields, objectName, limit } = req.body;
    const query = `Select ${fields} FROM ${objectName} ${limit || ""}`;
    const URL = instance_url + uri + query;

    const response = await axios.get(URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    res.status(200).json({ response: response.data });
  } catch (error) {
    if (
      counter < 2 &&
      error &&
      error.code === "ERR_BAD_REQUEST" &&
      error.status === 401
    ) {
      console.log("entered");
      const data = await refreshAccessToken();
      await sfDetail.update({ access_token: data.access_token });
      findAll(req, res);
      counter++;
    } else {
      return res.status(400).json({
        message: error.message,
        code: error.code,
        status: error.status,
      });
    }
  }
};

export const updateRecord = async (req, res) => {
  try {
    const access_token_callout = await refreshAccessToken();
    const access_token = access_token_callout?.access_token;
    const uri = `/services/data/v${process.env.api_version}/sobjects/${req.params.objectName}/${req.params.recordId}`;
    const URL = instance_url + uri;
    const response = await axios.patch(URL, req.body, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    res.status(200).json({ response: response.data });
  } catch (error) {
    return res.status(400).json({ salesforce_error: error });
  }
};

export const createRecord = async (req, res) => {
  try {
    const access_token_callout = await refreshAccessToken();
    const access_token = access_token_callout?.access_token;
    const uri = `/services/data/v${process.env.api_version}/sobjects/${req.params.objectName}`;
    const URL = instance_url + uri;
    const response = await axios.post(URL, req.body, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    res.status(200).json({ response: response.data });
  } catch (error) {
    return res.status(400).json({ salesforce_error: error });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const access_token_callout = await refreshAccessToken();
    const access_token = access_token_callout?.access_token;
    const uri = `/services/data/v${process.env.api_version}/sobjects/${req.params.objectName}/${req.params.recordId}`;
    const URL = instance_url + uri;
    const response = await axios.delete(URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    res.status(200).json({ response: response.data });
  } catch (error) {
    return res.status(400).json({ salesforce_error: error });
  }
};
