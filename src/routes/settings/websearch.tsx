import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/routes/root";
import { WebsearchSettingsPage } from "@/components/settings/WebsearchSettingsPage";

export const websearchSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/websearch",
  component: WebsearchSettingsPage,
});
