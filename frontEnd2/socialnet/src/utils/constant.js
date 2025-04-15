export const USER_API_END_POINT = "http://localhost:8084/api/v1/user";
export const POST_API_END_POINT = "http://localhost:8084/api/v1/post";

export const timeSince = (timestamp) => {
  if (!timestamp) return "Invalid date";

  let time = Date.parse(timestamp);
  if (isNaN(time)) return "Invalid date";

  let now = Date.now();
  let secondsPast = (now - time) / 1000;

  if (secondsPast < 1) return "just now";

  let suffix = "ago";
  let intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (let i in intervals) {
    let interval = intervals[i];
    if (secondsPast >= interval) {
      let count = Math.floor(secondsPast / interval);
      return `${count} ${i}${count > 1 ? "s" : ""} ${suffix}`;
    }
  }

  return "just now";
};
