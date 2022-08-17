import { FC, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Username: FC = () => {
    const router = useRouter()

    const username = router.query.username;
    const [castCount, setCastCount] = useState("loading...")

    useEffect(() => {
        if (username) {
            axios.get("/api/v1/" + username).then((response) => {
                setCastCount(response.data.count);
            })
        }
    }, [username])
    return (
        <div>
            <div className="pl-10 pt-10 text-2xl font-mono">Total cast count for {username}: {castCount}</div>
            <div className="pl-10 text-sm">updated every 24 hrs</div>
        </div>
    )
}

export default Username;