import React from "react";

interface ChangeEntry {
  version: string;
  date: string;
  changes: {
    type: "added" | "fixed" | "changed" | "removed";
    description: string;
  }[];
}

interface ChangelogListProps {
  entries: ChangeEntry[];
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

export function ChangelogList({ entries }: ChangelogListProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Changelog</h1>
          <p className="text-lg text-gray-600">Release notes and updates</p>
        </div>

        <div className="space-y-6">
          {entries.map((entry, index) => (
            <a
              key={index}
              href={`/changelogs/${entry.version}`}
              className="block group"
            >
              <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      v{entry.version}
                    </h2>
                  </div>
                  <span className="text-sm text-gray-500">{entry.date}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {entry.changes.slice(0, 3).map((change, idx) => (
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
                  {entry.changes.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{entry.changes.length - 3} more
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {entry.changes.slice(0, 2).map((change, idx) => (
                    <p key={idx} className="text-gray-700 text-sm line-clamp-1">
                      {change.description}
                    </p>
                  ))}
                  {entry.changes.length > 2 && (
                    <p className="text-gray-500 text-sm italic">
                      {entry.changes.length - 2} more changes...
                    </p>
                  )}
                </div>

                <div className="mt-4 text-blue-600 text-sm font-medium group-hover:text-blue-700">
                  View details →
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
