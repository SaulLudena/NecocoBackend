const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.likeByPost = async (req, res) => {
  try {
    const { idPost, idUsuario } = req.body;

    // Verificar si el usuario ha dado like al post
    const like = await prisma.likes.findFirst({
      where: {
        fkIdPost: idPost,
        fkIdUsuario: idUsuario,
      },
    });

    // Consultar la cantidad de likes dados al post
    const likesCount = await prisma.likes.count({
      where: {
        fkIdPost: idPost,
      },
    });

    res.json({ like: like !== null, likesCount: likesCount });
  } catch (error) {
    res.json(error);
  }
};

exports.likePost = async (req, res) => {
  //dar like a un post
  try {
    const { idPost, idUsuario } = req.body;

    const like = await prisma.likes.findFirst({
      where: {
        fkIdPost: idPost,
        fkIdUsuario: idUsuario,
      },
    });

    if (like) {
      res.json({ message: "Ya le has dado like a este post", status: 400 });
    } else {
      await prisma.likes.create({
        data: {
          fkIdPost: idPost,
          fkIdUsuario: idUsuario,
        },
      });

      res.json({ message: "Like agregado", like: true, status: 200 });
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

exports.dislikePost = async (req, res) => {
  //eliminar un like
  try {
    const { idPost, idUsuario } = req.body;

    const like = await prisma.likes.findFirst({
      where: {
        fkIdPost: idPost,
        fkIdUsuario: idUsuario,
      },
    });

    if (like) {
      await prisma.likes.delete({
        where: {
          idLike: like.idLike,
        },
      });

      res.json({ message: "Like eliminado", like: false, status: 200 });
    } else {
      res.json({ message: "Like no encontrado", status: 404 });
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
