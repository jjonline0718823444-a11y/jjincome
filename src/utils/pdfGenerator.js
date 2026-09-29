import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

/**
 * Generate a PDF financial report for JJ Online Business
 */
export function exportToPDF({
  businessName = 'JJ Online Business',
  currency = 'LKR',
  periodName = 'Financial Report',
  totals,
  transactions = [],
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Primary palette
  const primaryColor = [79, 70, 229]; // Indigo #4f46e5
  const emeraldColor = [16, 185, 129]; // Green #10b981
  const roseColor = [244, 63, 94]; // Red #f43f5e
  const textDark = [30, 41, 59]; // Slate 800
  const textMuted = [100, 116, 139]; // Slate 500

  // 1. Header Banner
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(businessName.toUpperCase(), 14, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(224, 231, 255);
  doc.text('Janith Income - Automated Accounting System', 14, 20);

  const reportDateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generated: ${reportDateStr}`, pageWidth - 14, 14, { align: 'right' });
  doc.text(`Period: ${periodName}`, pageWidth - 14, 20, { align: 'right' });

  // 2. Summary KPI Cards (Income, Expense, Net Profit)
  const cardY = 32;
  const cardWidth = (pageWidth - 28 - 8) / 3;
  const cardHeight = 22;

  // Card 1: Total Income
  doc.setFillColor(240, 253, 244); // Green 50
  doc.setDrawColor(187, 247, 208); // Green 200
  doc.roundedRect(14, cardY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52); // Green 800
  doc.text('TOTAL INCOME', 18, cardY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(21, 128, 61);
  doc.text(formatCurrency(totals.totalIncome, currency), 18, cardY + 16);

  // Card 2: Total Expenses
  const card2X = 14 + cardWidth + 4;
  doc.setFillColor(255, 241, 242); // Rose 50
  doc.setDrawColor(254, 205, 211); // Rose 200
  doc.roundedRect(card2X, cardY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(159, 18, 57); // Rose 800
  doc.text('TOTAL EXPENSES', card2X + 4, cardY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(190, 18, 60);
  doc.text(formatCurrency(totals.totalExpense, currency), card2X + 4, cardY + 16);

  // Card 3: Net Profit / Loss
  const card3X = card2X + cardWidth + 4;
  const isProfitable = totals.netProfit >= 0;
  if (isProfitable) {
    doc.setFillColor(238, 242, 255); // Indigo 50
    doc.setDrawColor(199, 210, 254); // Indigo 200
    doc.roundedRect(card3X, cardY, cardWidth, cardHeight, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(55, 48, 163);
    doc.text(`NET PROFIT (${totals.profitMargin}%)`, card3X + 4, cardY + 7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(67, 56, 202);
    doc.text(formatCurrency(totals.netProfit, currency), card3X + 4, cardY + 16);
  } else {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(252, 165, 165);
    doc.roundedRect(card3X, cardY, cardWidth, cardHeight, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(153, 27, 27);
    doc.text('NET LOSS', card3X + 4, cardY + 7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(185, 28, 28);
    doc.text(formatCurrency(totals.netProfit, currency), card3X + 4, cardY + 16);
  }

  // 3. Transactions Table
  const tableData = transactions.map((tx, idx) => [
    idx + 1,
    formatDate(tx.date),
    tx.type.toUpperCase(),
    tx.category,
    tx.description || '-',
    tx.payment_method || 'Cash',
    formatCurrency(tx.amount, currency),
  ]);

  autoTable(doc, {
    startY: cardY + cardHeight + 8,
    head: [['#', 'Date', 'Type', 'Category', 'Description', 'Method', 'Amount']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: textDark,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 22 },
      2: { cellWidth: 18, fontStyle: 'bold' },
      3: { cellWidth: 32 },
      4: { cellWidth: 'auto' },
      5: { cellWidth: 22 },
      6: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.section === 'body') {
        if (data.column.index === 2) {
          if (data.cell.raw === 'INCOME') {
            data.cell.styles.textColor = emeraldColor;
          } else {
            data.cell.styles.textColor = roseColor;
          }
        }
        if (data.column.index === 6) {
          const rowType = tableData[data.row.index]?.[2];
          if (rowType === 'INCOME') {
            data.cell.styles.textColor = emeraldColor;
          } else {
            data.cell.styles.textColor = roseColor;
          }
        }
      }
    },
    margin: { left: 14, right: 14 },
    foot: [
      [
        '',
        '',
        '',
        '',
        'Summary Totals:',
        `Income: ${formatCurrency(totals.totalIncome, currency)}`,
        `Net: ${formatCurrency(totals.netProfit, currency)}`,
      ],
    ],
    footStyles: {
      fillColor: [248, 250, 252],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      fontSize: 8,
    },
  });

  // Footer on each page
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(
      `Confidential - JJ Online Business Internal Financial Record | Page ${i} of ${totalPages}`,
      14,
      pageHeight - 8
    );
    doc.text(
      'Janith Income System',
      pageWidth - 14,
      pageHeight - 8,
      { align: 'right' }
    );
  }

  // Save the PDF file
  const fileName = `JJ_Online_Business_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
