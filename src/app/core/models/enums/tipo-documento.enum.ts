export enum TipoDocumento {
  INE = 'INE',
  PASAPORTE = 'PASAPORTE',
  LICENCIA_CONDUCIR = 'LICENCIA_CONDUCIR',
  CEDULA_PROFESIONAL = 'CEDULA_PROFESIONAL'
}

export const TIPO_DOCUMENTO_LABELS: Record<TipoDocumento, string> = {
  [TipoDocumento.INE]: 'INE',
  [TipoDocumento.PASAPORTE]: 'Pasaporte',
  [TipoDocumento.LICENCIA_CONDUCIR]: 'Licencia de Conducir',
  [TipoDocumento.CEDULA_PROFESIONAL]: 'Cédula Profesional'
};

export const TIPOS_DOCUMENTO = Object.values(TipoDocumento);
