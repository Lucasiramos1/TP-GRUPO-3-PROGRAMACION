import { Presentation, PresentationFile } from '@oai/artifact-tool';
import { buildSlide01 } from './slide-01.mjs';
import { buildSlide05 } from './slide-05.mjs';
import { buildSlide10 } from './slide-10.mjs';
import fs from 'node:fs/promises';

const output = 'C:/Users/elpro/Desktop/club_programacion/proyecto/TP-GRUPO-3-PROGRAMACION/Presentacion_Consulir_MVP.pptx';
const previewDir = 'C:/Users/elpro/Desktop/club_programacion/proyecto/TP-GRUPO-3-PROGRAMACION/.tmp/presentacion_consulir/previews';
const para = (run) => ({ runs: [{ run, textStyle: {} }] });

async function saveBlob(path, blob) {
  await fs.writeFile(path, new Uint8Array(await blob.arrayBuffer()));
}

const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });

buildSlide01(deck, {
  title: para('INFORME PARA LA CÁTEDRA'),
  title2: para('Consulir\nApp'),
  title3: para('Estado actual del MVP\ny alcance del próximo sprint'),
});

buildSlide05(deck, {
  footer1: para('02'),
  title: para('El MVP apunta a ordenar las finanzas personales'),
  body1: {
    titleHere: para('Objetivo'),
    loremIpsumDolorSitAmetConsecteturAdipiscing: para('Ofrecer una aplicación web para que cada usuario gestione ingresos, egresos y resultados mensuales desde una interfaz clara y modular.'),
  },
  body2: {
    titleHere: para('Enfoque actual'),
    loremIpsumDolorSitAmetConsecteturAdipiscing: para('El proyecto prioriza la experiencia inicial: presentación del producto, acceso de usuarios y una base técnica preparada para crecer.'),
  },
});

buildSlide10(deck, {
  footer1: para('03'),
  title: para('La base funcional del MVP ya está construida'),
  body1: para('El trabajo realizado permite recorrer la experiencia inicial y deja separados los componentes, páginas, rutas y servicios.'),
  body2: para('Estado implementado'),
  label1: para('Landing page'),
  label2: para('Inicio de sesión'),
  label3: para('Registro de usuarios'),
  label4: para('Validaciones y ARIA'),
  label5: para('Rutas y servicios base'),
});

buildSlide05(deck, {
  footer1: para('04'),
  title: para('El próximo sprint incorpora el registro de ingresos'),
  body1: {
    titleHere: para('Formulario accesible'),
    loremIpsumDolorSitAmetConsecteturAdipiscing: para('Crear los campos monto, fecha y concepto o descripción. Cada control contará con etiqueta asociada, foco visible y navegación por teclado.'),
  },
  body2: {
    titleHere: para('Registro y visualización'),
    loremIpsumDolorSitAmetConsecteturAdipiscing: para('Agregar el botón Guardar ingreso, validar los datos y presentar los movimientos registrados dentro del dashboard.'),
  },
});

buildSlide01(deck, {
  title: para('PRÓXIMO HITO'),
  title2: para('Del acceso\nal movimiento'),
  title3: para('La siguiente entrega transforma\nla base actual en gestión financiera real.'),
});

await fs.mkdir(previewDir, { recursive: true });
for (const [index, slide] of deck.slides.items.entries()) {
  await saveBlob(`${previewDir}/slide-${index + 1}.png`, await deck.export({ slide, format: 'png', scale: 1 }));
}
const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(output);
