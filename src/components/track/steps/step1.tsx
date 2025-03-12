'use client'

import { FileWithPath, useDropzone } from "react-dropzone";
import "./theme.css"
import { CloudUpload } from "@mui/icons-material";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Button from "@mui/material/Button";

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

function InputFileUpload() {
    return (
        <Button
            onClick={(e) => e.preventDefault()}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUpload />}
        >
            Upload files
            <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                multiple
            />
        </Button>
    );
}

interface IProps {
    setValue: (v: number) => void;
    setTrackUpload: any;
    trackUpload: any;
}

const Step1 = (props: IProps) => {
    const {trackUpload} = props;

    const { data: session } = useSession();

    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
        props.setValue(1);
        if (acceptedFiles && acceptedFiles[0]) {
            const audio = acceptedFiles[0];
            const formData = new FormData()
            formData.append('fileUpload', audio);

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`, formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${session?.access_token}`,
                            'target_type': 'tracks',
                        },
                        onUploadProgress: ProgressEvent => {
                            //@ts-ignore
                            let percentCompleted = Math.floor((ProgressEvent.loaded * 100) / ProgressEvent.total);
                            props.setTrackUpload({
                                ...trackUpload,
                                fileName: acceptedFiles[0].name,
                                percent: percentCompleted
                            })
                        }
                    })
                props.setTrackUpload((prevState: any) => ({
                    ...prevState,
                    uploadedTrackName: res.data.data.fileName
                }))
            } catch (error) {
                //@ts-ignore
                alert(error?.response?.data?.message);
            }
        }
    }, [session]);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'audio/*': [".mp3", ".m4a", ".wav"]
        }
    });

    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));



    return (
        <section className="container-upload">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <InputFileUpload />
                <p>Drag 'n' drop some file here, or click to select file</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    )
}

export default Step1