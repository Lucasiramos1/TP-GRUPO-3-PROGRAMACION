const stats = [
  { value: '15k+', label: 'CLIENTES ACTIVOS' },
  { value: '$4.2B', label: 'ACTIVOS GESTIONADOS' },
  { value: '99.9%', label: 'TIEMPO DE ACTIVIDAD' },
  { value: '24/7', label: 'SOPORTE PREMIUM' },
];

/**
 * Mock temporal del endpoint GET /stats.
 */
export async function getStats() {
  return stats;
}