const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const routes = require("./routes"); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}: http://localhost:3000`);
});
