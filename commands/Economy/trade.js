
module.exports.run = async (client, message, args, userInfo) => {
  const getter = await client.getUser(message.guild.member(message.mentions.users.first()));
  const monnaie = parseInt(args[1]);
  if (userInfo.coins < monnaie)
    return message.reply(
      `Vous n'avez pas assez d'argent pour cela! (${userInfo.coins} < ${monnaie})`
    );

  if (getter && !isNaN(monnaie)) {
    try {
      message.channel.send(
        `Confirmez-vous le payement de \`${monnaie}\`<:coins:737627354020577294> à ${message.guild.member(message.mentions.users.first())}? (oui)`
      );

      const filter = (m) => message.author.id === m.author.id;
      const userEntry = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 10000,
        errors: ["time"],
      });
      if (userEntry.first().content.toLowerCase() === "oui") {
        const getterCoins = getter.coins + monnaie
        const emitterCoins = userInfo.coins - monnaie

        client.updateUserInfo(message.member, {
          "users.$.coins": emitterCoins,
        })

        client.updateUserInfo(getter, {
          "users.$.coins": getterCoins,
        })

        message.channel.send(
          `Merci pour votre échange, votre balance est maintenant de: \`${
            userInfo.coins - monnaie
          }\`<:coins:737627354020577294>`
        );

      }
    } catch (e) {
      message.channel.send(
        "Achat annulé, Merci de confirmer votre échange en répondant `oui` la prochaine fois."
      );
    }
  } else {
    message.reply(
      "Merci de mentionner la personne que vous désirez payer et le montant!"
    );
  }
};

module.exports.help = {
  name: "trade",
  aliases: ["trade"],
  category: "economy",
  description: "Faire un échange avec un utilisateur",
  cooldown: 3,
  usage: "<@user> <balance>",
  isUserAdmin: false,
  permissions: false,
  args: true,
  profil: true
}
