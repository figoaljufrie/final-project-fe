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
  static exportToExcel(
    data: Record<string, unknown>[],
    filename: string = "report.xlsx"
  ) {
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
    const kpiData = reportData.kpiData as
      | {
          totalRevenue?: number;
          revenueGrowth?: number;
          totalBookings?: number;
          bookingGrowth?: number;
          totalGuests?: number;
          guestGrowth?: number;
          averageOccupancy?: number;
          occupancyGrowth?: number;
        }
      | undefined;

    excelData.push({
      Metric: "Total Revenue",
      Value: kpiData?.totalRevenue || 0,
      Growth: `${kpiData?.revenueGrowth || 0}%`,
      Category: "KPI",
    });
    excelData.push({
      Metric: "Total Bookings",
      Value: kpiData?.totalBookings || 0,
      Growth: `${kpiData?.bookingGrowth || 0}%`,
      Category: "KPI",
    });
    excelData.push({
      Metric: "Total Guests",
      Value: kpiData?.totalGuests || 0,
      Growth: `${kpiData?.guestGrowth || 0}%`,
      Category: "KPI",
    });
    excelData.push({
      Metric: "Average Occupancy",
      Value: `${kpiData?.averageOccupancy || 0}%`,
      Growth: `${kpiData?.occupancyGrowth || 0}%`,
      Category: "KPI",
    });

    // Monthly Data
    const monthlyData = reportData.monthlyData as
      | Record<string, unknown>[]
      | undefined;
    if (monthlyData && monthlyData.length > 0) {
      monthlyData.forEach((item: Record<string, unknown>) => {
        excelData.push({
          Metric: item.name,
          Value: item.value,
          Growth: `${item.growth || 0}%`,
          Category: "Monthly",
        });
      });
    }

    // Property Performance
    const propertyPerformance = reportData.propertyPerformance as
      | Record<string, unknown>[]
      | undefined;
    if (propertyPerformance && propertyPerformance.length > 0) {
      propertyPerformance.forEach((item: Record<string, unknown>) => {
        excelData.push({
          Metric: item.name,
          Value: item.revenue,
          Growth: `${item.occupancy}%`,
          Category: "Property",
        });
      });
    }

    // Booking Status
    const bookingStatusData = reportData.bookingStatusData as
      | Record<string, unknown>[]
      | undefined;
    if (bookingStatusData && bookingStatusData.length > 0) {
      bookingStatusData.forEach((item: Record<string, unknown>) => {
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
