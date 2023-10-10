const User = require('../schemas/userSchema.js');

async function botInit() {
  const { Client, ChannelType, PermissionsBitField, IntentsBitField } = require('discord.js')
  const mongoose = require('mongoose')

  const client = new Client({
    intents: 3276799
  })

  const TOKEN = process.env.TOKEN
  client.login(TOKEN)
  client.on('ready', () => { console.log(`${client.user.tag} has logged in.`) })


  client.on('messageCreate', async (message) => {
    try{
    const guild = await client.guilds.fetch(process.env.GUILD_ID)
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    if (message.channel.id == channel && message.content.startsWith("ts verify")) {
      const member = message.member
      let content = message.content.split(" ")[2]
      team = await User.findOne({ discordCode: content })
      if (team && team.regType == "school") {
        console.log("In school")
        let role = guild.roles.cache.find(r => r.name === team.school.schoolName)
        if (role) {
          member.roles.add([role, process.env.MEMBER_ROLE_ID]).then(
            async () => await member.setNickname(`${message.author.globalName} | ${team.school.schoolName}}`.slice(0, 31))
          )
          message.react('✅')
          member.send("Verified")
        }
      }
      else if (team && team.regType == "indi") {
        let role = guild.roles.cache.find(r => r.name === team.indi.firstName)
        if (role) {
          member.roles.add([role, process.env.MEMBER_ROLE_ID]).then(
            async () => await member.setNickname(`${message.author.globalName} | ${team.school.firstName}`)
          )
          message.react('✅')
          member.send("Verified")
        }
      }
      else {
        message.react('❌')
        member.send("The verification code does not match!")
      }
      setTimeout(() => message.delete(), 1000)
    }
  } catch (err) {
    console.log(err)

  }
  })

}




const teamCreateHandle = async (name) => {
  const { Client, ChannelType, PermissionsBitField } = require('discord.js')
  const mongoose = require('mongoose')

  const client = new Client({ intents: 131071 })
  const TOKEN = process.env.TOKEN
  client.login(TOKEN)
  client.on('ready', () => { console.log(`${client.user.tag} has logged in.`) })
  const guild = await client.guilds.fetch(process.env.GUILD_ID) //server ID 
  guild.roles.create({
    name: name, //role name
    reason: 'Test role',
  })
    .then(async () => {
      const role = await guild.roles.cache.find(role => role.name === name)
      await guild.channels.create({
        name: name,
        type: ChannelType.GuildText,
        parent: process.env.SCHOOL_CATEGORY_ID, //Category Id
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: role,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: process.env.CORE_ROLE_ID,
            allow: [PermissionsBitField.Flags.ViewChannel],
          }
        ]
      })

    })
    .catch(err => console.log(err));

}

function discoIt(message) {
  //send the message on this webhooks

  const request = require('request');
  request.post({
    uri: process.env.WEBHOOK_URL,
    json: {
      "content": message
    },
  });

}

//add logic for finding team name etc 


module.exports = { botInit, teamCreateHandle, discoIt }