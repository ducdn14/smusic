'use client'

import { useToast } from "@/utils/toast";
import Button from "@mui/material/Button/Button";
import AddIcon from '@mui/icons-material/Add';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Dialog from "@mui/material/Dialog/Dialog";
import { Box, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import { sendRequest } from "@/utils/api";

const NewPlaylist = () => {

    const [open, setOpen] = useState(false);
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [title, setTitle] = useState<string>("");
    const toast = useToast();
    const router = useRouter();
    const { data: session } = useSession();

    const handleClose = (event: any, reason: any) => {
        if (reason && reason == 'backdropClick')
            return;
        setOpen(false);
        setTitle("");
    }

    const handleSubmit = async () => {
        if (!title) {
            toast.error("Title can't be empty");
            return;
        }
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
            method: "POST",
            body: { title, isPublic },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        })
        if (res.data) {
            toast.success("New playlist created successfully!")
            setIsPublic(true);
            setTitle("");
            setOpen(false)

            await sendRequest<IBackendRes<any>>({
                url: `/api/revalidate`,
                method: "POST",
                queryParams: {
                    tag: "playlist-by-user",
                    secret: "justArandomString"
                }
            })
            router.refresh();
        } else {
            toast.error(res.message)
        }
    }


    return (
        <>
            <Button startIcon={<AddIcon />} variant="outlined"
                onClick={() => setOpen(true)}>
                Playlists
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth={"sm"} fullWidth>
                <DialogTitle>Add new Playlist:</DialogTitle>
                <DialogContent>
                    <Box width={"100%"} sx={{
                        display: "flex",
                        gap: "30px",
                        flexDirection: "column"
                    }}>
                        <TextField 
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        label="Title"
                        variant="standard"/>
                        <FormGroup>
                            <FormControlLabel control={
                                <Switch
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                inputProps={{'aria-label': 'controlled'}}
                                />}
                                label={isPublic === true ? "Public" : "Private"}
                            />
                        </FormGroup>
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

export default NewPlaylist;