export const SERVER_URL =
  process.env.NODE_ENV === "production" ? "/py" : "http://localhost:5000";

export const URL = {
  SERVER_URL,
  Home: "/mains",
};

export const MAIN_CONTENT = {
  Home: "/mains",
  Forecast: "/mains/forecast",
};
