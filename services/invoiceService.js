'use strict';

const Transaction = require('../models/transaction');
const Customer = require('../models/customer');
const Vehicle = require('../models/vehicle');
const Repair = require('../models/repair');
const Service = require('../models/service');
const Part = require('../models/part');
const PDFDocument = require('pdfkit');

const TAX_RATE = 0.08; // 8%

module.exports = {
  /**
   * Build a full invoice data object for a given transaction.
   */
  async generateInvoice(transactionId) {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) throw Object.assign(new Error('Transaction not found'), { status: 404 });

    const customer = await Customer.findById(transaction.customerid);

    let repair = null;
    let vehicle = null;
    let service = null;
    let part = null;

    if (transaction.repairid) {
      repair = await Repair.findById(transaction.repairid);
      if (repair) {
        vehicle = await Vehicle.findById(repair.vehicleid);
        if (repair.partid) {
          part = await Part.findById(repair.partid);
        }
      }
    }

    if (transaction.serviceid) {
      service = await Service.findById(transaction.serviceid);
    }

    const subtotal = Number(transaction.transactionamount);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    return {
      invoicenumber: transaction.invoicenumber,
      created_at: transaction.created_at,
      customer,
      vehicle,
      repair,
      service,
      part,
      subtotal,
      tax,
      total,
      paymentmethod: transaction.paymentmethod,
      routingnumber: transaction.routingnumber,
    };
  },

  /**
   * Stream a PDF invoice to a writable stream (e.g. res).
   */
  async generateInvoicePdf(transactionId, outputStream) {
    const data = await this.generateInvoice(transactionId);
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(outputStream);

    // Header
    doc.fontSize(20).text('Auto Repair Shop — Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice #: ${data.invoicenumber}`);
    doc.text(`Date: ${new Date(data.created_at).toLocaleDateString()}`);
    doc.moveDown();

    // Customer
    if (data.customer) {
      doc.fontSize(14).text('Customer');
      doc.fontSize(12).text(`${data.customer.firstname} ${data.customer.lastname}`);
      doc.text(`${data.customer.streetaddress || ''}, ${data.customer.city || ''} ${data.customer.zipcode || ''}`);
      doc.text(`Phone: ${data.customer.phonenumber || 'N/A'}`);
      doc.text(`Email: ${data.customer.email}`);
      doc.moveDown();
    }

    // Vehicle
    if (data.vehicle) {
      doc.fontSize(14).text('Vehicle');
      doc.fontSize(12).text(`${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model} (${data.vehicle.color})`);
      doc.text(`VIN: ${data.vehicle.vin}`);
      doc.text(`License Plate: ${data.vehicle.licenseplatenumber}`);
      doc.moveDown();
    }

    // Service / Repair line items
    doc.fontSize(14).text('Services / Repairs');
    if (data.service) {
      doc.fontSize(12).text(`Service: ${data.service.servicename}  —  $${data.service.hourlycost}/hr`);
    }
    if (data.part) {
      doc.fontSize(12).text(`Part: ${data.part.partname} (${data.part.vendorname})  —  $${data.part.cost}`);
    }
    doc.moveDown();

    // Totals
    doc.fontSize(12).text(`Subtotal: $${data.subtotal.toFixed(2)}`);
    doc.text(`Tax (${TAX_RATE * 100}%): $${data.tax.toFixed(2)}`);
    doc.fontSize(14).text(`Total: $${data.total.toFixed(2)}`);
    doc.moveDown();

    // Payment
    doc.fontSize(12).text(`Payment Method: ${data.paymentmethod || 'N/A'}`);
    if (data.routingnumber) doc.text(`Routing Number: ${data.routingnumber}`);

    doc.end();
    return data;
  },
};
