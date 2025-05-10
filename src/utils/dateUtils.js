// Format a Unix timestamp to a readable date
export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
  
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString(undefined, options);
};

// Format a Unix timestamp to a readable time
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
  
  const options = { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleTimeString(undefined, options);
};

// Check if an event is in the past
export const isEventPast = (timestamp) => {
  const eventDate = new Date(timestamp * 1000);
  const now = new Date();
  return eventDate < now;
};

// Get a relative time string (e.g. "in 2 days", "3 hours ago")
export const getRelativeTime = (timestamp) => {
  const now = new Date();
  const eventDate = new Date(timestamp * 1000);
  const diffInSeconds = Math.floor((eventDate - now) / 1000);
  
  // If the event is in the past
  if (diffInSeconds < 0) {
    const absSeconds = Math.abs(diffInSeconds);
    
    if (absSeconds < 60) return `${absSeconds} seconds ago`;
    if (absSeconds < 3600) return `${Math.floor(absSeconds / 60)} minutes ago`;
    if (absSeconds < 86400) return `${Math.floor(absSeconds / 3600)} hours ago`;
    if (absSeconds < 2592000) return `${Math.floor(absSeconds / 86400)} days ago`;
    return `${Math.floor(absSeconds / 2592000)} months ago`;
  }
  
  // If the event is in the future
  if (diffInSeconds < 60) return `in ${diffInSeconds} seconds`;
  if (diffInSeconds < 3600) return `in ${Math.floor(diffInSeconds / 60)} minutes`;
  if (diffInSeconds < 86400) return `in ${Math.floor(diffInSeconds / 3600)} hours`;
  if (diffInSeconds < 2592000) return `in ${Math.floor(diffInSeconds / 86400)} days`;
  return `in ${Math.floor(diffInSeconds / 2592000)} months`;
};

// Format a date range (for multi-day events)
export const formatDateRange = (startTimestamp, endTimestamp) => {
  const startDate = new Date(startTimestamp * 1000);
  const endDate = new Date(endTimestamp * 1000);
  
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = startDate.getMonth() === endDate.getMonth();
  
  const startFormat = sameYear 
    ? { month: 'long', day: 'numeric' } 
    : { year: 'numeric', month: 'long', day: 'numeric' };
    
  const endFormat = { year: 'numeric', month: 'long', day: 'numeric' };
  
  return `${startDate.toLocaleDateString(undefined, startFormat)} - ${endDate.toLocaleDateString(undefined, endFormat)}`;
};