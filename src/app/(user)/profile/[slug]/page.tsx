import { sendRequest } from "@/utils/api";
import { Container, Grid } from "@mui/material";
import ProfileTracks from "@/components/profile/profile.tracks";

const ProfilePage = async ({ params }: { params: { slug: string } }) => {
    const slug = params.slug;

    const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=20`,
        method: "POST",
        body: { id: slug },
        nextOption: {
            // cache: "no-store" 
            next: { tags: ['track-by-profile'] }
        }
    })

    const data = tracks?.data?.result ?? [];

    return (
        <div>
            <Container sx={{ my: 5 }}>
                <Grid container spacing={3}>
                    {data.map((item: ITrackTop, index: number) => {
                        return (
                            <Grid key={index} item xs={12} md={6}>
                                <ProfileTracks data={item} />
                            </Grid>
                        )
                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default ProfilePage;