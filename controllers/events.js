const { respose } = require("express");
const Evento = require("../models/Evento");

const getEventos = async (req, res = response) => {
  try {
    const eventos = await Evento.find().populate("user", "name");

    return res.status(200).json({
      ok: true,
      eventos,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "Error al recuperar los eventos",
    });
  }
};

const createEvento = async (req, res = response) => {
  const evento = new Evento(req.body);
  try {
    evento.user = req.uid;
    const eventoDB = await evento.save();

    return res.status(200).json({
      ok: true,
      evento: eventoDB,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error. Contacte con el administrador.",
    });
  }
};

const updateEvento = async (req, res = response) => {
  console.log("update evento");
  const { id } = req.params;
  const { uid } = req;

  try {
    const evento = await Evento.findById(id);
    console.log(evento);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "El evento no existe",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios de edicion",
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    const eventoActualizado = await Evento.findByIdAndUpdate(id, nuevoEvento, {
      new: true,
    });

    return res.status(200).json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const deleteEvento = async (req, res = response) => {
  const { id } = req.params;
  const { uid } = req;

  try {
    const evento = await Evento.findById(id);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "El evento no existe",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios de eliminación",
      });
    }

    const { deletedCount } = await Evento.deleteOne(evento);

    if (deletedCount > 0) {
      return res.status(200).json({
        ok: true,
        removed: deletedCount,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getEventos,
  createEvento,
  updateEvento,
  deleteEvento,
};
