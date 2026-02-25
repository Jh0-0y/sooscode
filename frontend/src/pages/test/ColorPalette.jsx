// pages/test/ColorPalette.jsx
import styles from './ColorPalette.module.css';
import { useDarkMode } from '@/hooks/useDarkMode';

const ColorPalette = () => {
    const { darkMode, toggleDarkMode } = useDarkMode();

    const primaryColors = [
        { name: 'Primary 50', var: '--color-primary-50' },
        { name: 'Primary 100', var: '--color-primary-100' },
        { name: 'Primary 200', var: '--color-primary-200' },
        { name: 'Primary 300', var: '--color-primary-300' },
        { name: 'Primary 400', var: '--color-primary-400' },
        { name: 'Primary 500', var: '--color-primary-500' },
        { name: 'Primary 600', var: '--color-primary-600' },
        { name: 'Primary 700', var: '--color-primary-700' },
        { name: 'Primary 800', var: '--color-primary-800' },
        { name: 'Primary 900', var: '--color-primary-900' },
    ];

    const grayColors = [
        { name: 'Gray 50', var: '--color-gray-50' },
        { name: 'Gray 100', var: '--color-gray-100' },
        { name: 'Gray 200', var: '--color-gray-200' },
        { name: 'Gray 300', var: '--color-gray-300' },
        { name: 'Gray 400', var: '--color-gray-400' },
        { name: 'Gray 500', var: '--color-gray-500' },
        { name: 'Gray 600', var: '--color-gray-600' },
        { name: 'Gray 700', var: '--color-gray-700' },
        { name: 'Gray 800', var: '--color-gray-800' },
        { name: 'Gray 900', var: '--color-gray-900' },
    ];

    const semanticColors = [
        { name: 'Success', var: '--color-success' },
        { name: 'Error', var: '--color-error' },
        { name: 'Warning', var: '--color-warning' },
        { name: 'Info', var: '--color-info' },
    ];

    const backgroundColors = [
        { name: 'BG Primary', var: '--color-bg-primary' },
        { name: 'BG Secondary', var: '--color-bg-secondary' },
        { name: 'BG Tertiary', var: '--color-bg-tertiary' },
    ];

    const textColors = [
        { name: 'Text Primary', var: '--color-text-primary' },
        { name: 'Text Secondary', var: '--color-text-secondary' },
        { name: 'Text Tertiary', var: '--color-text-tertiary' },
        { name: 'Text Inverse', var: '--color-text-inverse' },
    ];

    const borderColors = [
        { name: 'Border Light', var: '--color-border-light' },
        { name: 'Border Medium', var: '--color-border-medium' },
        { name: 'Border Dark', var: '--color-border-dark' },
    ];

    const ColorBox = ({ name, colorVar }) => (
        <div className={styles.colorBox}>
            <div
                className={styles.colorSwatch}
                style={{ backgroundColor: `var(${colorVar})` }}
            />
            <div className={styles.colorInfo}>
                <span className={styles.colorName}>{name}</span>
                <span className={styles.colorVar}>{colorVar}</span>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Color Palette</h1>
                <button onClick={toggleDarkMode} className={styles.toggleButton}>
                    {darkMode ? '☀️ 라이트모드' : '🌙 다크모드'}
                </button>
            </div>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Primary Colors</h2>
                <div className={styles.colorGrid}>
                    {primaryColors.map((color) => (
                        <ColorBox key={color.var} name={color.name} colorVar={color.var} />
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Gray Scale</h2>
                <div className={styles.colorGrid}>
                    {grayColors.map((color) => (
                        <ColorBox key={color.var} name={color.name} colorVar={color.var} />
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Semantic Colors</h2>
                <div className={styles.colorGrid}>
                    {semanticColors.map((color) => (
                        <ColorBox key={color.var} name={color.name} colorVar={color.var} />
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Background Colors</h2>
                <div className={styles.colorGrid}>
                    {backgroundColors.map((color) => (
                        <ColorBox key={color.var} name={color.name} colorVar={color.var} />
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Text Colors</h2>
                <div className={styles.colorGridText}>
                    {textColors.map((color) => (
                        <div key={color.var} className={styles.textBox}>
                            <div
                                className={styles.textSample}
                                style={{ color: `var(${color.var})` }}
                            >
                                The quick brown fox jumps over the lazy dog
                            </div>
                            <div className={styles.colorInfo}>
                                <span className={styles.colorName}>{color.name}</span>
                                <span className={styles.colorVar}>{color.var}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Border Colors</h2>
                <div className={styles.colorGrid}>
                    {borderColors.map((color) => (
                        <div key={color.var} className={styles.borderBox}>
                            <div
                                className={styles.borderSample}
                                style={{ borderColor: `var(${color.var})` }}
                            />
                            <div className={styles.colorInfo}>
                                <span className={styles.colorName}>{color.name}</span>
                                <span className={styles.colorVar}>{color.var}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ColorPalette;