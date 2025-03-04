import WaveTrack from "@/components/track/wave.track";
import { Container } from "@mui/material";
import { sendRequest } from "@/utils/api";

import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from "next/navigation";

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    const words = params?.slug?.split('.html') ?? [];
    const words2 = (words[0]?.split('-') ?? []) as string[];
    const id = words2[words2.length - 1];

    // fetch data
    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: "GET"
    });

    return {
        title: res.data?.title,
        description: res.data?.description,
        openGraph: {
            title: 'SMusic',
            description: 'SMusic description',
            type: 'website',
            images: [`https://github.com/ducdn14/image-hosting/blob/main/karersee-lake.jpg?raw=true`]
        }
    }
}

export async function generaterStaticParams() {
    return [
        { slug: 'thap-roi-tu-do-67be0476ad135c5c591d6316.html' },
        { slug: 'du-cho-tan-the-67bc30f82fd1d75aac95ce99.html' },
        { slug: 'noi-buon-em-danh-roi-67bc32c52fd1d75aac95ced5.html' }
    ]
}

const DetailTrackPage = async (props: any) => {

    const { params } = props;

    const words = params?.slug?.split('.html') ?? [];
    const words2 = (words[0]?.split('-') ?? []) as string[];
    const id = words2[words2.length - 1];

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: "GET",
        nextOption: {
            next: { tags: ["track-by-id"] }
        }
    });

    const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 100,
            trackId: id,
            sort: "-createdAt"
        }
    })

    await new Promise(resolve => setTimeout(resolve, 3000))

    if (!res?.data) return notFound();

    return (
        <Container>
            <div>
                <WaveTrack
                    track={res?.data ?? null}
                    comments={res1?.data?.result ?? []}
                />
            </div>
        </Container >
    )
}

export default DetailTrackPage;