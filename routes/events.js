/* 
    Rutas de eventos / Events
    host + /api/events
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  getEventos,
  createEvento,
  updateEvento,
  deleteEvento,
} = require("../controllers/events");
const { validarJwt } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");

const router = Router();
router.use(validarJwt);

router.get("/", getEventos);

router.post("/", [
  check('title', 'El título es obligatorio').not().isEmpty(),
  check('start', 'Fecha de inicio es obligatoria').custom(isDate),
  //check('start', 'Fecha de inicio es obligatoria').custom(isDate),
  check('end', 'Fecha de finalización es obligatoria').custom(isDate),
  validarCampos
],
createEvento);
router.put("/:id", updateEvento);

router.delete("/:id", deleteEvento);

module.exports = router;
