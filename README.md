This is a discord self-bot that will update your rich presence based on your activity on various services.

**Warning:** Self-bots have been described as "not supported" by Discord, and they have stated before that if you use them in ways that "cause problems", your account could be banned. These problems include spamming, intentional or otherwise, acting on messages of users besides yourself, etc. They are pretty vague about it, but if your self-bot does not do anything exploitative or conspicuous, they should not notice that you are using a self-bot. This bot only uses the Discord endpoint that updates your rich presence, so it _shouldn't_ be an issue. However, if your account gets banned, it is not out responsibility. It is planned to add an RPC mode that will update presence via the allowed method. This will require the app to run on a machine that has the Discord desktop client open.



#### Installation

1. Create a Discord bot [here](https://discordapp.com/developers/applications/me/create) and give it a name
2. Click "Enable Rich Presence" near the bottom of the app page
3. Upload assets from the `icons` folder, using the filenames as the asset names, and selecting the type based on the folder they are in (large/small)
4. Click "Save Changes"
5. Set environment variables
```
  DISCORD_TOKEN: Open devtools in the Discord desktop app (ctrl-shift-I/cmd-opt-I)
  ...
```

#### Usage

#### Development

##### Dependencies

1. Node.js
  - Install from https://nodejs.org/

##### Running

1. run `npm install`
2. run `npm start` with environment variables set
