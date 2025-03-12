import MainSlider from "@/components/main/main.slider";
import { Container } from "@mui/material";
import { sendRequest } from "../../utils/api";
import BannerSlider from "@/components/main/banner.slider";
import SwiperSlider from "@/components/main/banner.swiper";

export default async function HomePage() {

  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "CHILL",
      limit: 8
    }
  });

  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 8
    }
  });

  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "PARTY",
      limit: 8
    }
  });

  return (
    <Container>
      <SwiperSlider />
      <MainSlider
        title={"Top Chill"}
        data={chills?.data ? chills.data : []}
      />
      <MainSlider
        title={"Top Workout"}
        data={workouts?.data ? workouts.data : []} />
      <MainSlider
        title={"Top Party"}
        data={party?.data ? party.data : []} />
    </Container>
  );
}
