'use client'

import FavoriteIcon from '@mui/icons-material/Favorite';
import Chip from '@mui/material/Chip';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';


interface IProps {
    track: ITrackTop | null;
}

const LikeTrack = (props: IProps) => {

    const { track } = props;
    const { data: session } = useSession();
    const [trackLikes, setTrackLikes] = useState<ITrackLike[] | null>(null);
    const router = useRouter();

    const fetchData = async () => {
        if (session?.access_token) {
            const res2 = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
                method: "GET",
                queryParams: {
                    current: 1,
                    pageSize: 100,
                    sort: "-createdAt"
                },
                headers: {
                    Authorization: `Bearer ${session?.access_token}`
                }
            })
            if (res2?.data?.result) {
                setTrackLikes(res2?.data?.result);
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, [session])

    const handleLikeTrack = async () => {
        await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
            method: "POST",
            body: {
                track: track?._id,
                quantity: trackLikes?.some(t => t._id === track?._id) ? -1 : 1,
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`
            }
        })

        fetchData();

        await sendRequest<IBackendRes<any>>({
            url: `/api/revalidate`,
            method: "POST",
            queryParams: {
                tag: "track-by-id",
                secret: "justArandomString"
            }
        })

        await sendRequest<IBackendRes<any>>({
            url: `/api/revalidate`,
            method: "POST",
            queryParams: {
                tag: "liked-by-user",
                secret: "justArandomString"
            }
        })

        router.refresh();
    }

    return (
        <div style={{
            margin: "20px 10px 0 10px",
            display: "flex",
            justifyContent: "space-between"
        }}>
            <div>
                <Chip
                    onClick={() => handleLikeTrack()}
                    sx={{ borderRadius: "8px" }}
                    color={trackLikes?.some(t => t._id === track?._id) ? "error" : "default"}
                    clickable
                    label="Like"
                    variant="outlined"
                    size='medium'
                    icon={<FavoriteIcon />}
                />
            </div>
            <div style={{
                display: "flex",
                gap: "15px"
            }}>
                <span style={{ display: "flex", alignItems: "center" }}><PlayArrowIcon sx={{ fontSize: "20px" }} />{track?.countPlay}</span>
                <span style={{ display: "flex", alignItems: "center" }}><FavoriteIcon sx={{ fontSize: "20px" }} />{track?.countLike}</span>
            </div>
        </div>
    )
}

export default LikeTrack;