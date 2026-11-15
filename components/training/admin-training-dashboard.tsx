"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  Ban,
  Download,
  FileSpreadsheet,
  GraduationCap,
  History,
  Pencil,
  RotateCcw,
  Search,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { CertificateStatusBadge } from "@/components/training/certificate-status-badge";
import {
  COURSE_CATEGORY_LABELS,
  COURSE_STATUS_LABELS,
  serializeDate,
  type Certificate,
  type TrainingCourse,
} from "@/lib/training/types";
import {
  downloadCertificatePdf,
  parseStudentsCsv,
} from "@/lib/training/helpers";

type Tab = "courses" | "issue" | "registry" | "log";

const TABS: { key: Tab; label: string; icon: typeof Award }[] = [
  { key: "courses", label: "دوره‌های آموزشی", icon: GraduationCap },
  { key: "issue", label: "صدور گواهینامه", icon: Award },
  { key: "registry", label: "سامانه گواهینامه‌ها", icon: Users },
  { key: "log", label: "تاریخچه", icon: History },
];

interface AuditEntry {
  id: string;
  action: string;
  serial: string | null;
  detail: string;
  createdAt: string;
}

export function AdminTrainingDashboard() {
  const [tab, setTab] = useState<Tab>("courses");
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [log, setLog] = useState<AuditEntry[]>([]);
  const [editingCourse, setEditingCourse] = useState<TrainingCourse | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);

  const refresh = useCallback(async () => {
    const [coursesRes, certsRes, logRes] = await Promise.all([
      fetch("/api/training/courses"),
      fetch("/api/training/certificates"),
      fetch("/api/training/log"),
    ]);
    setCourses((await coursesRes.json()).courses ?? []);
    setCertificates((await certsRes.json()).certificates ?? []);
    setLog((await logRes.json()).log ?? []);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const activeCourses = useMemo(
    () => courses.filter((c) => c.status !== "closed"),
    [courses],
  );

  async function saveCourse(data: Omit<TrainingCourse, "id" | "createdAt">, id?: string) {
    const res = await fetch(id ? `/api/training/courses/${id}` : "/api/training/courses", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      toast.error("ذخیره دوره ناموفق بود.");
      return false;
    }
    toast.success(id ? "دوره ویرایش شد." : "دوره جدید ایجاد شد.");
    await refresh();
    return true;
  }

  async function issueCertificates(students: { name: string; nationalId: string }[], courseId: string, grade: string) {
    const res = await fetch("/api/training/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ students, courseId, grade }),
    });
    if (!res.ok) {
      toast.error("صدور گواهینامه ناموفق بود.");
      return [];
    }
    const { certificates: issued } = (await res.json()) as { certificates: Certificate[] };
    toast.success(`${issued.length} گواهینامه صادر شد.`);
    await refresh();
    return issued;
  }

  async function patchCertificate(id: string, body: Record<string, unknown>, successMessage: string) {
    const res = await fetch(`/api/training/certificates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      toast.error("عملیات ناموفق بود.");
      return false;
    }
    toast.success(successMessage);
    await refresh();
    return true;
  }

  return (
    <div dir="rtl" className="mx-auto max-w-7xl">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-amber-50">مدیریت آموزش و گواهینامه‌ها</h1>
          <p className="mt-2 text-xs text-stone-400">
            {courses.length} دوره · {certificates.length} گواهینامه صادرشده ·{" "}
            {certificates.filter((c) => c.status === "valid").length} معتبر
          </p>
        </div>
      </header>

      <nav aria-label="بخش‌های مدیریت آموزش" className="mt-6 flex flex-wrap gap-2">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${tab === key
              ? "bg-[#c3a258]/15 text-[#d6b66c] ring-1 ring-[#c3a258]/40"
              : "text-stone-400 hover:bg-white/5 hover:text-amber-50"
              }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "courses" && (
          <CoursesTab
            courses={courses}
            editing={editingCourse}
            onEdit={(course) => setEditingCourse(course)}
            onClearEdit={() => setEditingCourse(null)}
            onSave={saveCourse}
          />
        )}
        {tab === "issue" && (
          <IssueTab courses={activeCourses} onIssue={issueCertificates} />
        )}
        {tab === "registry" && (
          <RegistryTab
            certificates={certificates}
            onPatch={patchCertificate}
            onEdit={(certificate) => setEditingCertificate(certificate)}
            editing={editingCertificate}
            onClearEdit={() => setEditingCertificate(null)}
          />
        )}
        {tab === "log" && <LogTab log={log} />}
      </div>
    </div>
  );
}

/* ---------------- Courses ---------------- */

function CoursesTab({
  courses,
  editing,
  onEdit,
  onClearEdit,
  onSave,
}: {
  courses: TrainingCourse[];
  editing: TrainingCourse | null;
  onEdit: (course: TrainingCourse) => void;
  onClearEdit: () => void;
  onSave: (data: Omit<TrainingCourse, "id" | "createdAt">, id?: string) => Promise<boolean>;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="rounded-3xl border border-white/10 bg-[#14130f] p-5">
        <h2 className="text-sm font-black text-amber-50">فهرست دوره‌ها</h2>
        <div className="mt-4 space-y-3">
          {courses.map((course) => (
            <div key={course.id} className="rounded-2xl border border-white/10 bg-[#0f0e0b] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-amber-50">{course.title}</p>
                  <p className="mt-1 text-[11px] text-stone-500">
                    {COURSE_CATEGORY_LABELS[course.category]} · {course.durationHours} ساعت ·{" "}
                    {course.instructor} · {serializeDate(course.startDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-stone-300">
                    {COURSE_STATUS_LABELS[course.status]}
                  </span>
                  <button
                    type="button"
                    onClick={() => onEdit(course)}
                    className="rounded-lg border border-white/10 p-2 text-stone-400 transition hover:border-[#c3a258]/50 hover:text-[#d6b66c]"
                    aria-label={`ویرایش ${course.title}`}
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {courses.length === 0 && <p className="text-xs text-stone-500">هنوز دوره‌ای ثبت نشده است.</p>}
        </div>
      </section>

      <CourseForm
        key={editing?.id ?? "new"}
        editing={editing}
        onClearEdit={onClearEdit}
        onSave={onSave}
      />
    </div>
  );
}

function CourseForm({
  editing,
  onClearEdit,
  onSave,
}: {
  editing: TrainingCourse | null;
  onClearEdit: () => void;
  onSave: (data: Omit<TrainingCourse, "id" | "createdAt">, id?: string) => Promise<boolean>;
}) {
  const [form, setForm] = useState(() =>
    editing
      ? { ...editing }
      : {
        id: "",
        title: "",
        description: "",
        category: "technician",
        durationHours: 40,
        sessionsCount: 10,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
        instructor: "",
        location: "سایت مرکزی جام جم — سالن آموزش، تهران",
        capacity: 20,
        tuition: 4_000_000,
        status: "open",
        createdAt: "",
      } as Omit<TrainingCourse, "id" | "createdAt"> & { id: string; createdAt: string },
  );
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, createdAt: _createdAt, ...data } = form;
    const ok = await onSave(
      {
        ...data,
        durationHours: Number(data.durationHours),
        sessionsCount: Number(data.sessionsCount),
        capacity: Number(data.capacity),
        tuition: Number(data.tuition),
      } as Omit<TrainingCourse, "id" | "createdAt">,
      editing?.id,
    );
    setSaving(false);
    if (ok && !editing) {
      setForm((prev) => ({ ...prev, title: "", description: "", instructor: "" }));
    }
  }

  const field = "w-full rounded-xl border border-white/10 bg-[#0f0e0b] px-3 py-2.5 text-sm text-amber-50 outline-none transition focus:border-[#c3a258]/60";
  const label = "mb-1.5 block text-[11px] font-bold text-stone-400";

  return (
    <section className="h-fit rounded-3xl border border-white/10 bg-[#14130f] p-5">
      <h2 className="text-sm font-black text-amber-50">{editing ? "ویرایش دوره" : "ایجاد دوره جدید"}</h2>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <div>
          <label className={label} htmlFor="course-title">عنوان دوره</label>
          <input id="course-title" required value={form.title} onChange={(e) => update("title", e.target.value)} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="course-desc">توضیحات</label>
          <textarea id="course-desc" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} className={field} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="course-cat">دسته</label>
            <select id="course-cat" value={form.category} onChange={(e) => update("category", e.target.value as TrainingCourse["category"])} className={field}>
              {Object.entries(COURSE_CATEGORY_LABELS).map(([value, labelText]) => (
                <option key={value} value={value}>{labelText}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="course-status">وضعیت</label>
            <select id="course-status" value={form.status} onChange={(e) => update("status", e.target.value as TrainingCourse["status"])} className={field}>
              {Object.entries(COURSE_STATUS_LABELS).map(([value, labelText]) => (
                <option key={value} value={value}>{labelText}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="course-hours">ساعت</label>
            <input id="course-hours" type="number" min={1} value={form.durationHours} onChange={(e) => update("durationHours", Number(e.target.value))} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="course-sessions">جلسات</label>
            <input id="course-sessions" type="number" min={1} value={form.sessionsCount} onChange={(e) => update("sessionsCount", Number(e.target.value))} className={field} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="course-start">شروع</label>
            <input id="course-start" type="date" value={form.startDate.slice(0, 10)} onChange={(e) => update("startDate", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="course-end">پایان</label>
            <input id="course-end" type="date" value={form.endDate.slice(0, 10)} onChange={(e) => update("endDate", e.target.value)} className={field} />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="course-instructor">مدرس</label>
          <input id="course-instructor" required value={form.instructor} onChange={(e) => update("instructor", e.target.value)} className={field} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="course-capacity">ظرفیت</label>
            <input id="course-capacity" type="number" min={1} value={form.capacity} onChange={(e) => update("capacity", Number(e.target.value))} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="course-tuition">شهریه (تومان)</label>
            <input id="course-tuition" type="number" min={0} step={100000} value={form.tuition} onChange={(e) => update("tuition", Number(e.target.value))} className={field} />
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-[#c3a258] px-4 py-2.5 text-sm font-black text-[#17130b] transition hover:bg-[#d6b66c] disabled:opacity-50">
            {saving ? "در حال ذخیره…" : editing ? "ذخیره تغییرات" : "ایجاد دوره"}
          </button>
          {editing && (
            <button type="button" onClick={onClearEdit} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-stone-400 transition hover:text-amber-50">
              انصراف
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

/* ---------------- Issue certificates ---------------- */

function IssueTab({
  courses,
  onIssue,
}: {
  courses: TrainingCourse[];
  onIssue: (
    students: { name: string; nationalId: string }[],
    courseId: string,
    grade: string,
  ) => Promise<Certificate[]>;
}) {
  const [courseId, setCourseId] = useState("");
  const [grade, setGrade] = useState("قبول");
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [csvText, setCsvText] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const students = useMemo(() => parseStudentsCsv(csvText), [csvText]);

  async function issue(studentsToIssue: { name: string; nationalId: string }[]) {
    if (!courseId || studentsToIssue.length === 0) {
      toast.error("دوره و حداقل یک دانشجو را وارد کنید.");
      return;
    }
    setBusy(true);
    const issued = await onIssue(studentsToIssue, courseId, grade);
    setBusy(false);
    if (issued.length > 0) {
      if (issued.length === 1) {
        await downloadOne(issued[0]);
      } else {
        for (const certificate of issued) await downloadOne(certificate);
      }
      setName("");
      setNationalId("");
      setCsvText("");
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Single */}
      <section className="rounded-3xl border border-white/10 bg-[#14130f] p-5">
        <h2 className="text-sm font-black text-amber-50">صدور تکی گواهینامه</h2>
        <div className="mt-4 space-y-3">
          <CourseSelect courses={courses} value={courseId} onChange={setCourseId} />
          <GradeSelect value={grade} onChange={setGrade} />
          <input
            placeholder="نام و نام خانوادگی دانشجو"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0f0e0b] px-3 py-2.5 text-sm text-amber-50 outline-none focus:border-[#c3a258]/60"
          />
          <input
            placeholder="کد ملی (اختیاری)"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            dir="ltr"
            className="w-full rounded-xl border border-white/10 bg-[#0f0e0b] px-3 py-2.5 text-sm text-amber-50 outline-none focus:border-[#c3a258]/60"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => issue([{ name, nationalId }])}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c3a258] px-4 py-2.5 text-sm font-black text-[#17130b] transition hover:bg-[#d6b66c] disabled:opacity-50"
          >
            <Award size={16} /> صدور و دانلود PDF
          </button>
        </div>
      </section>

      {/* Bulk */}
      <section className="rounded-3xl border border-white/10 bg-[#14130f] p-5">
        <h2 className="text-sm font-black text-amber-50">صدور گروهی (CSV / اکسل)</h2>
        <p className="mt-2 text-[11px] leading-6 text-stone-500">
          هر خط: <span dir="ltr" className="font-mono">نام, کد ملی</span> — فایل CSV خروجی اکسل را می‌توانید مستقیم
          بارگذاری کنید.
        </p>
        <div className="mt-4 space-y-3">
          <CourseSelect courses={courses} value={courseId} onChange={setCourseId} />
          <GradeSelect value={grade} onChange={setGrade} />
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt,.xls,.xlsx"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (file) setCsvText(await file.text());
            }}
            className="w-full text-xs text-stone-400 file:ml-3 file:rounded-lg file:border-0 file:bg-[#c3a258]/15 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#d6b66c]"
          />
          <textarea
            rows={5}
            dir="rtl"
            placeholder={"علی محمدی, 0012345678\nرضا کریمی, 0098765432"}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0f0e0b] px-3 py-2.5 text-xs text-amber-50 outline-none focus:border-[#c3a258]/60"
          />
          <p className="text-[11px] text-stone-500">
            {students.length} دانشجو شناسایی شد.
          </p>
          <button
            type="button"
            disabled={busy || students.length === 0}
            onClick={() => issue(students)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#c3a258]/50 bg-[#c3a258]/10 px-4 py-2.5 text-sm font-black text-[#d6b66c] transition hover:bg-[#c3a258]/20 disabled:opacity-50"
          >
            <FileSpreadsheet size={16} /> صدور گروهی و دانلود PDFها
          </button>
        </div>
      </section>
    </div>
  );
}

function CourseSelect({
  courses,
  value,
  onChange,
}: {
  courses: TrainingCourse[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full rounded-xl border border-white/10 bg-[#0f0e0b] px-3 py-2.5 text-sm text-amber-50 outline-none focus:border-[#c3a258]/60"
    >
      <option value="">— انتخاب دوره —</option>
      {courses.map((course) => (
        <option key={course.id} value={course.id}>
          {course.title} ({course.durationHours} ساعت)
        </option>
      ))}
    </select>
  );
}

function GradeSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-[#0f0e0b] px-3 py-2.5 text-sm text-amber-50 outline-none focus:border-[#c3a258]/60"
    >
      {["قبول", "خوب", "خیلی خوب", "ممتاز"].map((grade) => (
        <option key={grade} value={grade}>{grade}</option>
      ))}
    </select>
  );
}

async function downloadOne(certificate: Certificate) {
  await downloadCertificatePdf({
    serial: certificate.serial,
    studentName: certificate.studentName,
    courseTitle: certificate.courseTitle,
    durationHours: certificate.durationHours,
    issueDate: certificate.issueDate,
    completionDate: certificate.completionDate,
    grade: certificate.grade,
    revoked: certificate.status === "revoked",
  });
}

/* ---------------- Registry ---------------- */

function RegistryTab({
  certificates,
  onPatch,
  onEdit,
  editing,
  onClearEdit,
}: {
  certificates: Certificate[];
  onPatch: (id: string, body: Record<string, unknown>, message: string) => Promise<boolean>;
  onEdit: (certificate: Certificate) => void;
  editing: Certificate | null;
  onClearEdit: () => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [courseId, setCourseId] = useState("");
  const [revoking, setRevoking] = useState<Certificate | null>(null);
  const [revokeReason, setRevokeReason] = useState("");

  const filtered = certificates.filter((certificate) => {
    const q = query.trim().toLowerCase();
    if (q && !(
      certificate.studentName.toLowerCase().includes(q) ||
      certificate.serial.toLowerCase().includes(q) ||
      certificate.courseTitle.toLowerCase().includes(q)
    )) return false;
    if (status && certificate.status !== status) return false;
    if (courseId && certificate.courseId !== courseId) return false;
    return true;
  });

  const courseOptions = Array.from(new Set(certificates.map((c) => c.courseTitle)));

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/10 bg-[#14130f] p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_160px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
            <input
              placeholder="جستجو: نام دانشجو، دوره یا شماره سریال…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0f0e0b] py-2.5 pl-10 pr-3 text-sm text-amber-50 outline-none focus:border-[#c3a258]/60"
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-white/10 bg-[#0f0e0b] px-3 py-2.5 text-sm text-amber-50 outline-none">
            <option value="">همه وضعیت‌ها</option>
            <option value="valid">معتبر</option>
            <option value="revoked">ابطال‌شده</option>
          </select>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="rounded-xl border border-white/10 bg-[#0f0e0b] px-3 py-2.5 text-sm text-amber-50 outline-none">
            <option value="">همه دوره‌ها</option>
            {courseOptions.map((title) => (
              <option key={title} value={certificates.find((c) => c.courseTitle === title)?.courseId ?? ""}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 space-y-3">
          {filtered.map((certificate) => (
            <div key={certificate.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0f0e0b] p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-amber-50">{certificate.studentName}</p>
                  <CertificateStatusBadge status={certificate.status} size="sm" />
                </div>
                <p dir="ltr" className="mt-1 text-right font-mono text-[11px] text-[#d6b66c]">{certificate.serial}</p>
                <p className="mt-1 text-[11px] text-stone-500">
                  {certificate.courseTitle} · {certificate.durationHours} ساعت ·{" "}
                  {serializeDate(certificate.issueDate)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`/training/verify/${certificate.serial}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-white/10 px-3 py-2 text-[11px] text-stone-300 transition hover:border-[#c3a258]/50 hover:text-[#d6b66c]"
                >
                  مشاهده استعلام
                </a>
                <button
                  type="button"
                  onClick={() => downloadOne(certificate)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-[11px] text-stone-300 transition hover:border-[#c3a258]/50 hover:text-[#d6b66c]"
                >
                  <Download size={13} /> PDF
                </button>
                <button
                  type="button"
                  onClick={() => (editing?.id === certificate.id ? onClearEdit() : onEdit(certificate))}
                  className="rounded-lg border border-white/10 p-2 text-stone-400 transition hover:border-[#c3a258]/50 hover:text-[#d6b66c]"
                  aria-label="ویرایش"
                >
                  <Pencil size={13} />
                </button>
                {certificate.status === "valid" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setRevoking(certificate);
                      setRevokeReason("");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] font-bold text-red-300 transition hover:bg-red-500/20"
                  >
                    <Ban size={13} /> ابطال
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onPatch(certificate.id, { action: "restore" }, "گواهینامه مجدداً معتبر شد.")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] font-bold text-emerald-300 transition hover:bg-emerald-500/20"
                  >
                    <RotateCcw size={13} /> رفع ابطال
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-xs text-stone-500">گواهینامه‌ای مطابق فیلترها یافت نشد.</p>
          )}
        </div>
      </section>

      {editing && (
        <EditCertificateForm
          key={editing.id}
          certificate={editing}
          onClearEdit={onClearEdit}
          onPatch={onPatch}
        />
      )}

      {revoking && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-3xl border border-red-500/40 bg-[#14130f] p-6">
            <h3 className="text-sm font-black text-red-300">ابطال گواهینامه {revoking.studentName}</h3>
            <p className="mt-2 text-[11px] leading-6 text-stone-400">
              با ابطال، استعلام عمومی این گواهینامه به‌صورت «ابطال‌شده» نمایش داده می‌شود.
            </p>
            <textarea
              rows={3}
              placeholder="دلیل ابطال…"
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              className="mt-3 w-full rounded-xl border border-white/10 bg-[#0f0e0b] px-3 py-2.5 text-xs text-amber-50 outline-none focus:border-red-500/50"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  const ok = await onPatch(
                    revoking.id,
                    { action: "revoke", revokeReason: revokeReason || undefined },
                    "گواهینامه ابطال شد.",
                  );
                  if (ok) setRevoking(null);
                }}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-600"
              >
                تایید ابطال
              </button>
              <button
                type="button"
                onClick={() => setRevoking(null)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-stone-400 transition hover:text-amber-50"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditCertificateForm({
  certificate,
  onClearEdit,
  onPatch,
}: {
  certificate: Certificate;
  onClearEdit: () => void;
  onPatch: (id: string, body: Record<string, unknown>, message: string) => Promise<boolean>;
}) {
  const [form, setForm] = useState({
    studentName: certificate.studentName,
    nationalId: certificate.nationalId,
    grade: certificate.grade,
  });
  const field = "w-full rounded-xl border border-white/10 bg-[#0f0e0b] px-3 py-2.5 text-sm text-amber-50 outline-none focus:border-[#c3a258]/60";

  return (
    <section className="rounded-3xl border border-[#c3a258]/40 bg-[#14130f] p-5">
      <h2 className="text-sm font-black text-amber-50">
        ویرایش گواهینامه <span dir="ltr" className="font-mono text-[#d6b66c]">{certificate.serial}</span>
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input value={form.studentName} onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))} placeholder="نام دانشجو" className={field} />
        <input value={form.nationalId} onChange={(e) => setForm((p) => ({ ...p, nationalId: e.target.value }))} placeholder="کد ملی" dir="ltr" className={field} />
        <input value={form.grade} onChange={(e) => setForm((p) => ({ ...p, grade: e.target.value }))} placeholder="ارزیابی" className={field} />
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={async () => {
            const ok = await onPatch(certificate.id, form, "گواهینامه ویرایش شد.");
            if (ok) onClearEdit();
          }}
          className="rounded-xl bg-[#c3a258] px-5 py-2.5 text-sm font-black text-[#17130b] transition hover:bg-[#d6b66c]"
        >
          ذخیره
        </button>
        <button type="button" onClick={onClearEdit} className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-stone-400 transition hover:text-amber-50">
          انصراف
        </button>
      </div>
    </section>
  );
}

/* ---------------- Log ---------------- */

function LogTab({ log }: { log: AuditEntry[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#14130f] p-5">
      <h2 className="text-sm font-black text-amber-50">تاریخچه دوره‌ها و دانش‌آموختگان</h2>
      <ol className="mt-4 space-y-3 border-r border-white/10 pr-4">
        {log.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute -right-[22px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#c3a258]" />
            <p className="text-xs font-bold text-amber-50">{entry.detail}</p>
            <p className="mt-1 text-[10px] text-stone-500">
              {new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(
                new Date(entry.createdAt),
              )}
              {entry.serial ? <> · <span dir="ltr" className="font-mono">{entry.serial}</span></> : null}
            </p>
          </li>
        ))}
        {log.length === 0 && <p className="text-xs text-stone-500">رویدادی ثبت نشده است.</p>}
      </ol>
    </section>
  );
}
