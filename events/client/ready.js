module.exports = (client) => {
  console.log(
    `${client.user.tag} observe ses ${client.guilds.cache
      .map((g) => g.memberCount)
      .reduce((a, b) => a + b)} utilisateurs du serveur !`
  );
  client.channels.cache
    .get("708692148895088681")
    .send("Je suis opérationnel !");

  const guild = []
  client.guilds.cache.map(e => guild.push(e))
  guild.forEach(async g => {
    const data = await client.getGuild(g)
    if (!data) client.createGuild({ guildID: g.id })
  })


  let activities = [
    "a%help",
    `être avec ${client.guilds.cache
      .map((g) => g.memberCount)
      .reduce((a, b) => a + b)} utilisateurs`,
    "contempler Hayzival",
    `être sur ${client.guilds.cache.size.toString()} serveurs`,
  ];

  setInterval(
    () =>
      client.user.setPresence({
        activity: {
          name: `${activities[Math.floor(Math.random() * activities.length)]}`,
          type: "PLAYING",
        },
        status: "dnd",
      }),
    3000
  );

  // setInterval(() => client.user.setPresence({ activity: { name: `${activities[i++ % activities.length]}`, type: 'PLAYING' }, status: 'dnd' }), 3000);
};
