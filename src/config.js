const { google } = require('googleapis');

let vars = {
  DB: '',
  G_DRIVE_CLIENT_ID: '',
  G_DRIVE_CLIENT_SECRET: '',
  G_DRIVE_REDIRECT_URIS: [],
  G_DRIVE_ACCESS_TOKEN: '',
  G_DRIVE_REFRESH_TOKEN: '',
  G_DRIVE_BACKUP_FOLDER_ID: '',
};

Object.keys(vars).forEach((key) => {
  if (process.env[key] === undefined)
    throw new Error(`${key} not found in ENV`);

  if (Array.isArray(vars[key])) vars[key] = JSON.parse(process.env[key]);
  else vars[key] = process.env[key];
});

const oAuth2Client = new google.auth.OAuth2(
  vars.G_DRIVE_CLIENT_ID,
  vars.G_DRIVE_CLIENT_SECRET,
  vars.G_DRIVE_REDIRECT_URIS[0]
);
oAuth2Client.setCredentials({
  access_token: vars.G_DRIVE_ACCESS_TOKEN,
  refresh_token: vars.G_DRIVE_REFRESH_TOKEN,
  token_type: 'Bearer',
});

module.exports = {
  vars,
  oAuth2Client,
};
