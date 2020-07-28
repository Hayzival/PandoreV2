const { MessageEmbed } = require("discord.js");
const { capitalize } = require("../../functions/strings");

module.exports.run = (client, message, args, userInfo) => {
  if (userInfo.class == "") return message.reply("Tu dois d'abord utiliser la commande \`setup\` pour créer ton personnage !")

  const classes = require("../../assets/rpg/classes.json");
  const position = classes
    .map((e) => e.name.toLowerCase())
    .indexOf(userInfo.class.toLowerCase());
  const classe = classes[position];

  const embed = new MessageEmbed()
    .setAuthor(`${message.author.username} | ${userInfo.class} de niveau ${userInfo.level}`, message.author.displayAvatarURL())
    .setThumbnail(classe.icon)
    .setDescription(`${userInfo.description !== "" ? userInfo.description : classe.description}`)
    .addField("Stats", `${Object.entries(userInfo.attributs).map(([key, value]) => `${capitalize(key)}: ${value}`).join(' | ')}`)
    message.channel.send(embed);

};

module.exports.help = {
  name: "profil",
  aliases: ["profil"],
  category: "rpg",
  description: "Renvoie le profil de votre personnage",
  cooldown: 3,
  usage: "",
  isUserAdmin: false,
  permissions: false,
  args: false,
  profil: true
};

