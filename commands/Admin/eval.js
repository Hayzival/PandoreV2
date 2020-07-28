module.exports.run = async (client, message, args) => {
  function clean(text) {
    if (typeof text === "string")
      return text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    return text;
  }

  if (message.author.id !== "306768451702095874") return;
  const code = args.join(" ");
  const evaled = eval(code);
  const cleanCode = await clean(evaled);
  message.channel.send(cleanCode, { code: "js" });
};

module.exports.help = {
  name: "eval",
  aliases: ["eval"],
  category: "admin",
  description: "Tester un code javascript",
  cooldown: 3,
  usage: "<code_to_test>",
  isUserAdmin: false,
  permissions: true,
  args: true,
  profil: false
}