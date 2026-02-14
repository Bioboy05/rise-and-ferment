/**
 * Jar SVG illustration with animated bubbles (sourdough starter).
 * Used in HomePage, OnboardingPage, and App splash screen.
 */
export default function JarIllustration() {
    return (
        <div className="jar-illustration">
            <svg viewBox="0 0 80 110" fill="none">
                <rect x="15" y="0" width="50" height="12" rx="3" fill="#8B5A2B" />
                <rect x="18" y="2" width="44" height="3" fill="#A67C52" />
                <rect x="12" y="10" width="56" height="6" rx="2" fill="#6B4423" />
                <path
                    d="M15 16 L12 100 Q12 108 20 108 L60 108 Q68 108 68 100 L65 16 Z"
                    fill="rgba(200, 220, 230, 0.3)"
                    stroke="var(--border)"
                    strokeWidth="1.5"
                />
                <path
                    d="M18 20 L16 95 Q16 98 18 98 L22 98 Q24 98 24 95 L26 20 Z"
                    fill="rgba(255,255,255,0.4)"
                />
                <g id="starter-level">
                    <path
                        d="M16 85 Q25 80 40 82 Q55 84 64 85 L63 100 Q63 105 58 105 L22 105 Q17 105 17 100 Z"
                        fill="var(--accent)"
                        opacity="0.7"
                    >
                        <animate
                            attributeName="d"
                            values="M16 85 Q25 80 40 82 Q55 84 64 85 L63 100 Q63 105 58 105 L22 105 Q17 105 17 100 Z;
                      M16 83 Q28 78 40 80 Q52 78 64 83 L63 100 Q63 105 58 105 L22 105 Q17 105 17 100 Z;
                      M16 85 Q25 80 40 82 Q55 84 64 85 L63 100 Q63 105 58 105 L22 105 Q17 105 17 100 Z"
                            dur="4s"
                            repeatCount="indefinite"
                        />
                    </path>
                    <circle cx="25" cy="90" r="2" fill="rgba(255,255,255,0.6)">
                        <animate attributeName="cy" values="95;85;95" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="40" cy="92" r="2.5" fill="rgba(255,255,255,0.5)">
                        <animate attributeName="cy" values="97;86;97" dur="3.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="55" cy="88" r="1.8" fill="rgba(255,255,255,0.6)">
                        <animate attributeName="cy" values="93;83;93" dur="2.8s" repeatCount="indefinite" />
                    </circle>
                </g>
                <rect x="10" y="70" width="60" height="3" rx="1" fill="var(--warning)" opacity="0.8" />
            </svg>
        </div>
    );
}
