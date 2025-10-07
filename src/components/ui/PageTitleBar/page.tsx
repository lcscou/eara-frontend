import { PageTitleBarProps } from "@/lib/types";
import { Container, Title } from "@mantine/core";

export default function PageTitleBar({
  title,
  author,
  date,
  readingTime,
}: PageTitleBarProps) {
  return (
    <div
      className=" h-[575px] bg-cover bg-primaryColor "
      style={{
        backgroundImage:
          "url(https://static.wixstatic.com/media/8834e5_d541b84e20d34efebda6452deb7a423b~mv2.jpg/v1/fill/w_1905,h_515,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/8834e5_d541b84e20d34efebda6452deb7a423b~mv2.jpg)",
      }}
    >
      <Container fluid className="h-full">
        <div className="flex justify-center items-center h-full">


        <Title c="white" size={88}>{title}</Title>
        </div>
      </Container>
    </div>
  );
}
