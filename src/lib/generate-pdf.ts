import jsPDF from "jspdf";
import type { AnalysisResult } from "./mock-data";

export function generatePDF(result: AnalysisResult, contentType: string, originalText: string) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxW = pageW - margin * 2;
  let y = 20;

  const addPage = () => { doc.addPage(); y = 20; };
  const checkPage = (needed: number) => { if (y + needed > 280) addPage(); };

  // --- Header ---
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageW, 45, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Content Insight AI", margin, 20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Reporte de Análisis de Contenido", margin, 30);
  const date = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
  doc.setFontSize(9);
  doc.text(date, pageW - margin, 30, { align: "right" });
  doc.text(`Tipo: ${contentType}`, pageW - margin, 20, { align: "right" });

  y = 55;

  // --- Score ---
  const scoreColor = result.score >= 80 ? [34, 197, 94] : result.score >= 60 ? [245, 158, 11] : [239, 68, 68];
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(margin, y, 50, 30, 4, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(`${result.score}`, margin + 25, y + 17, { align: "center" });
  doc.setFontSize(9);
  doc.text("/100", margin + 25, y + 25, { align: "center" });

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Score General", margin + 58, y + 12);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const scoreLabel = result.score >= 80 ? "Excelente" : result.score >= 60 ? "Bueno — puede mejorar" : "Necesita mejoras significativas";
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(scoreLabel, margin + 58, y + 20);

  y += 40;

  // --- Claridad & Propuesta side by side ---
  doc.setTextColor(30, 30, 30);
  const boxW = (maxW - 6) / 2;

  // Claridad
  doc.setFillColor(240, 245, 255);
  doc.roundedRect(margin, y, boxW, 35, 3, 3, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("Claridad del mensaje", margin + 5, y + 10);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text(`Nivel: ${result.claridad.nivel}`, margin + 5, y + 17);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  const claridadLines = doc.splitTextToSize(result.claridad.detalle, boxW - 10);
  doc.text(claridadLines.slice(0, 2), margin + 5, y + 23);

  // Propuesta
  doc.setFillColor(245, 240, 255);
  doc.roundedRect(margin + boxW + 6, y, boxW, 35, 3, 3, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(124, 58, 237);
  doc.text("Propuesta de valor", margin + boxW + 11, y + 10);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text(`Nivel: ${result.propuestaValor.nivel}`, margin + boxW + 11, y + 17);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  const propLines = doc.splitTextToSize(result.propuestaValor.detalle, boxW - 10);
  doc.text(propLines.slice(0, 2), margin + boxW + 11, y + 23);

  y += 44;

  // --- Fortalezas ---
  checkPage(50);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 197, 94);
  doc.text("✓ Fortalezas", margin, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  result.fortalezas.forEach((f) => {
    checkPage(8);
    const lines = doc.splitTextToSize(`•  ${f}`, maxW - 5);
    doc.text(lines, margin + 3, y);
    y += lines.length * 5 + 2;
  });

  y += 5;

  // --- Mejoras ---
  checkPage(50);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(245, 158, 11);
  doc.text("⚠ Áreas de mejora", margin, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  result.mejoras.forEach((m) => {
    checkPage(8);
    const lines = doc.splitTextToSize(`•  ${m}`, maxW - 5);
    doc.text(lines, margin + 3, y);
    y += lines.length * 5 + 2;
  });

  y += 5;

  // --- Recomendaciones ---
  checkPage(50);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("Recomendaciones accionables", margin, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  result.recomendaciones.forEach((r, i) => {
    checkPage(10);
    const lines = doc.splitTextToSize(`${i + 1}.  ${r}`, maxW - 5);
    doc.text(lines, margin + 3, y);
    y += lines.length * 5 + 3;
  });

  y += 8;

  // --- Versión optimizada ---
  checkPage(40);
  doc.setFillColor(240, 245, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("✦ Versión optimizada", margin, y);
  y += 5;

  const optLines = doc.splitTextToSize(result.versionOptimizada, maxW - 10);
  const optHeight = optLines.length * 4.5 + 10;
  checkPage(optHeight);
  doc.roundedRect(margin, y, maxW, optHeight, 3, 3, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  doc.text(optLines, margin + 5, y + 7);
  y += optHeight + 8;

  // --- Texto original ---
  checkPage(30);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageW - margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(130, 130, 130);
  doc.text("Texto original analizado:", margin, y);
  y += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  const origLines = doc.splitTextToSize(originalText.substring(0, 1000), maxW);
  origLines.slice(0, 15).forEach((line: string) => {
    checkPage(5);
    doc.text(line, margin, y);
    y += 4;
  });
  if (originalText.length > 1000) {
    doc.text("[texto truncado...]", margin, y);
  }

  // --- Footer on every page ---
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 160, 160);
    doc.text("Content Insight AI — Análisis generado con inteligencia artificial", margin, 290);
    doc.text(`Página ${i} de ${pageCount}`, pageW - margin, 290, { align: "right" });
  }

  doc.save(`analisis-contenido-${Date.now()}.pdf`);
}
