export type ChecklistTask = {
  group: string
  task: string
}

export type ChecklistState = {
  meta: {
    date: string
    responsavel: string
    culto: string
  }
  checks: Record<string, boolean>
  notes: Record<string, string>
}

export const checklistTasks: ChecklistTask[] = [
  { group: 'COMPUTADOR', task: 'Ligar o computador de transmissão' },
  { group: 'COMPUTADOR', task: 'Verificar energia e cabos' },
  { group: 'COMPUTADOR', task: 'Verificar conexão com a internet' },
  { group: 'COMPUTADOR', task: 'Abrir o software de transmissão' },
  { group: 'COMPUTADOR', task: 'Conferir resolução e configurações de vídeo' },
  { group: 'COMPUTADOR', task: 'Conferir configurações de áudio' },
  { group: 'COMPUTADOR', task: 'Testar entrada das câmeras' },
  { group: 'COMPUTADOR', task: 'Testar saída de áudio' },
  { group: 'COMPUTADOR', task: 'Conferir cenas/fontes da transmissão' },
  { group: 'COMPUTADOR', task: 'Fazer teste de transmissão' },
  { group: 'CÂMERAS PTZ', task: 'Ligar todas as câmeras' },
  { group: 'CÂMERAS PTZ', task: 'Conferir alimentação e cabos' },
  { group: 'CÂMERAS PTZ', task: 'Verificar conexão das câmeras' },
  { group: 'CÂMERAS PTZ', task: 'Testar movimento PAN/TILT' },
  { group: 'CÂMERAS PTZ', task: 'Testar ZOOM' },
  { group: 'CÂMERAS PTZ', task: 'Conferir foco' },
  { group: 'CÂMERAS PTZ', task: 'Conferir enquadramento' },
  { group: 'CÂMERAS PTZ', task: 'Conferir presets/posições salvas' },
  { group: 'CÂMERAS PTZ', task: 'Conferir imagem de todas as câmeras no computador' },
  { group: 'SOM', task: 'Ligar mesa de som' },
  { group: 'SOM', task: 'Conferir alimentação e cabos' },
  { group: 'SOM', task: 'Ligar microfones' },
  { group: 'SOM', task: 'Testar microfone principal' },
  { group: 'SOM', task: 'Testar microfone auxiliar' },
  { group: 'SOM', task: 'Conferir níveis de áudio' },
  { group: 'SOM', task: 'Verificar retorno/monitoração' },
  { group: 'SOM', task: 'Testar áudio no computador' },
  { group: 'SOM', task: 'Conferir ausência de ruídos/microfonia' },
  { group: 'TRANSMISSÃO', task: 'Conferir título/informações da transmissão' },
  { group: 'TRANSMISSÃO', task: 'Conferir câmera principal' },
  { group: 'TRANSMISSÃO', task: 'Conferir áudio' },
  { group: 'TRANSMISSÃO', task: 'Conferir conexão com a plataforma' },
  { group: 'TRANSMISSÃO', task: 'Iniciar transmissão' },
  { group: 'TRANSMISSÃO', task: 'Confirmar transmissão ao vivo' },
  { group: 'DURANTE A TRANSMISSÃO', task: 'Monitorar imagem' },
  { group: 'DURANTE A TRANSMISSÃO', task: 'Monitorar áudio' },
  { group: 'DURANTE A TRANSMISSÃO', task: 'Alternar câmeras conforme programação' },
  { group: 'DURANTE A TRANSMISSÃO', task: 'Colocar para gravar a mensagem' },
  { group: 'FINALIZAÇÃO', task: 'Encerrar transmissão' },
  { group: 'FINALIZAÇÃO', task: 'Desligar câmeras PTZ' },
  { group: 'FINALIZAÇÃO', task: 'Desligar equipamentos de som' },
  { group: 'FINALIZAÇÃO', task: 'Desligar computador' },
  { group: 'FINALIZAÇÃO', task: 'Conferir e guardar cabos/equipamentos' },
]

export const emptyChecklistState: ChecklistState = {
  meta: { date: '', responsavel: '', culto: '' },
  checks: {},
  notes: {},
}
