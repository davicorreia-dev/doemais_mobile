import { Platform, StatusBar } from 'react-native';

/** Mantém um valor dentro de um intervalo. */
export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Altura da área do sistema no topo (status bar / notch).
 * Usa o inset do safe-area quando disponível e cai para a StatusBar do Android.
 */
export function topInset(insetTop: number) {
    if (insetTop > 0) return insetTop;
    if (Platform.OS === 'android') return StatusBar.currentHeight ?? 24;
    return 20;
}

/** Altura da barra vermelha simples (sem título), proporcional à tela. */
export function barHeight(windowHeight: number) {
    return clamp(windowHeight * 0.07, 48, 72);
}

/** Altura do header com título/subtítulo, proporcional à tela. */
export function headerHeight(windowHeight: number) {
    return clamp(windowHeight * 0.22, 150, 230);
}

/** Largura máxima da coluna de formulário (evita campos gigantes em tablets). */
export const FORM_MAX_WIDTH = 400;

/** Respiro lateral entre a borda da coluna e as caixas do formulário. */
export const FORM_GUTTER = 12;

/**
 * Coluna única do formulário: inputs, links, divisores e botão principal
 * compartilham exatamente as mesmas bordas esquerda e direita.
 */
export const formColumn = {
    width: '100%',
    maxWidth: FORM_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: FORM_GUTTER,
} as const;
