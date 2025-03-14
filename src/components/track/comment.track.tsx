
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { Box, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from 'dayjs';
import WaveSurfer from "wavesurfer.js";

import relativeTime from 'dayjs/plugin/relativeTime';
import Image from "next/image";
dayjs.extend(relativeTime)


interface IProps {
    track: ITrackTop | null;
    comments: ITrackComment[];
    wavesurfer: WaveSurfer | null;
}

const CommentTrack = (props: IProps) => {
    const router = useRouter();

    const { comments, track, wavesurfer } = props;
    const [yourComment, setYourComment] = useState("");
    const { data: session } = useSession();

    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<ITrackComment>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
            method: "POST",
            body: {
                content: yourComment,
                moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
                track: track?._id
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`
            },
        })
        if (res.data) {
            setYourComment("");
            router.refresh();
        }
    }

    const handleJumpTrack = (moment: number) => {
        if (wavesurfer) {
            const duration = wavesurfer.getDuration();
            wavesurfer.seekTo(moment / duration);
            wavesurfer.play();
        }
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

    return (
        <div>
            <div style={{ marginTop: "50px", marginBottom: "25px" }}>
                <TextField
                    value={yourComment}
                    onChange={(e) => setYourComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSubmit()
                        }
                    }}
                    variant="standard"
                    fullWidth
                    margin="normal"
                    label="Comment"
                    name="comment"
                />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
                <div className="left" style={{ width: "190px" }}>
                    <div>
                        <Image
                            height={100}
                            width={100}
                            alt="avatar-comment"
                            src={fetchDefaultImages(track?.uploader?.type!)} />
                        <div>{track?.uploader?.email}</div>
                    </div>
                </div>
                <div className="right" style={{ width: "calc(100% - 200px)" }}>
                    {comments?.map(comment => {
                        return (
                            <Box key={comment._id} sx={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
                                <Box sx={{
                                    display: "flex",
                                    gap: 2,
                                    marginBottom: "25px",
                                    alignItems: "center"
                                }}>
                                    <Image src={fetchDefaultImages(comment?.user?.type!)}
                                        height={40}
                                        width={40}
                                        alt="comments"
                                    />
                                    <div>
                                        <div style={{
                                            fontSize: "16px"
                                        }}>
                                            {comment?.user?.name ?? comment?.user?.email} at <span style={{ color: "orange", cursor: "pointer" }}
                                                onClick={() => handleJumpTrack(comment.moment)}>
                                                {formatTime(comment?.moment)}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "14px"
                                            }}>
                                            {comment.content}
                                        </div>
                                    </div>
                                </Box>
                                <div style={{ fontSize: "12px", color: "#999" }}>
                                    {dayjs(comment.createdAt).fromNow()}
                                </div>
                            </Box>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CommentTrack;