import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendar.css';

export const Calendar = () => {
  const calendarRef = useRef(null);

  const [events, setEvents] = useState([
    { id: '1', title: 'Wedding Shoot - John & Jane', start: '2025-11-10T10:00:00', end: '2025-11-10T14:00:00', client: 'John & Jane', location: 'Toronto', notes: 'Bring extra lights' },
  ]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '', client: '', location: '', start: '', end: '', notes: ''
  });

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };

  const handleEventClick = (ev) => {
    setSelectedEvent(ev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const openAddEventModal = () => {
    if (!selectedDate) {
      alert('Please select a date first.');
      return;
    }
    setNewEvent({
      title: '',
      client: '',
      location: '',
      start: `${selectedDate}T10:00`,
      end: `${selectedDate}T12:00`,
      notes: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start) {
      alert('Please provide at least a title and start time.');
      return;
    }
    const id = String(events.length + 1);
    setEvents([...events, { ...newEvent, id }]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="calendar-container">

      {/* LEFT SIDE — Calendar */}
      <div className="calendar-left">
        <h2>Photographer Calendar</h2>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prevYear,prev,next,nextYear today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          editable={true}
          height="auto"
          fixedWeekCount={false} // removes extra empty weeks
          showNonCurrentDates={false} // hides overflow from other months
        />
      </div>


      {/* RIGHT SIDE — Schedule & Event Info */}
      <div className="calendar-right">
        <div className="schedule-header pt-3">
          <h3 className='fw-semibold'>{selectedDate ? `${selectedDate}` : 'Select a Date'}</h3>
          <button className="btn-primary" onClick={openAddEventModal}>
            + Add Event
          </button>
        </div>

        {selectedDate ? (
          <div className="day-schedule">
            {events.filter(e => e.start.startsWith(selectedDate)).length > 0 ? (
              <div className="time-slot-list">
                {Array.from({ length: 8 }, (_, i) => 8 + i * 2).map(hour => {
                  const slotStart = `${hour.toString().padStart(2, '0')}:00`;
                  const slotEnd = `${(hour + 2).toString().padStart(2, '0')}:00`;

                  const slotEvents = events.filter(e => {
                    const startTime = new Date(e.start).toLocaleTimeString('en-US', { hour12: false });
                    return e.start.startsWith(selectedDate) && startTime >= slotStart && startTime < slotEnd;
                  });

                  return (
                    <div key={hour} className="time-slot">
                      <div className="time-label">{slotStart}</div>
                      <div className="slot-events">
                        {slotEvents.length > 0 ? (
                          slotEvents.map(ev => (
                            <div
                              key={ev.id}
                              className="event-card"
                              onClick={() => handleEventClick(ev)}
                            >
                              <strong>{ev.title}</strong>
                              <p>{ev.client}</p>
                              <span>{new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          ))
                        ) : (
                          <div className="no-event">—</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-event-selected">
                <div className="no-event-icon">📅</div>
                <h4>No Events Scheduled</h4>
                <p>Click "+ Add Event" to create one for this date.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="no-event-selected">
            <div className="no-event-icon">🗓️</div>
            <h4>No Date Selected</h4>
            <p>Select a date from the calendar to view its schedule.</p>
          </div>
        )}
      </div>

      {/* EVENT CREATION MODAL */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Event</h3>
              <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>×</button>
            </div>

            <div className="modal-body">
              <label>Title</label>
              <input type="text" name="title" placeholder="Event Title" value={newEvent.title} onChange={handleInputChange} />

              <label>Client</label>
              <input type="text" name="client" placeholder="Client Name" value={newEvent.client} onChange={handleInputChange} />

              <label>Location</label>
              <input type="text" name="location" placeholder="Location" value={newEvent.location} onChange={handleInputChange} />

              <div className="datetime-row">
                <div className="datetime-container">
                  <label>Start</label>
                  <input className="input-datetime" type="datetime-local" name="start" value={newEvent.start} onChange={handleInputChange} />
                </div>
                <div className="datetime-container">
                  <label>End</label>
                  <input className="input-datetime" type="datetime-local" name="end" value={newEvent.end} onChange={handleInputChange} />
                </div>
              </div>

              <label>Notes</label>
              <textarea name="notes" placeholder="Additional notes" value={newEvent.notes} onChange={handleInputChange} />
            </div>

            <div className="modal-footer">
              <button className="btn-primary" onClick={handleAddEvent}>Add Event</button>
              <button className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
