const express = require("express");
const router = express.Router(); // Usar o Router do Express
const csv = require("csv");
const fs = require("fs");
const path = require("path");
const upload = require("../services/uploadCsvServices"); // Ajuste o caminho corretamente
const db = require("../db/models"); // Ajuste o caminho corretamente
const { sendGreeting, sendMessageToAPI } = require("../src/greetings"); // Importando funções de envio
const { sendToBaseNumbers } = require("../src/sendMessages"); // Importando funções de envio

router.get("/", (req, res) => res.send("Seja bem-vindo a API Brz.apps!"));

router.post("/upload", upload.single("arquivo"), (req, res) => {
  // Verifique se o arquivo foi enviado
  if (!req.file) {
    return res.send("Erro: Selecione arquivo CSV!");
  }

  // Diretório onde o CSV será salvo
  const uploadDir = path.join(__dirname, "../public/upload/csv");

  // Verifica se o diretório existe, se não, cria-o
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Caminho completo do arquivo CSV
  const arquivoCSV = path.join(uploadDir, req.file.filename);

  console.log("Arquivo CSV salvo em: ", arquivoCSV);

  fs.createReadStream(arquivoCSV)
    .pipe(csv.parse({ columns: true, delimiter: "," }))
    .on("data", async (dadosLinha) => {
      const user = await db.Base_Numbers.findOne({
        attributes: ["id"],
        where: { phone: dadosLinha.phone }, // Ajustado para comparar o telefone
      });

      if (!user) {
        await db.Base_Numbers.create(dadosLinha);
      }
    });

  db.Arquivos.create({ arquivo: req.file.filename })
    .then(() => {
      return res.send("Importação concluída.");
    })
    .catch(() => {
      return res.send("Erro: Nome do arquivo não foi salvo no banco de dados!");
    });
});

// Rota para envio de saudação
router.post("/send-greeting", async (req, res) => {
 
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).send("Erro: 'name' e 'number' são obrigatórios.");
  }

  // Chama a função para gerar a saudação
  const result = await sendGreeting(name);

  if (result.status === "error") {
    return res.status(500).send(result.message);
  }

  // Envia a mensagem para a API de envio de texto
  const sendResult = await sendMessageToAPI(number, result.message);

  if (sendResult.status === "error") {
    return res
      .status(500)
      .send("Erro ao enviar mensagem para o número: " + sendResult.message);
  }

  return res.send(`Mensagem enviada: ${result.message}`);
});

router.post("/send-messages", async (req, res) => {
  try{
    await sendToBaseNumbers()
  
    return res.status(200).send("Mensagens enviadas com sucesso!");
  }catch (error){
  
    return res.status(500).send("Erro ao enviar mensagens: " + error.message);
  }
})

module.exports = router;
