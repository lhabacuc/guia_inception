import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const ADMIN_EMAILS = [
  "lisvaldosf@gmail.com",
  "gkombadev@gmail.com",
  "angoshooltech@gmail.com",
  "liedsonnhabacuc@gmail.com",
];

const templates = [
  // ═══════════════════════════════════════════════════════
  // 1. Passe Escolar Azul Moderno
  // ═══════════════════════════════════════════════════════
  {
    name: "Passe Escolar — Azul Moderno",
    data: {
      name: "Passe Escolar — Azul Moderno",
      width: 1011,
      height: 638,
      backgroundColor: "#ffffff",
      fields: [
        // Header gradient
        { id: "header_bg", name: "header_bg", type: "rect", x: 0, y: 0, width: 1011, height: 160, fillType: "gradient", gradientColor1: "#1e3a5f", gradientColor2: "#2563eb", gradientDirection: "horizontal", locked: true },
        // School name
        { id: "escola", name: "escola", type: "text", x: 30, y: 20, width: 600, height: 35, fontSize: 13, color: "#ffffff", bold: true, fontFamily: "Montserrat", letterSpacing: 4, opacity: 0.8 },
        { id: "card_title", name: "CARTÃO DE ESTUDANTE", type: "static-text", x: 30, y: 55, width: 600, height: 45, fontSize: 22, color: "#ffffff", bold: true, fontFamily: "Montserrat", staticText: "CARTÃO DE ESTUDANTE", letterSpacing: 2 },
        { id: "ano_lectivo", name: "ano_lectivo", type: "text", x: 30, y: 105, width: 300, height: 28, fontSize: 12, color: "#ffffff", fontFamily: "Montserrat", opacity: 0.7 },
        // School logo area (top right)
        { id: "logo_bg", name: "logo_bg", type: "circle", x: 880, y: 20, width: 120, height: 120, color: "#ffffff", opacity: 0.15, locked: true },
        { id: "logo", name: "logo", type: "image", x: 890, y: 30, width: 100, height: 100 },
        // Photo
        { id: "foto_bg", name: "foto_bg", type: "rect", x: 30, y: 185, width: 195, height: 230, color: "#e8f0fe", borderRadius: 12, locked: true },
        { id: "foto", name: "foto", type: "image", x: 35, y: 190, width: 185, height: 220, borderRadius: 10 },
        // Info fields
        { id: "nome_label", name: "NOME COMPLETO", type: "static-text", x: 255, y: 185, width: 400, height: 16, fontSize: 9, color: "#94a3b8", bold: true, fontFamily: "Montserrat", staticText: "NOME COMPLETO", letterSpacing: 2 },
        { id: "nome", name: "nome", type: "text", x: 255, y: 203, width: 500, height: 32, fontSize: 18, color: "#1e293b", bold: true, fontFamily: "Montserrat" },
        { id: "divider1", name: "divider1", type: "line", x: 255, y: 240, width: 500, height: 1, color: "#e2e8f0" },
        { id: "turma_label", name: "TURMA", type: "static-text", x: 255, y: 252, width: 150, height: 16, fontSize: 9, color: "#94a3b8", bold: true, fontFamily: "Montserrat", staticText: "TURMA", letterSpacing: 2 },
        { id: "turma", name: "turma", type: "text", x: 255, y: 270, width: 150, height: 26, fontSize: 15, color: "#1e293b", fontFamily: "Montserrat" },
        { id: "num_label", name: "Nº ALUNO", type: "static-text", x: 430, y: 252, width: 150, height: 16, fontSize: 9, color: "#94a3b8", bold: true, fontFamily: "Montserrat", staticText: "Nº ALUNO", letterSpacing: 2 },
        { id: "numero", name: "numero", type: "text", x: 430, y: 270, width: 150, height: 26, fontSize: 15, color: "#1e293b", fontFamily: "Montserrat" },
        { id: "classe_label", name: "CLASSE", type: "static-text", x: 605, y: 252, width: 150, height: 16, fontSize: 9, color: "#94a3b8", bold: true, fontFamily: "Montserrat", staticText: "CLASSE", letterSpacing: 2 },
        { id: "classe", name: "classe", type: "text", x: 605, y: 270, width: 150, height: 26, fontSize: 15, color: "#1e293b", fontFamily: "Montserrat" },
        { id: "divider2", name: "divider2", type: "line", x: 255, y: 305, width: 500, height: 1, color: "#e2e8f0" },
        { id: "curso_label", name: "CURSO", type: "static-text", x: 255, y: 317, width: 300, height: 16, fontSize: 9, color: "#94a3b8", bold: true, fontFamily: "Montserrat", staticText: "CURSO", letterSpacing: 2 },
        { id: "curso", name: "curso", type: "text", x: 255, y: 335, width: 500, height: 26, fontSize: 14, color: "#1e293b", fontFamily: "Montserrat" },
        { id: "nascimento_label", name: "DATA NASCIMENTO", type: "static-text", x: 255, y: 372, width: 200, height: 16, fontSize: 9, color: "#94a3b8", bold: true, fontFamily: "Montserrat", staticText: "DATA NASCIMENTO", letterSpacing: 2 },
        { id: "nascimento", name: "nascimento", type: "text", x: 255, y: 390, width: 200, height: 26, fontSize: 14, color: "#1e293b", fontFamily: "Montserrat" },
        // QR Code
        { id: "qr", name: "qr_code", type: "qr", x: 860, y: 440, width: 120, height: 120, color: "#1e3a5f" },
        // Footer
        { id: "footer_line", name: "footer_line", type: "rect", x: 0, y: 590, width: 1011, height: 48, fillType: "gradient", gradientColor1: "#1e3a5f", gradientColor2: "#2563eb", gradientDirection: "horizontal", locked: true },
        { id: "footer_text", name: "footer_text", type: "text", x: 30, y: 600, width: 500, height: 25, fontSize: 10, color: "#ffffff", fontFamily: "Montserrat", opacity: 0.8 },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════
  // 2. Passe Escolar Vertical — Verde Académico
  // ═══════════════════════════════════════════════════════
  {
    name: "Passe Escolar — Verde Académico (Vertical)",
    data: {
      name: "Passe Escolar — Verde Académico (Vertical)",
      width: 638,
      height: 1011,
      backgroundColor: "#f8faf8",
      fields: [
        // Top green header
        { id: "header", name: "header", type: "rect", x: 0, y: 0, width: 638, height: 220, fillType: "gradient", gradientColor1: "#065f46", gradientColor2: "#059669", gradientDirection: "diagonal", locked: true },
        // Decorative circle
        { id: "deco_circle", name: "deco_circle", type: "circle", x: 460, y: -40, width: 300, height: 300, color: "#ffffff", opacity: 0.05, locked: true },
        // School name & title
        { id: "escola", name: "escola", type: "text", x: 30, y: 25, width: 580, height: 30, fontSize: 11, color: "#ffffff", bold: true, fontFamily: "Inter", letterSpacing: 4, opacity: 0.8 },
        { id: "title", name: "PASSE ESCOLAR", type: "static-text", x: 30, y: 60, width: 580, height: 50, fontSize: 28, color: "#ffffff", bold: true, fontFamily: "Inter", staticText: "PASSE ESCOLAR", letterSpacing: 1 },
        { id: "ano_lectivo", name: "ano_lectivo", type: "text", x: 30, y: 115, width: 300, height: 25, fontSize: 13, color: "#ffffff", fontFamily: "Inter", opacity: 0.7 },
        // Badge
        { id: "badge_bg", name: "badge_bg", type: "rect", x: 30, y: 155, width: 100, height: 30, color: "#ffffff", opacity: 0.2, borderRadius: 15, locked: true },
        { id: "badge_text", name: "ESTUDANTE", type: "static-text", x: 30, y: 155, width: 100, height: 30, fontSize: 9, color: "#ffffff", bold: true, fontFamily: "Inter", align: "center", verticalAlign: "middle", staticText: "ESTUDANTE", letterSpacing: 2 },
        // Photo (centered, large)
        { id: "foto_shadow", name: "foto_shadow", type: "rect", x: 164, y: 240, width: 310, height: 370, color: "#065f46", opacity: 0.1, borderRadius: 20, locked: true },
        { id: "foto_border", name: "foto_border", type: "rect", x: 169, y: 245, width: 300, height: 360, color: "#ffffff", borderRadius: 16, strokeColor: "#e5e7eb", strokeWidth: 2, locked: true },
        { id: "foto", name: "foto", type: "image", x: 177, y: 253, width: 284, height: 344, borderRadius: 12 },
        // Info section
        { id: "nome_label", name: "NOME", type: "static-text", x: 40, y: 635, width: 558, height: 16, fontSize: 9, color: "#6b7280", bold: true, fontFamily: "Inter", staticText: "NOME COMPLETO", letterSpacing: 2 },
        { id: "nome", name: "nome", type: "text", x: 40, y: 653, width: 558, height: 35, fontSize: 20, color: "#111827", bold: true, fontFamily: "Inter" },
        { id: "div1", name: "div1", type: "line", x: 40, y: 695, width: 558, height: 1, color: "#e5e7eb" },
        // Two columns
        { id: "turma_label", name: "TURMA", type: "static-text", x: 40, y: 710, width: 260, height: 16, fontSize: 9, color: "#6b7280", bold: true, fontFamily: "Inter", staticText: "TURMA", letterSpacing: 2 },
        { id: "turma", name: "turma", type: "text", x: 40, y: 728, width: 260, height: 28, fontSize: 16, color: "#111827", fontFamily: "Inter" },
        { id: "num_label", name: "Nº ALUNO", type: "static-text", x: 338, y: 710, width: 260, height: 16, fontSize: 9, color: "#6b7280", bold: true, fontFamily: "Inter", staticText: "Nº ALUNO", letterSpacing: 2 },
        { id: "numero", name: "numero", type: "text", x: 338, y: 728, width: 260, height: 28, fontSize: 16, color: "#111827", fontFamily: "Inter" },
        { id: "div2", name: "div2", type: "line", x: 40, y: 765, width: 558, height: 1, color: "#e5e7eb" },
        { id: "curso_label", name: "CURSO", type: "static-text", x: 40, y: 780, width: 260, height: 16, fontSize: 9, color: "#6b7280", bold: true, fontFamily: "Inter", staticText: "CURSO", letterSpacing: 2 },
        { id: "curso", name: "curso", type: "text", x: 40, y: 798, width: 558, height: 28, fontSize: 15, color: "#111827", fontFamily: "Inter" },
        { id: "div3", name: "div3", type: "line", x: 40, y: 835, width: 558, height: 1, color: "#e5e7eb" },
        { id: "emergencia_label", name: "CONTACTO EMERGÊNCIA", type: "static-text", x: 40, y: 850, width: 300, height: 16, fontSize: 9, color: "#6b7280", bold: true, fontFamily: "Inter", staticText: "CONTACTO EMERGÊNCIA", letterSpacing: 2 },
        { id: "contacto", name: "contacto", type: "text", x: 40, y: 868, width: 300, height: 28, fontSize: 14, color: "#111827", fontFamily: "Inter" },
        // QR
        { id: "qr", name: "qr_code", type: "qr", x: 430, y: 848, width: 110, height: 110, color: "#065f46" },
        // Bottom bar
        { id: "bottom", name: "bottom", type: "rect", x: 0, y: 975, width: 638, height: 36, fillType: "gradient", gradientColor1: "#065f46", gradientColor2: "#059669", gradientDirection: "horizontal", locked: true },
        { id: "website", name: "website", type: "text", x: 20, y: 982, width: 598, height: 20, fontSize: 10, color: "#ffffff", fontFamily: "Inter", align: "center", opacity: 0.8 },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════
  // 3. Crachá Escolar — Vermelho Institucional
  // ═══════════════════════════════════════════════════════
  {
    name: "Crachá Escolar — Vermelho Institucional",
    data: {
      name: "Crachá Escolar — Vermelho Institucional",
      width: 874,
      height: 1240,
      backgroundColor: "#ffffff",
      fields: [
        // Top red banner
        { id: "banner", name: "banner", type: "rect", x: 0, y: 0, width: 874, height: 300, fillType: "gradient", gradientColor1: "#7f1d1d", gradientColor2: "#dc2626", gradientDirection: "diagonal", locked: true },
        // Decorative shapes
        { id: "deco1", name: "deco1", type: "circle", x: -80, y: -80, width: 350, height: 350, color: "#ffffff", opacity: 0.03, locked: true },
        { id: "deco2", name: "deco2", type: "circle", x: 650, y: 100, width: 400, height: 400, color: "#ffffff", opacity: 0.03, locked: true },
        // Institution
        { id: "inst_label", name: "REPÚBLICA DE ANGOLA", type: "static-text", x: 60, y: 30, width: 754, height: 20, fontSize: 10, color: "#ffffff", bold: true, fontFamily: "Montserrat", align: "center", staticText: "REPÚBLICA DE ANGOLA", letterSpacing: 4, opacity: 0.7 },
        { id: "ministerio", name: "MINISTÉRIO DA EDUCAÇÃO", type: "static-text", x: 60, y: 55, width: 754, height: 22, fontSize: 10, color: "#ffffff", bold: true, fontFamily: "Montserrat", align: "center", staticText: "MINISTÉRIO DA EDUCAÇÃO", letterSpacing: 3, opacity: 0.7 },
        { id: "escola", name: "escola", type: "text", x: 60, y: 90, width: 754, height: 45, fontSize: 20, color: "#ffffff", bold: true, fontFamily: "Montserrat", align: "center" },
        { id: "subtitle", name: "CARTÃO DE IDENTIFICAÇÃO ESCOLAR", type: "static-text", x: 60, y: 145, width: 754, height: 30, fontSize: 11, color: "#ffffff", fontFamily: "Montserrat", align: "center", staticText: "CARTÃO DE IDENTIFICAÇÃO ESCOLAR", letterSpacing: 5, opacity: 0.8 },
        // Logo placeholder
        { id: "logo", name: "logo", type: "image", x: 362, y: 185, width: 150, height: 100 },
        // Photo with white border
        { id: "foto_frame", name: "foto_frame", type: "rect", x: 282, y: 320, width: 310, height: 380, color: "#ffffff", borderRadius: 8, strokeColor: "#e5e7eb", strokeWidth: 2, locked: true,
          shadowEnabled: true, shadowType: "elevation", shadowColor: "#000000", shadowBlur: 20, shadowOffsetY: 8, shadowOpacity: 0.15 },
        { id: "foto", name: "foto", type: "image", x: 290, y: 328, width: 294, height: 364, borderRadius: 4 },
        // Data fields
        { id: "nome_label", name: "NOME", type: "static-text", x: 80, y: 730, width: 714, height: 18, fontSize: 10, color: "#9ca3af", bold: true, fontFamily: "Montserrat", staticText: "NOME COMPLETO", letterSpacing: 3 },
        { id: "nome", name: "nome", type: "text", x: 80, y: 752, width: 714, height: 40, fontSize: 22, color: "#111827", bold: true, fontFamily: "Montserrat", align: "center" },
        { id: "div1", name: "div1", type: "line", x: 80, y: 800, width: 714, height: 1, color: "#e5e7eb" },
        // Row: Classe | Turma | Nº
        { id: "classe_label", name: "CLASSE", type: "static-text", x: 80, y: 815, width: 220, height: 18, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Montserrat", staticText: "CLASSE", letterSpacing: 2 },
        { id: "classe", name: "classe", type: "text", x: 80, y: 835, width: 220, height: 30, fontSize: 18, color: "#111827", fontFamily: "Montserrat" },
        { id: "turma_label", name: "TURMA", type: "static-text", x: 327, y: 815, width: 220, height: 18, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Montserrat", staticText: "TURMA", letterSpacing: 2 },
        { id: "turma", name: "turma", type: "text", x: 327, y: 835, width: 220, height: 30, fontSize: 18, color: "#111827", fontFamily: "Montserrat" },
        { id: "num_label", name: "Nº ALUNO", type: "static-text", x: 574, y: 815, width: 220, height: 18, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Montserrat", staticText: "Nº ALUNO", letterSpacing: 2 },
        { id: "numero", name: "numero", type: "text", x: 574, y: 835, width: 220, height: 30, fontSize: 18, color: "#111827", fontFamily: "Montserrat" },
        { id: "div2", name: "div2", type: "line", x: 80, y: 878, width: 714, height: 1, color: "#e5e7eb" },
        // Curso
        { id: "curso_label", name: "CURSO", type: "static-text", x: 80, y: 893, width: 400, height: 18, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Montserrat", staticText: "CURSO / ÁREA", letterSpacing: 2 },
        { id: "curso", name: "curso", type: "text", x: 80, y: 913, width: 714, height: 30, fontSize: 16, color: "#111827", fontFamily: "Montserrat" },
        { id: "div3", name: "div3", type: "line", x: 80, y: 955, width: 714, height: 1, color: "#e5e7eb" },
        // Nascimento + Validade
        { id: "nasc_label", name: "NASCIMENTO", type: "static-text", x: 80, y: 970, width: 320, height: 18, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Montserrat", staticText: "DATA DE NASCIMENTO", letterSpacing: 2 },
        { id: "nascimento", name: "nascimento", type: "text", x: 80, y: 990, width: 320, height: 28, fontSize: 15, color: "#111827", fontFamily: "Montserrat" },
        { id: "val_label", name: "VALIDADE", type: "static-text", x: 474, y: 970, width: 320, height: 18, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Montserrat", staticText: "VÁLIDO ATÉ", letterSpacing: 2 },
        { id: "validade", name: "validade", type: "text", x: 474, y: 990, width: 320, height: 28, fontSize: 15, color: "#111827", fontFamily: "Montserrat" },
        // QR
        { id: "qr", name: "qr_code", type: "qr", x: 337, y: 1040, width: 200, height: 200, color: "#7f1d1d" },
        // Bottom
        { id: "bottom", name: "bottom", type: "rect", x: 0, y: 1210, width: 874, height: 30, fillType: "gradient", gradientColor1: "#7f1d1d", gradientColor2: "#dc2626", gradientDirection: "horizontal", locked: true },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════
  // 4. Passe Escolar — Minimalista Cinza
  // ═══════════════════════════════════════════════════════
  {
    name: "Passe Escolar — Minimalista Cinza",
    data: {
      name: "Passe Escolar — Minimalista Cinza",
      width: 1011,
      height: 638,
      backgroundColor: "#fafafa",
      fields: [
        // Left accent
        { id: "accent", name: "accent", type: "rect", x: 0, y: 0, width: 6, height: 638, color: "#111827", locked: true },
        // School name
        { id: "escola", name: "escola", type: "text", x: 40, y: 30, width: 600, height: 25, fontSize: 11, color: "#6b7280", fontFamily: "Inter", letterSpacing: 3, bold: true },
        { id: "title", name: "CARTÃO ESTUDANTIL", type: "static-text", x: 40, y: 58, width: 400, height: 35, fontSize: 24, color: "#111827", bold: true, fontFamily: "Inter", staticText: "CARTÃO ESTUDANTIL" },
        { id: "ano", name: "ano_lectivo", type: "text", x: 40, y: 96, width: 200, height: 22, fontSize: 12, color: "#9ca3af", fontFamily: "Inter" },
        // Thin divider
        { id: "hline", name: "hline", type: "line", x: 40, y: 130, width: 100, height: 2, color: "#111827" },
        // Photo
        { id: "foto", name: "foto", type: "image", x: 40, y: 155, width: 180, height: 220, borderRadius: 8 },
        // Fields (right of photo)
        { id: "nome_label", name: "Nome", type: "static-text", x: 255, y: 155, width: 300, height: 14, fontSize: 9, color: "#9ca3af", fontFamily: "Inter", staticText: "Nome", letterSpacing: 1 },
        { id: "nome", name: "nome", type: "text", x: 255, y: 172, width: 500, height: 30, fontSize: 17, color: "#111827", bold: true, fontFamily: "Inter" },
        { id: "d1", name: "d1", type: "line", x: 255, y: 208, width: 500, height: 1, color: "#e5e7eb" },
        { id: "curso_label", name: "Curso", type: "static-text", x: 255, y: 220, width: 300, height: 14, fontSize: 9, color: "#9ca3af", fontFamily: "Inter", staticText: "Curso", letterSpacing: 1 },
        { id: "curso", name: "curso", type: "text", x: 255, y: 237, width: 500, height: 26, fontSize: 14, color: "#374151", fontFamily: "Inter" },
        { id: "d2", name: "d2", type: "line", x: 255, y: 270, width: 500, height: 1, color: "#e5e7eb" },
        // Grid: Classe | Turma | Nº
        { id: "cl_label", name: "Classe", type: "static-text", x: 255, y: 282, width: 150, height: 14, fontSize: 9, color: "#9ca3af", fontFamily: "Inter", staticText: "Classe", letterSpacing: 1 },
        { id: "classe", name: "classe", type: "text", x: 255, y: 298, width: 150, height: 24, fontSize: 14, color: "#374151", fontFamily: "Inter" },
        { id: "tu_label", name: "Turma", type: "static-text", x: 430, y: 282, width: 150, height: 14, fontSize: 9, color: "#9ca3af", fontFamily: "Inter", staticText: "Turma", letterSpacing: 1 },
        { id: "turma", name: "turma", type: "text", x: 430, y: 298, width: 150, height: 24, fontSize: 14, color: "#374151", fontFamily: "Inter" },
        { id: "nu_label", name: "Nº", type: "static-text", x: 605, y: 282, width: 150, height: 14, fontSize: 9, color: "#9ca3af", fontFamily: "Inter", staticText: "Nº Aluno", letterSpacing: 1 },
        { id: "numero", name: "numero", type: "text", x: 605, y: 298, width: 150, height: 24, fontSize: 14, color: "#374151", fontFamily: "Inter" },
        { id: "d3", name: "d3", type: "line", x: 255, y: 332, width: 500, height: 1, color: "#e5e7eb" },
        { id: "nasc_label", name: "Nascimento", type: "static-text", x: 255, y: 344, width: 200, height: 14, fontSize: 9, color: "#9ca3af", fontFamily: "Inter", staticText: "Data de Nascimento", letterSpacing: 1 },
        { id: "nascimento", name: "nascimento", type: "text", x: 255, y: 361, width: 200, height: 24, fontSize: 14, color: "#374151", fontFamily: "Inter" },
        // QR at bottom right
        { id: "qr", name: "qr_code", type: "qr", x: 860, y: 470, width: 120, height: 120, color: "#111827" },
        // Bottom
        { id: "footer_line", name: "footer_line", type: "rect", x: 0, y: 620, width: 1011, height: 18, color: "#111827", locked: true },
        { id: "footer_txt", name: "footer", type: "text", x: 40, y: 556, width: 400, height: 18, fontSize: 9, color: "#9ca3af", fontFamily: "Inter" },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════
  // 5. Passe Escolar — Laranja Energético
  // ═══════════════════════════════════════════════════════
  {
    name: "Passe Escolar — Laranja Energético",
    data: {
      name: "Passe Escolar — Laranja Energético",
      width: 874,
      height: 1240,
      backgroundColor: "#fffbf5",
      fields: [
        // Top section
        { id: "top_bg", name: "top_bg", type: "rect", x: 0, y: 0, width: 874, height: 180, fillType: "gradient", gradientColor1: "#ea580c", gradientColor2: "#f97316", gradientDirection: "horizontal", locked: true },
        { id: "deco_tri", name: "deco_tri", type: "triangle", x: 700, y: -40, width: 250, height: 250, color: "#ffffff", opacity: 0.06, locked: true },
        { id: "escola", name: "escola", type: "text", x: 60, y: 35, width: 754, height: 28, fontSize: 12, color: "#ffffff", bold: true, fontFamily: "Poppins", letterSpacing: 3, opacity: 0.85 },
        { id: "title", name: "CARTÃO DO ALUNO", type: "static-text", x: 60, y: 70, width: 754, height: 45, fontSize: 28, color: "#ffffff", bold: true, fontFamily: "Poppins", staticText: "CARTÃO DO ALUNO" },
        { id: "ano", name: "ano_lectivo", type: "text", x: 60, y: 125, width: 300, height: 25, fontSize: 14, color: "#ffffff", fontFamily: "Poppins", opacity: 0.7 },
        // Photo (offset, with shadow)
        { id: "foto_bg", name: "foto_bg", type: "rect", x: 60, y: 210, width: 280, height: 350, color: "#ffffff", borderRadius: 16, locked: true,
          shadowEnabled: true, shadowType: "elevation", shadowColor: "#000000", shadowBlur: 25, shadowOffsetY: 10, shadowOpacity: 0.12 },
        { id: "foto", name: "foto", type: "image", x: 70, y: 220, width: 260, height: 330, borderRadius: 12 },
        // Info to the right of photo
        { id: "nome_l", name: "NOME", type: "static-text", x: 380, y: 220, width: 454, height: 16, fontSize: 10, color: "#9ca3af", bold: true, fontFamily: "Poppins", staticText: "NOME COMPLETO", letterSpacing: 2 },
        { id: "nome", name: "nome", type: "text", x: 380, y: 240, width: 454, height: 35, fontSize: 19, color: "#1c1917", bold: true, fontFamily: "Poppins" },
        { id: "line1", name: "line1", type: "line", x: 380, y: 282, width: 454, height: 1, color: "#fed7aa" },
        { id: "curso_l", name: "CURSO", type: "static-text", x: 380, y: 296, width: 454, height: 16, fontSize: 10, color: "#9ca3af", bold: true, fontFamily: "Poppins", staticText: "CURSO", letterSpacing: 2 },
        { id: "curso", name: "curso", type: "text", x: 380, y: 316, width: 454, height: 28, fontSize: 15, color: "#1c1917", fontFamily: "Poppins" },
        { id: "line2", name: "line2", type: "line", x: 380, y: 352, width: 454, height: 1, color: "#fed7aa" },
        { id: "cl_l", name: "CLASSE", type: "static-text", x: 380, y: 366, width: 200, height: 16, fontSize: 10, color: "#9ca3af", bold: true, fontFamily: "Poppins", staticText: "CLASSE", letterSpacing: 2 },
        { id: "classe", name: "classe", type: "text", x: 380, y: 386, width: 200, height: 28, fontSize: 16, color: "#1c1917", fontFamily: "Poppins" },
        { id: "tu_l", name: "TURNO", type: "static-text", x: 610, y: 366, width: 224, height: 16, fontSize: 10, color: "#9ca3af", bold: true, fontFamily: "Poppins", staticText: "TURNO", letterSpacing: 2 },
        { id: "turno", name: "turno", type: "text", x: 610, y: 386, width: 224, height: 28, fontSize: 16, color: "#1c1917", fontFamily: "Poppins" },
        { id: "line3", name: "line3", type: "line", x: 380, y: 424, width: 454, height: 1, color: "#fed7aa" },
        { id: "nu_l", name: "Nº", type: "static-text", x: 380, y: 438, width: 200, height: 16, fontSize: 10, color: "#9ca3af", bold: true, fontFamily: "Poppins", staticText: "Nº MATRÍCULA", letterSpacing: 2 },
        { id: "numero", name: "numero", type: "text", x: 380, y: 458, width: 200, height: 28, fontSize: 16, color: "#1c1917", fontFamily: "Poppins" },
        { id: "nasc_l", name: "NASC", type: "static-text", x: 610, y: 438, width: 224, height: 16, fontSize: 10, color: "#9ca3af", bold: true, fontFamily: "Poppins", staticText: "NASCIMENTO", letterSpacing: 2 },
        { id: "nascimento", name: "nascimento", type: "text", x: 610, y: 458, width: 224, height: 28, fontSize: 16, color: "#1c1917", fontFamily: "Poppins" },
        // Separator
        { id: "sep", name: "sep", type: "rect", x: 60, y: 600, width: 754, height: 3, fillType: "gradient", gradientColor1: "#ea580c", gradientColor2: "#fdba74", gradientDirection: "horizontal", borderRadius: 2, locked: true },
        // Parent / emergency contact
        { id: "enc_l", name: "ENCARREGADO", type: "static-text", x: 60, y: 630, width: 400, height: 18, fontSize: 10, color: "#9ca3af", bold: true, fontFamily: "Poppins", staticText: "ENCARREGADO DE EDUCAÇÃO", letterSpacing: 2 },
        { id: "encarregado", name: "encarregado", type: "text", x: 60, y: 652, width: 754, height: 30, fontSize: 16, color: "#1c1917", fontFamily: "Poppins" },
        { id: "tel_l", name: "TELEFONE", type: "static-text", x: 60, y: 695, width: 300, height: 18, fontSize: 10, color: "#9ca3af", bold: true, fontFamily: "Poppins", staticText: "TELEFONE / CONTACTO", letterSpacing: 2 },
        { id: "telefone", name: "telefone", type: "text", x: 60, y: 717, width: 300, height: 30, fontSize: 16, color: "#1c1917", fontFamily: "Poppins" },
        { id: "morada_l", name: "MORADA", type: "static-text", x: 400, y: 695, width: 434, height: 18, fontSize: 10, color: "#9ca3af", bold: true, fontFamily: "Poppins", staticText: "MORADA", letterSpacing: 2 },
        { id: "morada", name: "morada", type: "text", x: 400, y: 717, width: 434, height: 30, fontSize: 16, color: "#1c1917", fontFamily: "Poppins" },
        // Observation
        { id: "obs_l", name: "OBS", type: "static-text", x: 60, y: 770, width: 754, height: 18, fontSize: 10, color: "#9ca3af", bold: true, fontFamily: "Poppins", staticText: "OBSERVAÇÕES", letterSpacing: 2 },
        { id: "observacoes", name: "observacoes", type: "text", x: 60, y: 792, width: 754, height: 50, fontSize: 13, color: "#6b7280", fontFamily: "Poppins" },
        // Signature area
        { id: "sig_line1", name: "sig_line1", type: "line", x: 100, y: 920, width: 280, height: 1, color: "#d1d5db" },
        { id: "sig1_label", name: "Encarregado de Educação", type: "static-text", x: 100, y: 925, width: 280, height: 18, fontSize: 9, color: "#9ca3af", fontFamily: "Poppins", align: "center", staticText: "Encarregado de Educação" },
        { id: "sig_line2", name: "sig_line2", type: "line", x: 494, y: 920, width: 280, height: 1, color: "#d1d5db" },
        { id: "sig2_label", name: "Director(a)", type: "static-text", x: 494, y: 925, width: 280, height: 18, fontSize: 9, color: "#9ca3af", fontFamily: "Poppins", align: "center", staticText: "Director(a) da Escola" },
        // QR
        { id: "qr", name: "qr_code", type: "qr", x: 337, y: 970, width: 200, height: 200, color: "#ea580c" },
        // Bottom bar
        { id: "bottom", name: "bottom", type: "rect", x: 0, y: 1200, width: 874, height: 40, fillType: "gradient", gradientColor1: "#ea580c", gradientColor2: "#f97316", gradientDirection: "horizontal", locked: true },
        { id: "foot_txt", name: "footer", type: "text", x: 60, y: 1208, width: 754, height: 25, fontSize: 10, color: "#ffffff", fontFamily: "Poppins", align: "center", opacity: 0.85 },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════
  // 6. Passe Escolar — Roxo Premium (Dupla Face)
  // ═══════════════════════════════════════════════════════
  {
    name: "Passe Escolar — Roxo Premium",
    data: {
      name: "Passe Escolar — Roxo Premium",
      width: 1011,
      height: 638,
      backgroundColor: "#0f0a1a",
      fields: [
        // Background gradient
        { id: "bg_grad", name: "bg_grad", type: "rect", x: 0, y: 0, width: 1011, height: 638, fillType: "gradient", gradientColor1: "#1e1035", gradientColor2: "#0f0a1a", gradientDirection: "diagonal", locked: true },
        // Accent line top
        { id: "accent_top", name: "accent_top", type: "rect", x: 0, y: 0, width: 1011, height: 4, fillType: "gradient", gradientColor1: "#8b5cf6", gradientColor2: "#a78bfa", gradientDirection: "horizontal", locked: true },
        // School branding
        { id: "escola", name: "escola", type: "text", x: 30, y: 22, width: 500, height: 22, fontSize: 10, color: "#8b5cf6", bold: true, fontFamily: "Space Grotesk", letterSpacing: 4 },
        { id: "title", name: "STUDENT ID", type: "static-text", x: 30, y: 46, width: 350, height: 35, fontSize: 20, color: "#ffffff", bold: true, fontFamily: "Space Grotesk", staticText: "STUDENT ID CARD", letterSpacing: 1 },
        { id: "ano", name: "ano_lectivo", type: "text", x: 30, y: 82, width: 200, height: 20, fontSize: 11, color: "#6b7280", fontFamily: "Space Grotesk" },
        // Photo (left side)
        { id: "foto_glow", name: "foto_glow", type: "rect", x: 25, y: 120, width: 220, height: 270, color: "#8b5cf6", opacity: 0.1, borderRadius: 16, locked: true },
        { id: "foto", name: "foto", type: "image", x: 30, y: 125, width: 210, height: 260, borderRadius: 12 },
        // Info
        { id: "nome_l", name: "FULL NAME", type: "static-text", x: 275, y: 125, width: 450, height: 14, fontSize: 9, color: "#6d28d9", bold: true, fontFamily: "Space Grotesk", staticText: "NOME COMPLETO", letterSpacing: 3 },
        { id: "nome", name: "nome", type: "text", x: 275, y: 143, width: 500, height: 32, fontSize: 18, color: "#ffffff", bold: true, fontFamily: "Space Grotesk" },
        { id: "line1", name: "line1", type: "line", x: 275, y: 180, width: 500, height: 1, color: "#2d1f4e" },
        { id: "curso_l", name: "COURSE", type: "static-text", x: 275, y: 194, width: 300, height: 14, fontSize: 9, color: "#6d28d9", bold: true, fontFamily: "Space Grotesk", staticText: "CURSO", letterSpacing: 3 },
        { id: "curso", name: "curso", type: "text", x: 275, y: 212, width: 500, height: 26, fontSize: 14, color: "#e2e8f0", fontFamily: "Space Grotesk" },
        { id: "line2", name: "line2", type: "line", x: 275, y: 245, width: 500, height: 1, color: "#2d1f4e" },
        { id: "cl_l", name: "CLASS", type: "static-text", x: 275, y: 259, width: 160, height: 14, fontSize: 9, color: "#6d28d9", bold: true, fontFamily: "Space Grotesk", staticText: "CLASSE", letterSpacing: 3 },
        { id: "classe", name: "classe", type: "text", x: 275, y: 277, width: 160, height: 24, fontSize: 14, color: "#e2e8f0", fontFamily: "Space Grotesk" },
        { id: "tu_l", name: "TURMA", type: "static-text", x: 460, y: 259, width: 160, height: 14, fontSize: 9, color: "#6d28d9", bold: true, fontFamily: "Space Grotesk", staticText: "TURMA", letterSpacing: 3 },
        { id: "turma", name: "turma", type: "text", x: 460, y: 277, width: 160, height: 24, fontSize: 14, color: "#e2e8f0", fontFamily: "Space Grotesk" },
        { id: "nu_l", name: "Nº", type: "static-text", x: 645, y: 259, width: 130, height: 14, fontSize: 9, color: "#6d28d9", bold: true, fontFamily: "Space Grotesk", staticText: "Nº ALUNO", letterSpacing: 3 },
        { id: "numero", name: "numero", type: "text", x: 645, y: 277, width: 130, height: 24, fontSize: 14, color: "#e2e8f0", fontFamily: "Space Grotesk" },
        { id: "line3", name: "line3", type: "line", x: 275, y: 310, width: 500, height: 1, color: "#2d1f4e" },
        // Birth + Validity
        { id: "nasc_l", name: "BIRTH", type: "static-text", x: 275, y: 324, width: 240, height: 14, fontSize: 9, color: "#6d28d9", bold: true, fontFamily: "Space Grotesk", staticText: "NASCIMENTO", letterSpacing: 3 },
        { id: "nascimento", name: "nascimento", type: "text", x: 275, y: 342, width: 240, height: 24, fontSize: 14, color: "#e2e8f0", fontFamily: "Space Grotesk" },
        { id: "val_l", name: "VALID", type: "static-text", x: 540, y: 324, width: 235, height: 14, fontSize: 9, color: "#6d28d9", bold: true, fontFamily: "Space Grotesk", staticText: "VÁLIDO ATÉ", letterSpacing: 3 },
        { id: "validade", name: "validade", type: "text", x: 540, y: 342, width: 235, height: 24, fontSize: 14, color: "#e2e8f0", fontFamily: "Space Grotesk" },
        // QR
        { id: "qr_glow", name: "qr_glow", type: "rect", x: 30, y: 415, width: 140, height: 140, color: "#8b5cf6", opacity: 0.08, borderRadius: 12, locked: true },
        { id: "qr", name: "qr_code", type: "qr", x: 35, y: 420, width: 130, height: 130, color: "#a78bfa" },
        // Footer
        { id: "footer_txt", name: "footer", type: "text", x: 30, y: 580, width: 500, height: 18, fontSize: 9, color: "#4c1d95", fontFamily: "Space Grotesk", letterSpacing: 1 },
        { id: "bottom_line", name: "bottom_line", type: "rect", x: 0, y: 630, width: 1011, height: 8, fillType: "gradient", gradientColor1: "#8b5cf6", gradientColor2: "#6d28d9", gradientDirection: "horizontal", locked: true },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════
  // 7. Passe Escolar — Azul Claro Infantil
  // ═══════════════════════════════════════════════════════
  {
    name: "Passe Escolar — Azul Infantil (Primário)",
    data: {
      name: "Passe Escolar — Azul Infantil (Primário)",
      width: 1011,
      height: 638,
      backgroundColor: "#eff6ff",
      fields: [
        // Playful top bar
        { id: "top1", name: "top1", type: "rect", x: 0, y: 0, width: 253, height: 10, color: "#3b82f6", locked: true },
        { id: "top2", name: "top2", type: "rect", x: 253, y: 0, width: 253, height: 10, color: "#f59e0b", locked: true },
        { id: "top3", name: "top3", type: "rect", x: 506, y: 0, width: 253, height: 10, color: "#10b981", locked: true },
        { id: "top4", name: "top4", type: "rect", x: 759, y: 0, width: 252, height: 10, color: "#ef4444", locked: true },
        // School name
        { id: "escola", name: "escola", type: "text", x: 30, y: 25, width: 650, height: 30, fontSize: 13, color: "#1e40af", bold: true, fontFamily: "Nunito", letterSpacing: 2 },
        { id: "title", name: "CARTÃO DO ALUNO", type: "static-text", x: 30, y: 55, width: 500, height: 35, fontSize: 22, color: "#1e3a5f", bold: true, fontFamily: "Nunito", staticText: "CARTÃO DO ALUNO" },
        { id: "ano", name: "ano_lectivo", type: "text", x: 30, y: 92, width: 300, height: 20, fontSize: 12, color: "#64748b", fontFamily: "Nunito" },
        // Photo (rounded, friendly)
        { id: "foto_circle_bg", name: "foto_circle_bg", type: "circle", x: 780, y: 25, width: 200, height: 200, color: "#dbeafe", locked: true },
        { id: "foto", name: "foto", type: "image", x: 790, y: 35, width: 180, height: 180, borderRadius: 90 },
        // Colored info cards
        { id: "card1_bg", name: "card1_bg", type: "rect", x: 30, y: 135, width: 720, height: 65, color: "#ffffff", borderRadius: 12, strokeColor: "#e2e8f0", strokeWidth: 1, locked: true },
        { id: "nome_icon_bg", name: "nome_icon_bg", type: "rect", x: 40, y: 145, width: 44, height: 44, color: "#dbeafe", borderRadius: 10, locked: true },
        { id: "nome_l", name: "NOME", type: "static-text", x: 96, y: 143, width: 200, height: 16, fontSize: 9, color: "#94a3b8", bold: true, fontFamily: "Nunito", staticText: "NOME DO ALUNO", letterSpacing: 2 },
        { id: "nome", name: "nome", type: "text", x: 96, y: 162, width: 640, height: 28, fontSize: 17, color: "#1e293b", bold: true, fontFamily: "Nunito" },
        // Row 2
        { id: "card2_bg", name: "card2_bg", type: "rect", x: 30, y: 212, width: 350, height: 65, color: "#ffffff", borderRadius: 12, strokeColor: "#e2e8f0", strokeWidth: 1, locked: true },
        { id: "turma_icon_bg", name: "turma_icon_bg", type: "rect", x: 40, y: 222, width: 44, height: 44, color: "#fef3c7", borderRadius: 10, locked: true },
        { id: "turma_l", name: "TURMA", type: "static-text", x: 96, y: 220, width: 150, height: 16, fontSize: 9, color: "#94a3b8", bold: true, fontFamily: "Nunito", staticText: "TURMA / CLASSE", letterSpacing: 2 },
        { id: "turma", name: "turma", type: "text", x: 96, y: 239, width: 270, height: 26, fontSize: 15, color: "#1e293b", fontFamily: "Nunito" },
        { id: "card3_bg", name: "card3_bg", type: "rect", x: 400, y: 212, width: 350, height: 65, color: "#ffffff", borderRadius: 12, strokeColor: "#e2e8f0", strokeWidth: 1, locked: true },
        { id: "num_icon_bg", name: "num_icon_bg", type: "rect", x: 410, y: 222, width: 44, height: 44, color: "#d1fae5", borderRadius: 10, locked: true },
        { id: "num_l", name: "Nº", type: "static-text", x: 466, y: 220, width: 150, height: 16, fontSize: 9, color: "#94a3b8", bold: true, fontFamily: "Nunito", staticText: "Nº ALUNO", letterSpacing: 2 },
        { id: "numero", name: "numero", type: "text", x: 466, y: 239, width: 270, height: 26, fontSize: 15, color: "#1e293b", fontFamily: "Nunito" },
        // Row 3
        { id: "card4_bg", name: "card4_bg", type: "rect", x: 30, y: 290, width: 720, height: 65, color: "#ffffff", borderRadius: 12, strokeColor: "#e2e8f0", strokeWidth: 1, locked: true },
        { id: "enc_icon_bg", name: "enc_icon_bg", type: "rect", x: 40, y: 300, width: 44, height: 44, color: "#fce7f3", borderRadius: 10, locked: true },
        { id: "enc_l", name: "ENCARREGADO", type: "static-text", x: 96, y: 298, width: 300, height: 16, fontSize: 9, color: "#94a3b8", bold: true, fontFamily: "Nunito", staticText: "ENCARREGADO DE EDUCAÇÃO", letterSpacing: 2 },
        { id: "encarregado", name: "encarregado", type: "text", x: 96, y: 317, width: 640, height: 26, fontSize: 15, color: "#1e293b", fontFamily: "Nunito" },
        // Emergency contact
        { id: "card5_bg", name: "card5_bg", type: "rect", x: 30, y: 368, width: 350, height: 65, color: "#ffffff", borderRadius: 12, strokeColor: "#e2e8f0", strokeWidth: 1, locked: true },
        { id: "tel_icon_bg", name: "tel_icon_bg", type: "rect", x: 40, y: 378, width: 44, height: 44, color: "#fee2e2", borderRadius: 10, locked: true },
        { id: "tel_l", name: "TELEFONE", type: "static-text", x: 96, y: 376, width: 200, height: 16, fontSize: 9, color: "#94a3b8", bold: true, fontFamily: "Nunito", staticText: "TELEFONE EMERGÊNCIA", letterSpacing: 2 },
        { id: "telefone", name: "telefone", type: "text", x: 96, y: 395, width: 270, height: 26, fontSize: 15, color: "#1e293b", fontFamily: "Nunito" },
        { id: "card6_bg", name: "card6_bg", type: "rect", x: 400, y: 368, width: 350, height: 65, color: "#ffffff", borderRadius: 12, strokeColor: "#e2e8f0", strokeWidth: 1, locked: true },
        { id: "sangue_icon_bg", name: "sangue_icon_bg", type: "rect", x: 410, y: 378, width: 44, height: 44, color: "#fef3c7", borderRadius: 10, locked: true },
        { id: "sangue_l", name: "G.SANGUÍNEO", type: "static-text", x: 466, y: 376, width: 200, height: 16, fontSize: 9, color: "#94a3b8", bold: true, fontFamily: "Nunito", staticText: "GRUPO SANGUÍNEO", letterSpacing: 2 },
        { id: "grupo_sanguineo", name: "grupo_sanguineo", type: "text", x: 466, y: 395, width: 270, height: 26, fontSize: 15, color: "#1e293b", fontFamily: "Nunito" },
        // QR
        { id: "qr", name: "qr_code", type: "qr", x: 810, y: 460, width: 140, height: 140, color: "#1e40af" },
        // Footer
        { id: "foot_txt", name: "footer", type: "text", x: 30, y: 490, width: 500, height: 18, fontSize: 9, color: "#94a3b8", fontFamily: "Nunito" },
        // Bottom colorful bar
        { id: "bot1", name: "bot1", type: "rect", x: 0, y: 628, width: 253, height: 10, color: "#3b82f6", locked: true },
        { id: "bot2", name: "bot2", type: "rect", x: 253, y: 628, width: 253, height: 10, color: "#f59e0b", locked: true },
        { id: "bot3", name: "bot3", type: "rect", x: 506, y: 628, width: 253, height: 10, color: "#10b981", locked: true },
        { id: "bot4", name: "bot4", type: "rect", x: 759, y: 628, width: 252, height: 10, color: "#ef4444", locked: true },
      ],
    },
  },
];

async function inject() {
  try {
    console.log("Connecting to database...");
    await pool.query("SELECT 1");
    console.log("Connected.\n");

    // Find admin
    let { rows: admins } = await pool.query(
      "SELECT id, email FROM users WHERE email = ANY($1) ORDER BY id LIMIT 1",
      [ADMIN_EMAILS]
    );
    if (!admins.length) {
      ({ rows: admins } = await pool.query(
        "SELECT id, email FROM users WHERE role = 'admin' ORDER BY id LIMIT 1"
      ));
    }
    if (!admins.length) {
      console.error("No admin user found.");
      process.exit(1);
    }
    const adminId = admins[0].id;
    console.log(`Admin: ${admins[0].email} (id: ${adminId})\n`);

    let inserted = 0;
    let updated = 0;

    for (const tmpl of templates) {
      const { rows: existing } = await pool.query(
        "SELECT id FROM templates WHERE name = $1 AND is_system = TRUE",
        [tmpl.name]
      );

      if (existing.length > 0) {
        await pool.query(
          "UPDATE templates SET data = $1 WHERE id = $2",
          [JSON.stringify(tmpl.data), existing[0].id]
        );
        console.log(`  [UPDATE] ${tmpl.name} (id: ${existing[0].id})`);
        updated++;
      } else {
        const { rows } = await pool.query(
          "INSERT INTO templates (name, data, user_id, is_system) VALUES ($1, $2, $3, TRUE) RETURNING id",
          [tmpl.name, JSON.stringify(tmpl.data), adminId]
        );
        console.log(`  [INSERT] ${tmpl.name} (id: ${rows[0].id})`);
        inserted++;
      }
    }

    // Show summary
    const { rows: all } = await pool.query(
      "SELECT id, name FROM templates WHERE is_system = TRUE ORDER BY id"
    );
    console.log(`\n  Inserted: ${inserted} | Updated: ${updated}`);
    console.log(`\nAll system templates (${all.length}):`);
    all.forEach((t: any) => console.log(`  [${t.id}] ${t.name}`));

    console.log("\nDone!");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

inject();
