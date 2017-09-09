var Discord = require('discord.io');
var URL = require('url-parse');
var token = 'place token here';

var bot = new Discord.Client({
    autorun: true,
    token: token
});

if (token == '') {
    console.log('what\'d i tell you?');
}

bot.on('any', function(event) {
  //console.log(event)
  //console.log(bot.servers['261614766227718146'])
})


// SET TO UNDEFINED to disable logs
var logIndicator = '[LOGS]';

// VALID LIMITS:
// - reason: requires you to provide a reason
var newchannel = {
  '194268574163009537': [
    'reason'
  ],
  '285901641188769792': []
};

bot.on('message', function(user, userID, channelID, message, event) {
  msg = message;

  // MAKE !createchannel AN ALIAS FOR !newchannel
  if (message.startsWith('!createchannel')) {
    msg = message.replace('!createchannel', '!newchannel');
  } else if (message.startsWith('!deletechannel')) {
    msg = message.replace('!deletechannel', '!delchannel');
  }

  if (msg.startsWith('!delchannel') && bot.channels[channelID].guild_id == '261614766227718146' && (userID == '285901641188769792'||userID == '265015624252653568')) {
    if (msg.startsWith('!delchannel ')) {
      if (msg.startsWith('!delchannel <#') && msg.split(' ')[1].endsWith('>')) {
        var dedID = msg.split(' ')[1].replace('<#','').replace('>','');
        var topic = bot.servers['261614766227718146'].channels[dedID].topic == undefined ? '*(none)*' : `\`\`\`md\n${bot.servers['261614766227718146'].channels[dedID].topic}\n\`\`\``;
        var reason = msg.replace(/^([^ ]+ ){2}/, '');
        var reason = msg == reason ? '*(none provided)*' : msg.replace(/^([^ ]+ ){2}/, '');
        bot.sendMessage({
          to: channelID,
          message: 'Done!'
        });

        bot.sendMessage({
          to: '261621440904691712',
          embed: {
            title: 'Channel Deleted',
            timestamp: new Date(),
            color: 0xd32f2f,
            description: `\`#${bot.servers['261614766227718146'].channels[dedID].name}\` was deleted.`,
            fields: [
              {
                name: 'Channel ID',
                value: `\`${dedID}\``,
                inline: true
              }, {
                name: 'Author',
                value: `<@${userID}>`,
                inline: true
              }, {
                name: 'Author ID',
                value: `\`${userID}\``,
                inline: true
              }, {
                name: 'Reason',
                value: reason,
                inline: true
              }, {
                  name: 'Channel Topic',
                  value: topic,
                  inline: false
              },
            ]
          }
        })

        bot.deleteChannel(dedID)
      } else {
        bot.sendMessage({
          to: channelID,
          message: 'You provided an invalid channel name! Try the following command:\n```\n!delchannel #channel-name\n```'
        });
      }
    } else {
      bot.sendMessage({
        to: channelID,
        message: 'You provided no arguments! Try the following command:\n```\n!delchannel #channel-name\n```'
      });
    }
  } else if (msg.startsWith('!newchannel')) {
    if (Object.keys(newchannel).indexOf(userID) > -1) {
      if (msg.startsWith('!newchannel ')) {
        if (!bot.channels[channelID]) {
          bot.sendMessage({
            to: channelID,
            message: ':x: You cannot use this command outside of a server!',
            tts: event.d.tss
          });
        } else if (bot.channels[channelID].guild_id == '261614766227718146') {
          var serverChannels = bot.servers[bot.channels[channelID].guild_id].channels;

          if (logIndicator == undefined) {
            var logChannel = undefined;
          } else {
            var logChannel = null;

            for (var i = 0; i < Object.keys(serverChannels).length; i++) {
              // Locate [LOGS] channel.
              var loopChannel = serverChannels[Object.keys(serverChannels)[i]];

              if (loopChannel.type !== 'text') {
                continue;
              }
              if (loopChannel.topic.indexOf(logIndicator) > -1) {
                //
                logChannel = Object.keys(serverChannels)[i];
                break;
              }
            }
          }

          var reason = msg.replace(/^([^ ]+ ){2}/, '');
          var reason = msg == reason ? '*(none provided)*' : msg.replace(/^([^ ]+ ){2}/, '');

          var dedID = msg.split(' ')[1].replace('#','');

          if (reason.length > 1024) {
            bot.sendMessage({
              to: channelID,
              message: ':x: Your reason is too long! Keep it at most 1024 characters.',
              tts: event.d.tss
            });
          } else if (reason == '*(none provided)*' && newchannel[userID].indexOf('reason') > -1) {
            bot.sendMessage({
              to: channelID,
              message: ':x: You must provide a reason!',
              tts: event.d.tss
            });
          } else if (9==11) { //  Will implement later
            bot.sendMessage({
              to: channelID,
              message: ':x: The bot does not have enough permissions to embed in the staff logs!',
              tts: event.d.tss
            });
          } else if (logChannel == null) {
            bot.sendMessage({
              to: channelID,
              message: `:x: There was not a channel to log channel creation in! Set your logging channel's topic to contain \`${logIndicator}\`.`,
              tts: event.d.tss
            });
          } else if (dedID.search(/^[a-zA-Z0-9-_]+$/) == -1) {
            bot.sendMessage({
              to: channelID,
              message: `:x: Your channel name must only have letters, numbers, dashes, and underscores.`,
              tts: event.d.tss
            });
          } else if (dedID.length < 2) {
            bot.sendMessage({
              to: channelID,
              message: ':x: Your channel name is too short! Keep it at least 2 characters.',
              tts: event.d.tss
            });
          } else if (dedID.length > 100) {
            bot.sendMessage({
              to: channelID,
              message: ':x: Your channel name is too long! Keep it at most 100 characters.',
              tts: event.d.tss
            });
          } else {
            bot.createChannel({
              name: dedID,
              serverID: '261614766227718146'
            }, function(err,callback){
              if (!err){
                bot.sendMessage({
                  to: channelID,
                  message: `:white_check_mark: Successfully created a new channel by the name of \`#${callback.name}\`!`,
                  tts: event.d.tss
                });

                if (logChannel !== null) {
                  bot.sendMessage({
                    to: '261621440904691712',
                    embed: {
                      title: 'Channel Created',
                      timestamp: new Date(),
                      color: 0x32cb00,
                      description: `\`#${callback.name}\` was created.`,
                      fields: [
                        {
                          name: 'Channel ID',
                          value: `\`${callback.id}\``,
                          inline: true
                        }, {
                          name: 'Position',
                          value: `${callback.position+1}`,
                          inline: true
                        }, {
                          name: 'Type',
                          value: callback.type == 'text' ? `Text` : `Voice`,
                          inline: true
                        }, {
                          name: 'NSFW',
                          value: callback.nsfw ? `Not Safe` : `Safe`,
                          inline: true
                        }, {
                          name: 'Author',
                          value: `<@${userID}>`,
                          inline: true
                        }, {
                          name: 'Author ID',
                          value: `\`${userID}\``,
                          inline: true
                        }, {
                          name: 'Reason',
                          value: reason,
                          inline: true
                        }
                      ]
                    }
                  });
                }
              } else {
                if (err.response.code == 50013) {
                  bot.sendMessage({
                    to: channelID,
                    message: ':x: The bot does not have enough permissions to create a channel!',
                    tts: event.d.tss
                  });
                } else if (err.response.code && err.response.message) {
                  bot.sendMessage({
                    to: channelID,
                    message: `:x: An error with code \`${err.response.code}\` and description \`${err.response.message}\` has occurred!`,
                    tts: event.d.tss
                  })
                } else if (err.response.name) {
                  bot.sendMessage({
                    to: channelID,
                    message: `:x: An error with description \`${err.response.name}\` has occurred!`,
                    tts: event.d.tss
                  })
                } else if (err.response.code) {
                  bot.sendMessage({
                    to: channelID,
                    message: `:x: An error with code \`${err.response.code}\` has occurred!`,
                    tts: event.d.tss
                  })
                } else if (err.response.message) {
                  bot.sendMessage({
                    to: channelID,
                    message: `:x: An error with description \`${err.response.name}\` has occurred!`,
                    tts: event.d.tss
                  })
                } else {
                  bot.sendMessage({
                    to: channelID,
                    message: `:x: An unknown error has occurred!`,
                    tts: event.d.tss
                  })
                }
                console.log(err)
              }
            });
          }
        } else {
          bot.sendMessage({
            to: channelID,
            message: ':x: You provided no arguments! Try the following command:\n```\n!newchannel #[channel-name] <reason>\n```',
            tts: event.d.tss
          });
        }
      } else {
        bot.sendMessage({
          to: channelID,
          message: ':x: You are not allowed to run that command!',
          tts: event.d.tss
        });
      }
    }
  } else if (msg.startsWith('!expand ') && bot.channels[channelID].guild_id == '261614766227718146') {

  }
});
