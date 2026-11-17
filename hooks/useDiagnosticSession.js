import { useSyncExternalStore } from 'react';

import { diagnosticSession } from '../services/diagnosticSession';

// Estado reativo do diagnóstico. Cada mudança gera um novo objeto, então a tela re-renderiza só quando algo muda.
export function useDiagnosticSession() {
  return useSyncExternalStore(diagnosticSession.subscribe, diagnosticSession.getState);
}
