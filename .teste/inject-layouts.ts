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

// Layouts are reusable sets of TemplateField[] that can be dropped onto any template
const layouts = [
  // ═══════════════════════════════════════════════════
  // HEADERS
  // ═══════════════════════════════════════════════════
  {
    name: "Header — Azul Institucional",
    data: [
      { id: "h_bg", name: "header_bg", type: "rect", x: 0, y: 0, width: 1011, height: 140, fillType: "gradient", gradientColor1: "#1e3a5f", gradientColor2: "#2563eb", gradientDirection: "horizontal", locked: true },
      { id: "h_escola", name: "escola", type: "text", x: 30, y: 20, width: 600, height: 25, fontSize: 11, color: "#ffffff", bold: true, fontFamily: "Montserrat", letterSpacing: 4, opacity: 0.8 },
      { id: "h_title", name: "titulo", type: "text", x: 30, y: 50, width: 600, height: 40, fontSize: 22, color: "#ffffff", bold: true, fontFamily: "Montserrat" },
      { id: "h_sub", name: "subtitulo", type: "text", x: 30, y: 95, width: 400, height: 22, fontSize: 12, color: "#ffffff", fontFamily: "Montserrat", opacity: 0.7 },
    ],
  },
  {
    name: "Header — Verde Escuro",
    data: [
      { id: "h_bg", name: "header_bg", type: "rect", x: 0, y: 0, width: 1011, height: 140, fillType: "gradient", gradientColor1: "#064e3b", gradientColor2: "#059669", gradientDirection: "diagonal", locked: true },
      { id: "h_deco", name: "deco", type: "circle", x: 820, y: -50, width: 280, height: 280, color: "#ffffff", opacity: 0.04, locked: true },
      { id: "h_escola", name: "escola", type: "text", x: 30, y: 20, width: 600, height: 25, fontSize: 11, color: "#ffffff", bold: true, fontFamily: "Inter", letterSpacing: 4, opacity: 0.8 },
      { id: "h_title", name: "titulo", type: "text", x: 30, y: 50, width: 600, height: 40, fontSize: 22, color: "#ffffff", bold: true, fontFamily: "Inter" },
      { id: "h_sub", name: "subtitulo", type: "text", x: 30, y: 95, width: 400, height: 22, fontSize: 12, color: "#ffffff", fontFamily: "Inter", opacity: 0.7 },
    ],
  },
  {
    name: "Header — Vermelho Governo",
    data: [
      { id: "h_bg", name: "header_bg", type: "rect", x: 0, y: 0, width: 1011, height: 160, fillType: "gradient", gradientColor1: "#7f1d1d", gradientColor2: "#dc2626", gradientDirection: "diagonal", locked: true },
      { id: "h_rep", name: "REPÚBLICA DE ANGOLA", type: "static-text", x: 30, y: 18, width: 951, height: 18, fontSize: 9, color: "#ffffff", bold: true, fontFamily: "Montserrat", align: "center", staticText: "REPÚBLICA DE ANGOLA", letterSpacing: 5, opacity: 0.7 },
      { id: "h_min", name: "MINISTÉRIO DA EDUCAÇÃO", type: "static-text", x: 30, y: 38, width: 951, height: 18, fontSize: 9, color: "#ffffff", bold: true, fontFamily: "Montserrat", align: "center", staticText: "MINISTÉRIO DA EDUCAÇÃO", letterSpacing: 3, opacity: 0.7 },
      { id: "h_escola", name: "escola", type: "text", x: 30, y: 68, width: 951, height: 40, fontSize: 20, color: "#ffffff", bold: true, fontFamily: "Montserrat", align: "center" },
      { id: "h_sub", name: "subtitulo", type: "text", x: 30, y: 115, width: 951, height: 25, fontSize: 11, color: "#ffffff", fontFamily: "Montserrat", align: "center", opacity: 0.8, letterSpacing: 4 },
    ],
  },
  {
    name: "Header — Dark Premium",
    data: [
      { id: "h_bg", name: "header_bg", type: "rect", x: 0, y: 0, width: 1011, height: 140, fillType: "gradient", gradientColor1: "#0f172a", gradientColor2: "#1e293b", gradientDirection: "horizontal", locked: true },
      { id: "h_accent", name: "accent", type: "rect", x: 0, y: 0, width: 1011, height: 3, fillType: "gradient", gradientColor1: "#8b5cf6", gradientColor2: "#3b82f6", gradientDirection: "horizontal", locked: true },
      { id: "h_escola", name: "escola", type: "text", x: 30, y: 22, width: 500, height: 20, fontSize: 10, color: "#8b5cf6", bold: true, fontFamily: "Space Grotesk", letterSpacing: 4 },
      { id: "h_title", name: "titulo", type: "text", x: 30, y: 46, width: 500, height: 35, fontSize: 20, color: "#ffffff", bold: true, fontFamily: "Space Grotesk" },
      { id: "h_sub", name: "subtitulo", type: "text", x: 30, y: 86, width: 400, height: 22, fontSize: 11, color: "#64748b", fontFamily: "Space Grotesk" },
    ],
  },

  // ═══════════════════════════════════════════════════
  // BLOCOS DE DADOS DO ALUNO
  // ═══════════════════════════════════════════════════
  {
    name: "Dados Aluno — Completo (5 campos)",
    data: [
      { id: "d_nome_l", name: "NOME", type: "static-text", x: 30, y: 200, width: 500, height: 16, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Inter", staticText: "NOME COMPLETO", letterSpacing: 2 },
      { id: "d_nome", name: "nome", type: "text", x: 30, y: 218, width: 700, height: 32, fontSize: 18, color: "#111827", bold: true, fontFamily: "Inter" },
      { id: "d_div1", name: "div1", type: "line", x: 30, y: 256, width: 700, height: 1, color: "#e5e7eb" },
      { id: "d_curso_l", name: "CURSO", type: "static-text", x: 30, y: 268, width: 500, height: 16, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Inter", staticText: "CURSO", letterSpacing: 2 },
      { id: "d_curso", name: "curso", type: "text", x: 30, y: 286, width: 700, height: 26, fontSize: 14, color: "#374151", fontFamily: "Inter" },
      { id: "d_div2", name: "div2", type: "line", x: 30, y: 318, width: 700, height: 1, color: "#e5e7eb" },
      { id: "d_cl_l", name: "CLASSE", type: "static-text", x: 30, y: 330, width: 220, height: 16, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Inter", staticText: "CLASSE", letterSpacing: 2 },
      { id: "d_classe", name: "classe", type: "text", x: 30, y: 348, width: 220, height: 26, fontSize: 14, color: "#374151", fontFamily: "Inter" },
      { id: "d_tu_l", name: "TURMA", type: "static-text", x: 270, y: 330, width: 220, height: 16, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Inter", staticText: "TURMA", letterSpacing: 2 },
      { id: "d_turma", name: "turma", type: "text", x: 270, y: 348, width: 220, height: 26, fontSize: 14, color: "#374151", fontFamily: "Inter" },
      { id: "d_nu_l", name: "Nº ALUNO", type: "static-text", x: 510, y: 330, width: 220, height: 16, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Inter", staticText: "Nº ALUNO", letterSpacing: 2 },
      { id: "d_numero", name: "numero", type: "text", x: 510, y: 348, width: 220, height: 26, fontSize: 14, color: "#374151", fontFamily: "Inter" },
    ],
  },
  {
    name: "Dados Aluno — Simplificado (3 campos)",
    data: [
      { id: "s_nome_l", name: "NOME", type: "static-text", x: 30, y: 200, width: 500, height: 16, fontSize: 9, color: "#6b7280", bold: true, fontFamily: "Inter", staticText: "NOME", letterSpacing: 2 },
      { id: "s_nome", name: "nome", type: "text", x: 30, y: 220, width: 700, height: 30, fontSize: 17, color: "#111827", bold: true, fontFamily: "Inter" },
      { id: "s_div", name: "div", type: "line", x: 30, y: 258, width: 700, height: 1, color: "#e5e7eb" },
      { id: "s_turma_l", name: "TURMA", type: "static-text", x: 30, y: 272, width: 300, height: 16, fontSize: 9, color: "#6b7280", bold: true, fontFamily: "Inter", staticText: "TURMA / CLASSE", letterSpacing: 2 },
      { id: "s_turma", name: "turma", type: "text", x: 30, y: 290, width: 300, height: 26, fontSize: 15, color: "#111827", fontFamily: "Inter" },
      { id: "s_num_l", name: "Nº", type: "static-text", x: 380, y: 272, width: 300, height: 16, fontSize: 9, color: "#6b7280", bold: true, fontFamily: "Inter", staticText: "Nº ALUNO", letterSpacing: 2 },
      { id: "s_numero", name: "numero", type: "text", x: 380, y: 290, width: 300, height: 26, fontSize: 15, color: "#111827", fontFamily: "Inter" },
    ],
  },

  // ═══════════════════════════════════════════════════
  // BLOCOS DE CONTACTO / EMERGÊNCIA
  // ═══════════════════════════════════════════════════
  {
    name: "Bloco — Contacto de Emergência",
    data: [
      { id: "e_div", name: "div", type: "line", x: 30, y: 400, width: 700, height: 1, color: "#e5e7eb" },
      { id: "e_enc_l", name: "ENCARREGADO", type: "static-text", x: 30, y: 415, width: 400, height: 16, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Inter", staticText: "ENCARREGADO DE EDUCAÇÃO", letterSpacing: 2 },
      { id: "e_enc", name: "encarregado", type: "text", x: 30, y: 433, width: 700, height: 26, fontSize: 14, color: "#374151", fontFamily: "Inter" },
      { id: "e_div2", name: "div2", type: "line", x: 30, y: 465, width: 700, height: 1, color: "#e5e7eb" },
      { id: "e_tel_l", name: "TELEFONE", type: "static-text", x: 30, y: 478, width: 330, height: 16, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Inter", staticText: "TELEFONE EMERGÊNCIA", letterSpacing: 2 },
      { id: "e_tel", name: "telefone", type: "text", x: 30, y: 496, width: 330, height: 26, fontSize: 14, color: "#374151", fontFamily: "Inter" },
      { id: "e_morada_l", name: "MORADA", type: "static-text", x: 400, y: 478, width: 330, height: 16, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Inter", staticText: "MORADA", letterSpacing: 2 },
      { id: "e_morada", name: "morada", type: "text", x: 400, y: 496, width: 330, height: 26, fontSize: 14, color: "#374151", fontFamily: "Inter" },
    ],
  },
  {
    name: "Bloco — Info Pessoal (Nascimento + Sangue)",
    data: [
      { id: "p_div", name: "div", type: "line", x: 30, y: 400, width: 700, height: 1, color: "#e5e7eb" },
      { id: "p_nasc_l", name: "NASCIMENTO", type: "static-text", x: 30, y: 415, width: 220, height: 16, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Inter", staticText: "DATA NASCIMENTO", letterSpacing: 2 },
      { id: "p_nasc", name: "nascimento", type: "text", x: 30, y: 433, width: 220, height: 26, fontSize: 14, color: "#374151", fontFamily: "Inter" },
      { id: "p_bi_l", name: "BI/CÉDULA", type: "static-text", x: 270, y: 415, width: 220, height: 16, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Inter", staticText: "BI / CÉDULA", letterSpacing: 2 },
      { id: "p_bi", name: "bi", type: "text", x: 270, y: 433, width: 220, height: 26, fontSize: 14, color: "#374151", fontFamily: "Inter" },
      { id: "p_sg_l", name: "G.SANGUÍNEO", type: "static-text", x: 510, y: 415, width: 220, height: 16, fontSize: 9, color: "#9ca3af", bold: true, fontFamily: "Inter", staticText: "GRUPO SANGUÍNEO", letterSpacing: 2 },
      { id: "p_sangue", name: "grupo_sanguineo", type: "text", x: 510, y: 433, width: 220, height: 26, fontSize: 14, color: "#374151", fontFamily: "Inter" },
    ],
  },

  // ═══════════════════════════════════════════════════
  // FOTOS
  // ═══════════════════════════════════════════════════
  {
    name: "Foto — Retangular com Sombra",
    data: [
      { id: "f_shadow", name: "foto_shadow", type: "rect", x: 35, y: 165, width: 190, height: 230, color: "#000000", opacity: 0.06, borderRadius: 14, locked: true },
      { id: "f_bg", name: "foto_bg", type: "rect", x: 30, y: 160, width: 190, height: 230, color: "#ffffff", borderRadius: 12, strokeColor: "#e5e7eb", strokeWidth: 1, locked: true },
      { id: "f_foto", name: "foto", type: "image", x: 38, y: 168, width: 174, height: 214, borderRadius: 8 },
    ],
  },
  {
    name: "Foto — Circular Grande",
    data: [
      { id: "fc_bg", name: "foto_bg", type: "circle", x: 30, y: 160, width: 220, height: 220, color: "#f1f5f9", locked: true },
      { id: "fc_foto", name: "foto", type: "image", x: 40, y: 170, width: 200, height: 200, borderRadius: 100 },
    ],
  },
  {
    name: "Foto — Com Moldura Colorida",
    data: [
      { id: "fm_frame", name: "frame", type: "rect", x: 27, y: 157, width: 196, height: 236, fillType: "gradient", gradientColor1: "#2563eb", gradientColor2: "#7c3aed", gradientDirection: "diagonal", borderRadius: 14, locked: true },
      { id: "fm_inner", name: "inner", type: "rect", x: 31, y: 161, width: 188, height: 228, color: "#ffffff", borderRadius: 12, locked: true },
      { id: "fm_foto", name: "foto", type: "image", x: 35, y: 165, width: 180, height: 220, borderRadius: 10 },
    ],
  },

  // ═══════════════════════════════════════════════════
  // QR CODES
  // ═══════════════════════════════════════════════════
  {
    name: "QR Code — Canto Inferior Direito",
    data: [
      { id: "qr_bg", name: "qr_bg", type: "rect", x: 850, y: 470, width: 140, height: 140, color: "#f9fafb", borderRadius: 12, locked: true },
      { id: "qr", name: "qr_code", type: "qr", x: 860, y: 480, width: 120, height: 120, color: "#111827" },
    ],
  },
  {
    name: "QR Code — Central com Label",
    data: [
      { id: "qr_label", name: "SCAN PARA VERIFICAR", type: "static-text", x: 355, y: 440, width: 300, height: 18, fontSize: 9, color: "#9ca3af", fontFamily: "Inter", align: "center", staticText: "SCAN PARA VERIFICAR", letterSpacing: 3 },
      { id: "qr", name: "qr_code", type: "qr", x: 405, y: 465, width: 200, height: 200, color: "#111827" },
    ],
  },

  // ═══════════════════════════════════════════════════
  // FOOTERS
  // ═══════════════════════════════════════════════════
  {
    name: "Footer — Barra Simples",
    data: [
      { id: "ft_bar", name: "footer_bar", type: "rect", x: 0, y: 600, width: 1011, height: 38, color: "#111827", locked: true },
      { id: "ft_txt", name: "footer", type: "text", x: 30, y: 608, width: 951, height: 20, fontSize: 10, color: "#ffffff", fontFamily: "Inter", align: "center", opacity: 0.8 },
    ],
  },
  {
    name: "Footer — Gradiente Azul",
    data: [
      { id: "ft_bar", name: "footer_bar", type: "rect", x: 0, y: 595, width: 1011, height: 43, fillType: "gradient", gradientColor1: "#1e3a5f", gradientColor2: "#2563eb", gradientDirection: "horizontal", locked: true },
      { id: "ft_txt", name: "footer", type: "text", x: 30, y: 604, width: 500, height: 20, fontSize: 10, color: "#ffffff", fontFamily: "Inter", opacity: 0.85 },
      { id: "ft_web", name: "website", type: "text", x: 500, y: 604, width: 480, height: 20, fontSize: 10, color: "#ffffff", fontFamily: "Inter", align: "right", opacity: 0.6 },
    ],
  },
  {
    name: "Footer — Multicolor (Primário)",
    data: [
      { id: "ft1", name: "f1", type: "rect", x: 0, y: 628, width: 253, height: 10, color: "#3b82f6", locked: true },
      { id: "ft2", name: "f2", type: "rect", x: 253, y: 628, width: 253, height: 10, color: "#f59e0b", locked: true },
      { id: "ft3", name: "f3", type: "rect", x: 506, y: 628, width: 253, height: 10, color: "#10b981", locked: true },
      { id: "ft4", name: "f4", type: "rect", x: 759, y: 628, width: 252, height: 10, color: "#ef4444", locked: true },
    ],
  },

  // ═══════════════════════════════════════════════════
  // ASSINATURAS
  // ═══════════════════════════════════════════════════
  {
    name: "Assinaturas — Dupla (Director + Encarregado)",
    data: [
      { id: "sig1_line", name: "sig1_line", type: "line", x: 80, y: 530, width: 300, height: 1, color: "#d1d5db" },
      { id: "sig1_label", name: "Director(a)", type: "static-text", x: 80, y: 536, width: 300, height: 18, fontSize: 9, color: "#9ca3af", fontFamily: "Inter", align: "center", staticText: "Director(a) da Escola" },
      { id: "sig2_line", name: "sig2_line", type: "line", x: 630, y: 530, width: 300, height: 1, color: "#d1d5db" },
      { id: "sig2_label", name: "Encarregado", type: "static-text", x: 630, y: 536, width: 300, height: 18, fontSize: 9, color: "#9ca3af", fontFamily: "Inter", align: "center", staticText: "Encarregado de Educação" },
    ],
  },
  {
    name: "Assinatura — Única Central",
    data: [
      { id: "sig_line", name: "sig_line", type: "line", x: 350, y: 530, width: 310, height: 1, color: "#d1d5db" },
      { id: "sig_label", name: "Director(a) Geral", type: "static-text", x: 350, y: 536, width: 310, height: 18, fontSize: 9, color: "#9ca3af", fontFamily: "Inter", align: "center", staticText: "Director(a) Geral" },
    ],
  },

  // ═══════════════════════════════════════════════════
  // DECORAÇÕES
  // ═══════════════════════════════════════════════════
  {
    name: "Decoração — Barras Laterais Verdes",
    data: [
      { id: "bar_left", name: "bar_left", type: "rect", x: 0, y: 0, width: 8, height: 638, fillType: "gradient", gradientColor1: "#065f46", gradientColor2: "#10b981", gradientDirection: "vertical", locked: true },
      { id: "bar_right", name: "bar_right", type: "rect", x: 1003, y: 0, width: 8, height: 638, fillType: "gradient", gradientColor1: "#10b981", gradientColor2: "#065f46", gradientDirection: "vertical", locked: true },
    ],
  },
  {
    name: "Decoração — Cantos Arredondados",
    data: [
      { id: "corner_tl", name: "corner_tl", type: "rect", x: 10, y: 10, width: 40, height: 4, color: "#2563eb", borderRadius: 2, locked: true },
      { id: "corner_tl2", name: "corner_tl2", type: "rect", x: 10, y: 10, width: 4, height: 40, color: "#2563eb", borderRadius: 2, locked: true },
      { id: "corner_tr", name: "corner_tr", type: "rect", x: 961, y: 10, width: 40, height: 4, color: "#2563eb", borderRadius: 2, locked: true },
      { id: "corner_tr2", name: "corner_tr2", type: "rect", x: 997, y: 10, width: 4, height: 40, color: "#2563eb", borderRadius: 2, locked: true },
      { id: "corner_bl", name: "corner_bl", type: "rect", x: 10, y: 624, width: 40, height: 4, color: "#2563eb", borderRadius: 2, locked: true },
      { id: "corner_bl2", name: "corner_bl2", type: "rect", x: 10, y: 588, width: 4, height: 40, color: "#2563eb", borderRadius: 2, locked: true },
      { id: "corner_br", name: "corner_br", type: "rect", x: 961, y: 624, width: 40, height: 4, color: "#2563eb", borderRadius: 2, locked: true },
      { id: "corner_br2", name: "corner_br2", type: "rect", x: 997, y: 588, width: 4, height: 40, color: "#2563eb", borderRadius: 2, locked: true },
    ],
  },
  {
    name: "Decoração — Watermark Central",
    data: [
      { id: "wm_circle1", name: "wm1", type: "circle", x: 306, y: 119, width: 400, height: 400, color: "#2563eb", opacity: 0.03, locked: true },
      { id: "wm_circle2", name: "wm2", type: "circle", x: 356, y: 169, width: 300, height: 300, color: "#2563eb", opacity: 0.03, locked: true },
    ],
  },

  // ═══════════════════════════════════════════════════
  // BADGES / ETIQUETAS
  // ═══════════════════════════════════════════════════
  {
    name: "Badge — Tipo de Aluno",
    data: [
      { id: "badge_bg", name: "badge_bg", type: "rect", x: 800, y: 160, width: 180, height: 32, color: "#2563eb", borderRadius: 16, locked: true },
      { id: "badge_txt", name: "tipo_aluno", type: "text", x: 800, y: 160, width: 180, height: 32, fontSize: 11, color: "#ffffff", bold: true, fontFamily: "Inter", align: "center", verticalAlign: "middle" },
    ],
  },
  {
    name: "Badge — Validade",
    data: [
      { id: "val_bg", name: "val_bg", type: "rect", x: 790, y: 20, width: 190, height: 55, color: "#ffffff", opacity: 0.15, borderRadius: 12, locked: true },
      { id: "val_label", name: "VÁLIDO ATÉ", type: "static-text", x: 800, y: 24, width: 170, height: 16, fontSize: 8, color: "#ffffff", bold: true, fontFamily: "Inter", align: "center", staticText: "VÁLIDO ATÉ", letterSpacing: 3, opacity: 0.7 },
      { id: "val_date", name: "validade", type: "text", x: 800, y: 42, width: 170, height: 26, fontSize: 15, color: "#ffffff", bold: true, fontFamily: "Inter", align: "center" },
    ],
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

    for (const layout of layouts) {
      const { rows: existing } = await pool.query(
        "SELECT id FROM layouts WHERE name = $1 AND user_id = $2",
        [layout.name, adminId]
      );

      if (existing.length > 0) {
        await pool.query(
          "UPDATE layouts SET data = $1 WHERE id = $2",
          [JSON.stringify(layout.data), existing[0].id]
        );
        console.log(`  [UPDATE] ${layout.name} (id: ${existing[0].id})`);
        updated++;
      } else {
        const { rows } = await pool.query(
          "INSERT INTO layouts (name, data, user_id) VALUES ($1, $2, $3) RETURNING id",
          [layout.name, JSON.stringify(layout.data), adminId]
        );
        console.log(`  [INSERT] ${layout.name} (id: ${rows[0].id})`);
        inserted++;
      }
    }

    const { rows: all } = await pool.query(
      "SELECT id, name FROM layouts ORDER BY id"
    );
    console.log(`\n  Inserted: ${inserted} | Updated: ${updated}`);
    console.log(`\nAll layouts (${all.length}):`);
    all.forEach((l: any) => console.log(`  [${l.id}] ${l.name}`));

    console.log("\nDone!");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

inject();
