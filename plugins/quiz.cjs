const questions = [
  {
    q: "Capital of Nigeria?",
    a: "Abuja"
  },
  {
    q: "5 + 5 ?",
    a: "10"
  },
  {
    q: "Largest planet?",
    a: "Jupiter"
  }
];

module.exports = {
  name: "quiz",
  command: ["quiz"],

  async run({ sock, m }) {
    const pick =
      questions[
        Math.floor(
          Math.random() *
          questions.length
        )
      ];

    await sock.sendMessage(
      m.key.remoteJid,
      {
        text:
          `🧠 QUIZ\n\n${pick.q}\n\nAnswer:\n${pick.a}`
      },
      {
        quoted: m
      }
    );
  }
};
