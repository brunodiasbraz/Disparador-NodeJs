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
    // Seleciona todos os templates de saudação
    const templates = await db.Greeting_Template.findAll();

    if (templates.length === 0) {
      return {
        status: "error",
        message: "Nenhum template de saudação encontrado.",
      };
    }

    // Seleciona um template aleatório
    const randomTemplate =
      templates[Math.floor(Math.random() * templates.length)];

    // Gera a mensagem personalizada
    const message = generateGreeting(randomTemplate.template, { name });

    // Aqui você enviaria a mensagem (exemplo fictício)
    // sendMessageToUser(name, message);

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

    // Retornar a resposta da API
    return { status: "success", data: response.data };
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return { status: "error", message: error.message };
  }
}
module.exports = { sendGreeting, sendMessageToAPI };
