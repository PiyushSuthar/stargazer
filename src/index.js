import {
  Composition,
  continueRender,
  delayRender,
  getInputProps,
  registerRoot,
} from "remotion";
import { Video } from "./video";
import { fetchStargazers } from "./fetch";

const FPS = 30;

const defaultProps = {
  username: "PiyushSuthar",
  starCount: 109,
  duration: 15,
};
const inputProps = { ...defaultProps, ...getInputProps() };

function RemotionVideo() {
  const [handle] = React.useState(() => delayRender());
  const [stargazers, setStargazers] = React.useState({
    allStargazers: [],
    user: {}
  });

  React.useEffect(() => {
    const { username, starCount } = inputProps;
    fetchStargazers(username, starCount).then((stargazers) => {
      setStargazers(stargazers);
      continueRender(handle);
    });
  }, [handle]);

  return (
    <Composition
      id="main"
      component={Video}
      durationInFrames={FPS * inputProps.duration}
      fps={FPS}
      width={960}
      height={540}
      defaultProps={{
        ...inputProps,
        stargazers,
      }}
    />
  );
}

registerRoot(RemotionVideo);
