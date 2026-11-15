import QRCode from "qrcode";
import { jsPDF } from "jspdf";

export const SITE_URL = "https://jamjamelevator.ir";

/**
 * Builds the public verification URL for a certificate serial/id,
 * pointing at /training/verify/[id]. Relative by default (safe for QR on
 * any deployment domain); pass `absolute` for the canonical printed domain.
 */
export function certificateVerificationUrl(serialOrId: string, absolute = false) {
  const path = `/training/verify/${encodeURIComponent(serialOrId)}`;
  return absolute ? `${SITE_URL}${path}` : path;
}

/** Canonical absolute URL used inside printed PDFs / QR codes. */
export function verificationUrl(serialOrId: string) {
  return certificateVerificationUrl(serialOrId, true);
}

export async function qrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 320,
    color: { dark: "#17130bff", light: "#ffffff00" },
  });
}

/** Latin digits for serial numbers printed on the PDF. */
function toLatin(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (d) => {
    const code = d.charCodeAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  });
}

/** Gregorian date string (client-safe) for serial fields on the PDF. */
function gregorianDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("fa-IR");
}

/**
 * Generates a print-ready A4 certificate PDF with an embedded QR code.
 * Persian text rendering is limited by the default jsPDF fonts, so the
 * PDF carries the structured/latin fields plus the QR code; the verified
 * Persian details live on the verification page behind the QR.
 */
export async function generateCertificatePdf(options: {
  serial: string;
  studentName: string;
  courseTitle: string;
  durationHours: number;
  issueDate: string;
  completionDate: string;
  grade: string;
  revoked?: boolean;
}): Promise<Blob> {
  const { serial, studentName, courseTitle, durationHours, issueDate, completionDate, grade, revoked } =
    options;

  const qr = await qrDataUrl(verificationUrl(serial));
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Frame & header
  doc.setFillColor(12, 11, 9);
  doc.rect(0, 0, w, h, "F");
  doc.setDrawColor(197, 162, 88);
  doc.setLineWidth(1.2);
  doc.rect(10, 10, w - 20, h - 20);
  doc.setLineWidth(0.4);
  doc.rect(13, 13, w - 26, h - 26);

  doc.setDrawColor(197, 162, 88);
  doc.line(18, 34, w - 18, 34);

  doc.setFontSize(22);
  doc.setTextColor(212, 175, 55);
  doc.text("JAM JAM ELEVATOR CO.", w / 2, 24, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(240, 240, 240);
  doc.text("Certificate of Training Completion", w / 2, 45, { align: "center" });
  doc.text("(گواهینامه پایان دوره آموزشی)", w / 2, 52, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(245, 245, 245);
  doc.text(`Student / Student Name Code: ${toLatin(studentName)}`, w / 2, 68, { align: "center" });

  doc.setFontSize(11);
  const rows: Array<[string, string]> = [
    ["Serial No.", toLatin(serial)],
    ["Course", courseTitle],
    ["Duration (Hours)", String(durationHours)],
    ["Issue Date", gregorianDate(issueDate)],
    ["Completion Date", gregorianDate(completionDate)],
    ["Grade", grade],
  ];
  let y = 82;
  rows.forEach(([label, value]) => {
    doc.setTextColor(197, 162, 88);
    doc.text(`${label}:`, w / 2 - 12, y, { align: "right" });
    doc.setTextColor(240, 240, 240);
    doc.text(value, w / 2 + 12, y, { align: "left" });
    y += 9;
  });

  if (revoked) {
    doc.setFontSize(28);
    doc.setTextColor(220, 60, 60);
    doc.text("REVOKED", w / 2, h - 30, { align: "center" });
  }

  // QR code (top-right corner inside the frame)
  doc.addImage(qr, "PNG", w - 58, 38, 36, 36);
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text("Scan to verify authenticity", w - 40, 78, { align: "center" });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text("www.jamjamelevator.ir", 20, h - 18);
  doc.text(`${toLatin(serial)}`, w - 20, h - 18, { align: "right" });

  return doc.output("blob");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadCertificatePdf(
  certificate: Parameters<typeof generateCertificatePdf>[0] & { serial: string },
) {
  const blob = await generateCertificatePdf(certificate);
  downloadBlob(blob, `certificate-${certificate.serial}.pdf`);
}

/** Parses a pasted CSV of students: name, nationalId (one record per line). */
export function parseStudentsCsv(text: string): { name: string; nationalId: string }[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = "", nationalId = ""] = line.split(/[,;\t]/).map((cell) => cell.trim());
      return { name, nationalId };
    })
    .filter((student) => student.name.length >= 2);
}
