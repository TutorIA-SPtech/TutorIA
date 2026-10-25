import { StyleSheet } from 'react-native';
import { styles as base } from './resposta';

// Reaproveita todo o estilo da tela de acerto (resposta.js) e só adiciona
// o que é específico da variante de erro.
export const styles = StyleSheet.create({
  ...base,

  // --- Destaque coral dentro do texto (ex.: "sobram 4 g") ---
  secaoDestaqueErro: {
    color: '#FF8A65',
    fontWeight: 'bold',
  },

  // --- Card "A CORRETA" ---
  corretaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  corretaLetra: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#57DDA9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corretaLetraTexto: {
    color: '#0A0D14',
    fontSize: 14,
    fontWeight: 'bold',
  },
  corretaTitulo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // --- Card "O CONTEÚDO" ---
  mapaValorErro: {
    color: '#FF8A65',
    fontSize: 13,
    fontWeight: 'bold',
  },
  conteudoTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
});