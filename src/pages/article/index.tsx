import React, { useEffect, useState } from "react";
import axios from "axios";
import * as S from "./styles";
import Image from "next/image";
import { BiLoaderAlt } from "react-icons/bi";
import youtubeThumbnail from "youtube-thumbnail";

function getYoutubeVideoId(url: string) {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

async function getYoutubeThumbnail(url: string) {
  if (url === "") {
    return null;
  }
  const thumbnail = await youtubeThumbnail(url);
  return thumbnail.high.url;
}

type ThumbnailProps = {
  url: string | null;
};

const Thumbnail: React.FC<ThumbnailProps> = ({ url }) =>
  url ? (
    <Image
      src={url}
      alt="Video thumbnail"
      width={280}
      height={180}
      style={{ marginTop: "20px", border: "1px solid #000" }}
    />
  ) : null;

type ContentProps = {
  content: string | null;
};

const Content: React.FC<ContentProps> = ({ content }) =>
  content ? <S.Content dangerouslySetInnerHTML={{ __html: content }} /> : null;

const App = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);

  const [stringLength, setStringLength] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  useEffect(() => {
    setStringLength(article.length);
  }, [article]);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);

    setArticle("");
    const videoId = getYoutubeVideoId(videoUrl);
    setThumbnailUrl(await getYoutubeThumbnail(videoUrl));

    if (!videoId) {
      setArticle("Invalid link.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post("/api/article", { chat: videoId });
      setArticle(data);
    } catch (error) {
      setArticle("An error occurred." + error);
    }


    setLoading(false);
  };

  return (
    <>
      <S.TopNavbar>
        <S.Logo>Something-Here.ai</S.Logo>
        <S.LoginButton>Login</S.LoginButton>
      </S.TopNavbar>
      <S.NavbarLine />
      <S.MainContainer>
        <h2>Add a video</h2>
        <S.InputContainer>
          <h4>Paste the link to your video here:</h4>
          <S.LinkInput
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=-ANx41sZNIQ"
          />
        </S.InputContainer>
      </S.MainContainer>
      <S.Container>
        {loading ? (
          <BiLoaderAlt
            style={{ marginBottom: "50px" }}
            className="spinner"
            color="#FFF"
            size={50}
          />
        ) : (
          <S.Button style={{ marginBottom: "50px" }} onClick={handleSubmit}>
            Make my article!
          </S.Button>
        )}

        <Thumbnail url={thumbnailUrl} />

        <Content content={article} />
        {article && (
          <S.StringLength>Amount of characters: {stringLength}</S.StringLength>
        )}

        <S.Disclaimer>
          Important notice: This app uses artificial intelligence technology to
          generate content automatically. However, it is important to point out
          that the expressions contained in the texts generated may not be
          accurate and should always be verified by the user. The app is not
          responsible for any damages or losses caused by using incorrect
          information. The user assumes full responsibility for the content
          generated through this application.
        </S.Disclaimer>
      </S.Container>
    </>
  );
};

export default App;

