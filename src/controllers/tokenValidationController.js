const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { correoUsuario, contraseniaUsuario } = req.body;

    const validateUser = await prisma.usuarios.findUnique({
      where: {
        correoUsuario: correoUsuario,
      },
    });

    if (correoUsuario.length <= 0 || contraseniaUsuario.length <= 0) {
      res.json({ message: "Todos los campos son necesarios" });
    } else {
      if (validateUser !== null) {
        bcryptjs.compare(
          contraseniaUsuario,
          validateUser.contraseniaUsuario,
          (rq, rs) => {
            if (rs === true) {
              const userDataWithJwt = {
                id: validateUser.idUsuario,
                message: "OK",
                status: 200,
              };
              const token = jwt.sign(userDataWithJwt, "necoco", {
                expiresIn: "10h",
              });

              return res.json({
                status: 200,
                message: "Credenciales correctas",
                token,
              });
            }

            res.json({ message: "Email o contrasena incorrecta 2" });
          }
        );
      } else {
        res.json({
          message: "Email o contrasena incorrecta",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

exports.protectedRoute = async (req, res) => {
  try {
    const receivedToken = req.headers["authorization"];
    jwt.verify(receivedToken, "necoco", (err, decoded) => {
      err ? res.status(401).json() : res.json({ decoded });
    });
  } catch (error) {
    res.json({ message: "algo pasó" });
  }
};
