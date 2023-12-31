const PDFDocument = require('pdfkit');

const generateSalesReport = (orders, res) => {
    const doc = new PDFDocument();
    doc.text('Sales Report', { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();
    let orderCounter = 0;
    orders.forEach((order) => {
        doc.text(`Order ID: ORD${String(order._id.toString()).padStart(5, '0')}`, { fontSize: 12 });
        doc.text(`Customer Name: ${order.user.name ? order.user.name : 'N/A'}`, { fontSize: 12 });

        const totalPrice = order.products.reduce((sum, product) => sum + product.total, 0);

        doc.text(`Price: ₹${totalPrice}`, { fontSize: 12 });
        doc.text(`Status: ${order.status}`, { fontSize: 12 });
        doc.text(`Date: ${order.createdAt ? order.createdAt.toLocaleDateString() : 'N/A'}`, { fontSize: 12 });
        doc.moveDown();
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="sales_report.pdf"');
    doc.pipe(res);
    doc.end();
};


const generateInvoicePdf = (orderDetails, res) => {
    const doc = new PDFDocument();
    doc.text('Order Invoice', { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();

    doc.text(`Order ID: ORD${String(orderDetails._id.toString()).padStart(5, '0')}`, { fontSize: 12 });
    doc.text(`Customer Name: ${orderDetails.user.name ? orderDetails.user.name : 'N/A'}`, { fontSize: 12 });

    orderDetails.products.forEach((item) => {
        doc.text(`Product: ${item.product.title}`, { fontSize: 12 });
        doc.text(`Quantity: ${item.quantity}`, { fontSize: 12 });
        doc.text(`Price: ₹${item.total}`, { fontSize: 12 });
        doc.text(`Status: ${item.status}`, { fontSize: 12 });
        doc.moveDown();
    });

    const totalPrice = orderDetails.products.reduce((sum, product) => sum + product.total, 0);
    doc.text(`Order Total: ₹${totalPrice}`, { fontSize: 12 });
    // const productStatus = orderDetails.products.map(item => item.status).join(', ');
    // doc.text(`Status: ${productStatus}`, { fontSize: 12 });
    doc.text(`Address: ${orderDetails.address.address}`, { fontSize: 12 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="order_invoice.pdf"');
    doc.pipe(res);
    doc.end();
};


module.exports ={
    generateSalesReport,
    generateInvoicePdf
};
