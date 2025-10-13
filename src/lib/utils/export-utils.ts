import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export class ExportUtils {
  // Simple PDF export - text-based only
  static async exportToPDF(elementId: string, filename: string = "report.pdf") {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error("Element not found");
      }

      const pdf = new jsPDF("p", "mm", "a4");
      let yPosition = 20;

      // Header
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("Property Rental Report", 20, yPosition);
      yPosition += 15;

      // Date
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Generated: ${new Date().toLocaleDateString("id-ID")}`,
        20,
        yPosition
      );
      yPosition += 20;

      // Extract and add text content
      const textContent = this.extractTextContent(element);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");

      const lines = pdf.splitTextToSize(textContent, 170);
      for (const line of lines) {
        if (yPosition > 280) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, 20, yPosition);
        yPosition += 6;
      }

      pdf.save(filename);
      return true;
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      throw error;
    }
  }

  // Extract text content from element
  private static extractTextContent(element: HTMLElement): string {
    const textParts: string[] = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const text = node.textContent?.trim();
        return text ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });

    let currentNode = walker.nextNode();
    while (currentNode) {
      const text = currentNode.textContent?.trim();
      if (text) {
        textParts.push(text);
      }
      currentNode = walker.nextNode();
    }

    return textParts.join("\n\n");
  }

  // Simple Excel export
  static exportToExcel(data: Record<string, unknown>[], filename: string = "report.xlsx") {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
      XLSX.writeFile(workbook, filename);
      return true;
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      throw error;
    }
  }

  // Simple data preparation for Excel
  static prepareReportDataForExcel(reportData: Record<string, unknown>) {
    const excelData = [];

    // KPI Data
    excelData.push({
      Metric: "Total Revenue",
      Value: reportData.kpiData?.totalRevenue || 0,
      Growth: `${reportData.kpiData?.revenueGrowth || 0}%`,
      Category: "KPI",
    });
    excelData.push({
      Metric: "Total Bookings",
      Value: reportData.kpiData?.totalBookings || 0,
      Growth: `${reportData.kpiData?.bookingGrowth || 0}%`,
      Category: "KPI",
    });
    excelData.push({
      Metric: "Total Guests",
      Value: reportData.kpiData?.totalGuests || 0,
      Growth: `${reportData.kpiData?.guestGrowth || 0}%`,
      Category: "KPI",
    });
    excelData.push({
      Metric: "Average Occupancy",
      Value: `${reportData.kpiData?.averageOccupancy || 0}%`,
      Growth: `${reportData.kpiData?.occupancyGrowth || 0}%`,
      Category: "KPI",
    });

    // Monthly Data
    if (reportData.monthlyData && reportData.monthlyData.length > 0) {
      reportData.monthlyData.forEach((item: Record<string, unknown>) => {
        excelData.push({
          Metric: item.name,
          Value: item.value,
          Growth: `${item.growth || 0}%`,
          Category: "Monthly",
        });
      });
    }

    // Property Performance
    if (
      reportData.propertyPerformance &&
      reportData.propertyPerformance.length > 0
    ) {
      reportData.propertyPerformance.forEach((item: Record<string, unknown>) => {
        excelData.push({
          Metric: item.name,
          Value: item.revenue,
          Growth: `${item.occupancy}%`,
          Category: "Property",
        });
      });
    }

    // Booking Status
    if (
      reportData.bookingStatusData &&
      reportData.bookingStatusData.length > 0
    ) {
      reportData.bookingStatusData.forEach((item: Record<string, unknown>) => {
        excelData.push({
          Metric: item.name,
          Value: item.value,
          Growth: "",
          Category: "Booking Status",
        });
      });
    }

    return excelData;
  }
}
