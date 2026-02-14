/**
 * Wheat SVG decoration used on parchment cards.
 * Renders as a left or right decorative wheat stalk.
 *
 * @param {{ side: 'left' | 'right' }} props
 */
export default function WheatDecoration({ side = "left" }) {
    return (
        <svg
            className={`wheat-decoration wheat-${side}`}
            width="40"
            height="120"
            viewBox="0 0 40 120"
        >
            <g fill="var(--accent)">
                <ellipse cx="20" cy="15" rx="6" ry="12" />
                <ellipse cx="12" cy="28" rx="5" ry="10" />
                <ellipse cx="28" cy="28" rx="5" ry="10" />
                <ellipse cx="14" cy="45" rx="4" ry="9" />
                <ellipse cx="26" cy="45" rx="4" ry="9" />
                <ellipse cx="16" cy="60" rx="4" ry="8" />
                <ellipse cx="24" cy="60" rx="4" ry="8" />
                <path d="M20 12 L20 115" stroke="var(--accent)" strokeWidth="2" fill="none" />
            </g>
        </svg>
    );
}
