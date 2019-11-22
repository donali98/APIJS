const User = require("../models/User");
var debug = require("debug")("controller:a");

// Search a one user y database
const getOne = (req, res, next) => {
  debug("Search User", req.params);
  User.findOne(
    {
      username: req.params.username
    },
    "-password -login_count"
  )
    .then(foundUser => {
      if (foundUser) return res.status(200).json(foundUser);
      else return res.status(404).json({ message: "No hay registros" });
    })
    .catch(err => {
      //   return res.status(500).json({ message: "Ha ocurrido un error" });
      next(err);
    });
};

const getAll = (req, res, next) => {
  var perPage = Number(req.query.size) || 10,
    page = req.query.page > 0 ? req.query.page : 0;

  var sortProperty = req.query.sortby || "createdAt",
    sort = req.query.sort || "desc";

  //   debug("Usert List", { size: perPage, page, sortby: sortProperty, sort });

  User.find({}, "-password -login_count")
    .limit(perPage)
    .skip(perPage * page)
    .sort({ [sortProperty]: sort })
    .then(users => {
      return res.status(200).json(users);
    })
    .catch(err => {
      next(err);
    });
};

const insert = (req, res, next) => {
  debug("New User", {
    body: req.body
  });
  //Buscar usuario en la base para validar si existe o no
  User.findOne(
    {
      username: req.body.username
    },
    "-password, -login_count"
  )
    .then(userFound => {
      if (userFound) {
        // a("Usuario duplicado");
        return res.json({ error: "Usuario ya existe" });
        // throw new Error(`Usuario duplicado ${req.body.username}`);
      } else {
        let newUser = new User({
          username: req.body.username,
          first_name: req.body.firts_name || "",
          last_name: req.body.last_name || "",
          email: req.body.email,
          password:
            req.body.password /*TODO: Modificar, hacer hash del password*/
        });
        return newUser.save();
      }
    })

    .then(user => {
      return res
        .header("Location", "/users/" + user._id)
        .status(201)
        .json({
          username: user.username
        });
    })
    .catch(err => {
      //   return res
      //     .status(400)
      //     .json({ error: "Ha ocurrido un error al insertar" });
      next(err);
    });
};

const update = (req, res, next) => {
  console.log(req);

  let update = {
    ...req.body
  };

  User.findOneAndUpdate(
    {
      username: req.params.username
    },
    update,
    {
      new: true
    }
  )
    .then(updated => {
      if (updated) return res.status(200).json(updated);
      else return res.status(400).json(null);
    })
    .catch(err => {
      next(err);
    });
};

module.exports = {
  insert,
  getOne,
  getAll,
  update
};
