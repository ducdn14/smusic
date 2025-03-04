import { CloudUpload } from '@mui/icons-material';
import { Box, Container, Grid, LinearProgress, LinearProgressProps, MenuItem, TextField, Typography } from '@mui/material';
import Button from "@mui/material/Button";
import React, { useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { FileWithPath, useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utils/api';
import { useToast } from '@/utils/toast';
import Image from 'next/image';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

function LinearWithValueLabel(props: IProps) {

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={props.trackUpload.percent} />
        </Box>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function InputFileUpload(props: any) {
    const { info, setInfo } = props;
    const { data: session } = useSession();
    const toast = useToast();

    const handleUpload = async (image: any) => {
        const formData = new FormData()
        formData.append('fileUpload', image);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`, formData,
                {
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`,
                        'target_type': 'images',
                    },
                })
            setInfo({
                ...info,
                imgUrl: res.data.data.fileName
            })
        } catch (error) {
            //@ts-ignore
            toast.error(error?.response?.data)
        }
    }
    return (
        <Button
            onChange={(e) => {
                const event = e.target as HTMLInputElement;
                if (event.files) {
                    handleUpload(event.files[0]);
                }
            }}
            component="label"
            variant="contained"
            startIcon={<CloudUpload />}
        >
            Upload files
            <VisuallyHiddenInput type="file" />
        </Button>
    )
}

interface IProps {
    trackUpload: {
        fileName: string;
        percent: number;
        uploadedTrackName: string;
    }
    setValue: (v: number) => void;
}

interface INewTrack {
    title: string,
    description: string,
    imgUrl: string,
    trackUrl: string,
    category: string
}

const Step2 = (props: IProps) => {
    const { trackUpload, setValue } = props;
    const { data: session } = useSession();
    const toast = useToast();

    const [info, setInfo] = useState<INewTrack>({
        title: "",
        description: "",
        imgUrl: "",
        trackUrl: "",
        category: ""
    });

    useEffect(() => {
        if (trackUpload && trackUpload.uploadedTrackName) {
            setInfo({
                ...info,
                trackUrl: trackUpload.uploadedTrackName
            })
        }
    }, [trackUpload]);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {

    }, []);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop });

    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const category = [
        {
            value: 'CHILL',
            label: 'CHILL',
        },
        {
            value: 'WORKOUT',
            label: 'WORKOUT',
        },
        {
            value: 'PARTY',
            label: 'PARTY',
        }
    ];

    const handleSubmitForm = async () => {
        console.log("check info: ", info);
        const res = await sendRequest<IBackendRes<ITrackTop[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
            method: "POST",
            headers: {
                'Authorization': `Bearer ${session?.access_token}`
            },
            body: {
                title: info.title,
                description: info.description,
                imgUrl: info.imgUrl,
                trackUrl: info.trackUrl,
                category: info.category
            }
        })
        if (res.data) {
            setValue(0);
            toast.success("Upload new track success!");

            await sendRequest<IBackendRes<any>>({
                url: `/api/revalidate`,
                method: "POST",
                queryParams: {
                    tag: "track-by-profile",
                    secret: "justArandomString"
                }
            })
        } else {
            toast.error(res.message);
        }
    }

    return (
        <Container>
            <div>{trackUpload.fileName}</div>
            <LinearWithValueLabel
                trackUpload={trackUpload}
                setValue={setValue} />

            <Grid container spacing={2} mt={5}>
                <Grid item xs={6} md={4}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: "10px"
                    }}>
                    <div style={{ height: 250, width: 250, background: "#ccc" }}>
                        {info.imgUrl &&
                        <Image
                            height={250}
                            width={250}
                            alt='preview-image'
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                            />}
                    </div>
                    <div>
                        <InputFileUpload
                            setInfo={setInfo}
                            info={info} />
                    </div>
                </Grid>
                <Grid item xs={6} md={8}>
                    <TextField value={info?.title}
                        onChange={(e) => setInfo({
                            ...info,
                            title: e.target.value
                        })}
                        label="Title"
                        variant='standard'
                        fullWidth
                        margin='dense'>
                    </TextField>
                    <TextField value={info?.description}
                        onChange={(e) => setInfo({
                            ...info,
                            description: e.target.value
                        })}
                        label="Description"
                        variant='standard'
                        fullWidth
                        margin='dense'>
                    </TextField>
                    <TextField
                        sx={{ mt: 3 }}
                        value={info?.category}
                        onChange={(e) => setInfo({
                            ...info,
                            category: e.target.value
                        })}
                        select variant='standard'
                        label="Category"
                        fullWidth>
                        {category.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        onClick={() => handleSubmitForm()}
                        sx={{ mt: 3 }} variant='outlined'>Save</Button>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Step2;