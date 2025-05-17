import { Router } from "express";
import { AllRoomsByHotel, registerRoom, deleteAdminRoom, updateRoomAdmin, createRoomManager, deleteRoomManager, updateRoomManager } from "./room.controller.js";
import { searchRoomValidator,registerValidator, RoomAdminValidator,updateRoomValidator } from "../middlewares/room-validators.js";

const router = Router();



router.get("/available/:idHotel?", searchRoomValidator, AllRoomsByHotel);


router.post('/registerAdmin', RoomAdminValidator, registerRoom);

router.delete('/admin/:roomId', RoomAdminValidator, deleteAdminRoom);


router.put('/adminUpdate/:roomId', RoomAdminValidator, updateRoomAdmin);


router.post('/registerManager', registerValidator, createRoomManager);


router.delete('/manager/:roomId', updateRoomValidator, deleteRoomManager);

router.put('/managerUpdate/:roomId', updateRoomValidator, updateRoomManager);

export default router;