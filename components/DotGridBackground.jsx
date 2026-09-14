import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const ESPACO = 22; // distância entre os pontos
const RAIO_PONTO = 1.3;

export default function DotGridBackground({ opacity = 0.06 }) {
    return (
        <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
            <Defs>
                <Pattern id="dot-grid" width={ESPACO} height={ESPACO} patternUnits="userSpaceOnUse">
                    <Circle
                        cx={ESPACO / 2}
                        cy={ESPACO / 2}
                        r={RAIO_PONTO}
                        fill={`rgba(255,255,255,${opacity})`}
                    />
                </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#dot-grid)" />
        </Svg>
    );
}