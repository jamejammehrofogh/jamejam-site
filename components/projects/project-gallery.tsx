"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpLeft, Building2, MapPin, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { projectCategoryLabels, projects, type Project } from "@/lib/projects-data";

type Category = keyof typeof projectCategoryLabels;

export function ProjectGallery() {
  const [category, setCategory] = useState<Category>("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const filtered = useMemo(
    () => projects.filter((project) => category === "all" || project.category === category),
    [category],
  );

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selected]);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(Object.keys(projectCategoryLabels) as Category[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCategory(key)}
            aria-pressed={category === key}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${category === key ? "bg-brand text-white" : "border border-slate-200 text-slate-600 hover:border-brand hover:text-brand"}`}
          >
            {projectCategoryLabels[key]}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, index) => (
          <motion.button
            key={project.id}
            type="button"
            onClick={() => setSelected(project)}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            className="group overflow-hidden rounded-2xl border border-slate-100 bg-white text-right shadow-sm transition hover:-translate-y-1 hover:shadow-card"
          >
            <div
              role="img"
              aria-label={`تصویر پروژه ${project.title}`}
              className="relative aspect-[4/3] bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
              style={{ backgroundImage: `linear-gradient(0deg,rgba(16,43,63,.5),transparent 65%),url("${project.image}")` }}
            >
              <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink">{projectCategoryLabels[project.category]}</span>
              <span className="absolute bottom-4 left-4 grid h-9 w-9 place-items-center rounded-full bg-white text-brand opacity-0 transition group-hover:opacity-100"><ArrowUpLeft size={17} /></span>
            </div>
            <div className="p-5">
              <h2 className="font-extrabold text-ink">{project.title}</h2>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={15} /> {project.location}</p>
              <p className="mt-3 text-xs text-slate-500">{project.type} · {project.stops}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-ink/65 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelected(null);
            }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="my-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div
                role="img"
                aria-label={`نمای پروژه ${selected.title}`}
                className="relative h-56 bg-cover bg-center sm:h-80"
                style={{ backgroundImage: `linear-gradient(0deg,rgba(16,43,63,.35),transparent 70%),url("${selected.image}")` }}
              >
                <button type="button" onClick={() => setSelected(null)} aria-label="بستن جزئیات پروژه" className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow"><X size={19} /></button>
              </div>
              <div className="p-5 sm:p-8">
                <span className="text-xs font-bold text-brand">{projectCategoryLabels[selected.category]}</span>
                <h2 id="project-modal-title" className="mt-2 text-2xl font-black text-ink">{selected.title}</h2>
                <div className="mt-5 grid gap-4 rounded-2xl bg-mist p-4 sm:grid-cols-2">
                  <p className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={16} className="text-brand" />{selected.location}</p>
                  <p className="flex items-center gap-2 text-sm text-slate-600"><Building2 size={16} className="text-brand" />{selected.type}</p>
                  <p className="text-sm text-slate-600">ظرفیت: <strong className="text-ink">{selected.capacity}</strong></p>
                  <p className="text-sm text-slate-600">توقف: <strong className="text-ink">{selected.stops}</strong></p>
                  {selected.specs.map(([label, value]) => (
                    <p key={label} className="text-sm text-slate-600">{label}: <strong className="text-ink">{value}</strong></p>
                  ))}
                </div>
                <Link href="/quote?service=installation" onClick={() => setSelected(null)} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark">
                  درخواست اجرای پروژه مشابه <ArrowLeft size={16} />
                </Link>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
