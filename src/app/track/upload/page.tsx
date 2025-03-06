import UploadTabs from "@/components/track/upload.tabs";
import { Container } from "@mui/material";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Upload your music",
    description: "This is description"
}

const UploadPage = () => {
    return (
        <Container>
            <UploadTabs />
        </Container>
    )
}

export default UploadPage;