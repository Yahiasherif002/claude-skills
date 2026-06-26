import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Github, Star, GitFork, Users, BookMarked, ExternalLink } from "lucide-react";

// GitHub language colors (subset) — falls back to a neutral gray.
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5", "C#": "#178600",
  HTML: "#e34c26", CSS: "#563d7c", Java: "#b07219", Go: "#00ADD8", Rust: "#dea584",
  Shell: "#89e051", Dockerfile: "#384d54", "Jupyter Notebook": "#DA5B0B", C: "#555555",
  "C++": "#f34b7d", Vue: "#41b883", PHP: "#4F5D95", Ruby: "#701516", Kotlin: "#A97BFF",
  Swift: "#F05138", Dart: "#00B4AB",
};
const colorFor = (l?: string | null) => (l && LANG_COLORS[l]) || "#8b949e";

interface Repo { name: string; html_url: string; stargazers_count: number; forks_count: number; language: string | null; fork: boolean }
interface Profile { public_repos: number; followers: number; following: number }

/** Small count-up that animates once it scrolls into view. */
function CountUp({ end, duration = 1200 }: { end: number; duration?: number }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / duration, 1);
          setV(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{v}</span>;
}

export default function GitHubActivity({ username }: { username: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const cacheKey = `gh-data-${username}`;

  useEffect(() => {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try { const d = JSON.parse(cached); setProfile(d.profile); setRepos(d.repos); setStatus("ok"); return; } catch { /* refetch */ }
    }
    (async () => {
      try {
        const [p, r] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`).then((x) => (x.ok ? x.json() : Promise.reject())),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`).then((x) => (x.ok ? x.json() : Promise.reject())),
        ]);
        setProfile(p); setRepos(Array.isArray(r) ? r : []); setStatus("ok");
        sessionStorage.setItem(cacheKey, JSON.stringify({ profile: p, repos: r }));
      } catch { setStatus("error"); }
    })();
  }, [username, cacheKey]);

  const own = repos.filter((r) => !r.fork);
  const totalStars = own.reduce((s, r) => s + r.stargazers_count, 0);
  const langCounts = new Map<string, number>();
  for (const r of own) if (r.language) langCounts.set(r.language, (langCounts.get(r.language) || 0) + 1);
  const langTotal = Array.from(langCounts.values()).reduce((a, b) => a + b, 0) || 1;
  const topLangs = Array.from(langCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const topRepos = [...own].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);

  const stats = [
    { icon: BookMarked, label: "Public repos", value: profile?.public_repos ?? 0 },
    { icon: Star, label: "Total stars", value: totalStars },
    { icon: Users, label: "Followers", value: profile?.followers ?? 0 },
    { icon: Users, label: "Following", value: profile?.following ?? 0 },
  ];

  if (status === "error") {
    return (
      <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-border bg-card/60 px-4 py-3 hover:border-primary/50 transition-colors">
        <Github className="w-5 h-5" /> <span>View on GitHub: github.com/{username}</span> <ExternalLink className="w-4 h-4" />
      </a>
    );
  }

  return (
    <motion.div className="space-y-6" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            className="border border-border bg-card/60 p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><s.icon className="w-4 h-4 text-primary" /> {s.label}</div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">{status === "loading" ? "—" : <CountUp end={s.value} />}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} className="border border-border bg-card/60 p-5">
          <h3 className="font-bold mb-4">Most used languages</h3>
          {status === "loading" ? <div className="h-2.5 w-full bg-muted animate-pulse rounded-full" /> : (
            <>
              <div className="flex w-full h-2.5 rounded-full overflow-hidden mb-4">
                {topLangs.map(([lang, count]) => (
                  <div key={lang} style={{ width: `${(count / langTotal) * 100}%`, backgroundColor: colorFor(lang) }} title={lang} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                {topLangs.map(([lang, count]) => (
                  <div key={lang} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colorFor(lang) }} />
                    <span className="text-foreground/90 truncate">{lang}</span>
                    <span className="text-muted-foreground ml-auto">{Math.round((count / langTotal) * 100)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} className="border border-border bg-card/60 p-5">
          <h3 className="font-bold mb-4">Top repositories</h3>
          <div className="space-y-3">
            {(status === "loading" ? Array.from({ length: 4 }) : topRepos).map((r, i) =>
              status === "loading" ? <div key={i} className="h-6 bg-muted/60 animate-pulse rounded" /> : (
                <a key={(r as Repo).name} href={(r as Repo).html_url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-sm">
                  <span className="text-primary group-hover:underline truncate font-medium">{(r as Repo).name}</span>
                  <span className="flex items-center gap-3 ml-auto shrink-0 text-muted-foreground text-xs">
                    {(r as Repo).language && (
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorFor((r as Repo).language) }} />{(r as Repo).language}</span>
                    )}
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" />{(r as Repo).stargazers_count}</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{(r as Repo).forks_count}</span>
                  </span>
                </a>
              )
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
