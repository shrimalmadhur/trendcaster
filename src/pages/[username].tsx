import { FC, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const defaultData = {
    username: "",
    count: "loading...",
    farcasterAddress: "0x00",
    recastCount: "loading...",
    firstCastCounnt: "loading..."
}
const Username: FC = () => {
    const router = useRouter()

    const username = router.query.username;
    const [profileDetails, setProfileDetails] = useState(defaultData)

    useEffect(() => {
        if (username) {
            axios.get("/api/v1/" + username).then((response) => {
                setProfileDetails(response.data);
            })
        }
    }, [username])
    return (
        <div>
            <div className="pl-10 pt-10 text-3xl font-mono">{username}</div>
            <div className="pl-10 pt-10 text-2xl font-mono">Farcaster address: {profileDetails.farcasterAddress}</div>
            <div className="pl-10 pt-10 text-2xl font-mono">Total cast: {profileDetails.count}</div>
            <div className="pl-10 pt-10 text-2xl font-mono">Total recast: {profileDetails.recastCount}</div>
            <div className="pl-10 text-sm">updated every 24 hrs</div>
        </div>
    )
}

export default Username;