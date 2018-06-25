This is a script that will update your rich presence based on your activity on Trakt.tv.

**Note:** This must be run on a machine that has the Discord desktop client open.

#### Installation

1. Install Node.js [here](https://nodejs.org/)
2. run `npm install`

3. Create a Discord app [here](https://discordapp.com/developers/applications/me/create) and name it `Trakt`
4. Click "Enable Rich Presence" near the bottom of the app page
5. Upload assets from the `icons` folder, using the filenames as the asset names, and selecting the type based on the folder they are in (large/small)
6. Click "Save Changes"

7. Create a Trakt app [here](https://trakt.tv/oauth/applications/new)
8. Give it a name and set the redirect uri to `urn:ietf:wg:oauth:2.0:oob`

9. Set environment variables
```
  DISCORD_CLIENT: Client ID from Discord app page
  TRAKT_CLIENT: Client ID from Trakt app page
  TRAKT_SECRET: Client Secret from Trakt app page
```
10. run `npm start`
11. You will be prompted to activate the app on Trakt with a code.

#### Usage

Scrobble something to Trakt, and your discord presence will be updated while you are watching.
