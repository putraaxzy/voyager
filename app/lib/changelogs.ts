export interface Change {
  type: "added" | "fixed" | "changed" | "removed";
  description: string;
}

export interface ChangeVersion {
  version: string;
  date: string;
  changes: Change[];
}

export interface ChangelogProject {
  name: string;
  slug: string;
  changes: ChangeVersion[];
}

// Auto-load all changelog JSON files dari folder changelogs
const changelogFiles = import.meta.glob<{ default: ChangelogProject }>(
  "../data/changelogs/*.json",
  { eager: true }
);

// Parse semua changelog files
const projectMap = new Map<string, ChangelogProject>();

Object.values(changelogFiles).forEach((module) => {
  const project = module.default;
  projectMap.set(project.slug, project);
});

export const allProjects = Array.from(projectMap.values());

// Get project by slug
export function getProjectBySlug(slug: string): ChangelogProject | undefined {
  return projectMap.get(slug);
}

// Get changelog by project slug dan version
export function getChangelogByVersion(
  projectSlug: string,
  version: string
): ChangeVersion | undefined {
  const project = projectMap.get(projectSlug);
  return project?.changes.find((log) => log.version === version);
}

// Get all versions for a project
export function getProjectVersions(projectSlug: string): ChangeVersion[] {
  const project = projectMap.get(projectSlug);
  return project?.changes || [];
}

// Get latest changelog for a project
export function getLatestChangelog(
  projectSlug: string
): ChangeVersion | undefined {
  const project = projectMap.get(projectSlug);
  return project?.changes[0];
}
