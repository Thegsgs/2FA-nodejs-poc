const express = require("express");
const assert = require("assert");
const qrcode = require("qrcode");
const speakeasy = require("speakeasy");
const ldap = require("ldapjs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3001;

const client = ldap.createClient({
  url: ["ldap://localhost:1389"],
});

client.on("error", (err) => {
  console.log(err);
});

client.bind("cn=admin,dc=example,dc=org", "adminpassword", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Bind successful!");
  }
});

async function searchUserPassword(username) {
  return new Promise(async (resolve, reject) => {
    const searchOpt = {
      filter: `(cn=${username})`,
      scope: "sub",
      attributes: ["userpassword"],
    };

    await client.search("dc=example,dc=org", searchOpt, (err, res) => {
      assert.ifError(err);

      res.on("searchEntry", (entry) => {
        resolve(entry.object.userPassword);
      });
      res.on("error", (err) => {
        console.error("error: " + err.message);
      });
      res.on("end", (result) => {});
    });
  });
}

let secret;
app.post("/", async (req, res) => {
  const { username, password } = req.body;
  const foundPassword = await searchUserPassword(username);
  if (password === foundPassword) {
    secret = speakeasy.generateSecret();
    qrcode.toDataURL(secret.otpauth_url, (err, data) => {
      try {
        res.json({ data });
      } catch (error) {
        console.log(error);
      }
    });
  } else {
    console.log("Passwords don't match");
  }
});

app.post("/verify", (req, res) => {
  const { token } = req.body;
  try {
    const verified = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: "base32",
      token,
      window: 2,
    });
    if (verified) {
      res.json({ verified: true });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
