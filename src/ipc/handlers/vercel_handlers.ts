import log from "electron-log";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { apps } from "../../db/schema";
import { createLoggedHandler } from "./safe_handle";
import fetch, { Response as NodeFetchResponse } from "node-fetch";
import { readSettings, writeSettings } from "../../main/settings";

const logger = log.scope("vercel_handlers");
const handle = createLoggedHandler(logger);

// Helper to get Vercel access token from persistent user settings
function getVercelAccessToken() {
  return readSettings().vercel?.apiKey?.value || process.env.VERCEL_TOKEN;
}

// Fetch Vercel projects using the Vercel API, with teamId and pagination support
async function fetchVercelProjects(teamId?: string) {
  const token = getVercelAccessToken();
  if (!token)
    throw new Error("No Vercel access token found. Please authenticate.");
  let url = "https://api.vercel.com/v9/projects";
  if (teamId) url += `?teamId=${teamId}`;
  let projects: any[] = [];
  let next: string | null = null;
  do {
    const pageUrl: string = next
      ? `${url}${teamId ? "&" : "?"}until=${next}`
      : url;
    const res: NodeFetchResponse = await fetch(pageUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err: string = await res.text();
      throw new Error(`Vercel API error: ${res.status} ${err}`);
    }
    const data: any = await res.json();
    projects.push(...(data.projects || []));
    next = data.pagination?.next ?? null;
  } while (next);
  return projects;
}

export function registerVercelHandlers() {
  // List Vercel projects (real API, with teamId support)
  handle("vercel:list-projects", async (_event, { teamId } = {}) => {
    return fetchVercelProjects(teamId);
  });

  // Set Vercel access token in settings (for UI token entry)
  handle("vercel:set-token", async (_event, { token }) => {
    writeSettings({
      vercel: { apiKey: { value: token } },
    });
    logger.info("Vercel access token updated via UI");
  });

  // Set app project - links a Dyad app to a Vercel project
  handle(
    "vercel:set-app-project",
    async (_, { project, app }: { project: string; app: number }) => {
      await db
        .update(apps)
        .set({ vercelProjectId: project })
        .where(eq(apps.id, app));
      logger.info(`Associated app ${app} with Vercel project ${project}`);
    },
  );

  // Unset app project - removes the link between a Dyad app and a Vercel project
  handle("vercel:unset-app-project", async (_, { app }: { app: number }) => {
    await db
      .update(apps)
      .set({ vercelProjectId: null })
      .where(eq(apps.id, app));
    logger.info(`Removed Vercel project association for app ${app}`);
  });

  // Trigger a deployment for a Vercel project
  handle(
    "vercel:deploy-project",
    async (_event, { projectId, teamId, payload }) => {
      const token = getVercelAccessToken();
      if (!token)
        throw new Error("No Vercel access token found. Please authenticate.");
      let url = `https://api.vercel.com/v13/deployments`;
      if (teamId) url += `?teamId=${teamId}`;
      const res: NodeFetchResponse = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectId, // project name or id
          ...payload, // additional deployment payload (files, env, etc.)
        }),
      });
      if (!res.ok) {
        const err: string = await res.text();
        throw new Error(`Vercel Deploy API error: ${res.status} ${err}`);
      }
      const data: any = await res.json();
      logger.info(`Triggered deployment for Vercel project ${projectId}`);
      return data;
    },
  );

  // Fetch deployment status by deployment ID
  handle(
    "vercel:get-deployment-status",
    async (_event, { deploymentId, teamId }) => {
      const token = getVercelAccessToken();
      if (!token)
        throw new Error("No Vercel access token found. Please authenticate.");
      let url = `https://api.vercel.com/v13/deployments/${deploymentId}`;
      if (teamId) url += `?teamId=${teamId}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Vercel API error: ${res.status} ${err}`);
      }
      return await res.json();
    },
  );

  // Fetch deployment logs by deployment ID
  handle(
    "vercel:get-deployment-logs",
    async (_event, { deploymentId, teamId }) => {
      const token = getVercelAccessToken();
      if (!token)
        throw new Error("No Vercel access token found. Please authenticate.");
      let url = `https://api.vercel.com/v2/deployments/${deploymentId}/events`;
      if (teamId) url += `?teamId=${teamId}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Vercel API error: ${res.status} ${err}`);
      }
      return await res.json();
    },
  );

  // List environment variables for a project
  handle("vercel:list-envs", async (_event, { projectId, teamId }) => {
    const token = getVercelAccessToken();
    if (!token)
      throw new Error("No Vercel access token found. Please authenticate.");
    let url = `https://api.vercel.com/v10/projects/${projectId}/env`;
    if (teamId) url += `?teamId=${teamId}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok)
      throw new Error(`Vercel API error: ${res.status} ${await res.text()}`);
    return await res.json();
  });

  // Add or update environment variable
  handle("vercel:add-env", async (_event, { projectId, teamId, env }) => {
    const token = getVercelAccessToken();
    if (!token)
      throw new Error("No Vercel access token found. Please authenticate.");
    let url = `https://api.vercel.com/v10/projects/${projectId}/env`;
    if (teamId) url += `?teamId=${teamId}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(env),
    });
    if (!res.ok)
      throw new Error(`Vercel API error: ${res.status} ${await res.text()}`);
    return await res.json();
  });

  // Delete environment variable
  handle("vercel:delete-env", async (_event, { projectId, teamId, envId }) => {
    const token = getVercelAccessToken();
    if (!token)
      throw new Error("No Vercel access token found. Please authenticate.");
    let url = `https://api.vercel.com/v10/projects/${projectId}/env/${envId}`;
    if (teamId) url += `?teamId=${teamId}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok)
      throw new Error(`Vercel API error: ${res.status} ${await res.text()}`);
    return { success: true };
  });

  // List project domains
  handle("vercel:list-domains", async (_event, { projectId, teamId }) => {
    const token = getVercelAccessToken();
    if (!token)
      throw new Error("No Vercel access token found. Please authenticate.");
    let url = `https://api.vercel.com/v10/projects/${projectId}/domains`;
    if (teamId) url += `?teamId=${teamId}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok)
      throw new Error(`Vercel API error: ${res.status} ${await res.text()}`);
    return await res.json();
  });

  // Add domain to project
  handle("vercel:add-domain", async (_event, { projectId, teamId, domain }) => {
    const token = getVercelAccessToken();
    if (!token)
      throw new Error("No Vercel access token found. Please authenticate.");
    let url = `https://api.vercel.com/v10/projects/${projectId}/domains`;
    if (teamId) url += `?teamId=${teamId}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(domain),
    });
    if (!res.ok)
      throw new Error(`Vercel API error: ${res.status} ${await res.text()}`);
    return await res.json();
  });

  // Remove domain from project
  handle(
    "vercel:remove-domain",
    async (_event, { projectId, teamId, domain }) => {
      const token = getVercelAccessToken();
      if (!token)
        throw new Error("No Vercel access token found. Please authenticate.");
      let url = `https://api.vercel.com/v10/projects/${projectId}/domains/${domain}`;
      if (teamId) url += `?teamId=${teamId}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok)
        throw new Error(`Vercel API error: ${res.status} ${await res.text()}`);
      return { success: true };
    },
  );
}
