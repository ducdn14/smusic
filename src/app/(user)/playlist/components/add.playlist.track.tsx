'use client'

import { useToast } from "@/utils/toast";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { Theme, useTheme } from '@mui/material/styles';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Dialog from '@mui/material/Dialog';
import { Box, Chip, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { sendRequest } from "@/utils/api";


interface IProps {
    playlists: IPlaylist[];
    tracks: ITrackTop[];
}

const AddPlaylistTrack = (props: IProps) => {
    const { playlists, tracks } = props;

    const [open, setOpen] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const { data: session } = useSession();

    const [playlistId, setPlaylistId] = useState("");
    const [trackId, setTrackid] = useState<string[]>([]);

    const theme = useTheme();

    const handleClose = (event: any, reason: any) => {
        if (reason && reason == "backdropClick")
            return;
        setOpen(false);
        setPlaylistId("");
        setTrackid([]);
    }

    const getStyles = (name: string, trackId: readonly string[], theme: Theme) => {
        return {
            fontWeight:
                trackId.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium
        }
    }

    const handleSubmit = async () => {
        if (!playlistId) {
            toast.error("Please select playlist!")
            return;
        }
        if (!trackId.length) {
            toast.error("Please select tracks!")
            return;
        }

        const chosenPlaylist = playlists.find(i => i._id === playlistId);
        let tracks = trackId?.map(item => item?.split("###")?.[1]);

        //remove null/undefined/empty
        tracks = tracks?.filter((item) => item);
        if (chosenPlaylist) {
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
                method: "PATCH",
                body: {
                    "id": chosenPlaylist._id,
                    "title": chosenPlaylist.title,
                    "isPublic": chosenPlaylist.isPublic,
                    "tracks": tracks
                },
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                }
            })

            if (res.data) {
                toast.success("Add track to playlist success!");
                await sendRequest<IBackendRes<any>>({
                    url: `/api/revalidate`,
                    method: "POST",
                    queryParams: {
                        tag: "playlist-by-user",
                        secret: "justArandomString"
                    }
                })
                handleClose("", "");
                router.refresh();
            } else {
                toast.error(res.message)
            }
        }
    }

    return (
        <>
            <Button startIcon={<AddIcon />} variant="outlined"
                onClick={() => setOpen(true)}>
                Tracks
            </Button>
            <Dialog open={open} fullWidth maxWidth={"sm"}>
                <DialogTitle>Add track to Playlist:</DialogTitle>
                <DialogContent>
                    <Box width={"100%"} sx={{
                        display: "flex",
                        gap: "30px",
                        flexDirection: "column"
                    }}>
                        <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
                            <InputLabel>Select Playlist</InputLabel>
                            <Select
                                value={playlistId}
                                label="Playlist"
                                onChange={(e) => setPlaylistId(e.target.value)}
                            >
                                {playlists.map(item => {
                                    return (
                                        <MenuItem key={item._id} value={item._id}>{item.title}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl sx={{
                            mt: 5,
                            width: "100%"
                        }}>
                            <InputLabel id="demo-multiple-chip-label">Tracks</InputLabel>
                            <Select
                                multiple
                                value={trackId}
                                onChange={(e) => {
                                    setTrackid(e.target.value as any)
                                }}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{
                                        display: "flex",
                                        flexWrap: 'wrap',
                                        gap: 0.5
                                    }}>
                                        {selected.map(value => {
                                            return (
                                                <Chip key={value} label={value?.split("###")?.[0]} />
                                            )
                                        })}
                                    </Box>
                                )}
                            >
                                {tracks.map((track) => {
                                    return (
                                        <MenuItem key={track._id}
                                            value={`${track.title}###${track._id}`}
                                            style={getStyles(`${track._id}`, trackId, theme)}>
                                            {track.title}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose("", "")}>Cancel</Button>
                    <Button onClick={() => handleSubmit()}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddPlaylistTrack;