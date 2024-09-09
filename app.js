const express = require("express");
const csv = require("csv");
const fs = require("fs");
const path = require("path");
const upload = require("./services/uploadCsvServices");
const db = require("./db/models");
const app = express();
const port = process.env.PORT || 3000;

const { sendGreeting, sendMessageToAPI } = require("./src/greetings");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/upload", upload.single("arquivo"), (req, res) => {
  if (!req.file) {
    return res.send("Erro: Selecione arquivo CSV!");
  }

  const arquivoCSV = "./public/upload/csv/" + req.file.filename;

  fs.createReadStream(arquivoCSV)
    .pipe(csv.parse({ columns: true, delimiter: "," }))

    .on("data", async (dadosLinha) => {
      const user = await db.Base_Numbers.findOne({
        attributes: ["id"],
        where: { phone: dadosLinha.phone },
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
      return res.send("Erro: Nome do arquivo não foi salvo banco de dados!");
    });
});

app.post("/send-greeting", async (req, res) => {
  const { name, number } = req.body;  // Recebe o nome e o número do corpo da requisição
  
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
    return res.status(500).send("Erro ao enviar mensagem para o número: " + sendResult.message);
  }

  return res.send(`Mensagem enviada: ${result.message}`);
});


app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}: http://localhost:3000`);
});
