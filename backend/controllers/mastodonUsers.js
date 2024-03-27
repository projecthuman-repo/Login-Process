const mastodonUserRouter = require("express").Router();
const config = require("../utils/config.js");
const Mastodon = require("mastodon-api");
const prompt = require("prompt");
const readline = require("readline");
const MastodonUser = require("../models/mastodonUser");
const { read } = require("fs");

prompt.start();

mastodonUserRouter.post("/login", async (req, res) => {
  try {
    const mastodonApp = await Mastodon.createOAuthApp();
    console.log(
      // "Please save 'id', 'client_id', and 'client_secret' in your program and use it from now on!"
    );
    console.log(mastodonApp);

    const clientId = mastodonApp.client_id;
    const clientSecret = mastodonApp.client_secret;

    const authUrl = await Mastodon.getAuthorizationUrl(clientId, clientSecret);
    console.log(
      // "This is the authorization URL. Open it in your browser and authorize with your account!"
    );
    console.log(authUrl);

    prompt.get(["code"], async (err, result) => {
      if (err) {
        console.error("Error getting code:", err);
        return res.status(500).send("Internal Server Error");
      }

      try {
        const accessToken = await Mastodon.getAccessToken(
          clientId,
          clientSecret,
          result.code
        );

        console.log("access token -> " + accessToken);


        const mastodonInstance = "https://mastodon.social";
        const verifyCredentialsEndpoint = "/api/v1/accounts/verify_credentials";

        const url = mastodonInstance + verifyCredentialsEndpoint;

        const headers = new Headers({
          Authorization: `Bearer ${accessToken}`,
        });

        const response = await fetch(url, { method: "GET", headers: headers });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    
        const accountInfo = await response.json();
        console.log(accountInfo)

        // Save user data to MongoDB
        const mastodonUser = new MastodonUser({
          mastodonUserId: accountInfo.id,
          username: accountInfo.username,
          accessToken: accessToken,
        });
        await mastodonUser.save();

        console.log(`User data saved to MongoDB: ${mastodonUser}`);
        return res.status(200).send("Login successful");
      } catch (error) {
        console.error("Error getting access token:", error);
        return res.status(500).send("Internal Server Error");
      } finally {
        prompt.stop();
      }
    });
  } catch (error) {
    console.error("Error creating OAuth app:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = mastodonUserRouter;
