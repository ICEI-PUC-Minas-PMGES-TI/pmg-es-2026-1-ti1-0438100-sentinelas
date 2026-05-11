(async () => {
  const response = await fetch('http://localhost:3000/heatmap');

  const heatmapData = await response.json();
  console.log(heatmapData);
})();