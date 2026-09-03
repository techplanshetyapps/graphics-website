// client/src/services/api.js
export async function fetchEcosystemLiveData(slug) {
  try {
    const response = await fetch(`/api/ecosystems/${slug}/live-data`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (err) {
    console.warn("Could not load live ecosystem metrics:", err);
    return null;
  }
}