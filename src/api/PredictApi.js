export async function predictEmployee(data) {
  const response = await fetch("http://192.168.41:8000/analysis", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });
  console.log("response", response);

  return response.json();
}
