import "./ReactionCheckbox.css";

export default function ReactionCheckbox({ active, disabled, onClick }) {
    return (
        <div
            className={`checkbox-wrapper ${active ? "is-active" : ""}`}
            onClick={disabled ? undefined : onClick}
        >
            {/* 체크박스는 React에서 상태를 관리하지 않기 때문에 checked 제거 */}
            <input type="checkbox" checked={active} readOnly />

            <svg viewBox="0 0 35.6 35.6">
                <circle r="17.8" cy="17.8" cx="17.8" className="background"></circle>
                <circle r="14.37" cy="17.8" cx="17.8" className="stroke"></circle>
                <polyline
                    points="11.78 18.12 15.55 22.23 25.17 12.87"
                    className="check"
                ></polyline>
            </svg>
        </div>
    );
}
