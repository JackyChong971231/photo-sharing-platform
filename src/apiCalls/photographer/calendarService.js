// Dummy calendar service using localStorage to mock backend API.
// Each event = { id, studioId, title, start, end, client, notes, photographerId }

const STORAGE_KEY = "dummy_calendar_events";

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load events from localStorage", err);
    return [];
  }
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

// Utility to simulate async delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Get all events for a given date range and studio
 */
export async function getEventsForRange(studioId, startDate, endDate) {
  await delay(300); // simulate API latency
  const events = loadEvents();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return events.filter(
    (e) =>
      e.studioId === studioId &&
      new Date(e.end) >= start &&
      new Date(e.start) <= end
  );
}

/**
 * Create a new event
 */
export async function createEventAPI(eventData) {
  await delay(300);
  const events = loadEvents();
  const newEvent = {
    id: Date.now(),
    studioId: eventData.studioId || 1,
    title: eventData.title || "Untitled",
    client: eventData.client || "",
    notes: eventData.notes || "",
    start: eventData.start,
    end: eventData.end,
    photographerId: eventData.photographerId || null,
  };
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
}

/**
 * Update an existing event
 */
export async function updateEventAPI(eventId, updatedData) {
  await delay(300);
  let events = loadEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx === -1) throw new Error("Event not found");
  const updated = { ...events[idx], ...updatedData };
  events[idx] = updated;
  saveEvents(events);
  return updated;
}

/**
 * Delete an event by ID
 */
export async function deleteEventAPI(eventId) {
  await delay(200);
  let events = loadEvents().filter((e) => e.id !== eventId);
  saveEvents(events);
  return true;
}
