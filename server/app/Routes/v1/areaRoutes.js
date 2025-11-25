const areaRouter = require("express").Router();
const { getAllAreas } = require("../../Controllers/serviceAreaController");


//get all service areas for register form
areaRouter.get("/all", getAllAreas); 





module.exports = areaRouter;