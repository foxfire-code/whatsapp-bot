export default {
  command: ["antivv", "antiviewonce"],
  async execute({ sock, from, args, owner }) {
    if (!owner) {
      return sock.sendMessage(from, {
        text: "❌ Owner only"
      });
    }

    const action = args[0]?.toLowerCase();

    if (!action) {
      return sock.sendMessage(from, {
        text: "Usage:\n.antivv on\n.antivv off"
      });
    }

    if (action === "on") {
      return sock.sendMessage(from, {
        text: "✅ Anti View Once enabled"
      });
    }

    if (action === "off") {
      return sock.sendMessage(from, {
        text: "❌ Anti View Once disabled"
      });
    }
  }
};
