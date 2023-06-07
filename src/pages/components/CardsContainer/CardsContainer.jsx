export const CardsContainer = ({ children, widthPercentage }) => {
    return <div className={`cards-container`} style={{ width: `${widthPercentage}%` }} >
        {children}
    </div>
}