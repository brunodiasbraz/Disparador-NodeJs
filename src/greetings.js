const db = require("../models"); // Ajuste o caminho conforme necessário
const axios = require('axios');

function generateGreeting(template, data) {
  return template
    .replace("{name}", data.name || "Cliente");
}

async function sendGreeting(name) {
  try {
    // Seleciona todos os templates de saudação
    const templates = await db.GreetingTemplate.findAll();
    
    if (templates.length === 0) {
      return { status: "error", message: "Nenhum template de saudação encontrado." };
    }

    // Seleciona um template aleatório
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    // Gera a mensagem personalizada
    const message = generateGreeting(randomTemplate.template, { name });

    // Aqui você enviaria a mensagem (exemplo fictício)
    // sendMessageToUser(name, message);
    
    return { status: "success", message: `Mensagem enviada: ${message}` };
  } catch (error) {
    return { status: "error", message: "Erro ao enviar a mensagem." };
  }
}

async function sendMessageToAPI(number, text) {
  const url = "https://brzapps-evolution.k8rcak.easypanel.host/message/sendText/wppPersonal";

  const body = {
    "number": number,
    "options": {
      "delay": 1200,
      "presence": "composing",
      "linkPreview": false
    },
    "textMessage": {
      "text": text
    }
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json'
        // Adicione outros cabeçalhos aqui, se necessário
      }
    });

    // Retornar a resposta da API
    return { status: "success", data: response.data };
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return { status: "error", message: error.message };
  }
}
module.exports = { sendGreeting, sendMessageToAPI };
