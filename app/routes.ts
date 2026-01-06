import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("projects/:slug", "routes/project.tsx"),
  route("projects/:slug/changelogs/:version", "routes/changelog-detail.tsx"),
] satisfies RouteConfig;
