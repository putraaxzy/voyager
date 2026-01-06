import { useState, useEffect } from "react";
import type { Route } from "./+types/home";
import React from "react";
import { allProjects, getLatestChangelog } from "../lib/changelogs";
import { FaTimes } from "react-icons/fa";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Changelog" },
    { name: "description", content: "Voyager Space - putrazxyo13" },
  ];
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState(allProjects || []); 
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const projectsSource = allProjects || []; 
      const filtered = projectsSource.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100"></div>
      
      {/* Floating blur elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 left-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-slate-900 mb-4 tracking-tight">
              VoyagerSpace
            </h1>
            <p className="text-xl text-slate-600">
               What's new in ma Project?
            </p>
          </div>

          {/* Search Bar - Redesigned */}
          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="pl-6 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 px-4 py-5 focus:outline-none text-base"
                placeholder="Search projects by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mr-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                  aria-label="Clear search"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProjects.map((project, index) => {
              const latest = getLatestChangelog(project.slug);
              return (
                <a
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group block animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="backdrop-blur-xl bg-white/70 border border-slate-200/50 rounded-2xl p-5 hover:bg-white/90 hover:shadow-lg hover:border-slate-300/50 transition-all duration-300 h-full relative overflow-hidden">
                    {/* Hover gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      {/* Project Name */}
                      <div className="mb-4">
                        <h2 className="text-lg font-light text-slate-900 group-hover:text-slate-700 transition-colors mb-2 line-clamp-2">
                          {project.name}
                        </h2>
                        <div className="h-0.5 w-8 bg-slate-900 group-hover:w-12 transition-all duration-300"></div>
                      </div>

                      {/* Latest Release Info */}
                      {latest && (
                        <div className="mb-4 space-y-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                              v{latest.version}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-light">
                            {latest.date}
                          </p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 mt-auto">
                        <span className="text-xs text-slate-500 font-light">
                          {project.changes?.length || 0} {(project.changes?.length || 0) === 1 ? 'release' : 'releases'}
                        </span>
                        <span className="text-slate-900 text-xs font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-300">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="backdrop-blur-xl bg-white/70 border border-slate-200/50 rounded-3xl p-12 max-w-md mx-auto">
              <p className="text-slate-600 font-light mb-4">No projects found</p>
              <p className="text-sm text-slate-400 mb-6">Try adjusting your search terms</p>
              <button
                onClick={clearSearch}
                className="text-slate-900 hover:text-slate-700 text-sm font-medium transition-colors underline underline-offset-4"
              >
                Clear search
              </button>
            </div>
          </div>
        )}
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