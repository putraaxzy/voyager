import type { Route } from "./+types/changelog-detail";
import { getChangelogByVersion, getProjectBySlug } from "../lib/changelogs";

export function meta({ params }: Route.MetaArgs) {
  const project = getProjectBySlug(params.slug);
  return [
    { title: `${project?.name} v${params.version}` },
    {
      name: "description",
      content: `Changelog for ${project?.name} version ${params.version}`,
    },
  ];
}

const typeColors: Record<string, { label: string; bg: string; text: string }> =
  {
    added: { label: "Added", bg: "bg-emerald-50", text: "text-emerald-700" },
    fixed: { label: "Fixed", bg: "bg-blue-50", text: "text-blue-700" },
    changed: { label: "Changed", bg: "bg-amber-50", text: "text-amber-700" },
    removed: { label: "Removed", bg: "bg-red-50", text: "text-red-700" },
  };

export default function ChangelogDetail({ params }: Route.ComponentProps) {
  const project = getProjectBySlug(params.slug);
  const changelog = getChangelogByVersion(params.slug, params.version);

  if (!project || !changelog) {
    return (
      <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <a
            href="/"
            className="text-slate-700 hover:text-slate-900 text-sm font-medium mb-8 inline-block transition-colors"
          >
            ← Back to all projects
          </a>
          <div className="text-center py-12">
            <h1 className="text-2xl font-light text-slate-900 mb-2">
              Not found
            </h1>
            <p className="text-slate-500 font-light">
              The changelog for {project?.name} v{params.version} does not
              exist.
            </p>
          </div>
        </div>
        
        <style>{`
          @keyframes blob {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100"></div>
      
      {/* Floating blur elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 left-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <a
          href={`/projects/${project.slug}`}
          className="text-slate-700 hover:text-slate-900 text-sm font-medium mb-8 inline-block transition-colors"
        >
          ← Back to {project.name}
        </a>

        <div className="mb-10">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <p className="text-slate-500 text-sm mb-1 font-light">{project.name}</p>
              <h1 className="text-4xl sm:text-5xl font-light text-slate-900 tracking-tight">
                v{changelog.version}
              </h1>
            </div>
            <span className="text-slate-400 text-sm font-light">{changelog.date}</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-900"></div>
        </div>

        <div className="space-y-4">
          {changelog.changes.map((change, idx) => {
            const typeInfo = typeColors[change.type];
            return (
              <div
                key={idx}
                className="backdrop-blur-xl bg-white/70 border border-slate-200/50 rounded-2xl p-6 hover:bg-white/90 hover:shadow-lg hover:border-slate-300/50 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded ${typeInfo.text} ${typeInfo.bg}`}
                    >
                      {typeInfo.label}
                    </span>
                  </div>
                  <p className="text-slate-800 text-base leading-relaxed font-light">
                    {change.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200/50">
          <p className="text-slate-500 text-sm font-light">
            Release date: {changelog.date}
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
