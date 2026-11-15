import type { Metadata } from "next";
import { ProjectGallery } from "@/components/projects/project-gallery";

export const metadata: Metadata = {
  title: "نمونه پروژه‌های آسانسور",
  description: "مشاهده نمونه پروژه‌های مسکونی، تجاری و صنعتی شرکت آسانسور جام جم.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-[70vh] bg-slate-50">
      <section className="bg-dark-bg px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold text-gold-primary">تجربه اجرا، قابل مشاهده است</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">پروژه‌های آسانسور جام جم</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">نمونه‌ای از پروژه‌های مسکونی، تجاری و صنعتی انجام‌شده با مدیریت و نظارت آقای خوزان.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ProjectGallery />
      </section>
    </div>
  );
}
