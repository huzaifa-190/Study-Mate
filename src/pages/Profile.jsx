import React, { useState } from "react";

const Profile = () => {
  const [subjects, setSubjects] = useState(['']); // Initialize with one empty subject
  const [timeSlots, setTimeSlots] = useState([{ startTime: '', endTime: '' }]);
  const [timetable, setTimetable] = useState([]);
  const [error, setError] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Handle subject change
  const handleSubjectChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = value;
    setSubjects(updatedSubjects);
  };

  // Add a new empty subject field
  const handleAddSubject = () => {
    setSubjects([...subjects, '']);
  };

  // Remove a subject, ensure at least one subject is present
  const handleRemoveSubject = (index) => {
    if (subjects.length > 1) {
      const updatedSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(updatedSubjects);
    } else {
      setError("At least one subject is required.");
    }
  };

  // Handle time slot change
  const handleTimeSlotChange = (index, field, value) => {
    const updatedTimeSlots = [...timeSlots];
    updatedTimeSlots[index][field] = value;
    setTimeSlots(updatedTimeSlots);
  };

  // Add a new time slot
  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: '', endTime: '' }]);
  };

  // Remove a time slot
  const handleRemoveTimeSlot = (index) => {
    if (timeSlots.length > 1) {
      const updatedTimeSlots = timeSlots.filter((_, i) => i !== index);
      setTimeSlots(updatedTimeSlots);
    } else {
      setError("At least one time slot is required.");
    }
  };

  // Validate and generate the timetable
  const handleGenerateTimetable = () => {
    if (subjects.some((subject) => subject.trim() === '')) {
      setError("Please fill in all subjects.");
      return;
    }

    if (timeSlots.some((slot) => !slot.startTime || !slot.endTime)) {
      setError("Please fill in all time slots.");
      return;
    }

    setError(''); // Clear any existing errors

    const totalSubjects = subjects.length;
    const totalTimeSlots = timeSlots.length;

    // Round-robin assignment of subjects to time slots for each day of the week
    const weeklyTimetable = daysOfWeek.map((day, dayIndex) => {
      const daySlots = timeSlots.map((slot, slotIndex) => {
        const subjectIndex = (dayIndex * totalTimeSlots + slotIndex) % totalSubjects;
        return {
          subject: subjects[subjectIndex],
          startTime: slot.startTime,
          endTime: slot.endTime,
        };
      });
      return {
        day,
        slots: daySlots,
      };
    });

    setTimetable(weeklyTimetable); // Update timetable state
  };

  return (
    <div className="w-full max-w-3xl p-6 bg-gray-100 rounded-lg shadow-md mx-auto">
      <h1 className="text-xl font-bold text-center mb-6">Study Timetable Generator</h1>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Input for Subjects */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Subjects</label>
        {subjects.map((subject, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={subject}
              onChange={(e) => handleSubjectChange(index, e.target.value)}
              placeholder={`Subject ${index + 1}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            {index > 0 && (
              <button
                type="button"
                className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => handleRemoveSubject(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="w-full mt-2 px-3 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-600"
          onClick={handleAddSubject}
        >
          Add Another Subject
        </button>
      </div>

      {/* Input for Time Slots */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Time Slots</label>
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
              placeholder="Start Time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
              placeholder="End Time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 ml-2"
            />
            {index > 0 && (
              <button
                type="button"
                className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => handleRemoveTimeSlot(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="w-full mt-2 px-3 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-600"
          onClick={handleAddTimeSlot}
        >
          Add Another Time Slot
        </button>
      </div>

      {/* Button to Generate Timetable */}
      <button
        type="button"
        className="w-full mt-4 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        onClick={handleGenerateTimetable}
      >
        Generate Timetable
      </button>

      {/* Display Generated Weekly Timetable */}
      {timetable.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Generated Weekly Timetable:</h2>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Day</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Subjects & Time Slots</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((dayItem, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{dayItem.day}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex flex-col">
                      {dayItem.slots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="mb-2">
                          <strong>{slot.subject}:</strong> {slot.startTime} - {slot.endTime}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Profile;
