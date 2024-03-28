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
      "Please save 'id', 'client_id', and 'client_secret' in your program and use it from now on!"
    );
    console.log(mastodonApp);

    const clientId = mastodonApp.client_id;
    const clientSecret = mastodonApp.client_secret;

    const authUrl = await Mastodon.getAuthorizationUrl(clientId, clientSecret);
    console.log(
      "This is the authorization URL. Open it in your browser and authorize with your account!"
    );
    console.log(authUrl);

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Form</title>
    </head>
    <body>
      <div id="root"></div>
      <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/babel-standalone@^6.26.0/babel.min.js"></script>
      <script type="text/babel">
        class Form extends React.Component {
          constructor(props) {
            super(props);
            this.state = {
              name: '',
              email: '',
              phone: ''
            };
          }

          handleChange = (e) => {
            this.setState({ [e.target.name]: e.target.value });
          };

          handleSubmit = async (e) => {
            e.preventDefault();
            const formData = {
              name: this.state.name,
              email: this.state.email,
              phone: this.state.phone
            };

            const response = await fetch('/save-data', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });

            const data = await response.text();
            console.log(data);
          };

          render() {
            return (
              <form onSubmit={this.handleSubmit}>
                <label>Name:</label>
                <input type="text" name="name" value={this.state.name} onChange={this.handleChange} /><br />
                <label>Email:</label>
                <input type="email" name="email" value={this.state.email} onChange={this.handleChange} /><br />
                <label>Phone:</label>
                <input type="text" name="phone" value={this.state.phone} onChange={this.handleChange} /><br />
                <button type="submit">Save</button>
              </form>
            );
          }
        }

        ReactDOM.render(<Form />, document.getElementById('root'));
      </script>
    </body>
    </html>
  `);

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
