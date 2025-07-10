import { useCallback } from "react";
import { useAtom } from "jotai";
import {
  vercelProjectsAtom,
  vercelLoadingAtom,
  vercelErrorAtom,
  selectedVercelProjectAtom,
} from "@/atoms/vercelAtoms";
import { IpcClient } from "@/ipc/ipc_client";

export function useVercel() {
  const [projects, setProjects] = useAtom(vercelProjectsAtom);
  const [loading, setLoading] = useAtom(vercelLoadingAtom);
  const [error, setError] = useAtom(vercelErrorAtom);
  const [selectedProject, setSelectedProject] = useAtom(
    selectedVercelProjectAtom,
  );

  const ipcClient = IpcClient.getInstance();

  /**
   * Load Vercel projects from the API
   */
  const loadProjects = useCallback(
    async (teamId?: string) => {
      setLoading(true);
      try {
        const projectList = await ipcClient.listVercelProjects(teamId);
        setProjects(projectList);
        setError(null);
      } catch (error) {
        console.error("Error loading Vercel projects:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setLoading(false);
      }
    },
    [ipcClient, setProjects, setError, setLoading],
  );

  /**
   * Associate a Vercel project with an app
   */
  const setAppProject = useCallback(
    async (projectId: string, appId: number) => {
      setLoading(true);
      try {
        await ipcClient.setVercelAppProject(projectId, appId);
        setError(null);
      } catch (error) {
        console.error("Error setting Vercel project for app:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [ipcClient, setError, setLoading],
  );

  /**
   * Remove a Vercel project association from an app
   */
  const unsetAppProject = useCallback(
    async (appId: number) => {
      setLoading(true);
      try {
        await ipcClient.unsetVercelAppProject(appId);
        setError(null);
      } catch (error) {
        console.error("Error unsetting Vercel project for app:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [ipcClient, setError, setLoading],
  );

  /**
   * Select a project for current use
   */
  const selectProject = useCallback(
    (projectId: string | null) => {
      setSelectedProject(projectId);
    },
    [setSelectedProject],
  );

  /**
   * Deploy the selected Vercel project
   */
  const deployProject = useCallback(
    async (projectId: string, teamId?: string, payload?: any) => {
      setLoading(true);
      try {
        const result = await ipcClient.deployVercelProject(
          projectId,
          teamId,
          payload,
        );
        setError(null);
        return result;
      } catch (error) {
        setError(error instanceof Error ? error : new Error(String(error)));
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [ipcClient, setError, setLoading],
  );

  const getDeploymentStatus = useCallback(
    async (deploymentId: string, teamId?: string) => {
      return ipcClient.getVercelDeploymentStatus(deploymentId, teamId);
    },
    [ipcClient],
  );

  const getDeploymentLogs = useCallback(
    async (deploymentId: string, teamId?: string) => {
      return ipcClient.getVercelDeploymentLogs(deploymentId, teamId);
    },
    [ipcClient],
  );

  const listEnvs = useCallback(
    async (projectId: string, teamId?: string) => {
      return ipcClient.listVercelEnvs(projectId, teamId);
    },
    [ipcClient],
  );
  const addEnv = useCallback(
    async (projectId: string, env: any, teamId?: string) => {
      return ipcClient.addVercelEnv(projectId, env, teamId);
    },
    [ipcClient],
  );
  const deleteEnv = useCallback(
    async (projectId: string, envId: string, teamId?: string) => {
      return ipcClient.deleteVercelEnv(projectId, envId, teamId);
    },
    [ipcClient],
  );
  const listDomains = useCallback(
    async (projectId: string, teamId?: string) => {
      return ipcClient.listVercelDomains(projectId, teamId);
    },
    [ipcClient],
  );
  const addDomain = useCallback(
    async (projectId: string, domain: any, teamId?: string) => {
      return ipcClient.addVercelDomain(projectId, domain, teamId);
    },
    [ipcClient],
  );
  const removeDomain = useCallback(
    async (projectId: string, domain: string, teamId?: string) => {
      return ipcClient.removeVercelDomain(projectId, domain, teamId);
    },
    [ipcClient],
  );

  return {
    projects,
    loading,
    error,
    selectedProject,
    loadProjects,
    setAppProject,
    unsetAppProject,
    selectProject,
    deployProject,
    getDeploymentStatus,
    getDeploymentLogs,
    listEnvs,
    addEnv,
    deleteEnv,
    listDomains,
    addDomain,
    removeDomain,
  };
}
