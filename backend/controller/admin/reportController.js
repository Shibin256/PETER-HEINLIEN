import Order from "../../model/orderModel.js";
import ExcelJS from "exceljs";
import PDFDocument from 'pdfkit';
import Product from "../../model/productModel.js";
import { statusCode } from "../../utils/statusCode.js";


export const getSalesReport = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;

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

        res.status(statusCode.OK).json({
            totalOrders: orders.length,
            totalSales,
            totalDiscount,
            avgOrderValue,
            orders,
        });
    } catch (error) {
        console.error("Error fetching sales report:", error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "Error fetching sales report" });
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

        return await Order.find(matchQuery).select('-updatedAt');

    } catch (error) {
        console.log(error)
    }
};

export const exelReport = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        console.log(type)
        const orders = await getSalesReportCall(type, startDate, endDate);
        console.log(orders,'--------')
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
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "Error generating Excel" });
    }
}



export const downloadSalesReportPDF = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        console.log(type)
        const orders = await getSalesReportCall(type, startDate, endDate);
        console.log(orders, '------')
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
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "Error generating PDF report" });
    }
};



// export const getBestSellers = async (req, res) => {
//     const orders = await Order.find()
//     const productMap = {}
//     const categoryMap = {};
//     const brandMap = {};
//     const limit=10;
//     console.log(orders, '---best sellers')

//     orders.forEach(order => {
//         order.Items.forEach(item => {
//             const key = item.productId;
//             if (!productMap[key]) {
//                 productMap[key] = {
//                     name: item.productName,
//                     quantity: 0,
//                     revenue: 0
//                 };
//             }

//             productMap[key].quantity += item.quantity;
//             productMap[key].revenue += item.subTotal;


//             // --- Categories ---
//             if (item.categoryName) {  // Ensure category is present
//                 if (!categoryMap[item.categoryId]) {
//                     categoryMap[item.categoryId] = {
//                         name: item.categoryName,
//                         quantity: 0,
//                         revenue: 0
//                     };
//                 }
//                 categoryMap[item.categoryId].quantity += item.quantity;
//                 categoryMap[item.categoryId].revenue += item.subTotal;
//             }

//             // --- Brands ---
//             if (item.brandName) {  // Ensure brand is present
//                 if (!brandMap[item.brandId]) {
//                     brandMap[item.brandId] = {
//                         name: item.brandName,
//                         quantity: 0,
//                         revenue: 0
//                     };
//                 }
//                 brandMap[item.brandId].quantity += item.quantity;
//                 brandMap[item.brandId].revenue += item.subTotal;
//             }

//         });


//     });

//     const topProducts = Object.values(productMap)
//         .sort((a, b) => b.quantity - a.quantity)
//         .slice(0, limit);

//     const topCategories = Object.values(categoryMap)
//         .sort((a, b) => b.quantity - a.quantity)
//         .slice(0, limit);

//     const topBrands = Object.values(brandMap)
//         .sort((a, b) => b.quantity - a.quantity)
//         .slice(0, limit);



//     console.log(topProducts, '-------')
//     console.log(topCategories, 'branddsss-------')
//     console.log(topBrands, 'categoriii-------')

// }



export const getBestSellers = async (req, res) => {
  try {
    const orders = await Order.find();

    const productMap = {};
    const categoryMap = {};
    const brandMap = {};
    const limit = 10;

    for (const order of orders) {
      for (const item of order.Items) {
        const product = await Product.findById(item.productId).populate("category brand");
        if (!product) continue;

        const prodKey = product._id.toString();
        if (!productMap[prodKey]) {
          productMap[prodKey] = {
            name: product.name,
            quantity: 0,
            revenue: 0
          };
        }
        productMap[prodKey].quantity += item.quantity;
        productMap[prodKey].revenue += item.subTotal;

        if (product.category) {
          const catKey = product.category._id.toString();
          if (!categoryMap[catKey]) {
            categoryMap[catKey] = {
              name: product.category.categoryName,
              quantity: 0,
              revenue: 0
            };
          }
          categoryMap[catKey].quantity += item.quantity;
          categoryMap[catKey].revenue += item.subTotal;
        }

        if (product.brand) {
          const brandKey = product.brand._id.toString();
          if (!brandMap[brandKey]) {
            brandMap[brandKey] = {
              name: product.brand.name,
              quantity: 0,
              revenue: 0
            };
          }
          brandMap[brandKey].quantity += item.quantity;
          brandMap[brandKey].revenue += item.subTotal;
        }
      }
    }

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);

    const topCategories = Object.values(categoryMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);

    const topBrands = Object.values(brandMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);

    res.status(statusCode.OK).json({ topProducts, topCategories, topBrands });
  } catch (error) {
    console.error(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: "Error fetching best sellers" });
  }
};