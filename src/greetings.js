const db = require("../db/models");
const axios = require("axios");
const apiKey = process.env.EVOLUTION_API_KEY;
const instance = process.env.EVOLUTION_INSTANCE;
const evolutioHost = process.env.EVOLUTION_HOST;

function generateGreeting(template, data) {
  return template.replace("{name}", data.name || "Cliente");
}

async function sendGreeting(name) {
  try {
    const templates = await db.Greeting_Template.findAll();

    if (templates.length === 0) {
      return {
        status: "error",
        message: "Nenhum template de saudação encontrado.",
      };
    }

    const randomTemplate =
      templates[Math.floor(Math.random() * templates.length)];

    const message = generateGreeting(randomTemplate.template, { name });

    return { status: "success", message: message };
  } catch (error) {
    return { status: "error", message: "Erro ao enviar a mensagem." };
  }
}

async function sendMessageToAPI(number, text) {
  const url = evolutioHost + "/message/sendText/" + instance;

  const body = {
    number: number,
    options: {
      delay: 1200,
      presence: "composing",
      linkPreview: false,
    },
    textMessage: {
      text: text,
    },
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        "apikey": apiKey,
      },
    });

    return { status: "success", data: response.data };
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return { status: "error", message: error.message };
  }
}
module.exports = { sendGreeting, sendMessageToAPI };
