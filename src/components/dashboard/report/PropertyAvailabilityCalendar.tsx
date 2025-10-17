import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  ReportService,
  PropertyReportResponse,
} from "@/lib/services/report/report-service";
import { useTenantProperties } from "@/hooks/report/use-tenant-properties";
import { toast } from "react-hot-toast";
import { ExportUtils } from "@/lib/utils/export-utils";

interface PropertyAvailabilityCalendarProps {
  propertyId?: number;
  startDate?: string;
  endDate?: string;
}

export default function PropertyAvailabilityCalendar({
  propertyId,
  startDate,
  endDate,
}: PropertyAvailabilityCalendarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [propertyData, setPropertyData] =
    useState<PropertyReportResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showRoomDetails, setShowRoomDetails] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { properties: tenantProperties } = useTenantProperties();

  const loadPropertyData = useCallback(async () => {
    try {
      setIsLoading(true);

      let targetPropertyId = propertyId;
      if (!targetPropertyId && tenantProperties.length > 0) {
        targetPropertyId = tenantProperties[0].id;
      }

      if (!targetPropertyId) {
        throw new Error("No properties found for this tenant");
      }

      const data = await ReportService.getPropertyAvailability(
        targetPropertyId,
        startDate || new Date().toISOString().split("T")[0],
        endDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]
      );
      setPropertyData(data as PropertyReportResponse);
    } catch (err: unknown) {
      console.error("Error loading property data:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to load property data");
      }
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, startDate, endDate, tenantProperties]);

  useEffect(() => {
    if (tenantProperties.length > 0) {
      loadPropertyData();
    }
  }, [tenantProperties, loadPropertyData]);

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const getAvailabilityStatus = (date: Date) => {
    if (!propertyData) return "unknown";
    const dateStr = date.toISOString().split("T")[0];
    const calendarEntry = propertyData.calendar.find(
      (entry) => entry.date === dateStr
    );
    if (!calendarEntry) return "unknown";
    const totalRooms = calendarEntry.rooms.length;
    const availableRooms = calendarEntry.rooms.filter(
      (room) => room.status === "available"
    ).length;
    const fullyBookedRooms = calendarEntry.rooms.filter(
      (room) => room.status === "fully_booked"
    ).length;
    const unavailableRooms = calendarEntry.rooms.filter(
      (room) => room.status === "unavailable"
    ).length;
    
    if (unavailableRooms > 0) return "unavailable";
    if (fullyBookedRooms === totalRooms) return "fully_booked";
    if (availableRooms === totalRooms) return "available";
    return "partially_booked";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "partially_booked":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "fully_booked":
        return "bg-red-100 text-red-800 border-red-200";
      case "unavailable":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadPropertyData();
      toast.success("Calendar data refreshed successfully");
    } catch {
      toast.error("Failed to refresh calendar data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportCalendar = async () => {
    if (!propertyData || !propertyData.calendar) {
      toast.error("No calendar data to export");
      return;
    }

    try {
      await ExportUtils.exportCalendarToExcel(
        propertyData.calendar,
        `property-calendar-${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}.xlsx`
      );
      toast.success("Calendar exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export calendar");
    }
  };

  const getRoomDetails = (date: Date) => {
    if (!propertyData) return [];
    const dateStr = date.toISOString().split("T")[0];
    const calendarEntry = propertyData.calendar.find(
      (entry) => entry.date === dateStr
    );
    return calendarEntry?.rooms || [];
  };

  const calendarDays = getCalendarDays();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Property Availability Calendar
        </h3>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportCalendar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Download className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRoomDetails(!showRoomDetails)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {showRoomDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </motion.button>
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth("next")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={index} className="p-2"></div>;
          }
          const status = getAvailabilityStatus(day);
          const isSelected = selectedDate === day.toISOString().split("T")[0];
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <motion.button
              key={day.toISOString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(day.toISOString().split("T")[0])}
              className={`p-2 text-sm rounded-lg border transition-all ${
                isSelected
                  ? "ring-2 ring-rose-500 bg-rose-50"
                  : getStatusColor(status)
              } ${isToday ? "font-bold" : ""}`}
            >
              {day.getDate()}
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center justify-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></div>
          <span className="text-sm text-gray-600">Partially Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
          <span className="text-sm text-gray-600">Fully Booked</span>
        </div>
      </div>

      {selectedDate && showRoomDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t pt-4"
        >
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            Room Details -{" "}
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getRoomDetails(new Date(selectedDate)).map((room) => (
              <motion.div 
                key={room.roomId} 
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{room.roomName}</h5>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.status === "available"
                        ? "bg-green-100 text-green-800"
                        : room.status === "partially_booked"
                        ? "bg-yellow-100 text-yellow-800"
                        : room.status === "unavailable"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {room.status.replace("_", " ")}
                  </span>
                </div>
                {room.reason && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 italic">
                      {room.reason}
                    </p>
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {room.availableUnits}/{room.totalUnits} available
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{room.bookedUnits} booked</span>
                  </div>
                </div>
                
                {/* Show booking details if available */}
                {room.bookings && room.bookings.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h6 className="text-xs font-medium text-gray-700 mb-2">Active Bookings:</h6>
                    <div className="space-y-1">
                      {room.bookings.map((booking, idx) => (
                        <div key={idx} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{booking.bookingNo}</span>
                            <span className="text-gray-500">{booking.unitCount} units</span>
                          </div>
                          <div className="text-gray-500">
                            {booking.totalGuests} guests • {booking.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
