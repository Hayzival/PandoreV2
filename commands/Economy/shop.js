const { MessageEmbed } = require("discord.js");
const { capitalize } = require("../../functions/strings");

module.exports.run = async (client, message, args, userInfo) => {
  
  const items = [];
  const shop = require("../../assets/shop/shop.json");
  const q = args.slice(1).join(" ");
  const position = shop
    .map((e) => e.name.toLowerCase())
    .indexOf(q.toLowerCase());
  const item = shop[position];
  const userInventory = userInfo.inventory;

  if (q && position == -1)
    message.reply(
      "Cet objet n'existe pas! Vérifié si l'objet se trouve bien dans le shop!"
    );

  const embed = new MessageEmbed().setTitle("Bienvenue dans notre magasin");

  if (q && position !== -1) {
    if (args[0] == "show") {
      const embed = new MessageEmbed()
        .setTitle(`${item.name} (type: ${item.type})`)
        .setColor(item.color)
        .setThumbnail(item.icon)
        .setDescription(`${item.description} (${item.prix}<:coins:737627354020577294>)`)
        .addField("Attributs", `${Object.entries(item.attributs).map(([key, value]) => `${capitalize(key)}: ${value}`).join(' | ')}`)
      
      message.channel.send(embed)
    }
    if (args[0] == "buy") {
      try {
        message.channel.send(
          `Confirmez-vous l'achat de \`${item.name.toLowerCase()}\` pour \`${
            item.prix
          }\`<:coins:737627354020577294>? (oui)`
        );
  
        const filter = (m) => message.author.id === m.author.id;
        const userEntry = await message.channel.awaitMessages(filter, {
          max: 1,
          time: 10000,
          errors: ["time"],
        });
  
        if (userEntry.first().content.toLowerCase() === "oui") {
          const userCoins = userInfo.coins - item.prix;
          client.updateUserInfo(message.member, {
            "users.$.coins": userCoins,
          });
          message.channel.send(
            `Merci pour votre achat, votre balance est maintenant de: \`${
              userInfo.coins - item.prix
            }\`<:coins:737627354020577294>`
          );
          userInventory.push(item.item);
          client.updateUserInfo(message.member, {
            "users.$.inventory": userInventory,
          });
        }
      } catch (e) {
        message.channel.send(
          "Achat annulé. Merci de confirmer votre achat en répondant `oui` la prochaine fois."
        );
      }
    }
    if (args[0] == "sell") {
      try {
        const check = userInventory.indexOf(capitalize(q));
        if(check == -1) return message.reply("Tu ne possèdes pas cette objet !")
        message.channel.send(
          `Confirmez-vous la vente de \`${item.name.toLowerCase()}\` pour \`${
            item.prix
          }\`<:coins:737627354020577294>? (oui)`
        );
  
        const filter = (m) => message.author.id === m.author.id;
        const userEntry = await message.channel.awaitMessages(filter, {
          max: 1,
          time: 10000,
          errors: ["time"],
        });
  
        if (userEntry.first().content.toLowerCase() === "oui") {
          const userCoins = userInfo.coins + item.prix;
          client.updateUserInfo(message.member, {
            "users.$.coins": userCoins,
          });
          message.channel.send(
            `Merci pour votre vente, votre balance est maintenant de: \`${
              userInfo.coins + item.prix
            }\`<:coins:737627354020577294>`
          );
          const userInventory = userInfo.inventory;
          userInventory.splice(check, 1);
          client.updateUserInfo(message.member, {
            "users.$.inventory": userInventory,
          });
        }
      } catch (e) {
        message.channel.send(
          "Vente annulé. Merci de confirmer votre vente en répondant `oui` la prochaine fois."
        );
      }
    }
  } else {
    shop.map((e) => items.push(`${e.name} (${e.prix}<:coins:737627354020577294>)`));
    embed.setDescription(
      `Voici les différents objets disponibles:\n${items
        .map((item) => `**${item}**`)
        .join("\n")}`
    );
    message.channel.send(embed);
  }
};

module.exports.help = {
  name: "shop",
  aliases: ["shop"],
  category: "economy",
  description: "Le magasin",
  cooldown: 3,
  usage: "[<object>]",
  isUserAdmin: false,
  permissions: false,
  args: false,
  profil: true,
};
