import { useAtom } from "jotai";
import {
  neonApiKeyAtom,
  neonProjectsAtom,
  neonSelectedProjectAtom,
  neonLoadingAtom,
  neonErrorAtom,
} from "@/atoms/neonAtoms";
import { useCallback, useEffect } from "react";
import { IpcClient } from "@/ipc/ipc_client";
import { useSettings } from "@/hooks/useSettings";

export function useNeon() {
  const { settings, updateSettings } = useSettings();
  const [apiKey, setApiKey] = useAtom(neonApiKeyAtom);
  const [projects, setProjects] = useAtom(neonProjectsAtom);
  const [selectedProject, setSelectedProject] = useAtom(
    neonSelectedProjectAtom,
  );
  const [loading, setLoading] = useAtom(neonLoadingAtom);
  const [error, setError] = useAtom(neonErrorAtom);

  // Sync persisted API key from settings on load
  useEffect(() => {
    if (settings?.neon?.apiKey?.value) {
      setApiKey(settings.neon.apiKey.value);
    } else {
      setApiKey(null);
    }
  }, [settings, setApiKey]);

  // Helper: is API key set
  const apiKeySet = !!apiKey;

  // Set API key and update both backend and atom
  const saveApiKey = useCallback(
    async (key: string) => {
      await IpcClient.getInstance().setNeonApiKey(key);
      setApiKey(key);
      await updateSettings({ neon: { apiKey: { value: key } } });
    },
    [setApiKey, updateSettings],
  );

  // Load projects
  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const projs = await IpcClient.getInstance().listNeonProjects();
      setProjects(projs);
    } catch (e: any) {
      setError(e.message || "Failed to load Neon projects");
    } finally {
      setLoading(false);
    }
  }, [setProjects, setLoading, setError]);

  // Create project
  const createProject = useCallback(
    async (options?: any) => {
      setLoading(true);
      setError(null);
      try {
        const proj = await IpcClient.getInstance().createNeonProject(options);
        await loadProjects();
        return proj;
      } catch (e: any) {
        setError(e.message || "Failed to create Neon project");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [loadProjects, setLoading, setError],
  );

  // Delete project
  const deleteProject = useCallback(
    async (projectId: string) => {
      setLoading(true);
      setError(null);
      try {
        await IpcClient.getInstance().deleteNeonProject(projectId);
        await loadProjects();
      } catch (e: any) {
        setError(e.message || "Failed to delete Neon project");
      } finally {
        setLoading(false);
      }
    },
    [loadProjects, setLoading, setError],
  );

  // Run SQL
  const runSql = useCallback(
    async (projectId: string, query: string) => {
      setLoading(true);
      setError(null);
      try {
        return await IpcClient.getInstance().runNeonSql(projectId, query);
      } catch (e: any) {
        setError(e.message || "Failed to run SQL");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError],
  );

  // Select project
  const selectProject = useCallback(
    (projectId: string) => {
      setSelectedProject(projectId);
    },
    [setSelectedProject],
  );

  return {
    apiKey,
    apiKeySet,
    saveApiKey,
    projects,
    loadProjects,
    createProject,
    deleteProject,
    selectedProject,
    selectProject,
    runSql,
    loading,
    error,
  };
}
