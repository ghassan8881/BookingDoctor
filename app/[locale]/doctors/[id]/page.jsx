"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslations } from "next-intl";
import { useUser } from "../../../hooks/useUser";
import { useLocale } from "next-intl";

export default function DoctorDetail(params) {
  const { user } = useUser();
  const t = useTranslations("Home");
  // const { locale } = params;
  const { locale } = useLocale;
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddSlotForm, setShowAddSlotForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [slotForm, setSlotForm] = useState({
    startTime: "",
    endTime: "",
  });
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });
  const [showPatientSelection, setShowPatientSelection] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentSlot, setCurrentSlot] = useState(null);

  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookedSlotsForPatient, setBookedSlotsForPatient] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] =
    useState(null);

  const [pendingSlots, setPendingSlots] = useState([]);
  const [pendingSlotsForPatient, setPendingSlotsForPatient] = useState([]);

  const showAppointmentDetails = (slot) => {
    setSelectedAppointmentDetails(slot);
    setShowDetailsModal(true);
  };

  const makeSlotAvailable = async (slotId) => {
    if (!confirm("Are you sure you want to make this slot available again?"))
      return;

    try {
      const response = await fetch(`/api/doctors/${id}/slots/${slotId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: 0, // Remove patient association
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update slot");
      }

      alert("Slot made available successfully!");
      setShowDetailsModal(false);
      fetchSlots();
    } catch (err) {
      console.error("Error making slot available:", err);
      alert("Failed to make slot available");
    }
  };

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const doctorId = pathParts[pathParts.length - 1];
    setId(doctorId);

    if (doctorId) {
      fetch(`/api/doctors/${doctorId}`)
        .then((res) => res.json())
        .then((data) => {
          setDoctor(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching doctor:", error);
          setLoading(false);
        });
    }

    // Fetch patients when component mounts
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((error) => console.error("Error fetching patients:", error));
  }, [locale]);

  useEffect(() => {
    if (id && selectedDate) {
      fetchSlots();
    }
  }, [id, selectedDate]);

  // Update your fetchSlots function to separate available and booked slots
  const fetchSlots = () => {
    fetch(`/api/doctors/${id}/slots?date=${selectedDate.toISOString()}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("🚀 ~ fetchSlots ~ data:102", data);
        const available = data.filter((slot) => slot.Status == "0");
        const pending = data.filter((slot) => slot.Status == 1);
        const booked = data.filter((slot) => slot.Status == "2");
        const pendingForPatient = data.filter(
          (slot) => slot.Status == 1 && slot.PatientId == user.UserID
        );
        const bookedForPatient = data.filter(
          (slot) => slot.Status == "2" && slot.PatientId == user.UserID
        );
        console.log(bookedForPatient, "🚀 ~ fetchSlots ~ booked119:", booked);
        setAvailableSlots(available);
        setPendingSlots(pending);
        setPendingSlotsForPatient(pendingForPatient);
        setBookedSlots(booked);
        setBookedSlotsForPatient(bookedForPatient);
      })
      .catch((error) => console.error("Error fetching slots:", error));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setFormMessage({ type: "", text: "" });

    if (slotForm.startTime >= slotForm.endTime) {
      setFormMessage({
        type: "error",
        text: "End time must be after start time",
      });
      return;
    }

    try {
      const url = editingSlot
        ? `/api/doctors/${id}/slots/${editingSlot.SlotID}`
        : `/api/doctors/${id}/slots`;

      const method = editingSlot ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          startTime: slotForm.startTime,
          endTime: slotForm.endTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save slot");
      }

      setFormMessage({
        type: "success",
        text: editingSlot
          ? "Slot updated successfully!"
          : "Slot added successfully!",
      });
      resetSlotForm();
      fetchSlots();
      setTimeout(() => {
        setShowAddSlotForm(false);
        setEditingSlot(null);
      }, 1500);
    } catch (err) {
      setFormMessage({ type: "error", text: err.message });
    }
  };

  const handleBookSlot = (slot) => {
    setCurrentSlot(slot);
    user.Role == "doctor" ? setShowPatientSelection(true) : bookAppointment();
  };

  const bookAppointment = async () => {
    console.log(user.Role == "doctor", "🚀 ~ bookAppointment ~ user:183", user);
    if (user.Role == "doctor") {
      if (!selectedPatient) {
        alert("Please select a patient");
        return;
      }

      try {
        console.log(
          user.Role == "doctor",
          "🚀 ~ bookAppointment ~ userpatient"
        );

        const url = `/api/doctors/${id}/slots/${currentSlot.SlotID}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: selectedPatient.UserID,
            bookBy: 2,
          }),
        });

        console.log("🚀 ~ bookAppointment ~ response:", response);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to save slot");
        }
        alert("Appointment booked successfully!");
        setShowPatientSelection(false);
        setSelectedPatient(null);
        fetchSlots();
      } catch (err) {
        console.log("Error booking appointment:", err);
        alert("Failed to book appointment");
      }
    } else {
      // console.log(currentSlot.SlotID, "bookAppointment ~ id224", id);
      try {
        const url = `/api/doctors/${id}/slots/${currentSlot.SlotID}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: user.UserID,
            bookBy: 1,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to save slot");
        }
        alert("Appointment booked successfully!");
        setShowPatientSelection(false);
        setSelectedPatient(null);
        fetchSlots();
      } catch (err) {
        console.log("Error booking appointment:", err);
        alert("Failed to book appointment");
      }
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;

    try {
      const response = await fetch(`/api/doctors/${id}/slots/${slotId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete slot");
      }

      setFormMessage({ type: "success", text: "Slot deleted successfully!" });
      fetchSlots();
    } catch (err) {
      setFormMessage({ type: "error", text: err.message });
    }
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setSlotForm({
      startTime: new Date(slot.StartTime).toISOString().substring(11, 16),
      endTime: new Date(slot.EndTime).toISOString().substring(11, 16),
    });
    setShowAddSlotForm(true);
  };

  const resetSlotForm = () => {
    setSlotForm({ startTime: "", endTime: "" });
  };

  const cancelForm = () => {
    setShowAddSlotForm(false);
    setEditingSlot(null);
    resetSlotForm();
    setFormMessage({ type: "", text: "" });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  const processPendingSlot = async (slotId, newStatus) => {
    try {
      const response = await fetch(`/api/doctors/${id}/slots/${slotId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update slot status");
      }

      alert(`Slot status updated successfully!`);
      fetchSlots();
    } catch (err) {
      console.error("Error updating slot status:", err);
      alert("Failed to update slot status");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Doctor Info Section */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          {locale === "ar"
            ? `الطبيب ${doctor.FullName_ar}`
            : `Dr. ${doctor.FullName}`}
        </h1>
        <p className="text-lg text-blue-600 mb-4">
          Specialty: {doctor.Specialty}
        </p>
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{doctor.Location || "City Hospital"}</span>
        </div>
      </div>

      {/* Date Picker */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {t("BookAppointment")}
        </h2>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={new Date()}
          inline
          className="border rounded-lg p-2 w-full"
        />

        {/* Add Slot Button (for doctors/staff) */}
        {user.Role == "doctor" ? (
          <div className="mt-4">
            {!showAddSlotForm ? (
              <button
                onClick={() => {
                  setShowAddSlotForm(true);
                  setEditingSlot(null);
                  resetSlotForm();
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {t("AddNewSlot")}
              </button>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 className="text-lg font-medium mb-3">
                  {editingSlot ? "Edit Time Slot" : "Add New Time Slot"}
                </h3>
                <form onSubmit={handleAddSlot}>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("StartTime")}
                    </label>
                    <input
                      type="time"
                      value={slotForm.startTime}
                      onChange={(e) => {
                        setSlotForm({ ...slotForm, startTime: e.target.value });
                        if (formMessage.type === "error") {
                          setFormMessage({ type: "", text: "" });
                        }
                      }}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("EndTime")}
                    </label>
                    <input
                      type="time"
                      value={slotForm.endTime}
                      onChange={(e) => {
                        setSlotForm({ ...slotForm, endTime: e.target.value });
                        if (formMessage.type === "error") {
                          setFormMessage({ type: "", text: "" });
                        }
                      }}
                      className="w-full p-2 border rounded"
                      required
                      min={slotForm.startTime}
                    />
                  </div>
                  {formMessage.text && (
                    <div
                      className={`mb-3 p-2 rounded ${
                        formMessage.type === "error"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {formMessage.text}
                    </div>
                  )}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={cancelForm}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                    >
                      {t("Cancel")}
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      {editingSlot ? "Update Slot" : "Save Slot"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </div>

      {/* Available Slots */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {t("AvailableSlots")}
          </h3>
          {(availableSlots.length > 0 || bookedSlots.length > 0) && (
            <button
              onClick={fetchSlots}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {t("Refresh")}
            </button>
          )}
        </div>
        {availableSlots.length > 0 ? (
          <ul className="space-y-3">
            {availableSlots.map((slot, index) => (
              <li
                key={`available-${index}`}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
              >
                <span className="font-medium">
                  {new Date(slot.StartTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  })}
                  {" - "}
                  {new Date(slot.EndTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  })}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditSlot(slot)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                  >
                    {t("Edit")}
                  </button>
                  <button
                    onClick={() => handleDeleteSlot(slot.SlotID)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                  >
                    {t("Delete")}
                  </button>
                  <button
                    onClick={() => handleBookSlot(slot)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    {t("Book")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          ""
        )}
      </div>

      {/* Booked Appointments */}
      {/* {bookedSlots.length > 0 && ( */}
      {(user.Role == "doctor"
        ? bookedSlots.length > 0
        : bookedSlotsForPatient.length > 0) && (
        <div className="bg-gray-50 p-6 rounded-lg mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Booked Appointments
          </h3>
          <ul className="space-y-3">
            {(user.Role === "doctor" ? bookedSlots : bookedSlotsForPatient).map(
              (slot, index) => (
                <li
                  key={`booked-${index}`}
                  className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
                >
                  <div>
                    <span className="font-medium block">
                      {new Date(slot.StartTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })}
                      {" - "}
                      {new Date(slot.EndTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })}
                    </span>
                    {/* {slot.patient && (
                    <span className="text-sm text-gray-600">
                      Patient: {slot.patient.FirstName} {slot.patient.LastName}
                    </span>
                  )} */}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => showAppointmentDetails(slot)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/* Pending Slots */}
      {(user.Role == "doctor"
        ? pendingSlots.length > 0
        : pendingSlotsForPatient.length > 0) && (
        <div className="bg-yellow-50 p-6 rounded-lg mt-6 border border-yellow-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-yellow-800">
              Pending Approval Slots
            </h3>
          </div>
          <ul className="space-y-3">
            {(user.Role === "doctor"
              ? pendingSlots
              : pendingSlotsForPatient
            ).map((slot, index) => (
              <li
                key={`pending-${index}`}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border-l-4 border-yellow-500"
              >
                <div>
                  <span className="font-medium block">
                    {new Date(slot.StartTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC",
                    })}
                    {" - "}
                    {new Date(slot.EndTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC",
                    })}
                  </span>
                  {slot.patient && (
                    <span className="text-sm text-gray-600">
                      Requested by: {slot.patient.FirstName}{" "}
                      {slot.patient.LastName}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {user.Role === "doctor" ? (
                    <>
                      <button
                        onClick={() => processPendingSlot(slot.SlotID, 2)} // Approve as booked
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => processPendingSlot(slot.SlotID, 0)} // Reject to available
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                  <button
                    onClick={() => showAppointmentDetails(slot)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointmentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Appointment Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Time Slot</h4>
                <p>
                  {new Date(
                    selectedAppointmentDetails.StartTime
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  })}
                  {" - "}
                  {new Date(
                    selectedAppointmentDetails.EndTime
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  })}
                </p>
              </div>

              {selectedAppointmentDetails.patient && (
                <>
                  <div>
                    <h4 className="font-medium text-gray-700">
                      Patient Information
                    </h4>
                    <p>
                      {selectedAppointmentDetails.patient.FirstName}{" "}
                      {selectedAppointmentDetails.patient.LastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedAppointmentDetails.patient.Email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {selectedAppointmentDetails.patient.Phone || "N/A"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700">
                      Appointment Date
                    </h4>
                    <p>
                      {new Date(
                        selectedAppointmentDetails.StartTime
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() =>
                  makeSlotAvailable(selectedAppointmentDetails.SlotID)
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                Make Available
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Selection Modal */}
      {showPatientSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Select Patient</h3>
            <div className="mb-4 max-h-60 overflow-y-auto">
              {patients.length > 0 ? (
                <ul className="space-y-2">
                  {patients.map((patient) => (
                    <li
                      key={patient.UserID}
                      className={`p-3 rounded cursor-pointer ${
                        selectedPatient?.UserID === patient.UserID
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="font-medium">
                        {patient.FirstName} {patient.LastName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {patient.Email}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No patients available</p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPatientSelection(false);
                  setSelectedPatient(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={bookAppointment}
                disabled={!selectedPatient}
                className={`px-4 py-2 rounded-md text-white ${
                  selectedPatient
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-300 cursor-not-allowed"
                }`}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
