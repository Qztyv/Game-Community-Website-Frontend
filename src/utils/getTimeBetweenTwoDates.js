import { Duration } from "luxon";

const getGeneralTimeSinceCreation = (currentDate, dateOfPost) => {
  let durationSincePost = Duration.fromMillis(
    new Date(currentDate) - new Date(dateOfPost)
  );

  let minutes = Math.floor(durationSincePost.as("minutes"));
  let hours = Math.floor(durationSincePost.as("hours"));
  let days = Math.floor(durationSincePost.as("days"));
  let weeks = Math.floor(durationSincePost.as("weeks"));
  let months = Math.floor(durationSincePost.as("months"));
  let years = Math.floor(durationSincePost.as("years"));

  if (minutes === 0 || minutes === -1) {
    return `Just now`;
  } else if (hours === 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (days === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (weeks === 0) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (months === 0) {
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (years === 0) {
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
};

export default getGeneralTimeSinceCreation;
