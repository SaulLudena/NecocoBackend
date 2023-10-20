const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

exports.getUserInfo = async (req, res) => {
  const { localStorageToken } = req.body;
  try {
    jwt.verify(localStorageToken, "necoco", async (err, decoded) => {
      if (err) {
        res.status(401).json();
      } else {
        const { id } = decoded;
        const userInfo = await prisma.usuarios.findUnique({
          where: { idUsuario: id },
          select: {
            nombreUsuario: true,
          },
        });

        res.json({ userInfo });
      }
    });
  } catch (error) {
    res.json({ error });
  }
};

exports.register = async (req, res) => {
  try {
    const { correoUsuario, contraseniaUsuario, nombreUsuario } = req.body;

    if (
      correoUsuario.length <= 0 ||
      contraseniaUsuario.length <= 0 ||
      nombreUsuario.length <= 0
    ) {
      return res.json({ message: "Ingrese todos los campos" });
    }

    await prisma.usuarios.create({
      data: {
        correoUsuario: correoUsuario,
        contraseniaUsuario: bcryptjs.hashSync(contraseniaUsuario, 8),
        nombreUsuario: nombreUsuario,
      },
    });

    res.json({
      status: 200,
      message: "Usuario agregado correctamente",
    });
  } catch (error) {
    console.log(error);
    //validamos que exista un error de tipo prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      //validamos que el tipo de error sea un error de datos duplicados "P2002"
      if (error.code === "P2002") {
        //nos indica que el campo email usuario ya existe en la base de datos
        if (error.meta.target === "correoUsuario")
          res.json({
            message: "Email no disponible, ingrese otro",
          });
        //nos indica que el campo nombre publico usuario usuario ya existe en la base de datos
        if (error.meta.target === "nombreUsuario")
          res.json({
            message: "Nombre de usuario no disponible, ingrese otro",
          });
      }
    }
  }
};
