import React from 'react'
import '../../CSS/icons.css'

export function HomeIcon(props) {
    return (
        <svg viewBox="0 0 520 530" className="svg_ic" {...props}>
            <path d="m256 0-256 192v319h190v-210h130v210h190v-319z" />
        </svg>
    )
}

export function PlusIcon(props) {
    return (
        <svg viewBox="0 0 100 100" className="svg_ic" {...props}>
            <line x1="32.5" y1="50" x2="67.5" y2="50" />
            <line x1="50" y1="32.5" x2="50" y2="67.5" />
        </svg>
    )
}

export function DeleteIcon(props) {
    return (
        <svg viewBox="0 0 420 400" className="svg_ic" {...props}>
            <path d="M64,341C64,364,83,384,106,384h170C300,384,320,364,320,341v-256H64V341z" />
            <polygon points="266,21 245,0 138,0 117,21 42,21 42,64 341,64 341,21" />
        </svg>
    )
}
