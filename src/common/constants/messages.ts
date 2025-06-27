export const MESSAGES = {
  GENERAL: {
    INTERNAL_ERROR: 'Erro interno do servidor.',
    NOT_FOUND: 'Recurso não encontrado.',
    SUCCESS: 'Operação realizada com sucesso.',
  },
  FARM: {
    CREATED: 'Fazenda criada com sucesso.',
    UPDATED: 'Fazenda atualizada com sucesso.',
    DELETED: 'Fazenda deletada com sucesso.',
    NOT_FOUND: 'Fazenda não encontrada.',
    INVALID_AREA: 'A soma das áreas não pode ultrapassar a área total da fazenda.',
    NOT_FOUND_OR_UNAUTHORIZED: 'Fazenda não encontrada ou não pertence ao usuário autenticado.',
  },
  FARMER: {
    CREATED: 'Produtor rural cadastrado com sucesso.',
    UPDATED: 'Produtor rural atualizado com sucesso.',
    NOT_FOUND: 'Produtor rural não encontrado.',
    INVALID_DOCUMENT: 'CPF ou CNPJ inválido.',
    CONFLICT_DOCUMENT: 'Documento já está registrado.',
    CONFLICT_EMAIL: 'Email já está registrado.'
  },
  HARVEST: {
    CREATED: 'Safra criada com sucesso.',
    NOT_FOUND: 'Safra não encontrada.',
    NOT_FOUND_OR_UNAUTHORIZED: 'Safra não encontrada ou não pertence ao usuário autenticado.'
  },
  CROP: {
    CREATED: 'Cultura cadastrada com sucesso.',
    NOT_FOUND: 'Cultura não encontrada.',
    NOT_FOUND_OR_UNAUTHORIZED: 'Cultura não encontrada ou não pertence ao usuário.'
  },
};