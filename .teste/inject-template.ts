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

const template = {
  name: "ITPGAVS — Cartão de Estudante",
  data: {
    name: "ITPGAVS — Cartão de Estudante",
    width: 874,
    height: 1240,
    backgroundColor: "#ffffff",
    fields: [
      // Green top accent bar
      { id: "top_bar", name: "top_bar", type: "rect", x: 0, y: 0, width: 874, height: 8, color: "#1a6b2a", locked: true },
      // Logo at top center
      { id: "logo", name: "Logo ITPGAVS", type: "static-image", x: 262, y: 20, width: 350, height: 270, staticUrl: "/templates/itpgavs/logo.png", locked: true },
      // Subtitle
      { id: "subtitle", name: "- ENSINO POR EXCELÊNCIA -", type: "static-text", x: 137, y: 290, width: 600, height: 30, fontSize: 14, color: "#1a1a1a", bold: true, fontFamily: "Arial", align: "center", staticText: "- ENSINO POR EXCELÊNCIA -", letterSpacing: 2 },
      // Background watermark logo (low opacity, behind photo)
      { id: "watermark", name: "Watermark", type: "static-image", x: 137, y: 320, width: 600, height: 460, staticUrl: "/templates/itpgavs/logo.png", opacity: 0.08, locked: true },
      // Green side accents
      { id: "side_left", name: "side_left", type: "rect", x: 0, y: 340, width: 50, height: 380, fillType: "gradient", gradientColor1: "#1a6b2a", gradientColor2: "#2d8a3e", gradientDirection: "vertical", opacity: 0.15, locked: true },
      { id: "side_right", name: "side_right", type: "rect", x: 824, y: 340, width: 50, height: 380, fillType: "gradient", gradientColor1: "#1a6b2a", gradientColor2: "#2d8a3e", gradientDirection: "vertical", opacity: 0.15, locked: true },
      // Photo frame (green border)
      { id: "photo_frame", name: "photo_frame", type: "rect", x: 267, y: 340, width: 340, height: 380, color: "#2d8a3e", strokeColor: "#2d8a3e", strokeWidth: 4, locked: true },
      // Student photo (dynamic)
      { id: "foto", name: "foto", type: "image", x: 275, y: 348, width: 324, height: 364 },
      // NOME label (green background)
      { id: "nome_label_bg", name: "nome_label_bg", type: "rect", x: 30, y: 750, width: 130, height: 42, color: "#1a6b2a", borderRadius: 2, locked: true },
      { id: "nome_label", name: "NOME:", type: "static-text", x: 32, y: 750, width: 126, height: 42, fontSize: 16, color: "#ffffff", bold: true, fontFamily: "Arial", align: "center", verticalAlign: "middle", staticText: "NOME:" },
      // Name field (white bg with border)
      { id: "nome_field_bg", name: "nome_field_bg", type: "rect", x: 160, y: 750, width: 684, height: 42, color: "#f5f5f0", strokeColor: "#cccccc", strokeWidth: 1, borderRadius: 2, locked: true },
      { id: "nome", name: "nome", type: "text", x: 170, y: 750, width: 664, height: 42, fontSize: 15, color: "#1a1a1a", bold: true, fontFamily: "Arial", verticalAlign: "middle" },
      // CURSO
      { id: "curso_label", name: "CURSO:", type: "static-text", x: 30, y: 810, width: 130, height: 35, fontSize: 16, color: "#1a1a1a", bold: true, fontFamily: "Arial", staticText: "CURSO:" },
      { id: "curso", name: "curso", type: "text", x: 160, y: 810, width: 684, height: 35, fontSize: 16, color: "#1a1a1a", fontFamily: "Arial" },
      // CLASSE + TURNO (same row)
      { id: "classe_label", name: "CLASSE:", type: "static-text", x: 30, y: 855, width: 130, height: 35, fontSize: 16, color: "#1a1a1a", bold: true, fontFamily: "Arial", staticText: "CLASSE:" },
      { id: "classe", name: "classe", type: "text", x: 160, y: 855, width: 220, height: 35, fontSize: 16, color: "#1a1a1a", fontFamily: "Arial" },
      { id: "turno_label", name: "TURNO:", type: "static-text", x: 440, y: 855, width: 130, height: 35, fontSize: 16, color: "#1a1a1a", bold: true, fontFamily: "Arial", staticText: "TURNO:" },
      { id: "turno", name: "turno", type: "text", x: 570, y: 855, width: 274, height: 35, fontSize: 16, color: "#1a1a1a", fontFamily: "Arial" },
      // Divider
      { id: "divider", name: "divider", type: "line", x: 200, y: 910, width: 474, height: 1, color: "#cccccc" },
      // DIRECTORA GERAL
      { id: "directora_label", name: "DIRECTORA GERAL", type: "static-text", x: 237, y: 925, width: 400, height: 30, fontSize: 13, color: "#1a1a1a", bold: true, fontFamily: "Arial", align: "center", staticText: "DIRECTORA GERAL", letterSpacing: 3 },
      // Signature line
      { id: "sig_line", name: "sig_line", type: "line", x: 287, y: 1010, width: 300, height: 1, color: "#555555" },
      // Stamp/seal
      { id: "carimbo", name: "Carimbo", type: "static-image", x: 312, y: 950, width: 250, height: 250, staticUrl: "/templates/itpgavs/carimbo.png", opacity: 0.7, locked: true },
      // Bottom yellow-green stripe
      { id: "bottom_yellow", name: "bottom_yellow", type: "rect", x: 0, y: 1200, width: 874, height: 8, color: "#d4a917", locked: true },
      { id: "bottom_green", name: "bottom_green", type: "rect", x: 0, y: 1208, width: 874, height: 32, fillType: "gradient", gradientColor1: "#1a6b2a", gradientColor2: "#2d8a3e", gradientDirection: "horizontal", locked: true },
    ],
  },
};

async function inject() {
  try {
    console.log("Connecting to database...");
    await pool.query("SELECT 1");
    console.log("Connected.\n");

    // Find an admin user
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
      console.error("No admin user found. Create one first.");
      process.exit(1);
    }
    const adminId = admins[0].id;
    console.log(`Using admin: ${admins[0].email} (id: ${adminId})`);

    // Check if template already exists
    const { rows: existing } = await pool.query(
      "SELECT id FROM templates WHERE name = $1 AND is_system = TRUE",
      [template.name]
    );

    if (existing.length > 0) {
      // Update existing
      await pool.query(
        "UPDATE templates SET data = $1 WHERE id = $2",
        [JSON.stringify(template.data), existing[0].id]
      );
      console.log(`\nUpdated existing template: "${template.name}" (id: ${existing[0].id})`);
    } else {
      // Insert new
      const { rows } = await pool.query(
        "INSERT INTO templates (name, data, user_id, is_system) VALUES ($1, $2, $3, TRUE) RETURNING id",
        [template.name, JSON.stringify(template.data), adminId]
      );
      console.log(`\nInserted new template: "${template.name}" (id: ${rows[0].id})`);
    }

    // Show all system templates
    const { rows: all } = await pool.query(
      "SELECT id, name FROM templates WHERE is_system = TRUE ORDER BY id"
    );
    console.log(`\nSystem templates (${all.length}):`);
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
