'use client'

import { convertSlugUrl, sendRequest } from "@/utils/api";
import { Divider, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import Image from 'next/image';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ClientSearch = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [tracks, setTracks] = useState<ITrackTop[]>([]);

    const fetchData = async (query: string) => {
        const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
            method: "POST",
            body: {
                current: 1,
                pageSize: 10,
                title: query
            }
        })
        if (res.data?.result) {
            setTracks(res.data.result)
        }
    }
    useEffect(() => {
        document.title = `"${query}" on SMusic`;

        if (query) {
            fetchData(query);
        }
    }, [query])


    return (
        <div>
            {(!query || !tracks.length)
                ?
                <div>No search results exist.</div>
                :
                <Box>
                    <div>Search results: <b>{query}</b></div>
                    <Divider sx={{ my: 2 }} />
                    {tracks.map((track) => {
                        return (
                            <div key={track._id}>
                                <Box>
                                    <Image
                                        style={{ borderRadius: "3px" }}
                                        alt="avatar track"
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                                        height={100}
                                        width={100} />
                                    <Typography sx={{ py: 2 }}>
                                        <Link
                                            style={{ textDecoration: "none", color: "unset" }}
                                            href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`}
                                        >
                                            {track.title}
                                        </Link>
                                    </Typography>
                                </Box>
                            </div>
                        )
                    })}
                </Box>
            }
        </div>
    )
}

export default ClientSearch;