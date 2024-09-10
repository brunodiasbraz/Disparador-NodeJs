const axios = require("axios");
const db = require("../db/models");

async function sendToBaseNumbers() {
  try {
    const records = await db.Base_Numbers.findAll({
      attributes: ["name", "phone"], 
    });

    if (records.length === 0) {
      console.log("Nenhum número encontrado na base.");
      return;
    }

    for (const record of records) {
      const { name, phone } = record;

      try {
        const response = await axios.post(
          "http://localhost:3000/api/send-greeting",
          {
            name: name,
            number: phone,
          }
        );

        console.log(
          `Mensagem enviada para ${name} (${phone}): ${response.data}`
        );
      } catch (error) {
        console.error(
          `Erro ao enviar mensagem para ${name} (${phone}):`,
          error.message
        );
      }
      await sleep(5000);
    }
  } catch (error) {
    console.error("Erro ao buscar números da base:", error);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { sendToBaseNumbers };
