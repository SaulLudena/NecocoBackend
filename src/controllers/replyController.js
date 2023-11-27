const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.replyPost = async (req, res) => {
  //responder un post
  try {
    const { idPost, idUsuario, descripcionRespuesta } = req.body;

    await prisma.respuestapost.create({
      data: {
        fkIdPost: idPost,
        fkIdUsuario: idUsuario,
        descripcionRespuesta: descripcionRespuesta,
      },
    });

    res.json({ message: "Respuesta agregada", status: 200 });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

exports.getReplyByPost = async (req, res) => {
  //obtener las respuestas de un post
  try {
    const { idPost } = req.body;

    const reply = await prisma.respuestapost.findMany({
      where: {
        fkIdPost: idPost,
      },
    });

    res.json(reply);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

exports.deleteReply = async (req, res) => {
  //eliminar una respuesta
  try {
    const { idRespuestaPost } = req.body;

    await prisma.respuestapost.delete({
      where: {
        idRespuestaPost: idRespuestaPost,
      },
    });

    res.json({ message: "Respuesta eliminada", status: 200 });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

exports.editReply = async (req, res) => {
  //editar una respuesta
  try {
    const { idRespuestaPost, descripcionRespuesta } = req.body;

    await prisma.respuestapost.update({
      where: {
        idRespuestaPost: idRespuestaPost,
      },
      data: {
        descripcionRespuesta: descripcionRespuesta,
      },
    });

    res.json({ message: "Respuesta editada", status: 200 });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
