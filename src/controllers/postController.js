const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllPosts = async (req, res) => {
  try {
    //metodo para mostrar los posts con sus respuestas y likes
    const posts = await prisma.posts.findMany({
      //incluir el nombre del usuario que hizo el post, sus respuestas y likes
      include: {
        usuarios: {
          select: {
            nombreUsuario: true,
          },
        },
        respuestapost: {
          select: {
            idRespuestaPost: true,
            descripcionRespuesta: true,
            usuarios: {
              select: {
                nombreUsuario: true,
              },
            },
          },
        },
        likes: {
          select: {
            idLike: true,
            usuarios: {
              select: {
                nombreUsuario: true,
              },
            },
          },
        },
      },
    });

    posts ? res.json(posts) : res.json({ message: "Sin posts", status: 404 });
  } catch (error) {
    res.json(error);
  }
};
