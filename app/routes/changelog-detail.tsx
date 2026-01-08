import React, { useState } from "react";
import type { Route } from "./+types/changelog-detail";
import { getChangelogByVersion, getProjectBySlug } from "../lib/changelogs";

export function meta({ params }: Route.MetaArgs) {
  const project = getProjectBySlug(params.slug);
  return [
    { title: `${project?.name} ${params.version}` },
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top listener
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!project || !changelog) {
    return (
      <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Not Found View */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100"></div>
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
              The changelog for {project?.name} {params.version} does not
              exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setCurrentMediaIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.media) {
      setCurrentMediaIndex((prev) => (prev + 1) % project.media!.length);
    }
  };

  const prevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.media) {
      setCurrentMediaIndex(
        (prev) => (prev - 1 + project.media!.length) % project.media!.length
      );
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 relative font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>

      {/* Thumbnail/Banner - Mobile Optimized */}
      {project.thumbnail && (
        <div className="relative w-full h-auto aspect-[16/9] md:h-[500px] md:aspect-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10"></div>
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      <div
        className={`relative z-10 max-w-4xl mx-auto px-3 sm:px-4 md:px-6 ${project.thumbnail ? "-mt-8 sm:-mt-12 md:-mt-32" : "py-8 sm:py-12"
          }`}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 md:p-10 mb-8 sm:mb-10">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <a
              href={`/projects/${project.slug}`}
              className="text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-medium mb-4 sm:mb-6 inline-block transition-colors"
            >
              ← Back to {project.name}
            </a>

            <div className="flex flex-col gap-2 mb-6">
              <div className="min-w-0 w-full">
                <h1 className="text-sm sm:text-base md:text-xl font-light text-slate-900 tracking-tight mb-1 sm:mb-2 leading-snug break-all" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' }}>
                  {changelog.version.startsWith('v') ? changelog.version.substring(1) : changelog.version}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-light">
                  {project.name} Update
                </p>
              </div>
              <span className="text-slate-400 text-xs font-mono bg-slate-100 px-2 sm:px-3 py-1 rounded-full w-fit shrink-0">
                {changelog.date}
              </span>
            </div>

            {/* Notes - Improved Styling */}
            {changelog.notes && (
              <div className="mb-8 bg-blue-50/50 p-4 sm:p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  {/* Handle Markdown-like bolding for 'Pemberitahuan:' */}
                  {changelog.notes.split("\n").map((line, i) => (
                    <p
                      key={i}
                      className={`text-sm sm:text-base text-slate-600 font-light leading-relaxed ${line.trim() === "" ? "h-2" : ""
                        }`}
                    >
                      {line.includes("**") ? (
                        <span className="font-semibold text-slate-800">
                          {line.replace(/\*\*/g, "")}
                        </span>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Media Gallery */}
          {project.media && project.media.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Gallery
              </h3>
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-2 px-2">
                {project.media.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => openLightbox(idx)}
                    className="flex-none w-[120px] md:w-[200px] aspect-[9/16] snap-center rounded-xl md:rounded-2xl overflow-hidden shadow-md bg-slate-200 cursor-pointer hover:opacity-90 transition-opacity group relative"
                  >
                    {/* Play icon overlay for videos */}
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 pointer-events-none">
                        <div className="bg-white/30 backdrop-blur-sm p-2 rounded-full">
                          <svg
                            className="w-6 h-6 text-white fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={`Gallery item ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Changes List */}
          <div className="mb-12">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              Changelog
            </h3>
            <div className="space-y-3">
              {changelog.changes.map((change, idx) => {
                const typeInfo = typeColors[change.type];
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span
                      className={`shrink-0 text-[9px] sm:text-[10px] uppercase font-bold px-2 py-0.5 rounded-md tracking-wide w-fit ${typeInfo.text} ${typeInfo.bg}`}
                    >
                      {typeInfo.label}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 font-light leading-relaxed">
                      {change.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Downloads Section (Link Style) */}
          {project.downloadLinks && project.downloadLinks.length > 0 && (
            <div className="mb-12 pt-6 sm:pt-8 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">
                Downloads
              </h3>
              <div className="flex flex-col gap-2 sm:gap-3 items-start">
                {project.downloadLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-light text-xs sm:text-sm flex items-center gap-2 transition-colors group"
                  >
                    <span className="bg-blue-50 p-1 sm:p-1.5 rounded-lg group-hover:bg-blue-100 transition-colors flex-shrink-0">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                    </span>
                    <span className="break-words">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Credits Section */}
          {project.credits && project.credits.length > 0 && (
            <div className="pt-6 sm:pt-8 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">
                Credits
              </h3>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {project.credits.map((credit, idx) => (
                  <div key={idx} className="text-xs sm:text-sm group">
                    {credit.url ? (
                      <a
                        href={credit.url}
                        className="font-medium text-slate-800 hover:text-blue-600 transition-colors flex items-center gap-1 break-words"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {credit.name}
                        <svg
                          className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    ) : (
                      <span className="font-medium text-slate-800 break-words">
                        {credit.name}
                      </span>
                    )}
                    <p className="text-slate-500 font-light text-xs mt-0.5">
                      {credit.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && project.media && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevMedia}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 md:p-4 transition-colors z-[60]"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            onClick={nextMedia}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 md:p-4 transition-colors z-[60]"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div
            className="relative max-w-full max-h-full aspect-[9/16] h-[85vh] md:h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {project.media[currentMediaIndex].type === "image" ? (
              <img
                src={project.media[currentMediaIndex].url}
                className="h-full w-full object-contain rounded-lg"
                alt="Full view"
              />
            ) : (
              <video
                src={project.media[currentMediaIndex].url}
                controls
                className="h-full w-full object-contain rounded-lg"
                autoPlay
              />
            )}

            <button
              onClick={closeLightbox}
              className="absolute -top-10 right-0 md:top-4 md:right-4 text-white hover:text-gray-300 z-50 bg-white/10 rounded-full p-2 backdrop-blur-md"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 sm:bottom-8 right-6 sm:right-8 bg-black text-white p-2 sm:p-3 rounded-full shadow-2xl transition-all duration-300 z-40 hover:scale-110 hover:shadow-black/20 ${showScrollTop
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        aria-label="Scroll to top"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
    </div>
  );
}
