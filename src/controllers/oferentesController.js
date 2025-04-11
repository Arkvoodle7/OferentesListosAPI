const pool = require('../config/db');
const moment = require('moment'); // opcional, para calcular edades con mas precision

exports.getOferentesListos = (req, res) => {
  const idPuesto = req.params.id; // /api/v1/oferentesListos/:id

  // 1) obtener requisitos del puesto
  const reqQuery = 'SELECT * FROM requisito WHERE IdPuesto = ?';

  pool.query(reqQuery, [idPuesto], (errorReq, requisitos) => {
    if (errorReq) {
      console.error('Error al consultar requisitos:', errorReq);
      return res.status(500).json({ message: 'Error consultando requisitos' });
    }

    // 2) obtener todos los oferentes
    const ofQuery = 'SELECT * FROM oferente';
    pool.query(ofQuery, (errorOf, oferentes) => {
      if (errorOf) {
        console.error('Error al consultar oferentes:', errorOf);
        return res.status(500).json({ message: 'Error consultando oferentes' });
      }

      // filtramos la lista de oferentes
      const oferentesFiltrados = oferentes.filter((o) => {
        // cada oferente debe cumplir TODOS los requisitos
        return requisitos.every((r) => cumpleRequisito(o, r));
      });

      // devolvemos solo los datos solicitados: nombre e identificacion
      const resultado = oferentesFiltrados.map(of => ({
        nombre: of.Nombre,
        identificacion: of.Identificacion
      }));

      return res.json(resultado);
    });
  });
};

// funcion auxiliar que verifica si un oferente "o" cumple un requisito "r"
function cumpleRequisito(o, r) {
  /*
   Ejemplos de r.Descripcion que se usaron:
   - "Mayor de 18 anios" => calculamos edad
   - "Nacionalidad costarricense" => o.Nacionalidad === 'costarricense'
   - "El distrito debe iniciar con 3" => o.IdDistrito comienza con '3'
   - "Mayor de 21 anios", etc.
  */
  const desc = r.Descripcion.toLowerCase();

  // ejemplo: mayor de 18 anios
  if (desc.includes('mayor de 18')) {
    return calcularEdad(o.FechaNacimiento) >= 18;
  }

  // ejemplo: mayor de 21 anios
  if (desc.includes('mayor de 21')) {
    return calcularEdad(o.FechaNacimiento) >= 21;
  }

  // nacionalidad costarricense
  if (desc.includes('costarricense')) {
    return o.Nacionalidad && o.Nacionalidad.toLowerCase() === 'costarricense';
  }

  // nacionalidad mexicana
  if (desc.includes('mexicana')) {
    return o.Nacionalidad && o.Nacionalidad.toLowerCase() === 'mexicana';
  }

  // el distrito debe iniciar con 3
  if (desc.includes('distrito debe iniciar con 3')) {
    return o.IdDistrito && o.IdDistrito.toString().startsWith('3');
  }

  // el distrito debe iniciar con 4
  if (desc.includes('distrito debe iniciar con 4')) {
    return o.IdDistrito && o.IdDistrito.toString().startsWith('4');
  }

  // si no reconocemos la descripcion del requisito, por defecto devolvemos true
  // o false, segun prefieras. Lo logico seria false, pues no se cumple un
  // requisito desconocido.
  return false;
}

// funcion para calcular edad basado en FechaNacimiento (YYYY-MM-DD)
function calcularEdad(fechaNac) {
  if (!fechaNac) return 0; // si no tiene fecha, no cumple

  // opcional: usando moment
  const hoy = moment();
  const fn = moment(fechaNac, 'YYYY-MM-DD');
  return hoy.diff(fn, 'years');
}
