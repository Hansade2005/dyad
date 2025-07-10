import { ipcMain } from "electron";
import { NeonToolkit } from "@neondatabase/toolkit";
import { readSettings, writeSettings } from "../../main/settings";
import log from "electron-log";

const logger = log.scope("neon_handlers");

// In-memory store for projects (for demo; use secure storage in prod)
let neonToolkit: NeonToolkit | null = null;
let neonProjects: Record<string, any> = {};

// Helper to get Neon API key from persistent user settings
function getNeonApiKey() {
  const settings = readSettings();
  return settings.neon?.apiKey?.value;
}

ipcMain.handle("neon:set-api-key", async (_event, { apiKey }) => {
  writeSettings({
    neon: { apiKey: { value: apiKey } },
  });
  neonToolkit = new NeonToolkit(apiKey);
  logger.info("Neon API key updated via UI");
  return true;
});

ipcMain.handle("neon:create-project", async (_event, { projectOptions }) => {
  const apiKey = getNeonApiKey();
  if (!apiKey) throw new Error("Neon API key not set");
  neonToolkit = new NeonToolkit(apiKey);
  const project = await neonToolkit.createProject(projectOptions);
  neonProjects[project.project.id] = project;
  return project;
});

ipcMain.handle("neon:delete-project", async (_event, { projectId }) => {
  const apiKey = getNeonApiKey();
  if (!apiKey) throw new Error("Neon API key not set");
  neonToolkit = new NeonToolkit(apiKey);
  const project = neonProjects[projectId];
  if (!project) throw new Error("Project not found");
  await neonToolkit.deleteProject(project);
  delete neonProjects[projectId];
  return true;
});

ipcMain.handle("neon:list-projects", async () => {
  // Only lists locally created projects for now
  return Object.values(neonProjects);
});

ipcMain.handle("neon:run-sql", async (_event, { projectId, query }) => {
  const apiKey = getNeonApiKey();
  if (!apiKey) throw new Error("Neon API key not set");
  neonToolkit = new NeonToolkit(apiKey);
  const project = neonProjects[projectId];
  if (!project) throw new Error("Project not found");
  return neonToolkit.sql(project, query);
});
