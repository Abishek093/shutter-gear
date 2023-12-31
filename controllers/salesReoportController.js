const Order = require('../models/Order')
const Product = require('../models/productModel')
const Category = require('../controllers/categoryController')
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const generatePdf = require('../helper/pdfGenerator');
const generateExcel = require('../helper/excelGenerator');

// const generatePdf = (orders, res) => {
//     const doc = new PDFDocument();
//     // Customize your PDF content here based on the sales report data
//     doc.text('Sales Report', { align: 'center' });
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
//     doc.moveDown();
//     let orderCounter = 0;
//     // Add your sales data to the PDF
//     orders.forEach((order) => {
//       doc.text(`Order ID: ORD${String(order._id.toString().slice(-4)).padStart(5, '0')}`, { fontSize: 12 });
//       doc.text(`Customer Name: ${order.user.name ? order.user.name : 'N/A'}`, { fontSize: 12 });
  
//       // Calculate total price for all products in the order
//       const totalPrice = order.products.reduce((sum, product) => sum + product.total, 0);
  
//       doc.text(`Price: ${totalPrice}`, { fontSize: 12 });
//       doc.text(`Status: ${order.status}`, { fontSize: 12 });
//       doc.text(`Date: ${order.createdAt ? order.createdAt.toLocaleDateString() : 'N/A'}`, { fontSize: 12 });
//       doc.moveDown(); // Add spacing between entries
//     });
  
//     // Set the response headers for PDF download
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename="sales_report.pdf"');
//     // Pipe the PDF content to the response stream
//     doc.pipe(res);
//     doc.end();
//   };



//   const generateExcel = (orders, res) => {
//     // Create a new Excel workbook and worksheet
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Sales Report');
  
//     // Add headers to the worksheet
//     worksheet.addRow(['Order ID', 'Customer Name', 'Price', 'Status', 'Date']);
  
//     // Add data to the worksheet
//     orders.forEach((order) => {
//       // Ensure that 'order.products' is an array and has elements before attempting to iterate
//       if (order.products && Array.isArray(order.products) && order.products.length > 0) {
//         order.products.forEach((product) => {
//           worksheet.addRow([
//             `ORD${String(order._id.toString().slice(-4)).padStart(5, '0')}`,
//             order.user.name || 'N/A',
//             product.total,
//             order.status,
//             order.createdAt ? order.createdAt.toLocaleDateString() : 'N/A',
//           ]);
//         });
//       }
//     });
  
//     // Set the response headers for Excel download
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename="sales_report.xlsx"');
  
//     // Pipe the Excel content to the response stream
//     workbook.xlsx.write(res).then(() => {
//       res.end();
//     });
// };



const loadReport = async (req, res) => {
    try {
        const reportOrder = req.query.report;
        const selectedPaymentMethod = req.query.paymentMethod; 

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let filter = {
          $or: [
            { products: { $elemMatch: { status: "Delivered" } } },
            { paymentMethod: "Razorpay" }
          ]
        };
        
                
        if (reportOrder === "Daily") {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            filter.createdAt = {
                $gte: today,
                $lt: tomorrow,
            };
        } else if (reportOrder === "Monthly") {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);

            filter.createdAt = {
                $gte: startOfMonth,
                $lt: endOfMonth,
            };
        } else if (reportOrder === "Yearly") {
            const startOfYear = new Date(today.getFullYear(), 0, 1);
            const endOfYear = new Date(today.getFullYear() + 1, 0, 1);
            endOfYear.setHours(0, 0, 0, 0);

            filter.createdAt = {
                $gte: startOfYear,
                $lt: endOfYear,
            };
        }

        if (selectedPaymentMethod && selectedPaymentMethod !== "All") {
            filter.paymentMethod = selectedPaymentMethod;
        }

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .populate('user')
            .populate('address')
            .populate('products.product');

        const totalRevenue = orders.reduce((sum, order) => sum + order.grandTotal, 0);
        const totalSales = orders.length;
        const totalProductsSold = orders.reduce((sum, order) => sum + order.products.length, 0);

        // res.render('reports', { orders, reportOrder, totalRevenue, totalSales, totalProductsSold });

    if (req.query.downloadPdf) {
      generatePdf.generateSalesReport(orders, res);
    } else if (req.query.downloadExcel) {
      generateExcel(orders, res);
    } else {
      res.render('reports', { orders, reportOrder, totalRevenue, totalSales, totalProductsSold });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
};


const downloadPdf = async (req, res) => {
    try {
       
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');
        doc.pipe(res);
  
        doc.text('Sales Report', { align: 'center', underline: true });  
        doc.end();
  
        generatePdf(orders, res);
    } catch (error) {
      console.log('Error occurred in downloadPdf route:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };


  const downloadExcel = async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      let filter = { status: 'Delivered' };
  
      const orders = await Order.find(filter)
        .populate('user')
        .populate('address')
        .populate('products.product');
  
      generateExcel(orders, res);
    } catch (error) {
      console.log('Error occurred in downloadExcel route:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };

module.exports={
    loadReport,
    downloadPdf,
    downloadExcel
}