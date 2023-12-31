const ExcelJS = require('exceljs');

const generateExcel = (orders, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Report');

    worksheet.addRow(['Order ID', 'Customer Name', 'Price', 'Status', 'Date']);

    orders.forEach((order) => {
        if (order.products && Array.isArray(order.products) && order.products.length > 0) {
            order.products.forEach((product) => {
                worksheet.addRow([
                    `ORD${String(order._id.toString().slice(-4)).padStart(5, '0')}`,
                    order.user.name || 'N/A',
                    product.total,
                    order.status,
                    order.createdAt ? order.createdAt.toLocaleDateString() : 'N/A',
                ]);
            });
        }
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="sales_report.xlsx"');

    workbook.xlsx.write(res).then(() => {
        res.end();
    });
};

module.exports = generateExcel;
