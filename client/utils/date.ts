export function formatTime(dateString: string): string {
  if (!dateString) return "";
  
  // Check if it's already in simple time format (contains AM/PM or just numbers with colon)
  // This helps compatibility with old data "04:30 PM"
  if (dateString.match(/\d{1,2}:\d{2}\s?(AM|PM)?/i) && !dateString.includes('T')) {
    return dateString;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatLastSeen(dateString: string): string {
  if (!dateString) return "";
  
  // Fallback for old simple time strings
  if (dateString.match(/\d{1,2}:\d{2}\s?(AM|PM)?/i) && !dateString.includes('T')) {
      return `Last seen at ${dateString}`;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "";
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
      return 'Last seen just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
      return `Last seen ${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
      return `Last seen ${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
      return `Last seen ${diffInDays}d ago`;
  }
  
  return `Last seen ${date.toLocaleDateString()}`;
}
