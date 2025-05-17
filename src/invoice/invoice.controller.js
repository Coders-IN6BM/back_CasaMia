import PDFDocument from "pdfkit";
import fs from "fs";
import jwt from "jsonwebtoken";
import Invoice from "../invoice/invoice.model.js";  
import Reservation from "../reservation/reservation.model.js";
import path from "path";
import Hotel from "../hotel/hotel.model.js";
import Room from "../room/room.model.js";


export const generateInvoicePDF = async (req, res) => {
    try {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ message: 'Token not provided' });
  
      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
  
      const { reservationId } = req.params;
      const reservation = await Reservation.findById(reservationId)
        .populate({
          path: 'room',
          populate: { path: 'hotel' }
        })
        .populate('extraServices')
        .populate('user'); 
  
      if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
  
      if (reservation.user._id.toString() !== uid) {
        return res.status(403).json({ message: 'You are not authorized to generate the invoice for this reservation' });
      }
  
      let invoice = await Invoice.findOne({ reservation: reservationId });
  
      let total = 0;
      const dateEntry = new Date(reservation.dateEntry);
      const departureDate = new Date(reservation.departureDate);
      const cantidadDias = Math.ceil((departureDate - dateEntry) / (1000 * 60 * 60 * 24));
  
      const room = reservation.room;
      const hotel = room.hotel;
  
      if (!invoice) {
        const costoHabitacion = room.precio * cantidadDias;
        let costoServiciosExtras = 0;
  
        for (const servicio of reservation.extraServices) {
          costoServiciosExtras += servicio.cost;
        }
  
        total = costoHabitacion + costoServiciosExtras;
  
        invoice = new Invoice({
          reservation: reservation._id,
          total
        });
  
        await invoice.save();
      } else {
        total = invoice.total;
      }
  
      const doc = new PDFDocument({ margin: 50 });
      const pdfPath = path.join('invoices', `factura_${hotel.name}_${reservation.user._id}.pdf`);
      fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
  
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);
  
      doc
        .fontSize(22)
        .text('FACTURA', { align: 'center' })
        .moveDown(0.5);
  
      doc
        .fontSize(16)
        .text(`${hotel.name}`, { align: 'center' })
        .moveDown(1);
  
      doc
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown(1);
  
      doc.fontSize(12).text(`Cliente: ${reservation.user.name} ${reservation.user.surname}`);
      doc.moveDown();
  
      doc.fontSize(12).text(`Número de habitación: ${room.numeroCuarto}`);
      doc.text(`Tipo de habitación: ${room.tipo}`);
      doc.text(`Precio por noche: $${room.precio.toFixed(2)}`);
      doc.text(`Fecha de entrada: ${dateEntry.toLocaleDateString()}`);
      doc.text(`Fecha de salida: ${departureDate.toLocaleDateString()}`);
      doc.text(`Cantidad de días: ${cantidadDias}`);
      doc.moveDown();
  
      if (reservation.extraServices.length > 0) {
        doc.fontSize(13).text('Servicios Extra:', { underline: true }).moveDown(0.5);
        reservation.extraServices.forEach(service => {
          doc
            .fontSize(12)
            .text(`${service.name}`, { continued: true })
            .text(` ............................... $${service.cost.toFixed(2)}`, { align: 'right' });
        });
        doc.moveDown();
      }
  
      doc
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown(1);
  
      doc.fontSize(14).text(`Total a pagar: $${total.toFixed(2)}`, { align: 'right' });
      doc.moveDown();
      doc.fontSize(12).text(`Fecha de emisión: ${new Date(invoice.Date).toLocaleDateString()}`);
  
      doc.end();
  
      writeStream.on('finish', () => {
        res.download(pdfPath, `factura_${hotel.name}_${reservation._id}.pdf`);
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generating invoice', error: error.message });
    }
  };
  

  export const generateInvoiceAdmin = async (req, res) => {
    try {
      const { reservationId } = req.params;
  
      const reservation = await Reservation.findById(reservationId)
        .populate({
          path: 'room',
          populate: { path: 'hotel' }
        })
        .populate('extraServices')
        .populate('user');
  
      if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
  
      let invoice = await Invoice.findOne({ reservation: reservationId });
  
      let total = 0;
      const dateEntry = new Date(reservation.dateEntry);
      const departureDate = new Date(reservation.departureDate);
      const cantidadDias = Math.ceil((departureDate - dateEntry) / (1000 * 60 * 60 * 24));
  
      const room = reservation.room;
      const hotel = room.hotel;
  
      if (!invoice) {
        const costoHabitacion = room.precio * cantidadDias;
        let costoServiciosExtras = 0;
  
        for (const servicio of reservation.extraServices) {
          costoServiciosExtras += servicio.cost;
        }
  
        total = costoHabitacion + costoServiciosExtras;
  
        invoice = new Invoice({
          reservation: reservation._id,
          total
        });
  
        await invoice.save();
      } else {
        total = invoice.total;
      }
  
      const doc = new PDFDocument({ margin: 50 });
      const pdfPath = path.join('invoices', `factura_${hotel.name}_${reservation._id}.pdf`);
      fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
  
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);
  
      doc
        .fontSize(22)
        .text('FACTURA', { align: 'center' })
        .moveDown(0.5);
  
      doc
        .fontSize(16)
        .text(`${hotel.name}`, { align: 'center' })
        .moveDown(1);
  
      doc
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown(1);
  
      doc.fontSize(12).text(`Cliente: ${reservation.user.name} ${reservation.user.surname}`);
      doc.moveDown();
  
      doc.fontSize(12).text(`Número de habitación: ${room.numeroCuarto}`);
      doc.text(`Tipo de habitación: ${room.tipo}`);
      doc.text(`Precio por noche: $${room.precio.toFixed(2)}`);
      doc.text(`Fecha de entrada: ${dateEntry.toLocaleDateString()}`);
      doc.text(`Fecha de salida: ${departureDate.toLocaleDateString()}`);
      doc.text(`Cantidad de días: ${cantidadDias}`);
      doc.moveDown();
  
      if (reservation.extraServices.length > 0) {
        doc.fontSize(13).text('Servicios Extra:', { underline: true }).moveDown(0.5);
        reservation.extraServices.forEach(service => {
          doc
            .fontSize(12)
            .text(`${service.name}`, { continued: true })
            .text(` ............................... $${service.cost.toFixed(2)}`, { align: 'right' });
        });
        doc.moveDown();
      }
  
      doc
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown(1);
  
      doc.fontSize(14).text(`Total a pagar: $${total.toFixed(2)}`, { align: 'right' });
      doc.moveDown();
      doc.fontSize(12).text(`Fecha de emisión: ${new Date(invoice.Date).toLocaleDateString()}`);
  
      doc.end();
  
      writeStream.on('finish', () => {
        res.download(pdfPath, `factura_${hotel.name}_${reservation._id}.pdf`);
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generating invoice', error: error.message });
    }
  };

  export const ListInvoicesByHotelId = async (req, res) => {
    try {
      const { hotelId } = req.params;
  
      const invoices = await Invoice.find()
        .populate({
          path: 'reservation',
          populate: [
            {
              path: 'room',
              populate: {
                path: 'hotel'
              }
            },
            {
              path: 'user',
              select: 'name surname email'
            },
            {
              path: 'extraServices'
            }
          ]
        });
  
      const filteredInvoices = invoices.filter(invoice => {
        const hotel = invoice.reservation?.room?.hotel;
        return hotel && hotel._id.toString() === hotelId;
      });
  
      res.json({ facturas: filteredInvoices });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving hotel invoices', error: error.message });
    }
  };

  export const InvoicesByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const invoices = await Invoice.find()
        .populate({
          path: 'reservation',
          populate: [
            {
              path: 'room',
              populate: { path: 'hotel' }
            },
            {
              path: 'user',
              select: 'name surname email'
            },
            {
              path: 'extraServices'
            }
          ]
        });
  
      const filteredInvoices = invoices.filter(invoice => {
        return invoice.reservation?.user?._id.toString() === userId;
      });
  
      res.json({ facturas: filteredInvoices });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving user invoices', error: error.message });
    }
  };
  

  export const InvoicesForHotelAdmin = async (req, res) => {
    try {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ message: 'Token not provided' });
  
      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
      const { hotelId } = req.params;
  
      const hotel = await Hotel.findOne({ _id: hotelId, admin: uid });
      if (!hotel) return res.status(403).json({ message: 'You are not authorized to view the invoices for this hotel' });
  
      const invoices = await Invoice.find()
        .populate({
          path: 'reservation',
          populate: [
            {
              path: 'room',
              match: { hotel: hotelId },
              populate: { path: 'hotel' }
            },
            {
              path: 'extraServices'
            },
            {
              path: 'user',
              select: 'name surname'
            }
          ]
        });
  
      const filtered = invoices.filter(inv => inv.reservation?.room);
  
      res.json({ facturas: filtered });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error listing hotel invoices', error: error.message });
    }
  };

  export const UserInvoicesForHotelAdmin = async (req, res) => {
    try {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ message: 'Token not provided' });
  
      const { uid: adminUid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
  
      const { userUid } = req.params;
      if (!userUid) return res.status(400).json({ message: 'You must provide the user UID' });
  
      const reservaciones = await Reservation.find({ user: userUid });
      if (!reservaciones.length) {
        return res.status(404).json({ message: 'This user has no reservations' });
      }
  
      const accesibles = [];
  
      for (const reserva of reservaciones) {
        const room = await Room.findById(reserva.room);
        if (!room) continue;
  
        const hotel = await Hotel.findById(room.hotel);
        if (!hotel) continue;
  
        if (String(hotel.admin) === String(adminUid)) {
          accesibles.push(reserva._id); 
        }
      }
  
      if (!accesibles.length) {
        return res.status(403).json({ message: 'You do not have permission to view this user invoices.' });
      }
  
      const facturas = await Invoice.find({ reservation: { $in: accesibles } })
        .populate({
          path: 'reservation',
          populate: [
            { path: 'user', select: 'name surname email' },
            { path: 'room', populate: { path: 'hotel', select: 'name' } },
            { path: 'extraServices' }
          ]
        });
  
      res.json({ facturas });
  
    } catch (error) {
      console.error("Error getting invoices:", error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  