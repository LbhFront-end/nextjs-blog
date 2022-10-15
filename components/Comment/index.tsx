import { useScript } from "hooks"
import { Loading } from "components"

export default function Comment() {
    const status = useScript('https://cdn-city.livere.com/js/embed.dist.js', {
        removeOnUnmount: false,
    })

    return (
        <div style={{ width: '100%' }}>
            {status !== "ready" && <Loading />}
            <div id="lv-container" data-id="city" data-uid="MTAyMC8zOTcwMy8xNjIzMA=="></div>
        </div>
    )
}