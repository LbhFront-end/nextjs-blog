import GitalkComponent from "gitalk/dist/gitalk-component";
import config from 'config';

const { thirdParty: { gitalk } } = config;

export default function Gitalk({ title, labels }) {
    const { window } = global;
    if (window) return <GitalkComponent
        options={{
            clientID: gitalk.CLIENT_ID,
            clientSecret: gitalk.CLIENT_SECRET,
            repo: gitalk.REPO,
            owner: gitalk.OWNER,
            admin: gitalk.ADMIN,
            title,
            labels,
        }}
    />
    return <></>
}