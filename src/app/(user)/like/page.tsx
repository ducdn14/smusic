import { authOptions } from "@/app/api/auth/auth.option";
import { convertSlugUrl, sendRequest } from "@/utils/api";
import { Box, Divider } from "@mui/material";
import Container from "@mui/material/Container";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Your liked tracks',
    description: 'Like tracks page description',
}

const LikePage = async () => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['liked-by-user'] }
        }
    })

    const likes = res?.data?.result ?? [];

    return (
        <Container>
            <div>
                <h3>Hear the tracks you've liked:</h3>
            </div>
            <Divider />
            <Box sx={{ mt: 3, display: "flex", gap: "14px", flexWrap: "wrap" }}>
                {likes.map(track => {
                    return (
                        <Box key={track._id}>
                            <Image
                                style={{ borderRadius: "5px" }}
                                alt="avatar track"
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                                height={160}
                                width={160} />
                            <div>
                                <Link style={{
                                    textDecoration: "none",
                                    color: "unset"
                                }}
                                    href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`}>
                                    <span
                                        style={{
                                            width: "160px",
                                            display: "block",
                                            color: "black",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}>
                                        {track.title}
                                    </span>
                                </Link>
                            </div>
                        </Box>
                    )
                })}
            </Box>
        </Container>
    );
}

export default LikePage;