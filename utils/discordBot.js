const User = require('../schemas/userSchema.js');

async function botInit(){
    const {Client, ChannelType, PermissionsBitField} = require('discord.js')
    const mongoose = require('mongoose')

    const client = new Client({intents:131071})
    const TOKEN = process.env.TOKEN
    client.login(TOKEN)
    client.on('ready',()=>{console.log(`${client.user.tag} has logged in.`)})


    client.on('messageCreate', async (message)=>{
       function delMsg(){message.delete()}

        const guild = await client.guilds.fetch(process.env.GUILD_ID)
        const channel = client.channels.cache.get(process.env.CHANNEL_ID);
        if(message.channel.id == channel){
          const member = message.member
            let flag = false
            if(message.content.startsWith("ts verify")){
               let content = message.content.split(" ")[2]
               User.findOne({discordCode: content}).then(async (team)=>{
                if(team){
                  let role = guild.roles.cache.find(r => r.name === team.school.schoolName)
                  if(!role){
                    console.log("No role found")
                  }
                  else{ 
                    member.roles.add(role).then(
                      async () => await member.setNickname(`${message.author.globalName} | ${team.school.schoolName}`)
                    )
                    message.react('✅')
                    member.send("Verified")                
                  }
                }else{
                  flag = true
                }
                if(flag){
                  message.react('❌')
                  member.send("The verification code does not match!")
                }
               })
               setTimeout(delMsg, 3000)     
          }else{
            message.delete()
          }
          
        }
    })

}


const teamCreateHandle = async (name)=>{
  const {Client, ChannelType, PermissionsBitField} = require('discord.js')
  const mongoose = require('mongoose')

  const client = new Client({intents:131071})
  const TOKEN = process.env.TOKEN
  client.login(TOKEN)
  client.on('ready',()=>{console.log(`${client.user.tag} has logged in.`)})
  const guild = await client.guilds.fetch(process.env.GUILD_ID) //server ID 
    guild.roles.create({
        name: name, //role name
        reason: 'Test role', 
      })
        .then(async ()=>{
            const role = await guild.roles.cache.find(role => role.name === name)
            await guild.channels.create({
                name:name,
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
        .catch(err=>console.log(err));    

}

//add logic for finding team name etc 


module.exports = {botInit, teamCreateHandle}