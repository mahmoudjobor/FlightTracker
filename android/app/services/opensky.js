export const opensky = async () => {
  const url = "https://opensky-network.org/api/states/all";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response not ok: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};
