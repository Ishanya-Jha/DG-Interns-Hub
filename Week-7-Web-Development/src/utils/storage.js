const KEY = "dgih-saved-jobs";

export function getSavedJobs() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleSavedJob(id) {
  const saved = getSavedJobs();
  const updated = saved.includes(id)
    ? saved.filter((jobId) => jobId !== id)
    : [...saved, id];
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}