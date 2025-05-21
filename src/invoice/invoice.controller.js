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
    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

    const { reservationId } = req.params;
    const reservation = await Reservation.findById(reservationId)
      .populate({
        path: 'room',
        populate: { path: 'hotel' }
      })
      .populate('extraServices')
      .populate('user'); 

    if (!reservation) return res.status(404).json({ message: 'Reservación no encontrada' });

    if (reservation.user._id.toString() !== uid) {
      return res.status(403).json({ message: 'No tienes permiso para generar la factura de esta reservación' });
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

    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4',
      info: {
        Title: `Factura ${hotel.name}`,
        Author: hotel.name,
        Creator: 'Sistema de Reservas'
      }
    });
    
    const pdfPath = path.join('invoices', `factura_${hotel.name}_${reservation.user._id}.pdf`);
    fs.mkdirSync(path.dirname(pdfPath), { recursive: true });

    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc
      .fillColor('#2c3e50')
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('FACTURA', { align: 'center' })
      .moveDown(0.5);

    doc
      .fillColor('#3498db')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(hotel.name.toUpperCase(), { align: 'center' })
      .fillColor('#7f8c8d')
      .fontSize(10)
      .font('Helvetica')
      .text(hotel.address || 'Dirección no especificada', { align: 'center' })
      .text(`Teléfono: 12345678 | Email: lux@gmail.com`, { align: 'center' })
      .moveDown(1);

    doc
      .strokeColor('#3498db')
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke()
      .moveDown(1);

    doc
      .fillColor('#2c3e50')
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(`N° Factura: ${invoice._id.toString().slice(-8).toUpperCase()}`, { align: 'right' })
      .moveDown(1);

    doc
      .fillColor('#3498db')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('DATOS DEL CLIENTE', { underline: true })
      .moveDown(0.5);

    doc
      .fillColor('#2c3e50')
      .fontSize(12)
      .font('Helvetica')
      .text(`Nombre: ${reservation.user.name} ${reservation.user.surname}`)
      .text(`Email: ${reservation.user.email}`)
      .text(`Documento: ${reservation.user.document || 'No especificado'}`)
      .moveDown(1);

    doc
      .fillColor('#3498db')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('DETALLES DE LA RESERVA', { underline: true })
      .moveDown(0.5);

    doc
      .fillColor('#2c3e50')
      .fontSize(12)
      .font('Helvetica')
      .text(`Hotel: ${hotel.name}`)
      .text(`Número de habitación: ${room.numeroCuarto}`)
      .text(`Tipo de habitación: ${room.tipo}`)
      .text(`Precio por noche: $${room.precio.toFixed(2)}`)
      .text(`Fecha de entrada: ${dateEntry.toLocaleDateString()}`)
      .text(`Fecha de salida: ${departureDate.toLocaleDateString()}`)
      .text(`Cantidad de días: ${cantidadDias}`)
      .moveDown(1);

    if (reservation.extraServices.length > 0) {
      doc
        .fillColor('#3498db')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('SERVICIOS ADICIONALES', { underline: true })
        .moveDown(0.5);

      doc
        .fillColor('#ffffff')
        .rect(50, doc.y, 500, 20)
        .fill('#3498db')
        .fillColor('#ffffff')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Descripción', 50, doc.y, { width: 350 })
        .text('Precio', 400, doc.y, { width: 150, align: 'right' })
        .moveDown(1.5);

      reservation.extraServices.forEach((service, index) => {
        const y = doc.y;
        const fillColor = index % 2 === 0 ? '#f8f9fa' : '#ffffff';
        
        doc
          .fillColor('#2c3e50')
          .rect(50, y, 500, 20)
          .fill(fillColor)
          .fontSize(11)
          .font('Helvetica')
          .text(service.name, 55, y + 5, { width: 345 })
          .text(`$${service.cost.toFixed(2)}`, 400, y + 5, { width: 150, align: 'right' });
        
        doc.y += 20;
      });
      
      doc.moveDown(1);
    }

    doc
      .fillColor('#2c3e50')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(`Total:`, { continued: true, align: 'center-right' })
      .fillColor('#e74c3c')
      .text(` $${total.toFixed(2)}`, { align: 'right' })
      .moveDown(3);

    doc
      .fillColor('#7f8c8d')
      .fontSize(10)
      .text(`Fecha de emisión: ${new Date(invoice.Date).toLocaleDateString()}`, { align: 'center' })
      .moveDown(0.5)
      .text('Gracias por su preferencia', { align: 'center' })
      .moveDown(0.5)
      .text('Para cualquier consulta, contacte a nuestro servicio al cliente', { align: 'center' });

    doc
      .strokeColor('#3498db')
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.end();

    writeStream.on('finish', () => {
      res.download(pdfPath, `factura_${hotel.name}_${reservation._id}.pdf`);
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar la factura', error: error.message });
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
  
    if (!reservation) return res.status(404).json({ message: 'Reservación no encontrada' });
  
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
          eservation: reservation._id,
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
      res.status(500).json({ message: 'Error al generar la factura', error: error.message });
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
      res.status(500).json({ message: 'Error al obtener las facturas del hotel', error: error.message });
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
      res.status(500).json({ message: 'Error al obtener las facturas del usuario', error: error.message });
    }
  };
  

  export const InvoicesForHotelAdmin = async (req, res) => {
    try {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ message: 'Token no proporcionado' });
  
      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
      const { hotelId } = req.params;
  
      const hotel = await Hotel.findOne({ _id: hotelId, admin: uid });
      if (!hotel) return res.status(403).json({ message: 'No tienes permiso para ver las facturas de este hotel' });
  
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
      res.status(500).json({ message: 'Error al listar facturas del hotel', error: error.message });
    }
  };

  export const UserInvoicesForHotelAdmin = async (req, res) => {
    try {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ message: 'Token no proporcionado' });
  
      const { uid: adminUid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
  
      const { userUid } = req.params;
      if (!userUid) return res.status(400).json({ message: 'Debe proporcionar el uid del usuario' });
  
      const reservaciones = await Reservation.find({ user: userUid });
      if (!reservaciones.length) {
        return res.status(404).json({ message: 'Este usuario no tiene reservaciones' });
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
        return res.status(403).json({ message: 'No tienes permiso para ver las facturas de este usuario' });
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
      console.error("Error al obtener facturas:", error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  };

  