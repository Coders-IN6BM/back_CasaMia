import { Router } from "express";
import { searchHotel, deleteHotel, searchHotelsAdmin, updateHotel, registerHotel, obtenerEstadisticasHotel, obtenerEstadisticasPorHotelId } from "./hotel.controller.js";
import { searchHotelValidator, registerHotelValidator, updateHotelValidator, searchHotelManagerValidator, delteHotelValidator, estadisticasHotelValidator, estadisticasHotelAdminValidator } from "../middlewares/hotel-validators.js";

const router = Router();

router.get("/searchHotel", searchHotelValidator, searchHotel);

router.get("/searchHotelsAdmin", searchHotelManagerValidator, searchHotelsAdmin);

router.post("/registerHotel", registerHotelValidator, registerHotel);

router.put("/updateHotel/:id", updateHotelValidator, updateHotel);

router.delete("/deleteHotel/:id", delteHotelValidator, deleteHotel);

router.get('/statisticsManager', estadisticasHotelValidator, obtenerEstadisticasHotel);

router.get('/statisticsHotel/:id', estadisticasHotelAdminValidator, obtenerEstadisticasPorHotelId);

export default router;