import { Presentation, PresentationFile } from '@oai/artifact-tool';
import fs from 'node:fs/promises';
const output = 'C:/Users/elpro/Desktop/club_programacion/proyecto/TP-GRUPO-3-PROGRAMACION/Presentacion_Consulir_MVP.pptx';
const previewDir = 'C:/Users/elpro/Desktop/club_programacion/proyecto/TP-GRUPO-3-PROGRAMACION/.tmp/presentacion_consulir/previews';
const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const ink = '#111827', muted = '#4B5563', accent = '#0F766E', rule = '#B8BCC4';
const text = (slide, value, left, top, width, height, size, options = {}) => {
  const shape = slide.shapes.add({ geometry: 'textbox', position: { left, top, width, height }, fill: 'none', line: { style: 'solid', fill: 'none', width: 0 } });
  shape.text = value; shape.text.style = { fontSize: size, typeface: 'Helvetica Neue', color: options.color || ink, bold: Boolean(options.bold), alignment: options.align || 'left' };
};
const line = (slide, left, top, width, color = rule) => slide.shapes.add({ geometry: 'rect', position: { left, top, width, height: 2 }, fill: color, line: { style: 'solid', fill: color, width: 0 } });
const footer = (slide, n) => text(slide, `TP-GRUPO-3-PROGRAMACION  |  ${n}`, 72, 670, 1136, 20, 14, { color: muted, align: 'right' });
const base = () => { const slide = deck.slides.add(); slide.background.fill = '#FFFFFF'; return slide; };
{
  const s = base(); text(s, 'INFORME PARA LA CÁTEDRA', 72, 64, 600, 30, 24, { color: accent, bold: true }); line(s, 72, 118, 1136, accent);
  text(s, 'Consulir\nApp', 72, 206, 890, 190, 78, { bold: true }); text(s, 'Estado actual del MVP\ny alcance del próximo sprint', 72, 462, 610, 96, 30, { color: muted }); text(s, 'Aplicación web de finanzas personales', 72, 610, 620, 30, 20, { color: muted });
}
{
  const s = base(); text(s, 'Objetivo de la aplicación', 72, 64, 1100, 52, 38, { bold: true }); line(s, 72, 145, 1136);
  text(s, 'Consulir es una aplicación web de finanzas personales orientada a que los usuarios gestionen ingresos, egresos y resultados mensuales.', 72, 270, 920, 140, 32, { color: muted });
  text(s, 'MVP de finanzas personales', 72, 520, 620, 36, 26, { color: accent, bold: true }); footer(s, '02');
}
{
  const s = base(); text(s, 'Funcionalidades implementadas hasta el momento', 72, 64, 1150, 52, 38, { bold: true }); line(s, 72, 145, 1136);
  ['Landing page con información institucional, navegación y estadísticas simuladas.', 'Pantallas de inicio de sesión y registro de usuarios.', 'Validaciones básicas en formularios, mensajes de error y estado de carga.', 'Elementos iniciales de accesibilidad en autenticación: etiquetas asociadas a campos, atributos ARIA y controles navegables por teclado.', 'Estructura modular del proyecto con componentes, páginas, rutas y servicios.', 'Dashboard y rutas protegidas definidos como base, aunque todavía son temporales y sin autenticación real.'].forEach((item, i) => { const column = i < 3 ? 72 : 670; const row = i % 3; const y = 205 + row * 142; text(s, '•', column, y, 25, 30, 24, { color: accent, bold: true }); text(s, item, column + 32, y, 500, 105, 20, { color: muted }); }); footer(s, '03');
}
{
  const s = base(); text(s, 'Funcionalidades a abarcar\nen el próximo sprint', 72, 52, 1136, 95, 36, { bold: true }); line(s, 72, 170, 1136);
  ['Crear el formulario de registro de ingresos.', 'Incorporar campos de monto, fecha y concepto o descripción.', 'Agregar un botón para guardar el ingreso y la lógica de validación correspondiente.', 'Asegurar accesibilidad completa en este formulario: etiquetas visibles/asociadas, foco perceptible y navegación mediante teclado.', 'Mostrar los ingresos registrados en el dashboard.', 'Avanzar en la integración con backend para persistir usuarios y movimientos financieros.'].forEach((item, i) => { const column = i < 3 ? 72 : 670; const row = i % 3; const y = 205 + row * 142; text(s, '•', column, y, 25, 30, 24, { color: accent, bold: true }); text(s, item, column + 32, y, 500, 105, 20, { color: muted }); }); footer(s, '04');
}
{
  const s = base(); text(s, 'PRÓXIMO HITO', 72, 64, 500, 30, 24, { color: accent, bold: true }); line(s, 72, 118, 1136, accent); text(s, 'Del acceso\nal movimiento', 72, 206, 920, 190, 78, { bold: true }); text(s, 'La siguiente entrega transforma la base actual\nen gestión financiera real.', 72, 492, 690, 85, 30, { color: muted }); footer(s, '05');
}
async function saveBlob(path, blob) { await fs.writeFile(path, new Uint8Array(await blob.arrayBuffer())); }
await fs.mkdir(previewDir, { recursive: true });
for (const [index, slide] of deck.slides.items.entries()) await saveBlob(`${previewDir}/slide-${index + 1}.png`, await deck.export({ slide, format: 'png', scale: 1 }));
const pptx = await PresentationFile.exportPptx(deck); await pptx.save(output);
