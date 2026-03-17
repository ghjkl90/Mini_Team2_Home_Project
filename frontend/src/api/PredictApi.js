export async function predictEmployee(data) {
  const response = await fetch("http://192.168.0.2:8000/analysis", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  return response.json();
}
