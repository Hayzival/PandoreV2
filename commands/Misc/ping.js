
module.exports.run = async (client, message, args) => {
  const msg = await message.channel.send("Ping!");
  msg.edit(
    `Pong!
    Latence du bot: ${msg.createdTimestamp - message.createdTimestamp}ms
    Latence de l'API: ${Math.round(client.ws.ping)}ms`
  );
};

module.exports.help = {
  name: "ping",
  aliases: ["ping"],
  category: "misc",
  description: "Renvoie pong",
  cooldown: 3,
  usage: "",
  isUserAdmin: false,
  permissions: false,
  args: false,
  profil: false,
};

