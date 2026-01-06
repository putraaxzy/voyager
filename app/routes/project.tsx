import type { Route } from "./+types/project";
import { getProjectBySlug } from "../lib/changelogs";

export function meta({ params }: Route.MetaArgs) {
  const project = getProjectBySlug(params.slug);
  return [
    { title: project?.name || "Project" },
    { name: "description", content: `Changelog for ${project?.name}` },
  ];
}

const typeIcons: Record<string, string> = {
  added: "▲",
  fixed: "✓",
  changed: "◆",
  removed: "✕",
};

const typeColors: Record<string, { text: string; bg: string }> = {
  added: { text: "text-emerald-700", bg: "bg-emerald-50" },
  fixed: { text: "text-blue-700", bg: "bg-blue-50" },
  changed: { text: "text-amber-700", bg: "bg-amber-50" },
  removed: { text: "text-red-700", bg: "bg-red-50" },
};

export default function ProjectChangelogs({ params }: Route.ComponentProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <a
            href="/"
            className="text-slate-700 hover:text-slate-900 text-sm font-medium mb-8 inline-block transition-colors"
          >
            ← Back to all projects
          </a>
          <div className="text-center py-12">
            <h1 className="text-2xl font-light text-slate-900 mb-2">
              Project not found
            </h1>
            <p className="text-slate-500 font-light">
              The project "{params.slug}" does not exist.
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
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <a
          href="/"
          className="text-slate-700 hover:text-slate-900 text-sm font-medium mb-8 inline-block transition-colors"
        >
          ← Back to all projects
        </a>

        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-light text-slate-900 mb-2 tracking-tight">
            {project.name}
          </h1>
          <p className="text-base text-slate-500 font-light">
            {project.changes.length} {project.changes.length === 1 ? 'release' : 'releases'}
          </p>
        </div>

        <div className="space-y-4">
          {project.changes.map((changelog, index) => (
            <a
              key={index}
              href={`/projects/${project.slug}/changelogs/${changelog.version}`}
              className="group block animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="backdrop-blur-xl bg-white/70 border border-slate-200/50 rounded-2xl p-6 hover:bg-white/90 hover:shadow-lg hover:border-slate-300/50 transition-all duration-300 relative overflow-hidden">
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-light text-slate-900 group-hover:text-slate-700 transition-colors">
                        v{changelog.version}
                      </h2>
                    </div>
                    <span className="text-sm text-slate-400">{changelog.date}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {changelog.changes.slice(0, 3).map((change, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                          typeColors[change.type].bg
                        } ${typeColors[change.type].text}`}
                      >
                        <span>{typeIcons[change.type]}</span>
                        {change.type.charAt(0).toUpperCase() +
                          change.type.slice(1)}
                      </span>
                    ))}
                    {changelog.changes.length > 3 && (
                      <span className="text-xs text-slate-500">
                        +{changelog.changes.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {changelog.changes.slice(0, 2).map((change, idx) => (
                      <p key={idx} className="text-slate-700 text-sm line-clamp-1 font-light">
                        {change.description}
                      </p>
                    ))}
                    {changelog.changes.length > 2 && (
                      <p className="text-slate-400 text-sm font-light italic">
                        {changelog.changes.length - 2} more changes...
                      </p>
                    )}
                  </div>

                  <div className="mt-4 text-slate-900 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                    View details
                    <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
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
        
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
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
