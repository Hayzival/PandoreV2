const mongoose = require("mongoose");
const { Guild } = require("../models/index");

module.exports = (client) => {
  client.createGuild = async (guild) => {
    const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, guild);
    const createGuild = await new Guild(merged);
    createGuild.save();
  };

  client.getGuild = async (guild) => {
    const data = await Guild.findOne({ guildID: guild.id });
    if (data) return data;
  };

  client.getUser = async (member) => {
    const data = await client.getGuild(member.guild);
    const position = data.users.map((e) => e.id).indexOf(member.id);
    return data.users[position];
  };

  client.updateGuild = async (guild, settings) => {
    let data = await client.getGuild(guild);
    if (typeof data !== "object") data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
    }
    return data.updateOne(settings);
  };

  client.createUserProfile = (member, guild) => {
    Guild.updateOne(
      { guildID: guild.id },
      {
        $push: {
          users: {
            id: member.id,
            experience: 0,
            level: 1,
            coins: 0,
            wins: 0,
            losses: 0,
            description: "",
            class: "",
            attributs: {},
            inventory: []
          },
        },
      }
    ).then((d) => console.log("OK"));
  };

  client.updateUserInfo = (member, options = {}) => {
    Guild.updateOne({ "users.id": member.id }, { $set: options }).then();
  };

  client.createMissingInfoOnUser = (member, missingInfo = {}) => {
    Guild.updateOne({ "users.id": member.id }, { $set: missingInfo }).then();
  };
};
