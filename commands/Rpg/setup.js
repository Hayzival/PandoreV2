const { Guild } = require("../../models/index");

module.exports.run = async (client, message, args, userInfo) => {
  if (userInfo && userInfo.class !== "")
    return message.reply("Tu ne peux pas taper plusieurs fois cette commande");

  const classes = require("../../assets/rpg/classes.json");
  const q = args.join(" ");
  const position = classes
    .map((e) => e.name.toLowerCase())
    .indexOf(q.toLowerCase());

  if (q && position == -1) message.reply("Cette classe n'existe pas !");

  if (q && position !== -1) {
    try {
      const classe = classes[position];
      message.channel.send(
        `Voulez-vous vraiment choisir ${classe.name}? (\`oui\` pour confirmer)`
      );

      const filter = (m) => message.author.id === m.author.id;
      const userEntry = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 10000,
        errors: ["time"],
      });

      if (userEntry.first().content.toLowerCase() === "oui") {
        message.channel.send(
          `Votre profil a été crée, vous êtes maintenant un \`${classe.name}\`!`
        );
        if (!userInfo) {
          Guild.updateOne(
            { guildID: message.guild.id },
            {
              $push: {
                users: {
                  id: message.member.id,
                  experience: 0,
                  level: 1,
                  coins: 0,
                  wins: 0,
                  losses: 0,
                  description: "",
                  class: classe.name,
                  attributs: classe.attributs,
                  inventory: [],
                },
              },
            }
          ).then((d) => console.log("OK !"));
        } else {
          client.updateUserInfo(message.member, {
            "users.$.class": classe.name,
            "users.$.attributs": classe.attributs,
          });
        }
      }
    } catch (e) {
      message.channel.send(
        "Vous avez pris trop de temps pour choisir votre classe !"
      );
    }
  } else {
    message.channel.send(
      `Veuillez choisir votre classe (syntax: \`setup nom_de_classe\`)! Les classes disponibles: ${classes
        .map((e) => `${e.name}`)
        .join(", ")}`
    );
  }
};

module.exports.help = {
  name: "setup",
  aliases: ["setup"],
  category: "rpg",
  description: "Créer le profil de votre personnage",
  cooldown: 3,
  usage: "<class>",
  isUserAdmin: false,
  permissions: false,
  args: false,
  profil: false,
};
