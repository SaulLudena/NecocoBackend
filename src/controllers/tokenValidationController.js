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

            res.json({
              message: "Email o contrasena incorrecta",
              status: 400,
            });
          }
        );
      } else {
        res.json({
          message: "Email o contrasena incorrecta",
          status: 400,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

exports.protectedRoute = async (req, res, next) => {
  try {
    // Obtener token del encabezado de autorización
    const receivedToken = req.headers["authorizationtoken"];
    if (!receivedToken) {
      return res
        .status(401)
        .json({ error: "Token no proporcionado", status: 401 });
    }
    jwt.verify(receivedToken, "necoco", (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token no válido", status: 401 });
      }

      res.json({ message: "Token verificado con éxito", decoded, status: 200 });

      req.user = next();
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor", status: 500 });
  }
};
