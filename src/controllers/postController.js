const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.posts.findMany({
      // Incluir el nombre del usuario que hizo el post, sus respuestas y likes
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
      // Ordenar los posts por fecha de publicación en orden descendente (más reciente primero)
      orderBy: {
        fechaPublicacionPost: "desc",
      },
    });

    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      hasLiked: post.likes.length > 0,
    }));

    res.json(postsWithLikeStatus);
  } catch (error) {
    res.json(error);
  }
};

exports.deletePost = async (req, res) => {
  //eliminar un post
  try {
    const { idPost } = req.body;

    await prisma.posts.delete({
      where: {
        idPost: idPost,
      },
    });

    res.json({ message: "Post eliminado", status: 200 });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

exports.createPost = async (req, res) => {
  try {
    const { idUsuario, descripcionPost } = req.body;

    // Verificar que idUsuario existe
    if (!idUsuario) {
      return res
        .status(400)
        .json({ message: "El campo idUsuario es obligatorio.", status: 400 });
    }

    // Verificar que descripcionPost existe y no está vacío
    if (!descripcionPost || descripcionPost.trim() === "") {
      return res.status(400).json({
        message: "El campo descripcionPost es obligatorio.",
        status: 400,
      });
    }

    // Verificar si el usuario con idUsuario existe
    const usuarioExistente = await prisma.usuarios.findUnique({
      where: {
        idUsuario: idUsuario,
      },
    });

    if (!usuarioExistente) {
      return res.status(404).json({
        message: "El usuario con el id proporcionado no existe.",
        status: 404,
      });
    }

    // Crear el post si todas las validaciones son exitosas
    await prisma.posts.create({
      data: {
        fkIdUsuario: idUsuario,
        descripcionPost: descripcionPost,
      },
    });

    res.status(200).json({ message: "Post creado", status: 200 });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", status: 500 });
  }
};

exports.editPost = async (req, res) => {
  try {
    const { idPost, descripcionPost } = req.body;

    // Verificar que idPost existe
    if (!idPost) {
      return res
        .status(400)
        .json({ message: "El campo idPost es obligatorio.", status: 400 });
    }

    // Verificar que descripcionPost existe y no está vacío
    if (!descripcionPost || descripcionPost.trim() === "") {
      return res.status(400).json({
        message: "El campo descripcionPost es obligatorio.",
        status: 400,
      });
    }

    // Verificar si el post con idPost existe
    const postExistente = await prisma.posts.findUnique({
      where: {
        idPost: idPost,
      },
    });

    if (!postExistente) {
      return res.status(404).json({
        message: "El post con el id proporcionado no existe.",
        status: 404,
      });
    }

    // Actualizar el post si todas las validaciones son exitosas
    await prisma.posts.update({
      where: {
        idPost: idPost,
      },
      data: {
        descripcionPost: descripcionPost,
      },
    });

    res.status(200).json({ message: "Post actualizado", status: 200 });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", status: 500 });
  }
};
