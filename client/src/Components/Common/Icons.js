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

export function Trello(props) {
    return (
        <svg viewBox="0 0 512 512" className="trello" {...props}>
            <path d="M448,0H64C28.672,0,0,28.672,0,64v384c0,35.328,28.672,64,64,64h384c35.36,0,64-28.672,64-64V64
                C512,28.64,483.328,0,448,0z"/>
            <g id="trello-boxes">
                <path d="M224,384c0,17.664-14.336,32-32,32H96c-17.696,0-32-14.336-32-32V96c0-17.696,14.304-32,32-32h96
                    c17.664,0,32,14.304,32,32V384z"/>
                <path d="M448,256c0,17.664-14.336,32-32,32h-96c-17.696,0-32-14.336-32-32V96c0-17.696,14.304-32,32-32h96
                    c17.664,0,32,14.304,32,32V256z"/>
            </g>
        </svg>
    )
}
