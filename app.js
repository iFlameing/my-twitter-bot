require('dotenv').config()
const express = require("express");
const bodyParser = require ('body-parser');
const twitterWebhooks = require('twitter-webhooks');

const app = express();
app.use(bodyParser.json());

console.log(process.env.access_token)

const userActivityWebhook = twitterWebhooks.userActivity({
    serverUrl: 'https://iflameingtwitter-bot.herokuapp.com/',
    route: '/webhook/twitter', //default : '/'
    consumerKey: process.env.consumer_key,
    consumerSecret: process.env.consumer_secret,
    accessToken: process.env.access_token,
    accessTokenSecret: process.env.access_token_secret,
    environment: process.env.environment, //default : 'env-beta'
    app
});

//Register your webhook url - just needed once per URL
userActivityWebhook.register();

//Subscribe for a particular user activity
userActivityWebhook.subscribe({
    userId: process.env.UserId,
    accessToken: process.env.access_token,
    accessTokenSecret: process.env.access_token_secret,
})
.then(function (userActivity) {
    userActivity
    .on('favorite', (data) => console.log (userActivity.id + ' - favorite'))
    .on ('tweet_create', (data) => console.log (userActivity.id + ' - tweet_create'))
    .on ('follow', (data) => console.log (userActivity.id + ' - follow'))
    .on ('mute', (data) => console.log (userActivity.id + ' - mute'))
    .on ('revoke', (data) => console.log (userActivity.id + ' - revoke'))
    .on ('direct_message', (data) => console.log (userActivity.id + ' - direct_message'))
    .on ('direct_message_indicate_typing', (data) => console.log (userActivity.id + ' - direct_message_indicate_typing'))
    .on ('direct_message_mark_read', (data) => console.log (userActivity.id + ' - direct_message_mark_read'))
    .on ('tweet_delete', (data) => console.log (userActivity.id + ' - tweet_delete'))
});

//listen to any user activity
userActivityWebhook.on ('event', (event, userId, data) => console.log (userId + ' - favorite'));

//listen to unknown payload (in case of api new features)
userActivityWebhook.on ('unknown-event', (rawData) => console.log (rawData));

app.listen(process.env.PORT || 2345, () => console.log("server is started on 2345"))