export default function Loading() {
    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'scale(0.2)',
            }}>
            <div id='pikachu' />
            <div id='ash' />
        </div>
    )
}