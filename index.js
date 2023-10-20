const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const post = require("./src/routes/postRoute");
const login = require("./src/routes/loginRoute");
const user = require("./src/routes/userRoute");

app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/post", post);
app.use("/login", login);
app.use("/user", user);
