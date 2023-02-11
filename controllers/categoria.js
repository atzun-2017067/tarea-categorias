const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Categoria = require('../models/categoria');


const getCategoria = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaCategoria = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Categoria',
        listaCategoria
    });

}

const postCategoria = async (req = request, res = response) => {

    //Desestructuración
    const { nombre, descripcion } = req.body;
    const categoriaDB = new Categoria({ nombre, descripcion });

    //Encriptar password
    /*const salt = bcrypt.genSaltSync();
    categoriaDB.password = bcrypt.hashSync(password, salt);*/

    //Guardar en BD
    await categoriaDB.save();

    res.json({
        msg: 'Post Api - Post Categoria',
        categoriaDB
    });

}


const putCategoria = async (req = request, res = response) => {

    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;
    const { _id, img, rol, estado, google, ...resto } = req.body;
    //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)

    //Si la password existe o viene en el req.body, la encripta
    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    //Editar al usuario por el id
    const categoriaEditado = await Categoria.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT editar categoria',
        categoriaEditado
    });

}

const deleteCategoria = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;

    //Eliminar fisicamente de la DB
    const categoriaEliminado = await Categoria.findByIdAndDelete( id);

    //Eliminar cambiando el estado a false
    //const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'DELETE eliminar categoria',
        categoriaEliminado
    });
}

module.exports = {
    getCategoria,
    postCategoria,
    putCategoria,
    deleteCategoria
}


// CONTROLADOR