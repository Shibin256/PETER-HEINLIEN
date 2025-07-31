import Order from "../../model/orderModel.js";
import ExcelJS from "exceljs";
import PDFDocument from 'pdfkit';


export const getSalesReport = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        console.log(startDate)
        console.log(type)

        let matchQuery = { Status: { $nin: ['Cancelled', 'Returned'] } }; // Exclude Cancelled & Returned

        const now = new Date();
        if (startDate && endDate) {
            matchQuery.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else {
            const baseDate = startDate ? new Date(startDate) : now;
            console.log(type, "hii")
            if (type === "Daily") {
                const start = new Date(baseDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(baseDate);
                end.setHours(23, 59, 59, 999);
                matchQuery.createdAt = { $gte: start, $lte: end };
            } else if (type === "Weekly") {
                const end = new Date(baseDate);
                end.setHours(23, 59, 59, 999);
                const start = new Date(baseDate);
                start.setDate(start.getDate() - 6);
                start.setHours(0, 0, 0, 0);
                matchQuery.createdAt = { $gte: start, $lte: end };
            } else if (type === "Monthly") {
                const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
                const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
                end.setHours(23, 59, 59, 999);
                matchQuery.createdAt = { $gte: start, $lte: end };
            } else if (type === "Yearly") {
                const start = new Date(baseDate.getFullYear(), 0, 1);
                const end = new Date(baseDate.getFullYear(), 11, 31);
                end.setHours(23, 59, 59, 999);
                matchQuery.createdAt = { $gte: start, $lte: end };
            }
        }


        const orders = await Order.find(matchQuery).select('-createdAt -updatedAt');

        const totalSales = orders.reduce((sum, order) => sum + order.TotalAmount, 0);

        const totalDiscount = orders.reduce((acc, order) => {
            const sumSubTotals = order.Items.reduce((sum, item) => sum + item.subTotal, 0);
            const delivery = Number(order.DeliveryCharge) || 0;
            const discount = (sumSubTotals + delivery) - order.TotalAmount;
            return acc + (discount > 0 ? discount : 0);
        }, 0);

        const avgOrderValue = orders.length ? totalSales / orders.length : 0;

        res.status(200).json({
            totalOrders: orders.length,
            totalSales,
            totalDiscount,
            avgOrderValue,
            orders,
        });
    } catch (error) {
        console.error("Error fetching sales report:", error);
        res.status(500).json({ message: "Error fetching sales report" });
    }
};

const getSalesReportCall = async (type, startDate, endDate) => {
    try {

        let matchQuery = { Status: { $nin: ['Cancelled', 'Returned'] } }; // Exclude Cancelled & Returned

        const now = new Date();
        if (startDate && endDate) {
            matchQuery.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else {
            const baseDate = startDate ? new Date(startDate) : now;
            console.log(type, "hii")
            if (type === "Daily") {
                const start = new Date(baseDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(baseDate);
                end.setHours(23, 59, 59, 999);
                matchQuery.createdAt = { $gte: start, $lte: end };
            } else if (type === "Weekly") {
                const end = new Date(baseDate);
                end.setHours(23, 59, 59, 999);
                const start = new Date(baseDate);
                start.setDate(start.getDate() - 6);
                start.setHours(0, 0, 0, 0);
                matchQuery.createdAt = { $gte: start, $lte: end };
            } else if (type === "Monthly") {
                const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
                const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
                end.setHours(23, 59, 59, 999);
                matchQuery.createdAt = { $gte: start, $lte: end };
            } else if (type === "Yearly") {
                const start = new Date(baseDate.getFullYear(), 0, 1);
                const end = new Date(baseDate.getFullYear(), 11, 31);
                end.setHours(23, 59, 59, 999);
                matchQuery.createdAt = { $gte: start, $lte: end };
            }
        }

        return await Order.find(matchQuery).select('-createdAt -updatedAt');

    } catch (error) {
        console.error("Error fetching sales report:", error);
        res.status(500).json({ message: "Error fetching sales report" });
    }
};

export const exelReport = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        console.log(type)
        const orders = await getSalesReportCall(type, startDate, endDate);
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Sales Report");

        sheet.columns = [
            { header: "Order ID", key: "orderId", width: 20 },
            { header: "Date", key: "createdAt", width: 20 },
            { header: "Total Amount", key: "TotalAmount", width: 20 },
            { header: "Payment Method", key: "PaymentMethod", width: 20 },
            { header: "Status", key: "Status", width: 15 },
        ];

        orders.forEach(order => {
            sheet.addRow({
                orderId: order.orderId,
                createdAt: new Date(order.createdAt).toLocaleDateString(),
                TotalAmount: order.TotalAmount,
                PaymentMethod: order.PaymentMethod,
                Status: order.Status
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="sales_report.xlsx"');
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Error generating Excel:", error);
        res.status(500).json({ message: "Error generating Excel" });
    }
}



export const downloadSalesReportPDF = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        console.log(type)
        const orders = await getSalesReportCall(type, startDate, endDate);
        console.log(orders,'------')
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="sales_report.pdf"');
        doc.pipe(res);

        // Title
        doc.fontSize(22).font('Helvetica-Bold').text('Sales Report', { align: 'center' });
        doc.moveDown();

        // Date range
        doc.fontSize(12).font('Helvetica').text(
            `Report Period: ${startDate || 'N/A'} - ${endDate || 'N/A'}`
        );
        doc.moveDown(1);

        // Table headers
        doc.font('Helvetica-Bold');
        doc.text('Order ID', 50, doc.y, { continued: true });
        doc.text('Date', 150, doc.y, { continued: true });
        doc.text('Customer', 250, doc.y, { continued: true });
        doc.text('Amount', 380, doc.y, { continued: true });
        doc.text('Status', 460);
        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

        // Table rows
        doc.font('Helvetica');
        orders.forEach(order => {
            doc.text(order.orderId, 50, doc.y, { continued: true });
            doc.text(new Date(order.createdAt).toLocaleDateString(), 100, doc.y, { continued: true });
            doc.text(order.Order_Address.name || 'N/A', 200, doc.y, { continued: true });
            doc.text(`Rs.${order.TotalAmount}`, 300, doc.y, { continued: true });
            doc.text(order.Status, 460);
        });

        doc.moveDown(2);
        doc.fontSize(10).font('Helvetica-Oblique').text('Generated by Admin Dashboard', { align: 'center' });
        doc.end();
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: "Error generating PDF report" });
    }
};