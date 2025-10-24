import React, { useEffect, useMemo, useState } from "react";
import "./calendar.css";
import { getEventsForRange, createEventAPI, updateEventAPI, deleteEventAPI } from "../../../apiCalls/photographer/calendarService";


/**
 * Props:
 * monthDate: Date
 * events: array
 * onDayClick(day: Date)
 * onEventClick(evt)
 * onDropEvent(eventId, targetDay)
 */
function MonthView({ monthDate, events, onDayClick, onEventClick, onDropEvent }) {
  // generate 6x7 grid of dates
  const grid = useMemo(() => {
    const year = monthDate.getFullYear(), month = monthDate.getMonth();
    const first = new Date(year, month, 1);
    const startDayIndex = (first.getDay() + 6) % 7; // monday-first
    const start = new Date(first);
    start.setDate(first.getDate() - startDayIndex);
    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [monthDate]);

  // map events by date string (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach(ev => {
      const d = new Date(ev.start);
      const key = d.toISOString().slice(0,10);
      map[key] = map[key] || [];
      map[key].push(ev);
    });
    return map;
  }, [events]);

  function handleDragStart(e, eventId) {
    e.dataTransfer.setData("text/plain", eventId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e, targetDay) {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("text/plain");
    if (eventId) onDropEvent(Number(eventId), targetDay);
  }

  function allowDrop(e) { e.preventDefault(); }

  return (
    <div className="month-grid">
      <div className="grid-header d-flex">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
          <div key={d} className="grid-cell grid-cell-header">{d}</div>
        ))}
      </div>

      <div className="grid-body">
        {grid.map((day, idx) => {
          const key = day.toISOString().slice(0,10);
          const dayEvents = eventsByDate[key] || [];
          const inMonth = day.getMonth() === monthDate.getMonth();
          return (
            <div key={idx}
              className={`grid-cell day-cell ${inMonth? '' : 'muted'}`}
              onClick={(e) => { if (e.target === e.currentTarget) onDayClick(day); }}
              onDrop={(ev) => handleDrop(ev, day)}
              onDragOver={allowDrop}
            >
              <div className="day-number">{day.getDate()}</div>
              <div className="events">
                {dayEvents.slice(0,3).map(ev => (
                  <div key={ev.id}
                    className="event-pill"
                    draggable
                    onDragStart={(e)=>handleDragStart(e, ev.id)}
                    onClick={(e)=>{ e.stopPropagation(); onEventClick(ev); }}
                    title={`${ev.title || ev.client || 'Appointment'} — ${new Date(ev.start).toLocaleTimeString()}`}
                  >
                    <span className="event-title">{ev.title || ev.client || 'Appointment'}</span>
                    <small className="event-time">{new Date(ev.start).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</small>
                  </div>
                ))}
                {dayEvents.length > 3 && <div className="more-indicator">+{dayEvents.length - 3}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// simple modal implementation without programmatic bootstrap to keep deps low

function EventModal({ open, onClose, event, onSave, onDelete }) {
  const [form, setForm] = useState(event || null);

  useEffect(() => setForm(event ? { ...event } : null), [event]);

  if (!open || !form) return null;

  function handleChange(e) {
    const {name, value} = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function save() {
    // basic validation
    if (!form.title && !form.client) {
      alert("Please provide a title or client name");
      return;
    }
    onSave(form);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h5 className="modal-title">{form.id ? "Edit appointment" : "Create appointment"}</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="modal-body">
          <div className="mb-2">
            <label className="form-label">Title</label>
            <input name="title" className="form-control" value={form.title || ""} onChange={handleChange} />
          </div>

          <div className="mb-2">
            <label className="form-label">Client</label>
            <input name="client" className="form-control" value={form.client || ""} onChange={handleChange} />
          </div>

          <div className="row g-2">
            <div className="col">
              <label className="form-label">Start</label>
              <input name="start" type="datetime-local" className="form-control" value={form.start?.slice(0,16) || ""} onChange={handleChange} />
            </div>
            <div className="col">
              <label className="form-label">End</label>
              <input name="end" type="datetime-local" className="form-control" value={form.end?.slice(0,16) || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-2 mt-2">
            <label className="form-label">Notes</label>
            <textarea name="notes" className="form-control" rows={3} value={form.notes || ""} onChange={handleChange}></textarea>
          </div>
        </div>

        <div className="modal-footer">
          {form.id && <button className="btn btn-danger me-auto" onClick={()=>onDelete(form.id)}>Delete</button>}
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}


export const Calendar = ({ studioId, user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // 'month' or 'list'
  const [events, setEvents] = useState([]); // { id, title, start: ISO, end: ISO, client, notes, photographerId }
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const monthRange = useMemo(() => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const start = new Date(d);
    start.setDate(1 - ((d.getDay() + 6) % 7)); // start Monday-like
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    end.setDate(end.getDate() + (6 - ((end.getDay() + 6) % 7)));
    return { start, end };
  }, [currentDate]);

  useEffect(() => {
    fetchEvents();
  }, [monthRange, studioId]);

  async function fetchEvents() {
    setLoading(true);
    try {
      // Replace with your API
      const data = await getEventsForRange(studioId, monthRange.start, monthRange.end);
      setEvents(data || []);
    } catch (err) {
      console.error("fetch events:", err);
    } finally {
      setLoading(false);
    }
  }

  const handlePrev = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const handleNext = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const openCreateModal = (day) => {
    setEditingEvent({
      start: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 10, 0).toISOString(),
      end: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 11, 0).toISOString(),
      title: "",
      client: "",
      notes: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingEvent(evt);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    // payload: full event object; if has id => update, else create
    try {
      let saved;
      if (payload.id) {
        saved = await updateEventAPI(payload.id, payload);
        setEvents((prev) => prev.map((p) => (p.id === payload.id ? saved : p)));
      } else {
        saved = await createEventAPI(payload);
        setEvents((prev) => [saved, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error("save event", err);
      alert("Failed to save event");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteEventAPI(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setModalOpen(false);
    } catch (err) {
      console.error("delete event", err);
    }
  };

  const handleDropToDay = async (eventId, targetDay) => {
    // Move event to targetDay while preserving time-of-day (simple heuristic)
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return;
    const oldStart = new Date(evt.start);
    const oldEnd = new Date(evt.end);
    const duration = oldEnd - oldStart;
    const newStart = new Date(targetDay.getFullYear(), targetDay.getMonth(), targetDay.getDate(), oldStart.getHours(), oldStart.getMinutes());
    const newEnd = new Date(newStart.getTime() + duration);
    const updated = { ...evt, start: newStart.toISOString(), end: newEnd.toISOString() };
    try {
      const saved = await updateEventAPI(evt.id, updated);
      setEvents((prev) => prev.map((e) => (e.id === evt.id ? saved : e)));
    } catch (err) {
      console.error("drag update failed", err);
    }
  };

  const upcoming = events
    .slice()
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .filter((e) => new Date(e.start) >= new Date())
    .slice(0, 8);

  return (
    <div className="calendar-page container-fluid p-3">
      <div className="d-flex align-items-center mb-3 gap-3">
        <div>
          <button className="btn btn-sm btn-outline-secondary me-1" onClick={handlePrev}>Prev</button>
          <button className="btn btn-sm btn-outline-secondary me-1" onClick={handleToday}>Today</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleNext}>Next</button>
        </div>

        <div className="ms-2">
          <h5 className="mb-0">{currentDate.toLocaleString(undefined, { month: "long", year: "numeric" })}</h5>
        </div>

        <div className="ms-auto d-flex gap-2">
          <button className="btn btn-primary" onClick={() => openCreateModal(new Date())}>Create appointment</button>
          <select className="form-select form-select-sm" style={{width:120}} value={view} onChange={(e)=>setView(e.target.value)}>
            <option value="month">Month</option>
            <option value="list">List</option>
          </select>
        </div>
      </div>

      <div className="d-flex gap-3">
        <aside style={{width: 280}}>
          <div className="mb-3">
            <h6 className="mb-2">Upcoming</h6>
            <div className="list-group">
              {upcoming.length ? upcoming.map(ev=>(
                <button key={ev.id} type="button" className="list-group-item list-group-item-action" onClick={()=>openEditModal(ev)}>
                  <div className="d-flex justify-content-between">
                    <div>{ev.title || ev.client || "Appointment"}</div>
                    <small className="text-muted">{new Date(ev.start).toLocaleString()}</small>
                  </div>
                </button>
              )) : <div className="text-muted small">No upcoming</div>}
            </div>
          </div>
        </aside>

        <main style={{flex:1, minWidth:0}}>
          {view === "month" ? (
            <MonthView
              monthDate={currentDate}
              events={events}
              onDayClick={openCreateModal}
              onEventClick={openEditModal}
              onDropEvent={handleDropToDay}
            />
          ) : (
            <div>
              <h6>All events</h6>
              <ul className="list-group">
                {events.map(ev => <li key={ev.id} className="list-group-item">{ev.title} — {new Date(ev.start).toLocaleString()}</li>)}
              </ul>
            </div>
          )}
        </main>
      </div>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={editingEvent}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
